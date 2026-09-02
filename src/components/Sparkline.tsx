export function Sparkline({ data, color = "#FFB6D9", height = 32, width = 80 }: {
  data: number[];
  color?: string;
  height?: number;
  width?: number;
}) {
  if (data.length < 2) {
    return <div style={{ width, height }} className="flex items-center justify-center text-[10px] text-inkDim/40">—</div>;
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padding = 2;

  const points = data.map((v, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = padding + ((max - v) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  const lastPoint = points[points.length - 1].split(",");

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.4"
      />
      <circle cx={lastPoint[0]} cy={lastPoint[1]} r="2" fill={color} />
    </svg>
  );
}
