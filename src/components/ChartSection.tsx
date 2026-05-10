import React from 'react';
import { BarChart } from '../BarChart';
import { PieChart } from '../PieChart';
import type { ChartType } from '../types';

interface ChartSectionProps {
  chartType: ChartType;
  setChartType: (type: ChartType) => void;
  bins: number[];
  binLabels: string[];
}

export const ChartSection: React.FC<ChartSectionProps> = ({ 
  chartType, setChartType, bins, binLabels 
}) => {
  return (
    <section className="chart-section" aria-labelledby="chart-heading">
      <div className="chart-header">
        <h2 id="chart-heading" className="chart-title">Phổ điểm thí sinh (theo thang điểm 10)</h2>
        <div className="chart-actions" role="group" aria-label="Chuyển đổi loại biểu đồ">
          <button 
            className={`chart-toggle-btn ${chartType === 'bar' ? 'active' : ''}`}
            onClick={() => setChartType('bar')}
            aria-pressed={chartType === 'bar'}
          >
            Biểu đồ cột
          </button>
          <button 
            className={`chart-toggle-btn ${chartType === 'pie' ? 'active' : ''}`}
            onClick={() => setChartType('pie')}
            aria-pressed={chartType === 'pie'}
          >
            Biểu đồ tròn
          </button>
        </div>
      </div>
      <div className="chart-container">
        {chartType === 'bar' ? (
          <BarChart bins={bins} binLabels={binLabels} />
        ) : (
          <PieChart bins={bins} binLabels={binLabels} />
        )}
      </div>
    </section>
  );
};
