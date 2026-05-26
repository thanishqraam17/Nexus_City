"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  type NeuralConnection,
  isConnectionHighlighted,
} from "@/lib/system/neural-layout";
import {
  buildConnectionSegment,
  packetPositionOnSegment,
  type ConnectionSegment,
} from "@/lib/system/neural-graph-geometry";
import { NEXUS } from "@/components/hero-core/colors";

const PACKET_COUNT = 2;
const _packetPos = new THREE.Vector3();

interface NeuralSignalFlowProps {
  connections: NeuralConnection[];
  focusId: string | null;
  analysisId: string | null;
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
}: NeuralSignalFlowProps) {
  const lineMats = useRef<THREE.LineBasicMaterial[]>([]);
  const lineGeos = useRef<THREE.BufferGeometry[]>([]);
  const segmentsRef = useRef<(ConnectionSegment | null)[]>([]);
  const packetRefs = useRef<THREE.Mesh[]>([]);
  const analysisMode = analysisId !== null;
  const highlightId = focusId ?? analysisId;

  const segmentList = useMemo(
    () => connections.map((conn) => buildConnectionSegment(conn)),
    [connections]
  );

  segmentsRef.current = segmentList;

  const packetSlots = useMemo(
    () =>
      segmentList.flatMap((seg, segIdx) => {
        if (!seg) return [];
        return Array.from({ length: PACKET_COUNT }, (_, p) => ({
          segIdx,
          phase: p / PACKET_COUNT,
          speed:
            seg.conn.tier === "spoke" ? 0.32 : seg.conn.tier === "ring" ? 0.26 : 0.38,
        }));
      }),
    [segmentList]
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    connections.forEach((conn, i) => {
      const seg = buildConnectionSegment(conn);
      segmentsRef.current[i] = seg;

      if (!seg) return;

      const geo = lineGeos.current[i];
      if (geo) updateLineGeometry(geo, seg);

      const mat = lineMats.current[i];
      if (!mat) return;

      const highlighted = highlightId
        ? isConnectionHighlighted(seg.conn, highlightId)
        : false;
      const dimmed =
        analysisMode &&
        analysisId &&
        !isConnectionHighlighted(seg.conn, analysisId);

      const basePulse = 0.1 + Math.sin(t * 1.2 + i * 0.4) * 0.04;
      const tierBoost =
        seg.conn.tier === "spoke" ? 0.06 : seg.conn.tier === "ring" ? 0.04 : 0.03;

      mat.opacity = highlighted
        ? analysisMode
          ? 0.62
          : 0.42
        : dimmed
          ? 0.025
          : basePulse + tierBoost;
      mat.color.set(highlighted ? NEXUS.lime : NEXUS.cyan);
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

      mesh.scale.setScalar(highlighted ? 1.12 : 0.85);
      (mesh.material as THREE.MeshBasicMaterial).opacity = highlighted ? 0.95 : 0.55;
    });
  });

  let packetIndex = 0;

  return (
    <group renderOrder={1}>
      {connections.map((conn, i) => {
        const seg = segmentList[i];
        if (!seg) return null;

        return (
          <group key={`${conn.from}-${conn.to}`}>
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
                color={NEXUS.cyan}
                transparent
                opacity={0.12}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </lineSegments>

            {Array.from({ length: PACKET_COUNT }).map(() => {
              const idx = packetIndex++;
              return (
                <mesh
                  key={idx}
                  ref={(el) => {
                    if (el) packetRefs.current[idx] = el;
                  }}
                  renderOrder={2}
                >
                  <sphereGeometry args={[0.04, 8, 8]} />
                  <meshBasicMaterial
                    color={NEXUS.limeBright}
                    transparent
                    opacity={0.7}
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
