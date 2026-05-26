"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  buildNeuralGraph,
  nodeIdFromIndex,
  type NeuralGraphEdge,
} from "@/lib/system/neural-graph";
import { isConnectionHighlighted, type NeuralConnection } from "@/lib/system/neural-layout";
import { NEXUS } from "@/components/hero-core/colors";

const _worldA = new THREE.Vector3();
const _worldB = new THREE.Vector3();
const _packet = new THREE.Vector3();

const TIER_SPEED: Record<NeuralGraphEdge["tier"], number> = {
  spoke: 0.28,
  ring: 0.22,
  relay: 0.25,
  core: 0.34,
};

function edgeToConnection(edge: NeuralGraphEdge): NeuralConnection {
  return {
    from: nodeIdFromIndex(edge.from),
    to: nodeIdFromIndex(edge.to),
    directed: true,
    tier: edge.tier,
  };
}

interface NeuralGraphProps {
  nodeRefs: React.MutableRefObject<(THREE.Object3D | null)[]>;
  nodeProximityRef: React.MutableRefObject<number[]>;
  focusId: string | null;
  analysisId: string | null;
  packetsPerEdge?: number;
}

export function NeuralGraph({
  nodeRefs,
  nodeProximityRef,
  focusId,
  analysisId,
  packetsPerEdge = 2,
}: NeuralGraphProps) {
  const rootRef = useRef<THREE.Group>(null);
  const { edges } = useMemo(() => buildNeuralGraph(), []);
  const lineGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(edges.length * 2 * 3);
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [edges.length]);

  const lineMat = useRef(
    new THREE.LineBasicMaterial({
      color: NEXUS.cyan,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );

  const packetRefs = useRef<(THREE.Mesh | null)[]>([]);
  const highlightId = focusId ?? analysisId;
  const analysisMode = analysisId !== null;

  useLayoutEffect(() => {
    return () => {
      lineGeo.dispose();
      lineMat.current.dispose();
    };
  }, [lineGeo]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const posAttr = lineGeo.getAttribute("position") as THREE.BufferAttribute;
    const proximity = nodeProximityRef.current;
    let maxEdgeBoost = 0;
    const root = rootRef.current;

    edges.forEach((edge, i) => {
      const objA = nodeRefs.current[edge.from];
      const objB = nodeRefs.current[edge.to];
      if (!objA || !objB) return;

      objA.getWorldPosition(_worldA);
      objB.getWorldPosition(_worldB);

      const vi = i * 2;
      posAttr.setXYZ(vi, _worldA.x, _worldA.y, _worldA.z);
      posAttr.setXYZ(vi + 1, _worldB.x, _worldB.y, _worldB.z);

      const prox = Math.max(proximity[edge.from] ?? 0, proximity[edge.to] ?? 0);
      maxEdgeBoost = Math.max(maxEdgeBoost, prox);

      const conn = edgeToConnection(edge);
      const highlighted = highlightId
        ? isConnectionHighlighted(conn, highlightId)
        : false;
      const dimmed =
        analysisMode &&
        analysisId !== null &&
        !isConnectionHighlighted(conn, analysisId);

      for (let pi = 0; pi < packetsPerEdge; pi++) {
        const slot = i * packetsPerEdge + pi;
        const mesh = packetRefs.current[slot];
        if (!mesh) continue;

        if (dimmed) {
          mesh.visible = false;
          continue;
        }

        const phase = pi / packetsPerEdge;
        const speed = TIER_SPEED[edge.tier];
        const travel = (t * speed + phase) % 1;
        _packet.lerpVectors(_worldA, _worldB, travel);
        if (root) root.worldToLocal(_packet);
        mesh.position.copy(_packet);
        mesh.visible = true;
        const mat = mesh.material as THREE.MeshBasicMaterial;
        mat.opacity = (highlighted ? 0.95 : 0.55) + prox * 0.3;
        mesh.scale.setScalar(0.85 + prox * 0.25 + (highlighted ? 0.2 : 0));
      }
    });

    posAttr.needsUpdate = true;
    lineMat.current.opacity =
      0.14 + maxEdgeBoost * 0.25 + (highlightId ? 0.08 : 0);
    lineMat.current.color.set(
      maxEdgeBoost > 0.35 || highlightId ? NEXUS.lime : NEXUS.cyan
    );
  });

  let packetSlot = 0;

  return (
    <group ref={rootRef} renderOrder={1}>
      <lineSegments geometry={lineGeo} renderOrder={1} material={lineMat.current} />

      {edges.map((edge) =>
        Array.from({ length: packetsPerEdge }).map((_, pi) => {
          const idx = packetSlot++;
          return (
            <mesh
              key={`${edge.from}-${edge.to}-${pi}`}
              ref={(el) => {
                packetRefs.current[idx] = el;
              }}
              renderOrder={3}
              visible={false}
            >
              <sphereGeometry args={[0.04, 8, 8]} />
              <meshBasicMaterial
                color={edge.tier === "core" ? NEXUS.limeBright : NEXUS.lime}
                transparent
                opacity={0.8}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
          );
        })
      )}
    </group>
  );
}
