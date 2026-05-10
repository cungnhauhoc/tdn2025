import React from 'react';
import { BrandIcon, MoonIcon, SunIcon, SearchIcon, BookIcon } from './Icons';
import { EXAM_YEARS } from '../data/config';

interface HeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  currentView: 'search' | 'materials';
  setCurrentView: (view: 'search' | 'materials') => void;
  selectedYear: string;
  setSelectedYear: (year: any) => void;
  setInput: (input: string) => void;
  setResult: (res: any) => void;
  setResultList: (list: any) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  theme, toggleTheme, currentView, setCurrentView, 
  selectedYear, setSelectedYear, setInput, setResult, setResultList 
}) => {
  return (
    <header className="modern-header">
      <div className="modern-header-content">
        <div className="brand-header">
          <div className="brand-logo">
            <BrandIcon />
            <div className="brand-text">
              <span className="brand-name">Tra Cứu Điểm Thi</span>
              <span className="brand-tagline">Hệ thống phân tích điểm thi Trần Đại Nghĩa</span>
            </div>
          </div>

          <div className="header-actions">
            <button
              className="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label={theme === 'light' ? 'Chuyển sang chế độ tối' : 'Chuyển sang chế độ sáng'}
            >
              {theme === 'light' ? <MoonIcon /> : <SunIcon />}
            </button>
          </div>
        </div>

        <nav className="nav-container" role="navigation">
          <div className="nav-links">
            <button
              className={`nav-tab ${currentView === 'search' ? 'active' : ''}`}
              onClick={() => setCurrentView('search')}
            >
              <SearchIcon />
              <span>Tra cứu & Phân tích</span>
            </button>
            <button
              className={`nav-tab ${currentView === 'materials' ? 'active' : ''}`}
              onClick={() => setCurrentView('materials')}
            >
              <BookIcon />
              <span>Đề thi & Tài liệu</span>
            </button>
          </div>

          <div className="nav-year-selector">
            <span className="year-label">Năm thi:</span>
            <div className="year-chips">
              {EXAM_YEARS.map(y => (
                <button
                  key={y}
                  className={`year-chip ${selectedYear === y ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedYear(y);
                    setCurrentView('search');
                    setInput('');
                    setResult(null);
                    setResultList(null);
                  }}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};
