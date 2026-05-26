"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  buildNeuralGraph,
  nodeIdFromIndex,
  type NeuralGraphEdge,
} from "@/lib/system/neural-graph";
import { isConnectionHighlighted, type NeuralConnection } from "@/lib/system/neural-layout";
import {
  ROUTE_LAYER_STYLE,
  TIER_BASE_SPEED,
  routeLayerFromTier,
  type NeuralRouteLayer,
} from "@/lib/system/neural-route-styles";
import { NEXUS } from "@/components/hero-core/colors";

const _worldA = new THREE.Vector3();
const _worldB = new THREE.Vector3();
const _mid = new THREE.Vector3();
const _packet = new THREE.Vector3();
const LAYER_ORDER: NeuralRouteLayer[] = ["background", "secondary", "primary"];

function edgeToConnection(edge: NeuralGraphEdge): NeuralConnection {
  return {
    from: nodeIdFromIndex(edge.from),
    to: nodeIdFromIndex(edge.to),
    directed: true,
    tier: edge.tier,
  };
}

function depthFade(mid: THREE.Vector3, camera: THREE.Camera): number {
  const d = mid.distanceTo(camera.position);
  return THREE.MathUtils.clamp(1.1 - (d - 8) / 16, 0.32, 1);
}

function edgeEnergyPulse(t: number, edgeIndex: number, layer: NeuralRouteLayer): number {
  const wave = 0.5 + 0.5 * Math.sin(t * 1.6 + edgeIndex * 0.38);
  if (layer === "primary") return 0.88 + wave * 0.22;
  if (layer === "secondary") return 0.9 + wave * 0.14;
  return 0.92 + wave * 0.08;
}

interface LayerBundle {
  layer: NeuralRouteLayer;
  edgeIndices: number[];
  coreGeo: THREE.BufferGeometry;
  glowGeo: THREE.BufferGeometry;
  coreMat: THREE.LineBasicMaterial;
  glowMat: THREE.LineBasicMaterial;
}

interface NeuralGraphProps {
  nodeRefs: React.MutableRefObject<(THREE.Object3D | null)[]>;
  nodeProximityRef: React.MutableRefObject<number[]>;
  focusId: string | null;
  analysisId: string | null;
  hubEnergyRef: React.MutableRefObject<number>;
}

export function NeuralGraph({
  nodeRefs,
  nodeProximityRef,
  focusId,
  analysisId,
  hubEnergyRef,
}: NeuralGraphProps) {
  const rootRef = useRef<THREE.Group>(null);
  const { edges } = useMemo(() => buildNeuralGraph(), []);
  const { camera } = useThree();

  const layers = useMemo((): LayerBundle[] => {
    return LAYER_ORDER.map((layer) => {
      const edgeIndices = edges
        .map((e, i) => (routeLayerFromTier(e.tier) === layer ? i : -1))
        .filter((i) => i >= 0);
      const segCount = edgeIndices.length;
      const positions = new Float32Array(segCount * 2 * 3);

      const mkGeo = () => {
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.BufferAttribute(positions.slice(), 3));
        return geo;
      };

      const style = ROUTE_LAYER_STYLE[layer];
      return {
        layer,
        edgeIndices,
        coreGeo: mkGeo(),
        glowGeo: mkGeo(),
        coreMat: new THREE.LineBasicMaterial({
          color: style.coreColor,
          transparent: true,
          opacity: style.coreOpacity,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
        glowMat: new THREE.LineBasicMaterial({
          color: style.glowColor,
          transparent: true,
          opacity: style.glowOpacity,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      };
    });
  }, [edges]);

  type PacketSlot = {
    edgeIndex: number;
    kind: "packet" | "trail" | "wave";
    phase: number;
    mesh: THREE.Mesh | null;
  };

  const packetSlots = useMemo((): Omit<PacketSlot, "mesh">[] => {
    const slots: Omit<PacketSlot, "mesh">[] = [];
    edges.forEach((edge, edgeIndex) => {
      const layer = routeLayerFromTier(edge.tier);
      const style = ROUTE_LAYER_STYLE[layer];
      for (let i = 0; i < style.packetCount; i++) {
        slots.push({ edgeIndex, kind: "packet", phase: i / style.packetCount });
      }
      for (let i = 0; i < style.trailCount; i++) {
        slots.push({ edgeIndex, kind: "trail", phase: 0.12 + i * 0.08 });
      }
      if (layer === "primary") {
        slots.push({ edgeIndex, kind: "wave", phase: 0 });
      }
    });
    return slots;
  }, [edges]);

  const packetRefs = useRef<(THREE.Mesh | null)[]>([]);
  const highlightId = focusId ?? analysisId;
  const analysisMode = analysisId !== null;

  useLayoutEffect(() => {
    return () => {
      layers.forEach((l) => {
        l.coreGeo.dispose();
        l.glowGeo.dispose();
        l.coreMat.dispose();
        l.glowMat.dispose();
      });
    };
  }, [layers]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const proximity = nodeProximityRef.current;
    const root = rootRef.current;
    let maxProx = 0;
    const hubEnergy = hubEnergyRef.current;

    layers.forEach((bundle) => {
      const style = ROUTE_LAYER_STYLE[bundle.layer];
      const coreAttr = bundle.coreGeo.getAttribute("position") as THREE.BufferAttribute;
      const glowAttr = bundle.glowGeo.getAttribute("position") as THREE.BufferAttribute;
      let coreOpacityMax = 0;
      let glowOpacityMax = 0;
      let visibleSegs = 0;

      bundle.edgeIndices.forEach((edgeIndex, seg) => {
        const edge = edges[edgeIndex];
        const objA = nodeRefs.current[edge.from];
        const objB = nodeRefs.current[edge.to];
        if (!objA || !objB) return;

        objA.getWorldPosition(_worldA);
        objB.getWorldPosition(_worldB);
        _mid.lerpVectors(_worldA, _worldB, 0.5);

        const vi = seg * 2;
        coreAttr.setXYZ(vi, _worldA.x, _worldA.y, _worldA.z);
        coreAttr.setXYZ(vi + 1, _worldB.x, _worldB.y, _worldB.z);
        glowAttr.setXYZ(vi, _worldA.x, _worldA.y, _worldA.z);
        glowAttr.setXYZ(vi + 1, _worldB.x, _worldB.y, _worldB.z);

        const prox = Math.max(proximity[edge.from] ?? 0, proximity[edge.to] ?? 0);
        maxProx = Math.max(maxProx, prox);

        const fade = depthFade(_mid, camera);
        const energy = edgeEnergyPulse(t, edgeIndex, bundle.layer);

        const conn = edgeToConnection(edge);
        const highlighted = highlightId
          ? isConnectionHighlighted(conn, highlightId)
          : false;
        const dimmed =
          analysisMode &&
          analysisId !== null &&
          !isConnectionHighlighted(conn, analysisId);

        if (dimmed) {
          coreOpacityMax = Math.max(coreOpacityMax, 0.05 * fade);
          glowOpacityMax = Math.max(glowOpacityMax, 0.025 * fade);
          packetSlots.forEach((slot, slotIndex) => {
            if (slot.edgeIndex !== edgeIndex) return;
            const mesh = packetRefs.current[slotIndex];
            if (mesh) mesh.visible = false;
          });
        } else {
          visibleSegs += 1;
        }

        if (dimmed) return;

        const relayBurst =
          bundle.layer === "secondary" &&
          edge.tier === "relay" &&
          Math.sin(t * 1.1 + edge.from * 1.3) > 0.82
            ? 0.18
            : 0;

        const coreBoost =
          (highlighted ? 0.22 : 0) + prox * 0.28 + relayBurst + hubEnergy * 0.12;
        const glowBoost = coreBoost * 0.65;

        coreOpacityMax = Math.max(
          coreOpacityMax,
          (style.coreOpacity + coreBoost) * fade * energy
        );
        glowOpacityMax = Math.max(
          glowOpacityMax,
          (style.glowOpacity + glowBoost) * fade * energy
        );

        if (highlighted || prox > 0.35) {
          bundle.coreMat.color.set(NEXUS.limeBright);
        } else if (bundle.layer === "primary") {
          bundle.coreMat.color.set(NEXUS.lime);
        } else {
          bundle.coreMat.color.set(style.coreColor);
        }

        const speed =
          TIER_BASE_SPEED[edge.tier] * style.speedMul * (1 + hubEnergy * 0.08);

        packetSlots.forEach((slot, slotIndex) => {
          if (slot.edgeIndex !== edgeIndex) return;
          const mesh = packetRefs.current[slotIndex];
          if (!mesh) return;

          const travel =
            (t * speed + slot.phase + edgeIndex * 0.07) % 1;
          const trailOffset = slot.kind === "trail" ? 0.09 : 0;
          const waveOffset =
            slot.kind === "wave"
              ? 0.5 + 0.5 * Math.sin(t * 0.9 + edgeIndex * 0.5)
              : 0;
          const progress =
            slot.kind === "wave"
              ? waveOffset
              : (travel - trailOffset + 1) % 1;

          _packet.lerpVectors(_worldA, _worldB, progress);
          if (root) root.worldToLocal(_packet);
          mesh.position.copy(_packet);
          mesh.visible = true;

          const mat = mesh.material as THREE.MeshBasicMaterial;
          const pulse = 0.85 + 0.15 * Math.sin(t * 4 + slotIndex);
          const baseOp =
            slot.kind === "trail"
              ? style.packetOpacity * 0.35
              : slot.kind === "wave"
                ? style.packetOpacity * 0.45
                : style.packetOpacity;

          mat.opacity =
            (highlighted ? 1 : baseOp) * fade * pulse + prox * 0.25 + relayBurst;
          const scale =
            style.packetRadius *
            (slot.kind === "wave" ? 1.8 + hubEnergy * 0.4 : 2.2 + prox * 0.5);
          mesh.scale.setScalar(scale * pulse);
        });
      });

      if (visibleSegs > 0) {
        coreAttr.needsUpdate = true;
        glowAttr.needsUpdate = true;
      }

      const proxBoost = bundle.layer === "primary" ? 1 + maxProx * 0.08 : 1;
      bundle.coreMat.opacity = Math.min(
        0.95,
        (coreOpacityMax || style.coreOpacity * 0.2) * proxBoost
      );
      bundle.glowMat.opacity = Math.min(
        0.55,
        (glowOpacityMax || style.glowOpacity * 0.2) * proxBoost
      );
    });
  });

  return (
    <group ref={rootRef}>
      {layers.map((bundle) => {
        const order = ROUTE_LAYER_STYLE[bundle.layer].renderOrder;
        return (
          <group key={bundle.layer} renderOrder={order}>
            <lineSegments
              geometry={bundle.glowGeo}
              material={bundle.glowMat}
              renderOrder={order - 1}
            />
            <lineSegments
              geometry={bundle.coreGeo}
              material={bundle.coreMat}
              renderOrder={order}
            />
          </group>
        );
      })}

      {packetSlots.map((slot, i) => {
        const edge = edges[slot.edgeIndex];
        const layer = routeLayerFromTier(edge.tier);
        const style = ROUTE_LAYER_STYLE[layer];
        const color =
          slot.kind === "wave"
            ? NEXUS.limeBright
            : edge.tier === "core"
              ? NEXUS.limeBright
              : style.coreColor;

        return (
          <mesh
            key={`${slot.edgeIndex}-${slot.kind}-${slot.phase}`}
            ref={(el) => {
              packetRefs.current[i] = el;
            }}
            renderOrder={style.renderOrder + 2}
            visible={false}
          >
            <sphereGeometry args={[style.packetRadius, 10, 10]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={style.packetOpacity}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        );
      })}
    </group>
  );
}
