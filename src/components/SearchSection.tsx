import React from 'react';
import { SearchIcon, ResetIcon, ChevronDownIcon, ChevronUpIcon } from './Icons';
import type { FilterOptions } from '../types';

interface SearchSectionProps {
  input: string;
  setInput: (input: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  filters: FilterOptions;
  handleFilterChange: (field: keyof FilterOptions, value: any) => void;
  resetFilters: () => void;
  filteredCount: number;
  totalCount: number;
  setResult: (res: any) => void;
  setResultList: (list: any) => void;
  setNotFound: (nf: boolean) => void;
}

export const SearchSection: React.FC<SearchSectionProps> = ({
  input, setInput, showFilters, setShowFilters, filters,
  handleFilterChange, resetFilters, filteredCount, totalCount,
  setResult, setResultList, setNotFound
}) => {
  return (
    <section className="search-section" aria-labelledby="search-heading">
      <div className="search-main-container">
        <div className="search-header-text">
          <h2 id="search-heading" className="search-title">Tra cứu điểm thi</h2>
          <p className="search-subtitle">Nhập số báo danh hoặc họ và tên thí sinh để xem kết quả chi tiết</p>
        </div>

        <form className="search-form-modern" onSubmit={(e) => e.preventDefault()} autoComplete="off">
          <div className="search-input-wrapper">
            <div className="search-prefix-icon">
              <SearchIcon />
            </div>
            <input
              id="sbd"
              type="text"
              className="search-field"
              placeholder="Tìm kiếm số báo danh hoặc họ tên..."
              value={input}
              onChange={e => setInput(e.target.value)}
              autoFocus
            />
            {input && (
              <button 
                type="button" 
                className="search-clear-action"
                onClick={() => {
                  setInput('');
                  setResult(null);
                  setResultList(null);
                  setNotFound(false);
                }}
                title="Xóa tìm kiếm"
              >
                <ResetIcon />
                <span>Xóa</span>
              </button>
            )}
          </div>
          <div className="search-hint">
            <kbd>Enter</kbd> để tra cứu sau khi nhập
          </div>
        </form>
      </div>

      <div className="filters-section">
        <button 
          className="filter-toggle-btn"
          onClick={() => setShowFilters(!showFilters)}
          aria-expanded={showFilters}
          aria-controls="filters-content"
        >
          {showFilters ? <ChevronUpIcon /> : <ChevronDownIcon />}
          {showFilters ? 'Ẩn bộ lọc' : 'Hiển thị bộ lọc nâng cao'}
        </button>
        
        {showFilters && (
          <div id="filters-content" className="filters-content">
            <div className="filter-row">
              <div className="filter-group">
                <label htmlFor="min-score">Điểm tối thiểu:</label>
                <input
                  id="min-score"
                  type="number"
                  min="0"
                  max="100"
                  step="0.25"
                  value={filters.minScore || ''}
                  onChange={(e) => handleFilterChange('minScore', e.target.value ? parseFloat(e.target.value) : null)}
                  className="filter-input"
                />
              </div>
              
              <div className="filter-group">
                <label htmlFor="max-score">Điểm tối đa:</label>
                <input
                  id="max-score"
                  type="number"
                  min="0"
                  max="100"
                  step="0.25"
                  value={filters.maxScore || ''}
                  onChange={(e) => handleFilterChange('maxScore', e.target.value ? parseFloat(e.target.value) : null)}
                  className="filter-input"
                />
              </div>
            </div>
            
            <div className="filter-row">
              <div className="filter-group">
                <label htmlFor="sort-by">Sắp xếp theo:</label>
                <select
                  id="sort-by"
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value as any)}
                  className="filter-select"
                >
                  <option value="diem">Điểm</option>
                  <option value="soBaoDanh">Số báo danh</option>
                  <option value="hoVaTen">Họ và tên</option>
                  <option value="ngaySinh">Ngày sinh</option>
                </select>
              </div>
              
              <div className="filter-group">
                <label htmlFor="sort-order">Thứ tự:</label>
                <select
                  id="sort-order"
                  value={filters.sortOrder}
                  onChange={(e) => handleFilterChange('sortOrder', e.target.value as any)}
                  className="filter-select"
                >
                  <option value="desc">Giảm dần</option>
                  <option value="asc">Tăng dần</option>
                </select>
              </div>
            </div>
            
            <div className="filter-actions">
              <button className="reset-filters-btn" onClick={resetFilters}>
                <ResetIcon />
                Đặt lại bộ lọc
              </button>
              <span className="filter-results-count">
                Hiển thị {filteredCount} / {totalCount} thí sinh
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
