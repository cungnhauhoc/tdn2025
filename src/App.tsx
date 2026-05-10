import { useState, useEffect, useMemo } from 'react';
import './styles.css';
import { YEAR_CONFIG, parse2024Data, type Year } from './data/config';
import { EXAM_MATERIALS } from './data/materials';
import { Helmet } from 'react-helmet-async';

// New Imports
import { SearchIcon, BookIcon, QuestionIcon, ListIcon, UpArrowIcon } from './components/Icons';
import type { Candidate, RawCandidateData, ChartType, FilterOptions } from './types';
import { parseDate, normalizeString, normalizeSBD } from './utils';
import { ExamLibrary } from './components/ExamLibrary';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { StatsSection } from './components/StatsSection';
import { ChartSection } from './components/ChartSection';
import { SearchSection } from './components/SearchSection';
import { CandidateTable } from './components/CandidateTable';
import { ResultCard } from './components/ResultCard';

function App() {
  const [data, setData] = useState<Candidate[]>([]);
  const [selectedYear, setSelectedYear] = useState<Year>('2025');
  const [currentView, setCurrentView] = useState<'search' | 'materials'>('search');
  const [input, setInput] = useState('');
  const [result, setResult] = useState<Candidate | null>(null);
  const [resultList, setResultList] = useState<Candidate[] | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [page, setPage] = useState(1);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    minScore: null,
    maxScore: null,
    sortBy: 'diem',
    sortOrder: 'desc'
  });
  const [showScrollTop, setShowScrollTop] = useState(false);
  const pageSize = 100;

  // Router logic
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/tai-lieu/')) {
        const materialId = hash.replace('#/tai-lieu/', '');
        const material = EXAM_MATERIALS.find(m => m.id === materialId);
        if (material) {
          setCurrentView('materials');
          window.dispatchEvent(new CustomEvent('select-material', { detail: material }));
        }
      } else if (hash === '#/tra-cuu' || hash === '') {
        setCurrentView('search');
      } else if (hash === '#/tai-lieu') {
        setCurrentView('materials');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (currentView === 'search') {
      window.history.replaceState(null, '', '#/tra-cuu');
    } else if (currentView === 'materials' && !window.location.hash.startsWith('#/tai-lieu/')) {
      window.history.replaceState(null, '', '#/tai-lieu');
    }
  }, [currentView]);

  const PASS_SCORE = YEAR_CONFIG[selectedYear].passScore;
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const filteredData = useMemo(() => {
    let res = [...data];
    if (filters.minScore !== null) res = res.filter(c => c.diem >= filters.minScore!);
    if (filters.maxScore !== null) res = res.filter(c => c.diem <= filters.maxScore!);
    
    res.sort((a, b) => {
      let comp = 0;
      switch (filters.sortBy) {
        case 'soBaoDanh': comp = a.soBaoDanh.localeCompare(b.soBaoDanh, 'en', { numeric: true }); break;
        case 'hoVaTen': comp = a.hoVaTen.localeCompare(b.hoVaTen, 'vi'); break;
        case 'diem': comp = a.diem - b.diem; break;
        case 'ngaySinh': comp = parseDate(a.ngaySinh).getTime() - parseDate(b.ngaySinh).getTime(); break;
      }
      return filters.sortOrder === 'asc' ? comp : -comp;
    });
    return res;
  }, [data, filters]);

  const statistics = useMemo(() => {
    const total = data.length;
    const avg = total > 0 ? (data.reduce((sum, c) => sum + c.diem, 0) / total).toFixed(2) : '0.00';
    const max = total > 0 ? Math.max(...data.map(c => c.diem)) : 0;
    const passed = data.filter(c => c.diem >= PASS_SCORE).length;
    const passRate = total > 0 ? ((passed / total) * 100).toFixed(2) : '0.00';
    return { total, avg, max, passed, passRate, PASS_SCORE };
  }, [data, PASS_SCORE]);

  const chartData = useMemo(() => {
    const bins = Array(20).fill(0);
    data.forEach(c => {
      let idx = Math.floor(c.diem / 5);
      if (idx >= 20) idx = 19;
      bins[idx]++;
    });
    return { bins, binLabels: Array.from({ length: 20 }, (_, i) => `${i*5}–${(i+1)*5}`) };
  }, [data]);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as any;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
    fetch(YEAR_CONFIG[selectedYear].dataFile)
      .then(res => res.json())
      .then(json => {
        if (selectedYear === '2024') {
          setData(parse2024Data(json.content));
        } else if (Array.isArray(json)) {
          setData(json.map((item: RawCandidateData) => ({
            soBaoDanh: item["số báo danh"] || '',
            hoVaTen: item["họ và tên"] || '',
            diem: typeof item["kết quả"] === 'string' ? Number(item["kết quả"].replace(/[^\d.,-]/g, '').replace(',', '.')) : 0,
            ngaySinh: item["ngày sinh"] || '',
          })).filter(c => c.soBaoDanh && c.hoVaTen));
        }
      });
  }, [selectedYear]);

  useEffect(() => {
    const tid = setTimeout(() => {
      if (!input.trim()) {
        setResult(null); setResultList(null); setNotFound(false);
        return;
      }
      setNotFound(false); setResult(null); setResultList(null);
      const raw = input.trim();
      if (/^\d+$/.test(raw)) {
        const found = data.find(c => normalizeSBD(c.soBaoDanh) === normalizeSBD(raw));
        if (found) { setResult(found); return; }
      }
      const norm = normalizeString(raw);
      const list = data.filter(c => normalizeString(c.hoVaTen).includes(norm));
      if (list.length === 1) setResult(list[0]);
      else if (list.length > 1) setResultList(list);
      else setNotFound(true);
    }, 300);
    return () => clearTimeout(tid);
  }, [input, data]);

  return (
    <div className="container">
      <Helmet>
        <title>{currentView === 'search' ? `Tra Cứu Điểm Thi - Năm học ${YEAR_CONFIG[selectedYear].label}` : 'Đề Thi & Tài liệu'}</title>
      </Helmet>
      
      <Header 
        theme={theme} toggleTheme={toggleTheme} currentView={currentView} setCurrentView={setCurrentView}
        selectedYear={selectedYear} setSelectedYear={setSelectedYear} setInput={setInput} setResult={setResult} setResultList={setResultList}
      />

      <main id="main-content">
        {currentView === 'search' ? (
          <>
            <StatsSection statistics={statistics} selectedYear={selectedYear} />
            <ChartSection chartType={chartType} setChartType={setChartType} bins={chartData.bins} binLabels={chartData.binLabels} />
            
            <SearchSection 
              input={input} setInput={setInput} showFilters={showFilters} setShowFilters={setShowFilters}
              filters={filters} handleFilterChange={(f, v) => setFilters(p => ({ ...p, [f]: v }))}
              resetFilters={() => setFilters({ minScore: null, maxScore: null, sortBy: 'diem', sortOrder: 'desc' })}
              filteredCount={filteredData.length} totalCount={data.length}
              setResult={setResult} setResultList={setResultList} setNotFound={setNotFound}
            />

            {result && <ResultCard result={result} PASS_SCORE={PASS_SCORE} selectedYear={selectedYear} setCurrentView={setCurrentView} />}

            {resultList && (
              <div className="results-section">
                <h3 className="search-title">Có {resultList.length} thí sinh trùng tên:</h3>
                <CandidateTable candidates={resultList} PASS_SCORE={PASS_SCORE} page={1} totalPages={1} setPage={() => {}} />
              </div>
            )}

            {notFound && <div className="result-card" style={{textAlign: 'center'}}><span className="result-icon"><QuestionIcon /></span><div className="result-status">Không tìm thấy thí sinh phù hợp.</div></div>}

            {!result && !resultList && !notFound && filteredData.length > 0 && (
              <div className="results-section">
                <h3 className="search-title"><ListIcon /> Danh sách thí sinh ({selectedYear})</h3>
                <CandidateTable 
                  candidates={filteredData.slice((page-1)*pageSize, page*pageSize)} 
                  PASS_SCORE={PASS_SCORE} page={page} totalPages={Math.ceil(filteredData.length / pageSize)} setPage={setPage} 
                />
              </div>
            )}
          </>
        ) : (
          <ExamLibrary />
        )}
      </main>

      <Footer />
      
      {showScrollTop && (
        <button className="scroll-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Lên đầu trang">
          <UpArrowIcon />
        </button>
      )}

      <nav className="bottom-nav">
        <button className={`bottom-nav-item ${currentView === 'search' ? 'active' : ''}`} onClick={() => setCurrentView('search')}><SearchIcon /><span>Tra cứu</span></button>
        <button className={`bottom-nav-item ${currentView === 'materials' ? 'active' : ''}`} onClick={() => setCurrentView('materials')}><BookIcon /><span>Đề thi & Tài liệu</span></button>
      </nav>
    </div>
  );
}

export default App;
