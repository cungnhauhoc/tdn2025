import React from 'react';
import { getBinColor } from './utils';

interface BarChartProps {
  bins: number[];
  binLabels: string[];
}

export const BarChart: React.FC<BarChartProps> = ({ bins, binLabels }) => {
  const maxValue = Math.max(...bins, 1);
  const width = 800;
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const chartHeight = isMobile ? 220 : 300;
  const margin = { top: 20, right: 30, bottom: isMobile ? 40 : 60, left: isMobile ? 40 : 60 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = chartHeight - margin.top - margin.bottom;
  const barWidth = innerWidth / bins.length - 2;

  return (
    <div style={{ overflowX: 'auto', paddingBottom: 16 }}>
      <svg width="100%" height={chartHeight + 100} viewBox={`0 0 ${width} ${chartHeight + 100}`} preserveAspectRatio="xMidYMid meet">
        <line x1={margin.left} y1={margin.top + innerHeight} x2={margin.left + innerWidth} y2={margin.top + innerHeight} stroke="currentColor" strokeWidth={1} />
        <line x1={margin.left} y1={margin.top} x2={margin.left} y2={margin.top + innerHeight} stroke="currentColor" strokeWidth={1} />
        
        {bins.map((count, index) => {
          const barHeight = (count / maxValue) * innerHeight;
          const x = margin.left + index * (innerWidth / bins.length) + 1;
          const y = margin.top + innerHeight - barHeight;
          return (
            <g key={index}>
              <rect x={x} y={y} width={barWidth} height={barHeight} fill={getBinColor(index)} rx={4} ry={4} />
              {count > 0 && <text x={x + barWidth / 2} y={y - 5} textAnchor="middle" fontSize="12" fill="currentColor">{count}</text>}
            </g>
          );
        })}
        
        {binLabels.map((label, index) => (
          <text key={index} x={margin.left + index * (innerWidth / bins.length) + (innerWidth / bins.length) / 2} y={margin.top + innerHeight + 20} textAnchor="middle" fontSize="12" fill="currentColor">{label}</text>
        ))}
        
        {[0, Math.round(maxValue * 0.25), Math.round(maxValue * 0.5), Math.round(maxValue * 0.75), maxValue].map((value, index) => {
          const y = margin.top + innerHeight - (value / maxValue) * innerHeight;
          return (
            <g key={index}>
              <line x1={margin.left - 5} y1={y} x2={margin.left} y2={y} stroke="currentColor" strokeWidth={1} />
              <text x={margin.left - 10} y={y + 4} textAnchor="end" fontSize="12" fill="currentColor">{value}</text>
            </g>
          );
        })}
        <text x={margin.left + innerWidth / 2} y={chartHeight + 70} textAnchor="middle" fontSize="14" fontWeight="bold" fill="currentColor">Điểm</text>
        <text x={20} y={margin.top + innerHeight / 2} textAnchor="middle" fontSize="14" fontWeight="bold" fill="currentColor" transform={`rotate(-90, 20, ${margin.top + innerHeight / 2})`}>Số lượng thí sinh</text>
      </svg>
    </div>
  );
};
