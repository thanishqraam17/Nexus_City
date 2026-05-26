import type { WebGLRenderer, Scene } from "three";

/** Configure R3F renderer for seamless CSS compositing (no opaque clear) */
export function configureTransparentRenderer(gl: WebGLRenderer, scene: Scene) {
  scene.background = null;
  scene.fog = null;

  gl.setClearColor(0x000000, 0);
  gl.setClearAlpha(0);
  gl.autoClear = true;

  const canvas = gl.domElement;
  canvas.style.background = "transparent";
  canvas.style.backgroundColor = "transparent";
}
