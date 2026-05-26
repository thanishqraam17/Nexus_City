"use client";

/** Midground + foreground holographic compositing (CSS only, behind/above WebGL) */
export function NeuralHoloComposite() {
  return (
    <>
      <div className="neural-holo-midground" aria-hidden>
        <div className="neural-holo-midground__fog" />
        <div className="neural-holo-midground__beams" />
        <div className="neural-holo-midground__scanlines" />
        <div className="neural-holo-midground__glow" />
      </div>
      <div className="neural-holo-foreground" aria-hidden>
        <div className="neural-holo-foreground__bloom" />
        <div className="neural-holo-foreground__edge-fade" />
      </div>
    </>
  );
}
