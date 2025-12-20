import { useState, useEffect, useMemo, useCallback } from 'react';
import './styles.css';
import { BarChart } from './BarChart';
import { PieChart } from './PieChart';

// SVG Icons
const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const NewIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const BookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
  </svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.3-4.3"/>
  </svg>
);

const SchoolIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 22v-4a2 2 0 1 0-4 0v4"/>
    <path d="m18 16 2.13-4.27A2 2 0 0 0 18.2 9.27l-4.44-4.44A2 2 0 0 0 11 4H9"/>
    <path d="m3.6 16 2.13-4.27A2 2 0 0 1 7.66 9.27L12.1 4.83a2 2 0 0 1 2.83 0"/>
    <path d="M6 16v-3a2 2 0 1 1 4 0v3"/>
  </svg>
);

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const BarChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="20" x2="12" y2="10"/>
    <line x1="18" y1="20" x2="18" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="16"/>
  </svg>
);

const AwardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="7"/>
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const TrendingUpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
    <polyline points="17 6 23 6 23 12"/>
  </svg>
);

const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

const ChevronUpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="18 15 12 9 6 15"/>
  </svg>
);

const ResetIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
    <path d="M21 3v5h-5"/>
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
    <path d="M3 21v-5h5"/>
  </svg>
);

const QuestionIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const BirthdayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
    <circle cx="12" cy="16" r="1"/>
    <circle cx="16" cy="16" r="1"/>
    <circle cx="8" cy="16" r="1"/>
  </svg>
);

const ListIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"/>
    <line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/>
    <line x1="3" y1="12" x2="3.01" y2="12"/>
    <line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);

const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);

const SuccessIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="m9 12 2 2 4-4"/>
  </svg>
);

const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 16v-4"/>
    <path d="M12 8h.01"/>
  </svg>
);

// New icons for candidate list
const IdCardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const ScoreIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 6v6l4 2"/>
  </svg>
);

// New icon for passing score
const TargetIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="6"/>
    <circle cx="12" cy="12" r="2"/>
  </svg>
);

// Up arrow icon for scroll to top
const UpArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="19" x2="12" y2="5"/>
    <polyline points="5 12 12 5 19 12"/>
  </svg>
);

type Candidate = {
  soBaoDanh: string;
  hoVaTen: string;
  diem: number;
  ngaySinh: string;
};

// Define the structure of data from data.json
type RawCandidateData = {
  "số báo danh": string;
  "họ và tên": string;
  "ngày sinh": string;
  "kết quả": string;
  "đậu/rớt": string;
  "chi tiết": string;
};

// Define chart types
type ChartType = 'bar' | 'pie';

// Define filter options
type FilterOptions = {
  minScore: number | null;
  maxScore: number | null;
  sortBy: 'soBaoDanh' | 'hoVaTen' | 'diem' | 'ngaySinh';
  sortOrder: 'asc' | 'desc';
};

// Function to get color based on score range (5-point intervals)
const getScoreColor = (score: number) => {
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

// Function to determine if a candidate passed or failed
const isPassingScore = (score: number, passScore: number) => score >= passScore;

// Statistics for 2024-2025 academic year
const PREVIOUS_YEAR_STATS = {
  total: 3932,
  avg: "48.49",
  max: 96.5,
  passed: 356,
  passRate: "9.05"
};

// Previous year cutoff score
const PREVIOUS_YEAR_CUTOFF = 67.5;

function App() {
  const [data, setData] = useState<Candidate[]>([]);
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
  const PASS_SCORE = 73.25; // Passing score constant

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Parse date string (dd/mm/yyyy) to Date object
  const parseDate = (dateStr: string): Date => {
    const [day, month, year] = dateStr.split('/');
    return new Date(Number(year), Number(month) - 1, Number(day));
  };

  // Memoize filtered and sorted data
  const filteredData = useMemo(() => {
    let result = [...data];
    
    // Apply score filters
    if (filters.minScore !== null) {
      result = result.filter(candidate => candidate.diem >= filters.minScore!);
    }
    
    if (filters.maxScore !== null) {
      result = result.filter(candidate => candidate.diem <= filters.maxScore!);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (filters.sortBy) {
        case 'soBaoDanh':
          comparison = a.soBaoDanh.localeCompare(b.soBaoDanh, 'en', { numeric: true });
          break;
        case 'hoVaTen':
          comparison = a.hoVaTen.localeCompare(b.hoVaTen, 'vi');
          break;
        case 'diem':
          comparison = a.diem - b.diem;
          break;
        case 'ngaySinh': {
          const dateA = parseDate(a.ngaySinh);
          const dateB = parseDate(b.ngaySinh);
          comparison = dateA.getTime() - dateB.getTime();
          break;
        }
      }
      
      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return result;
  }, [data, filters]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  // Memoize statistics calculations
  const statistics = useMemo(() => {
    const total: number = data.length;
    const avg: string = total > 0 ? (data.reduce((sum, c) => sum + c.diem, 0) / total).toFixed(2) : '0.00';
    const max: number = total > 0 ? Math.max(...data.map(c => c.diem)) : 0;
    const passed: number = data.filter(c => c.diem >= PASS_SCORE).length;
    const passRate: string = total > 0 ? ((passed / total) * 100).toFixed(2) : '0.00';
    
    return { total, avg, max, passed, passRate, PASS_SCORE };
  }, [data]);

  // Memoize chart data with 5-point intervals
  const chartData = useMemo(() => {
    const BIN_COUNT = 20; // 0-5, 5-10, ..., 95-100
    const bins = Array(BIN_COUNT).fill(0);
    const binsPassed = Array(BIN_COUNT).fill(0); // số thí sinh đậu trong mỗi bin
    const binsFailed = Array(BIN_COUNT).fill(0); // số thí sinh rớt trong mỗi bin
    
    data.forEach(c => {
      let idx = Math.floor(c.diem / 5); // Changed from 10 to 5 for 5-point intervals
      if (idx >= BIN_COUNT) idx = BIN_COUNT - 1;
      bins[idx]++;
      if (c.diem >= statistics.PASS_SCORE) binsPassed[idx]++;
      else binsFailed[idx]++;
    });
    
    // Always generate 20 labels regardless of data
    const binLabels = Array.from({ length: BIN_COUNT }, (_, i) => `${i*5}–${(i+1)*5}`);
    
    return { bins, binsPassed, binsFailed, binLabels };
  }, [data, statistics.PASS_SCORE]);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Handle scroll event for scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    fetch('/data.json')
      .then(res => res.json())
      .then(json => {
        if (Array.isArray(json)) {
          // Chuyển đổi dữ liệu từ định dạng mới sang Candidate[]
          const mapped = json.map((item: RawCandidateData) => ({
            soBaoDanh: item["số báo danh"] || '',
            hoVaTen: item["họ và tên"] || '',
            diem: typeof item["kết quả"] === 'string' ? Number(item["kết quả"].replace(/[^\d.,-]/g, '').replace(',', '.')) : 0,
            ngaySinh: item["ngày sinh"] || '',
          })).filter((c: Candidate) => c.soBaoDanh && c.hoVaTen);
          setData(mapped);
        }
      });
  }, []);

  // Hàm chuẩn hóa chuỗi: loại bỏ dấu, chuyển thường, loại bỏ khoảng trắng thừa
  const normalizeString = useCallback((str: string) => {
    return str
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLowerCase()
      .replace(/\s+/g, '')
      .trim();
  }, []);

  // Hàm chuẩn hóa số báo danh: chỉ lấy số, bỏ số 0 đầu
  const normalizeSBD = useCallback((s: string) => {
    return s.replace(/\D/g, '').replace(/^0+/, '').trim();
  }, []);

  // Real-time search function
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (input.trim() === '') {
        // Clear all results when input is empty
        setResult(null);
        setResultList(null);
        setNotFound(false);
        return;
      }

      setNotFound(false);
      setResult(null);
      setResultList(null);
      const inputRaw = input.trim();
      
      // Nếu nhập toàn số, ưu tiên tìm theo SBD
      if (/^\d+$/.test(inputRaw)) {
        const inputNorm = normalizeSBD(inputRaw);
        const found = data.find(c => normalizeSBD(c.soBaoDanh) === inputNorm);
        if (found) {
          setResult(found);
          return;
        }
      }
      
      // Nếu nhập chữ hoặc không tìm thấy theo SBD, tìm gần đúng theo tên
      const inputNormName = normalizeString(inputRaw);
      const foundList = data.filter(c => normalizeString(c.hoVaTen).includes(inputNormName));
      
      if (foundList.length === 1) {
        setResult(foundList[0]);
      } else if (foundList.length > 1) {
        setResultList(foundList);
      } else if (foundList.length === 0) {
        setNotFound(true);
      }
    }, 300); // Debounce delay of 300ms

    return () => clearTimeout(timeoutId);
  }, [input, data, normalizeSBD, normalizeString]);

  // Handle filter changes
  const handleFilterChange = (field: keyof FilterOptions, value: string | number | null) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      minScore: null,
      maxScore: null,
      sortBy: 'diem',
      sortOrder: 'desc'
    });
  };

  // Get a random congratulatory message for passed students
  const getRandomPassedMessage = () => {
    const messages = [
      "Chúc mừng em đã vượt qua kỳ thi! Hãy tiếp tục phát huy tinh thần học tập và đạt được nhiều thành tích hơn nữa trong tương lai!",
      "Thật tuyệt vời! Em đã chứng tỏ được khả năng của mình. Hy vọng em sẽ giữ vững phong độ và tiếp tục tỏa sáng!",
      "Xin chúc mừng! Thành công này là phần thưởng xứng đáng cho sự nỗ lực của em. Hãy luôn tin vào bản thân!",
      "Em đã làm rất tốt! Đây là bước ngoặt quan trọng trong hành trình học tập. Chúc em luôn vững vàng và tiến xa hơn nữa!",
      "Chúc mừng em đã chinh phục được thử thách này! Hãy biến thành công này thành động lực để vươn tới những đỉnh cao mới!",
      "Rất ấn tượng với kết quả của em! Hy vọng em sẽ tiếp tục giữ vững tinh thần cầu tiến và đạt được nhiều ước mơ!",
      "Thành công không phải là đích đến mà là hành trình. Chúc mừng em đã bắt đầu hành trình đó một cách xuất sắc!",
      "Em đã chứng minh được rằng sự chăm chỉ luôn được đền đáp. Xin chúc mừng và chúc em tiếp tục tỏa sáng!"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  // Get a random encouraging message for failed students
  const getRandomFailedMessage = () => {
    const messages = [
      "Đừng nản lòng vì thất bại này. Hãy coi đây là bài học quý giá để em hoàn thiện bản thân và tiến gần hơn tới mục tiêu!",
      "Thất bại chỉ là bước đệm để thành công. Hãy tiếp tục cố gắng, vì em hoàn toàn có tiềm năng để làm được điều đó!",
      "Một lần vấp ngã không có nghĩa là mãi mãi không đứng dậy. Hãy lấy lại tinh thần và tiếp tục con đường phía trước!",
      "Kết quả hôm nay không định nghĩa được tương lai của em. Hãy biến thất bại này thành động lực để tiến xa hơn!",
      "Mỗi thử thách đều mang đến bài học riêng. Hãy rút kinh nghiệm từ lần này và quay trở lại mạnh mẽ hơn!",
      "Thành công không phải lúc nào cũng đến ngay lập tức. Hãy kiên trì và tiếp tục nỗ lực, em sẽ đạt được điều mình mong muốn!",
      "Đừng để một lần thất bại làm em mất đi niềm tin. Hãy xem đây là cơ hội để em trưởng thành và tiến bộ hơn!",
      "Cuộc sống không tránh khỏi những thất bại, nhưng điều quan trọng là cách chúng ta vượt qua. Hãy tin vào bản thân và cố gắng thêm!"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  return (
    <div className="container">
      {/* Skip to main content link for keyboard navigation */}
      <a href="#main-content" className="skip-link">Bỏ qua tới nội dung chính</a>
      
      <header className="modern-header">
        <div className="modern-header-content">
          <h1 className="modern-header-title">
            <BookIcon />
            TRA CỨU ĐIỂM THI LỚP 6
            <SearchIcon />
          </h1>
          <p className="modern-header-subtitle">
            <SchoolIcon />
            Trường THCS - THPT Trần Đại Nghĩa - Năm học 2025 - 2026
            <CalendarIcon />
          </p>
          
          <nav className="nav-menu" role="navigation" aria-label="Main navigation">
            <a href="https://cungnhauhoc.net/" target="_blank" rel="noopener noreferrer" className="nav-link">
              <HomeIcon />
              Trang chủ
            </a>
            <a href="https://tdn2024.cungnhauhoc.net/" target="_blank" rel="noopener noreferrer" className="nav-link">
              <CalendarIcon />
              Tra cứu điểm năm 2024
            </a>
            <a href="https://tdn2025.cungnhauhoc.net/" target="_blank" rel="noopener noreferrer" className="nav-link active" aria-current="page">
              <NewIcon />
              Tra cứu điểm năm 2025
            </a>
            <button 
              className="nav-link" 
              onClick={toggleTheme}
              aria-label={theme === 'light' ? 'Chuyển sang chế độ tối' : 'Chuyển sang chế độ sáng'}
            >
              {theme === 'light' ? '🌙 Tối' : '☀️ Sáng'}
            </button>
          </nav>
        </div>
      </header>

      <main id="main-content">
        <section className="stats-section" aria-labelledby="stats-heading">
          <h2 id="stats-heading" className="sr-only">Thống kê điểm thi</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <UsersIcon />
              <div className="stat-label">Tổng số thí sinh</div>
              <div className="stat-value">{statistics.total}</div>
              <div className="stat-comparison">
                <span className="stat-comparison-label">Năm trước:</span>
                <span className="stat-comparison-value">{PREVIOUS_YEAR_STATS.total}</span>
              </div>
            </div>
            <div className="stat-card">
              <BarChartIcon />
              <div className="stat-label">Điểm trung bình</div>
              <div className="stat-value">{statistics.avg}</div>
              <div className="stat-comparison">
                <span className="stat-comparison-label">Năm trước:</span>
                <span className="stat-comparison-value">{PREVIOUS_YEAR_STATS.avg}</span>
              </div>
            </div>
            <div className="stat-card">
              <AwardIcon />
              <div className="stat-label">Điểm cao nhất</div>
              <div className="stat-value">{statistics.max}</div>
              <div className="stat-comparison">
                <span className="stat-comparison-label">Năm trước:</span>
                <span className="stat-comparison-value">{PREVIOUS_YEAR_STATS.max}</span>
              </div>
            </div>
            <div className="stat-card success">
              <CheckIcon />
              <div className="stat-label">Số thí sinh đậu</div>
              <div className="stat-value">{statistics.passed}</div>
              <div className="stat-comparison">
                <span className="stat-comparison-label">Năm trước:</span>
                <span className="stat-comparison-value">{PREVIOUS_YEAR_STATS.passed}</span>
              </div>
            </div>
            <div className="stat-card warning">
              <TrendingUpIcon />
              <div className="stat-label">Tỉ lệ đậu</div>
              <div className="stat-value">{statistics.passRate}%</div>
              <div className="stat-comparison">
                <span className="stat-comparison-label">Năm trước:</span>
                <span className="stat-comparison-value">{PREVIOUS_YEAR_STATS.passRate}%</span>
              </div>
            </div>
            {/* New stat card for passing score */}
            <div className="stat-card highlight">
              <TargetIcon />
              <div className="stat-label">Điểm chuẩn</div>
              <div className="stat-value">{PASS_SCORE}</div>
            </div>
            
            {/* Previous year cutoff score */}
            <div className="stat-card highlight">
              <TargetIcon />
              <div className="stat-label">Điểm chuẩn năm trước</div>
              <div className="stat-value">{PREVIOUS_YEAR_CUTOFF}</div>
            </div>
          </div>
        </section>

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
              <BarChart bins={chartData.bins} binLabels={chartData.binLabels} />
            ) : (
              <PieChart bins={chartData.bins} binLabels={chartData.binLabels} />
            )}
          </div>
        </section>

        <section className="search-section" aria-labelledby="search-heading">
          <div className="search-header">
            <h2 id="search-heading" className="search-title">
              <SearchIcon />
              Nhập số báo danh hoặc họ tên để tra cứu
            </h2>
          </div>
          <form className="search-form" onSubmit={(e) => e.preventDefault()} autoComplete="off">
            <label htmlFor="sbd" className="sr-only">Số báo danh hoặc họ tên</label>
            <input
              id="sbd"
              type="text"
              className="search-input"
              placeholder="Nhập số báo danh hoặc họ tên..."
              value={input}
              onChange={e => setInput(e.target.value)}
              autoFocus
              aria-describedby="search-help"
            />
            <button 
              type="button" 
              className="search-button"
              onClick={() => {
                setInput('');
                setResult(null);
                setResultList(null);
                setNotFound(false);
              }}
            >
              <ResetIcon />
              Xóa
            </button>
          </form>
          <div id="search-help" className="sr-only">Nhấn Enter để tra cứu sau khi nhập</div>

          {/* Advanced Filters */}
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
                      aria-describedby="min-score-help"
                    />
                    <div id="min-score-help" className="sr-only">Nhập điểm tối thiểu để lọc kết quả</div>
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
                      aria-describedby="max-score-help"
                    />
                    <div id="max-score-help" className="sr-only">Nhập điểm tối đa để lọc kết quả</div>
                  </div>
                </div>
                
                <div className="filter-row">
                  <div className="filter-group">
                    <label htmlFor="sort-by">Sắp xếp theo:</label>
                    <select
                      id="sort-by"
                      value={filters.sortBy}
                      onChange={(e) => handleFilterChange('sortBy', e.target.value as 'soBaoDanh' | 'hoVaTen' | 'diem' | 'ngaySinh')}
                      className="filter-select"
                      aria-describedby="sort-by-help"
                    >
                      <option value="diem">Điểm</option>
                      <option value="soBaoDanh">Số báo danh</option>
                      <option value="hoVaTen">Họ và tên</option>
                      <option value="ngaySinh">Ngày sinh</option>
                    </select>
                    <div id="sort-by-help" className="sr-only">Chọn tiêu chí sắp xếp kết quả</div>
                  </div>
                  
                  <div className="filter-group">
                    <label htmlFor="sort-order">Thứ tự:</label>
                    <select
                      id="sort-order"
                      value={filters.sortOrder}
                      onChange={(e) => handleFilterChange('sortOrder', e.target.value as 'asc' | 'desc')}
                      className="filter-select"
                      aria-describedby="sort-order-help"
                    >
                      <option value="desc">Giảm dần</option>
                      <option value="asc">Tăng dần</option>
                    </select>
                    <div id="sort-order-help" className="sr-only">Chọn thứ tự sắp xếp kết quả</div>
                  </div>
                </div>
                
                <div className="filter-actions">
                  <button 
                    className="reset-filters-btn"
                    onClick={resetFilters}
                    aria-describedby="reset-filters-help"
                  >
                    <ResetIcon />
                    Đặt lại bộ lọc
                  </button>
                  <div id="reset-filters-help" className="sr-only">Đặt lại tất cả các bộ lọc về mặc định</div>
                  <span className="filter-results-count">
                    Hiển thị {filteredData.length} / {data.length} thí sinh
                  </span>
                </div>
              </div>
            )}
          </div>

          {result && (
            <div 
              className={`result-card ${result.diem >= PASS_SCORE ? 'passed' : 'failed'}`}
              role="region" 
              aria-labelledby="result-status"
            >
              <div className="result-header">
                <span className="result-icon">
                  {result.diem >= PASS_SCORE ? <SuccessIcon /> : <InfoIcon />}
                </span>
                <div id="result-status" className="result-status">
                  {result.diem >= PASS_SCORE
                    ? <>
                        <b>Chúc mừng, bạn đã ĐẬU!</b><br/>
                        <span>{getRandomPassedMessage()}</span>
                      </>
                    : <>
                        <b>Rất tiếc, bạn chưa ĐẬU!</b><br/>
                        <span>{getRandomFailedMessage()}</span>
                      </>
                  }
                </div>
              </div>
              <div className="result-info">
                <div className="result-info-item">
                  <span className="result-info-label">Số báo danh</span>
                  <span className={`result-info-value ${isPassingScore(result.diem, PASS_SCORE) ? 'passed' : 'failed'}`} style={{ color: getScoreColor(result.diem) }}>
                    {result.soBaoDanh}
                  </span>
                </div>
                <div className="result-info-item">
                  <span className="result-info-label">Họ và tên</span>
                  <span className={`result-info-value ${isPassingScore(result.diem, PASS_SCORE) ? 'passed' : 'failed'}`} style={{ color: getScoreColor(result.diem) }}>
                    {result.hoVaTen}
                  </span>
                </div>
                <div className="result-info-item">
                  <span className="result-info-label">Điểm</span>
                  <span className={`result-info-value ${isPassingScore(result.diem, PASS_SCORE) ? 'passed' : 'failed'}`} style={{ color: getScoreColor(result.diem), fontWeight: 'bold' }}>
                    {result.diem}
                  </span>
                </div>
                <div className="result-info-item">
                  <span className="result-info-label">
                    <BirthdayIcon />
                    Ngày sinh
                  </span>
                  <span className={`result-info-value ${isPassingScore(result.diem, PASS_SCORE) ? 'passed' : 'failed'}`} style={{ color: getScoreColor(result.diem) }}>
                    {result.ngaySinh}
                  </span>
                </div>
              </div>
            </div>
          )}

          {resultList && (
            <div className="results-section" role="region" aria-labelledby="multiple-results-heading">
              <h3 id="multiple-results-heading" className="search-title">
                <UsersIcon />
                Có {resultList.length} thí sinh trùng tên:
              </h3>
              <table className="candidates-table">
                <thead>
                  <tr>
                    <th scope="col"><IdCardIcon /> Số báo danh</th>
                    <th scope="col"><UserIcon /> Họ và tên</th>
                    <th scope="col"><ScoreIcon /> Điểm</th>
                    <th scope="col">
                      <BirthdayIcon />
                      Ngày sinh
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {resultList.map((c, idx) => (
                    <tr 
                      key={`${c.soBaoDanh}-${idx}`} 
                      className={isPassingScore(c.diem, PASS_SCORE) ? 'passed-row' : 'failed-row'}
                    >
                      <td className={isPassingScore(c.diem, PASS_SCORE) ? 'passed' : 'failed'} style={{ color: getScoreColor(c.diem) }}>
                        {c.soBaoDanh}
                      </td>
                      <td className={isPassingScore(c.diem, PASS_SCORE) ? 'passed' : 'failed'} style={{ color: getScoreColor(c.diem) }}>
                        {c.hoVaTen}
                      </td>
                      <td className={isPassingScore(c.diem, PASS_SCORE) ? 'passed' : 'failed'} style={{ color: getScoreColor(c.diem), fontWeight: 'bold' }}>
                        {c.diem}
                      </td>
                      <td className={isPassingScore(c.diem, PASS_SCORE) ? 'passed' : 'failed'} style={{ color: getScoreColor(c.diem) }}>
                        {c.ngaySinh}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {notFound && (
            <div 
              className="result-card" 
              style={{textAlign: 'center'}}
              role="alert"
              aria-live="polite"
            >
              <span className="result-icon">
                <QuestionIcon />
              </span>
              <div className="result-status">Không tìm thấy thí sinh phù hợp.</div>
            </div>
          )}

          {!result && !resultList && !notFound && filteredData.length > 0 && (
            <div className="results-section" role="region" aria-labelledby="candidates-list-heading">
              <h3 id="candidates-list-heading" className="search-title">
                <ListIcon />
                Danh sách thí sinh
              </h3>
              <table className="candidates-table">
                <thead>
                  <tr>
                    <th scope="col"><IdCardIcon /> Số báo danh</th>
                    <th scope="col"><UserIcon /> Họ và tên</th>
                    <th scope="col"><ScoreIcon /> Điểm</th>
                    <th scope="col">
                      <BirthdayIcon />
                      Ngày sinh
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.slice((page-1)*pageSize, page*pageSize).map((c, idx) => (
                    <tr 
                      key={`${c.soBaoDanh}-${idx}`} 
                      className={isPassingScore(c.diem, PASS_SCORE) ? 'passed-row' : 'failed-row'}
                    >
                      <td className={isPassingScore(c.diem, PASS_SCORE) ? 'passed' : 'failed'} style={{ color: getScoreColor(c.diem) }}>
                        {c.soBaoDanh}
                      </td>
                      <td className={isPassingScore(c.diem, PASS_SCORE) ? 'passed' : 'failed'} style={{ color: getScoreColor(c.diem) }}>
                        {c.hoVaTen}
                      </td>
                      <td className={isPassingScore(c.diem, PASS_SCORE) ? 'passed' : 'failed'} style={{ color: getScoreColor(c.diem), fontWeight: 'bold' }}>
                        {c.diem}
                      </td>
                      <td className={isPassingScore(c.diem, PASS_SCORE) ? 'passed' : 'failed'} style={{ color: getScoreColor(c.diem) }}>
                        {c.ngaySinh}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Pagination between candidate list and score distribution chart */}
              <div className="pagination" role="navigation" aria-label="Pagination Navigation">
                <button 
                  className="pagination-button"
                  onClick={() => setPage(p => Math.max(1, p-1))}
                  disabled={page === 1}
                  aria-disabled={page === 1}
                >
                  <ArrowLeftIcon />
                  Trước
                </button>
                <span>Trang {page} / {totalPages}</span>
                <button 
                  className="pagination-button"
                  onClick={() => setPage(p => Math.min(totalPages, p+1))}
                  disabled={page === totalPages}
                  aria-disabled={page === totalPages}
                >
                  Sau
                  <ArrowRightIcon />
                </button>
              </div>
              
              {/* Score distribution chart below the candidate list */}
              <div className="candidate-list-chart-section">
                <h3 className="chart-title">Phổ điểm thí sinh trong danh sách hiện tại</h3>
                <div className="chart-container">
                  <BarChart bins={chartData.bins} binLabels={chartData.binLabels} />
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      <footer className="footer">
        <div>© {new Date().getFullYear()} Tra cứu điểm thi lớp 6 Trường Trần Đại Nghĩa</div>
        <div className="footer-links">
          <a href="https://cungnhauhoc.net" target="_blank" rel="noopener noreferrer" className="footer-link">
            Nguồn: cungnhauhoc.net
          </a>
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); toggleTheme(); }} 
            className="footer-link"
            aria-label={theme === 'light' ? 'Chuyển sang chế độ tối' : 'Chuyển sang chế độ sáng'}
          >
            {theme === 'light' ? 'Chế độ tối' : 'Chế độ sáng'}
          </a>
        </div>
      </footer>
      
      {/* Scroll to top button */}
      {showScrollTop && (
        <button 
          className="scroll-to-top"
          onClick={scrollToTop}
          aria-label="Lên đầu trang"
        >
          <UpArrowIcon />
        </button>
      )}
    </div>
  );
}

export default App;