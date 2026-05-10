import React from 'react';
import { UsersIcon, BarChartIcon, AwardIcon, CheckIcon, TrendingUpIcon, TargetIcon } from './Icons';
import type { Statistics } from '../types';

interface StatsSectionProps {
  statistics: Statistics;
  selectedYear: string;
}

export const StatsSection: React.FC<StatsSectionProps> = ({ statistics, selectedYear }) => {
  return (
    <section className="stats-section" aria-labelledby="stats-heading">
      <h2 id="stats-heading" className="sr-only">Thống kê điểm thi</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <UsersIcon />
          <div className="stat-label">Tổng số thí sinh</div>
          <div className="stat-value">{statistics.total}</div>
        </div>
        <div className="stat-card">
          <BarChartIcon />
          <div className="stat-label">Điểm trung bình</div>
          <div className="stat-value">{statistics.avg}</div>
        </div>
        <div className="stat-card">
          <AwardIcon />
          <div className="stat-label">Điểm cao nhất</div>
          <div className="stat-value">{statistics.max}</div>
        </div>
        <div className="stat-card success">
          <CheckIcon />
          <div className="stat-label">Số thí sinh đậu</div>
          <div className="stat-value">{statistics.passed}</div>
        </div>
        <div className="stat-card warning">
          <TrendingUpIcon />
          <div className="stat-label">Tỉ lệ đậu</div>
          <div className="stat-value">{statistics.passRate}%</div>
        </div>
        <div className="stat-card highlight">
          <TargetIcon />
          <div className="stat-label">Điểm chuẩn {selectedYear}</div>
          <div className="stat-value">{statistics.PASS_SCORE}</div>
        </div>
      </div>
    </section>
  );
};
