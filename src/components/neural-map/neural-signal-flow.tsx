"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  type NeuralConnection,
  type NeuralConnectionTier,
  isConnectionHighlighted,
} from "@/lib/system/neural-layout";
import {
  buildConnectionSegment,
  packetPositionOnSegment,
  type ConnectionSegment,
} from "@/lib/system/neural-graph-geometry";
import { neuralPhase } from "@/lib/system/neural-sync";
import { NEXUS } from "@/components/hero-core/colors";

const _packetPos = new THREE.Vector3();
const _yAxis = new THREE.Vector3(0, 1, 0);
const _quat = new THREE.Quaternion();

const TIER_CONFIG: Record<
  NeuralConnectionTier,
  { packets: number; speed: number; lineOpacity: number; color: string }
> = {
  spoke: { packets: 3, speed: 0.3, lineOpacity: 0.24, color: NEXUS.lime },
  ring: { packets: 2, speed: 0.24, lineOpacity: 0.17, color: NEXUS.cyan },
  relay: { packets: 2, speed: 0.27, lineOpacity: 0.14, color: NEXUS.cyan },
  core: { packets: 2, speed: 0.36, lineOpacity: 0.2, color: NEXUS.limeBright },
};

interface NeuralSignalFlowProps {
  connections: NeuralConnection[];
  focusId: string | null;
  analysisId: string | null;
  cursorBoost?: number;
}

function createLineGeometry(seg: ConnectionSegment): THREE.BufferGeometry {
  const geo = new THREE.BufferGeometry();
  const positions = new Float32Array([
    seg.start.x,
    seg.start.y,
    seg.start.z,
    seg.end.x,
    seg.end.y,
    seg.end.z,
  ]);
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  return geo;
}

function updateLineGeometry(geo: THREE.BufferGeometry, seg: ConnectionSegment) {
  const attr = geo.getAttribute("position") as THREE.BufferAttribute;
  attr.setXYZ(0, seg.start.x, seg.start.y, seg.start.z);
  attr.setXYZ(1, seg.end.x, seg.end.y, seg.end.z);
  attr.needsUpdate = true;
}

export function NeuralSignalFlow({
  connections,
  focusId,
  analysisId,
  cursorBoost = 0,
}: NeuralSignalFlowProps) {
  const lineMats = useRef<THREE.LineBasicMaterial[]>([]);
  const lineGeos = useRef<THREE.BufferGeometry[]>([]);
  const segmentsRef = useRef<(ConnectionSegment | null)[]>([]);
  const packetRefs = useRef<THREE.Mesh[]>([]);
  const pulseRefs = useRef<THREE.Mesh[]>([]);
  const analysisMode = analysisId !== null;
  const highlightId = focusId ?? analysisId;

  const segmentList = useMemo(
    () => connections.map((conn) => buildConnectionSegment(conn)),
    [connections]
  );

  segmentsRef.current = segmentList;

  const { packetSlots, pulseSlots } = useMemo(() => {
    const packets: {
      segIdx: number;
      phase: number;
      speed: number;
      tier: NeuralConnectionTier;
    }[] = [];
    const pulses: { segIdx: number; phase: number; speed: number }[] = [];

    segmentList.forEach((seg, segIdx) => {
      if (!seg) return;
      const cfg = TIER_CONFIG[seg.conn.tier];
      for (let p = 0; p < cfg.packets; p++) {
        packets.push({
          segIdx,
          phase: p / cfg.packets,
          speed: cfg.speed,
          tier: seg.conn.tier,
        });
      }
      if (seg.conn.tier === "spoke" || seg.conn.tier === "core") {
        pulses.push({
          segIdx,
          phase: segIdx * 0.11,
          speed: cfg.speed * 0.85,
        });
      }
    });

    return { packetSlots: packets, pulseSlots: pulses };
  }, [segmentList]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const wave = 0.5 + 0.5 * Math.sin(neuralPhase(t, 0, Math.PI * 2));

    connections.forEach((conn, i) => {
      const seg = buildConnectionSegment(conn);
      segmentsRef.current[i] = seg;
      if (!seg) return;

      const geo = lineGeos.current[i];
      if (geo) updateLineGeometry(geo, seg);

      const mat = lineMats.current[i];
      if (!mat) return;

      const cfg = TIER_CONFIG[seg.conn.tier];
      const highlighted = highlightId
        ? isConnectionHighlighted(seg.conn, highlightId)
        : false;
      const dimmed =
        analysisMode &&
        analysisId &&
        !isConnectionHighlighted(seg.conn, analysisId);

      const lengthFade = Math.min(1, 4.2 / seg.pathLength);
      const basePulse = cfg.lineOpacity * lengthFade * (0.85 + wave * 0.15);
      const cursorLift = cursorBoost * 0.08;

      mat.opacity = highlighted
        ? analysisMode
          ? 0.68
          : 0.48 + cursorLift
        : dimmed
          ? 0.03
          : basePulse + cursorLift;
      mat.color.set(highlighted ? NEXUS.lime : cfg.color);
    });

    packetSlots.forEach((slot, pi) => {
      const mesh = packetRefs.current[pi];
      const seg = segmentsRef.current[slot.segIdx];
      if (!mesh || !seg) return;

      const highlighted = highlightId
        ? isConnectionHighlighted(seg.conn, highlightId)
        : true;
      const dimmed =
        analysisMode &&
        analysisId &&
        !isConnectionHighlighted(seg.conn, analysisId);

      mesh.visible = !dimmed;
      if (!mesh.visible) return;

      const travel = (t * slot.speed + slot.phase) % 1;
      packetPositionOnSegment(seg, travel, _packetPos);
      mesh.position.copy(_packetPos);

      const scale = (highlighted ? 1.15 : 0.9) * (slot.tier === "core" ? 1.1 : 1);
      mesh.scale.setScalar(scale);
      (mesh.material as THREE.MeshBasicMaterial).opacity =
        highlighted ? 0.95 : 0.5 + cursorBoost * 0.2;
    });

    pulseSlots.forEach((slot, pi) => {
      const mesh = pulseRefs.current[pi];
      const seg = segmentsRef.current[slot.segIdx];
      if (!mesh || !seg) return;

      const travel = (t * slot.speed + slot.phase) % 1;
      packetPositionOnSegment(seg, travel, _packetPos);
      mesh.position.copy(_packetPos);

      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.25 + wave * 0.15 + cursorBoost * 0.1;
      mesh.scale.set(0.06, seg.lineLength * 0.08, 0.06);
      _quat.setFromUnitVectors(_yAxis, seg.direction);
      mesh.quaternion.copy(_quat);
    });
  });

  let packetIndex = 0;
  let pulseIndex = 0;

  return (
    <group renderOrder={1}>
      {connections.map((conn, i) => {
        const seg = segmentList[i];
        if (!seg) return null;

        const cfg = TIER_CONFIG[conn.tier];

        return (
          <group key={`${conn.from}-${conn.to}-${conn.tier}`}>
            <lineSegments
              geometry={createLineGeometry(seg)}
              ref={(obj) => {
                if (obj) {
                  lineGeos.current[i] = obj.geometry;
                  lineMats.current[i] = obj.material as THREE.LineBasicMaterial;
                }
              }}
              renderOrder={1}
            >
              <lineBasicMaterial
                color={cfg.color}
                transparent
                opacity={cfg.lineOpacity}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </lineSegments>

            {Array.from({ length: cfg.packets }).map(() => {
              const idx = packetIndex++;
              return (
                <mesh
                  key={`pkt-${idx}`}
                  ref={(el) => {
                    if (el) packetRefs.current[idx] = el;
                  }}
                  renderOrder={3}
                >
                  <sphereGeometry args={[0.038, 8, 8]} />
                  <meshBasicMaterial
                    color={conn.tier === "core" ? NEXUS.limeBright : NEXUS.lime}
                    transparent
                    opacity={0.75}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                  />
                </mesh>
              );
            })}

            {(conn.tier === "spoke" || conn.tier === "core") &&
              Array.from({ length: 1 }).map(() => {
                const idx = pulseIndex++;
                return (
                  <mesh
                    key={`pulse-${idx}`}
                    ref={(el) => {
                      if (el) pulseRefs.current[idx] = el;
                    }}
                    renderOrder={2}
                  >
                    <sphereGeometry args={[0.08, 6, 6]} />
                    <meshBasicMaterial
                      color={NEXUS.cyan}
                      transparent
                      opacity={0.2}
                      blending={THREE.AdditiveBlending}
                      depthWrite={false}
                    />
                  </mesh>
                );
              })}
          </group>
        );
      })}
    </group>
  );
}
