"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  type NeuralConnection,
  getNeuralNodePosition,
  isConnectionHighlighted,
} from "@/lib/system/neural-layout";
import { NEXUS } from "@/components/hero-core/colors";

const PACKET_COUNT = 2;

interface SegmentData {
  conn: NeuralConnection;
  geo: THREE.BufferGeometry;
  pa: THREE.Vector3;
  pb: THREE.Vector3;
  dir: THREE.Vector3;
  len: number;
}

interface NeuralSignalFlowProps {
  connections: NeuralConnection[];
  focusId: string | null;
  analysisId: string | null;
}

export function NeuralSignalFlow({
  connections,
  focusId,
  analysisId,
}: NeuralSignalFlowProps) {
  const lineRefs = useRef<THREE.LineBasicMaterial[]>([]);
  const packetRefs = useRef<THREE.Mesh[]>([]);
  const analysisMode = analysisId !== null;
  const highlightId = focusId ?? analysisId;

  const segments = useMemo(() => {
    return connections
      .map((conn) => {
        const paRaw = getNeuralNodePosition(conn.from);
        const pbRaw = getNeuralNodePosition(conn.to);
        if (!paRaw || !pbRaw) return null;

        const pa = new THREE.Vector3(...paRaw);
        const pb = new THREE.Vector3(...pbRaw);
        const dir = new THREE.Vector3().subVectors(pb, pa);
        const len = dir.length();
        dir.normalize();

        const geo = new THREE.BufferGeometry();
        geo.setAttribute(
          "position",
          new THREE.Float32BufferAttribute(
            [pa.x, pa.y, pa.z, pb.x, pb.y, pb.z],
            3
          )
        );

        return { conn, geo, pa, pb, dir, len };
      })
      .filter(Boolean) as SegmentData[];
  }, [connections]);

  const packetSlots = useMemo(
    () =>
      segments.flatMap((seg, segIdx) =>
        Array.from({ length: PACKET_COUNT }, (_, p) => ({
          segIdx,
          phase: p / PACKET_COUNT,
          speed: seg.conn.tier === "spoke" ? 0.35 : seg.conn.tier === "ring" ? 0.28 : 0.4,
        }))
      ),
    [segments]
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    segments.forEach((seg, i) => {
      const mat = lineRefs.current[i];
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
      const seg = segments[slot.segIdx];
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

      const travel = ((t * slot.speed + slot.phase) % 1);
      mesh.position.copy(seg.pa).addScaledVector(seg.dir, seg.len * travel);
      const scale = highlighted ? 1.15 : 0.85;
      mesh.scale.setScalar(scale);
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = highlighted ? 0.95 : 0.55;
    });
  });

  let packetIndex = 0;

  return (
    <group>
      {segments.map((seg, i) => (
        <group key={`${seg.conn.from}-${seg.conn.to}`}>
          <lineSegments geometry={seg.geo}>
            <lineBasicMaterial
              ref={(el) => {
                if (el) lineRefs.current[i] = el;
              }}
              color={NEXUS.cyan}
              transparent
              opacity={0.12}
              blending={THREE.AdditiveBlending}
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
              >
                <sphereGeometry args={[0.045, 8, 8]} />
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
      ))}
    </group>
  );
}
