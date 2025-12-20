import React from 'react';

interface PieChartProps {
  bins: number[];
  binLabels: string[];
}

export const PieChart: React.FC<PieChartProps> = ({ bins, binLabels }) => {
  const total = bins.reduce((sum, count) => sum + count, 0);
  
  if (total === 0) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '300px',
        color: 'var(--text-secondary)'
      }}>
        Không có dữ liệu để hiển thị
      </div>
    );
  }

  // Calculate slice angles
  let startAngle = 0;
  const slices = bins.map((count, index) => {
    const percentage = (count / total) * 100;
    const angle = (percentage / 100) * 360;
    const endAngle = startAngle + angle;
    
    const slice = {
      count,
      percentage,
      startAngle,
      endAngle,
      label: binLabels[index],
      color: getColor(index)
    };
    
    startAngle = endAngle;
    return slice;
  });

  // Generate colors for slices based on score ranges (5-point intervals)
  function getColor(index: number) {
    const colors = [
      '#e53935', // 0-5: Dark Red
      '#f44336', // 5-10: Red
      '#ff5722', // 10-15: Deep Orange
      '#ffa726', // 15-20: Orange
      '#ff9800', // 20-25: Orange
      '#ffca28', // 25-30: Amber
      '#ffc107', // 30-35: Amber
      '#fff176', // 35-40: Yellow
      '#ffee58', // 40-45: Yellow
      '#ffeb3b', // 45-50: Yellow
      '#d4e157', // 50-55: Lime
      '#cddc39', // 55-60: Lime
      '#aed581', // 60-65: Light Green
      '#9ccc65', // 65-70: Light Green
      '#8bc34a', // 70-75: Light Green
      '#5cb85c', // 75-80: Green
      '#4caf50', // 80-85: Green
      '#43a047', // 85-90: Green
      '#388e3c', // 90-95: Green
      '#2e7d32'  // 95-100: Deep Green
    ];
    return colors[index] || '#43a047';
  }

  // Create SVG path for a pie slice
  function createSlicePath(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
    const start = polarToCartesian(cx, cy, r, endAngle);
    const end = polarToCartesian(cx, cy, r, startAngle);
    
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    return [
      "M", cx, cy,
      "L", start.x, start.y,
      "A", r, r, 0, largeArcFlag, 0, end.x, end.y,
      "Z"
    ].join(" ");
  }

  // Convert polar coordinates to cartesian
  function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
    const rad = (angle * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad)
    };
  }

  const centerX = 150;
  const centerY = 150;
  const radius = 100;

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      gap: '24px'
    }}>
      <div style={{ 
        width: '300px', 
        height: '300px', 
        position: 'relative'
      }}>
        <svg width="100%" height="100%" viewBox="0 0 300 300">
          {slices.map((slice, index) => (
            slice.count > 0 && (
              <path
                key={index}
                d={createSlicePath(centerX, centerY, radius, slice.startAngle, slice.endAngle)}
                fill={slice.color}
                stroke="white"
                strokeWidth="2"
              />
            )
          ))}
          
          {/* Center circle */}
          <circle
            cx={centerX}
            cy={centerY}
            r={30}
            fill="white"
            stroke="var(--border-color)"
            strokeWidth="1"
          />
          
          {/* Total count in center */}
          <text
            x={centerX}
            y={centerY}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="20"
            fontWeight="bold"
            fill="var(--text-primary)"
          >
            {total}
          </text>
        </svg>
      </div>
      
      {/* Legend with scrollable container for all items */}
      <div style={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxHeight: '300px',
        overflowY: 'auto',
        padding: '10px',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        backgroundColor: 'var(--bg-card)'
      }}>
        <h4 style={{ 
          margin: '0 0 10px 0', 
          color: 'var(--text-primary)',
          textAlign: 'center'
        }}>
          Phân bố điểm chi tiết
        </h4>
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: '8px',
          width: '100%'
        }}>
          {bins.map((count, index) => (
            <div 
              key={index} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px',
                padding: '6px',
                borderRadius: '4px',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)'
              }}
            >
              <div 
                style={{ 
                  width: '16px', 
                  height: '16px', 
                  backgroundColor: getColor(index),
                  borderRadius: '2px'
                }} 
              />
              <span style={{ 
                fontSize: '13px',
                color: 'var(--text-primary)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {binLabels[index]}: {count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};