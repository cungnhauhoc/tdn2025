import React from 'react';
import { getBinColor } from './utils';

interface PieChartProps {
  bins: number[];
  binLabels: string[];
}

export const PieChart: React.FC<PieChartProps> = ({ bins, binLabels }) => {
  const total = bins.reduce((sum, count) => sum + count, 0);
  
  if (total === 0) return <div className="no-data">Không có dữ liệu để hiển thị</div>;

  let startAngle = 0;
  const slices = bins.map((count, index) => {
    const angle = (count / total) * 360;
    const endAngle = startAngle + angle;
    const slice = { count, startAngle, endAngle, color: getBinColor(index) };
    startAngle = endAngle;
    return slice;
  });

  const polarToCartesian = (cx: number, cy: number, r: number, angle: number) => {
    const rad = (angle * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const createSlicePath = (cx: number, cy: number, r: number, startA: number, endA: number) => {
    const start = polarToCartesian(cx, cy, r, endA);
    const end = polarToCartesian(cx, cy, r, startA);
    return ["M", cx, cy, "L", start.x, start.y, "A", r, r, 0, endA - startA <= 180 ? "0" : "1", 0, end.x, end.y, "Z"].join(" ");
  };

  const centerX = 150; const centerY = 150; const radius = 100;

  return (
    <div className="pie-chart-wrapper">
      <div className="pie-svg-container">
        <svg width="300" height="300" viewBox="0 0 300 300">
          {slices.map((s, i) => s.count > 0 && <path key={i} d={createSlicePath(centerX, centerY, radius, s.startAngle, s.endAngle)} fill={s.color} stroke="white" strokeWidth="2" />)}
          <circle cx={centerX} cy={centerY} r={30} fill="white" stroke="var(--border-color)" strokeWidth="1" />
          <text x={centerX} y={centerY} textAnchor="middle" dominantBaseline="middle" fontSize="20" fontWeight="bold" fill="var(--text-primary)">{total}</text>
        </svg>
      </div>
      
      <div className="pie-legend">
        <h4>Phân bố điểm chi tiết</h4>
        <div className="legend-grid">
          {bins.map((count, i) => (
            <div key={i} className="legend-item">
              <div className="color-box" style={{ backgroundColor: getBinColor(i) }} />
              <span className="legend-text">{binLabels[i]}: {count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
