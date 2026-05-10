import React from 'react';
import type { Candidate } from '../types';
import { getScoreColor } from '../utils';
import { ArrowLeftIcon, ArrowRightIcon } from './Icons';

interface CandidateTableProps {
  candidates: Candidate[];
  PASS_SCORE: number;
  page: number;
  totalPages: number;
  setPage: (updater: (p: number) => number) => void;
}

export const CandidateTable: React.FC<CandidateTableProps> = ({ 
  candidates, PASS_SCORE, page, totalPages, setPage 
}) => {
  return (
    <div className="results-section">
      <div className="table-responsive">
        <table className="candidates-table">
          <thead>
            <tr>
              <th>Số báo danh</th>
              <th>Họ và tên</th>
              <th>Điểm</th>
              <th>Ngày sinh</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((c, idx) => (
              <tr key={`${c.soBaoDanh}-${idx}`} className={c.diem >= PASS_SCORE ? 'passed-row' : 'failed-row'}>
                <td data-label="Số báo danh" style={{ color: getScoreColor(c.diem) }}>
                  <span className="td-value">{c.soBaoDanh}</span>
                </td>
                <td data-label="Họ và tên" style={{ color: getScoreColor(c.diem) }}>
                  <span className="td-value">{c.hoVaTen}</span>
                </td>
                <td data-label="Điểm" style={{ color: getScoreColor(c.diem), fontWeight: 'bold' }}>
                  <span className="td-value">{c.diem}</span>
                </td>
                <td data-label="Ngày sinh" style={{ color: getScoreColor(c.diem) }}>
                  <span className="td-value">{c.ngaySinh}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="pagination">
        <button 
          className="pagination-button"
          onClick={() => setPage(p => Math.max(1, p-1))} 
          disabled={page === 1}
          title="Trang trước"
        >
          <ArrowLeftIcon /> Trước
        </button>
        <div className="pagination-info">
          <span className="current-page">{page}</span>
          <span className="page-separator">/</span>
          <span className="total-pages">{totalPages}</span>
        </div>
        <button 
          className="pagination-button"
          onClick={() => setPage(p => Math.min(totalPages, p+1))} 
          disabled={page === totalPages}
          title="Trang sau"
        >
          Sau <ArrowRightIcon />
        </button>
      </div>
    </div>
  );
};
