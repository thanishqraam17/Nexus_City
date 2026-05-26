import * as THREE from "three";

const _world = new THREE.Vector3();
const _proj = new THREE.Vector3();

/** Screen-space proximity 0–1 for cursor atmospheric influence */
export function cursorProximity01(
  x: number,
  y: number,
  z: number,
  parent: THREE.Object3D | null,
  camera: THREE.Camera,
  viewport: { width: number; height: number },
  cursorX: number,
  cursorY: number,
  radiusPx = 200
): number {
  _world.set(x, y, z);

  if (parent) {
    parent.updateWorldMatrix(true, false);
    _world.applyMatrix4(parent.matrixWorld);
  }

  _proj.copy(_world).project(camera);
  if (_proj.z > 1) return 0;

  const sx = (_proj.x * 0.5 + 0.5) * viewport.width;
  const sy = (-_proj.y * 0.5 + 0.5) * viewport.height;
  const dist = Math.hypot(sx - cursorX, sy - cursorY);
  const t = 1 - dist / radiusPx;
  return t <= 0 ? 0 : t * t * (3 - 2 * t);
}
