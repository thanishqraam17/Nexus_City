"use client";

const STREAM_COLUMNS = [
  "0x7F2A · SYNC · NODE_847 · 12ms",
  "GRID::ALPHA-7 · UPTIME 99.97%",
  "NEURAL::THROUGHPUT 87.2%",
  "LATENCY 0.8ms · VECTOR OK",
  "PULSE::TRANSIT · FLOW 94%",
  "AETHER::SHIELD · ARMED",
];

export function DataStreams() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden opacity-30"
      aria-hidden
    >
      <div className="absolute left-[4%] top-0 hidden h-full w-32 flex-col gap-8 font-mono text-[9px] uppercase tracking-widest text-nexus-cyan/40 sm:flex">
        <StreamColumn lines={STREAM_COLUMNS} duration={28} />
      </div>
      <div className="absolute right-[6%] top-0 hidden h-full w-28 flex-col gap-6 font-mono text-[8px] uppercase tracking-[0.2em] text-nexus-lime/35 lg:flex">
        <StreamColumn lines={[...STREAM_COLUMNS].reverse()} duration={34} reverse />
      </div>
    </div>
  );
}

function StreamColumn({
  lines,
  duration,
  reverse,
}: {
  lines: string[];
  duration: number;
  reverse?: boolean;
}) {
  const doubled = [...lines, ...lines];
  return (
    <div
      className={`atmo-data-stream flex flex-col gap-10 whitespace-nowrap ${reverse ? "atmo-data-stream-reverse" : ""}`}
      style={{ animationDuration: `${duration}s` }}
    >
      {doubled.map((line, i) => (
        <span key={`${line}-${i}`} className="atmo-holo-text">
          {line}
        </span>
      ))}
    </div>
  );
}
