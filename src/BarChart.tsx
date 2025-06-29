import React from 'react';

interface BarChartProps {
  bins: number[];
  binLabels: string[];
}

export const BarChart: React.FC<BarChartProps> = ({ bins, binLabels }) => {
  const max = Math.max(...bins, 1);
  const chartHeight = 220;
  const barWidth = 18;
  const gap = 6;
  const width = bins.length * (barWidth + gap) + gap;

  return (
    <div style={{ overflowX: 'auto', paddingBottom: 8 }}>
      <svg width={width} height={chartHeight + 30} style={{ background: '#fff' }}>
        {/* Bars */}
        {bins.map((count, i) => {
          const h = (count / max) * chartHeight;
          return (
            <g key={i}>
              <rect
                x={gap + i * (barWidth + gap)}
                y={chartHeight - h + 10}
                width={barWidth}
                height={h}
                fill="#4f8cff"
                rx={3}
              />
              {/* Value label */}
              <text
                x={gap + i * (barWidth + gap) + barWidth / 2}
                y={chartHeight - h + 5}
                textAnchor="middle"
                fontSize="11"
                fill="#333"
              >
                {count > 0 ? count : ''}
              </text>
              {/* Bin label */}
              <text
                x={gap + i * (barWidth + gap) + barWidth / 2}
                y={chartHeight + 25}
                textAnchor="middle"
                fontSize="10"
                fill="#555"
                transform={`rotate(-30,${gap + i * (barWidth + gap) + barWidth / 2},${chartHeight + 25})`}
              >
                {binLabels[i]}
              </text>
            </g>
          );
        })}
        {/* Y axis line */}
        <line x1={gap} y1={10} x2={gap} y2={chartHeight + 10} stroke="#bbb" strokeWidth={1} />
      </svg>
    </div>
  );
};
