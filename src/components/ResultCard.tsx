import React from 'react';
import type { Candidate } from '../types';
import { SuccessIcon, InfoIcon, SchoolIcon, BookIcon } from './Icons';
import { getScoreColor, getRandomPassedMessage, getRandomFailedMessage } from '../utils';
import { YEAR_CONFIG, type Year } from '../data/config';
import { EXAM_MATERIALS } from '../data/materials';

interface ResultCardProps {
  result: Candidate;
  PASS_SCORE: number;
  selectedYear: string;
  setCurrentView: (view: 'search' | 'materials') => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ 
  result, PASS_SCORE, selectedYear, setCurrentView 
}) => {
  const isPassed = result.diem >= PASS_SCORE;
  const yearLabel = YEAR_CONFIG[selectedYear as Year]?.label || selectedYear;
  
  return (
    <div className={`result-card-premium ${isPassed ? 'passed' : 'failed'}`}>
      <div className="result-card-inner">
        <div className="result-status-section">
          <div className="result-badge-icon">
            {isPassed ? <SuccessIcon /> : <InfoIcon />}
          </div>
          <div className="result-status-text">
            <h3 className="result-headline">
              {isPassed ? 'Chúc mừng, bạn đã ĐẬU!' : 'Rất tiếc, bạn chưa ĐẬU!'}
            </h3>
            <p className="result-subline">
              {isPassed ? getRandomPassedMessage() : getRandomFailedMessage()}
            </p>
          </div>
        </div>

        <div className="result-details-grid">
          <div className="detail-item">
            <span className="detail-label">Số báo danh</span>
            <span className="detail-value highlight">{result.soBaoDanh}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Họ và tên</span>
            <span className="detail-value name">{result.hoVaTen}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Ngày sinh</span>
            <span className="detail-value">{result.ngaySinh}</span>
          </div>
          <div className="detail-item score-focus">
            <span className="detail-label">Điểm khảo sát</span>
            <div className="score-display">
              <span className="score-number" style={{ color: getScoreColor(result.diem) }}>{result.diem}</span>
              <span className="score-total">/ 100</span>
            </div>
          </div>
        </div>

        <div className="result-card-footer">
          <div className="exam-info-tag">
            <SchoolIcon />
            <span>Kỳ thi khảo sát lớp 6 - Năm học {yearLabel}</span>
          </div>
          <div className="pass-score-tag">
            <span>Điểm chuẩn: <b>{PASS_SCORE}</b></span>
          </div>
        </div>
      </div>
      
      <div className="related-materials-premium">
        <h4 className="related-title">Tài liệu ôn luyện gợi ý cho năm {selectedYear}:</h4>
        <div className="materials-chips">
          {EXAM_MATERIALS.filter(m => m.year === selectedYear).map(m => (
            <button key={m.id} className="material-chip-btn" onClick={() => setCurrentView('materials')}>
              <BookIcon />
              {m.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
