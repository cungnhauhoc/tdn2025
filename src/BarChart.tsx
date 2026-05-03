import React from 'react';

interface BarChartProps {
  bins: number[];
  binLabels: string[];
}

export const BarChart: React.FC<BarChartProps> = ({ bins, binLabels }) => {
  const maxValue = Math.max(...bins, 1);
  const width = 800;
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const chartHeight = isMobile ? 220 : 300;
  const margin = { 
    top: 20, 
    right: 30, 
    bottom: isMobile ? 40 : 60, 
    left: isMobile ? 40 : 60 
  };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = chartHeight - margin.top - margin.bottom;
  const barWidth = innerWidth / bins.length - 2;

  // Function to get color based on score range (5-point intervals)
  const getBarColor = (index: number) => {
    const score = index * 5; // Calculate the starting score for this bin
    if (score >= 95) return '#2e7d32'; // Deep Green
    if (score >= 90) return '#388e3c'; // Green
    if (score >= 85) return '#43a047'; // Green
    if (score >= 80) return '#4caf50'; // Green
    if (score >= 75) return '#5cb85c'; // Green
    if (score >= 70) return '#8bc34a'; // Light Green
    if (score >= 65) return '#9ccc65'; // Light Green
    if (score >= 60) return '#aed581'; // Light Green
    if (score >= 55) return '#cddc39'; // Lime
    if (score >= 50) return '#d4e157'; // Lime
    if (score >= 45) return '#ffeb3b'; // Yellow
    if (score >= 40) return '#ffee58'; // Yellow
    if (score >= 35) return '#fff176'; // Yellow
    if (score >= 30) return '#ffc107'; // Amber
    if (score >= 25) return '#ffca28'; // Amber
    if (score >= 20) return '#ff9800'; // Orange
    if (score >= 15) return '#ffa726'; // Orange
    if (score >= 10) return '#ff5722'; // Deep Orange
    if (score >= 5) return '#f44336'; // Red
    return '#e53935'; // Dark Red
  };

  return (
    <div style={{ overflowX: 'auto', paddingBottom: 16 }}>
      <svg width="100%" height={chartHeight + 100} viewBox={`0 0 ${width} ${chartHeight + 100}`} preserveAspectRatio="xMidYMid meet">
        {/* X-axis */}
        <line 
          x1={margin.left} 
          y1={margin.top + innerHeight} 
          x2={margin.left + innerWidth} 
          y2={margin.top + innerHeight} 
          stroke="currentColor" 
          strokeWidth={1}
        />
        
        {/* Y-axis */}
        <line 
          x1={margin.left} 
          y1={margin.top} 
          x2={margin.left} 
          y2={margin.top + innerHeight} 
          stroke="currentColor" 
          strokeWidth={1}
        />
        
        {/* Bars */}
        {bins.map((count, index) => {
          const barHeight = (count / maxValue) * innerHeight;
          const x = margin.left + index * (innerWidth / bins.length) + 1;
          const y = margin.top + innerHeight - barHeight;
          
          return (
            <g key={index}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={getBarColor(index)}
                rx={4}
                ry={4}
              />
              {/* Bar value label */}
              {count > 0 && (
                <text
                  x={x + barWidth / 2}
                  y={y - 5}
                  textAnchor="middle"
                  fontSize="12"
                  fill="currentColor"
                >
                  {count}
                </text>
              )}
            </g>
          );
        })}
        
        {/* X-axis labels */}
        {binLabels.map((label, index) => {
          const x = margin.left + index * (innerWidth / bins.length) + (innerWidth / bins.length) / 2;
          return (
            <text
              key={index}
              x={x}
              y={margin.top + innerHeight + 20} // Moved down to prevent overlap
              textAnchor="middle"
              fontSize="12"
              fill="currentColor"
            >
              {label}
            </text>
          );
        })}
        
        {/* Y-axis labels */}
        {[0, Math.round(maxValue * 0.25), Math.round(maxValue * 0.5), Math.round(maxValue * 0.75), maxValue].map((value, index) => {
          const y = margin.top + innerHeight - (value / maxValue) * innerHeight;
          return (
            <g key={index}>
              <line
                x1={margin.left - 5}
                y1={y}
                x2={margin.left}
                y2={y}
                stroke="currentColor"
                strokeWidth={1}
              />
              <text
                x={margin.left - 10}
                y={y + 4}
                textAnchor="end"
                fontSize="12"
                fill="currentColor"
              >
                {value}
              </text>
            </g>
          );
        })}
        
        {/* Axis titles */}
        <text
          x={margin.left + innerWidth / 2}
          y={chartHeight + 70} // Moved down to prevent overlap
          textAnchor="middle"
          fontSize="14"
          fontWeight="bold"
          fill="currentColor"
        >
          Điểm
        </text>
        
        <text
          x={20}
          y={margin.top + innerHeight / 2}
          textAnchor="middle"
          fontSize="14"
          fontWeight="bold"
          fill="currentColor"
          transform={`rotate(-90, 20, ${margin.top + innerHeight / 2})`}
        >
          Số lượng thí sinh
        </text>
      </svg>
    </div>
  );
};