import { useState, useEffect, useMemo, useCallback } from 'react';
import './styles.css';
import { BarChart } from './BarChart';
import { PieChart } from './PieChart';
import { EXAM_YEARS, YEAR_CONFIG, parse2024Data, type Year } from './data/config';
import { EXAM_MATERIALS, type ExamMaterial } from './data/materials';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Helmet } from 'react-helmet-async';

// Vite glob import for MDX files
const mdxModules = import.meta.glob('./exam-content/**/*.mdx', { query: '?raw', import: 'default' });

// SVG Icons
const BrandIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
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

  // Simple Hash-based Router
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/tai-lieu/')) {
        const materialId = hash.replace('#/tai-lieu/', '');
        const material = EXAM_MATERIALS.find(m => m.id === materialId);
        if (material) {
          setCurrentView('materials');
          // We need a way to trigger the selection in the ExamLibrary component
          // or move the selection logic up to App.tsx
          window.dispatchEvent(new CustomEvent('select-material', { detail: material }));
        }
      } else if (hash === '#/tra-cuu' || hash === '') {
        setCurrentView('search');
      } else if (hash === '#/tai-lieu') {
        setCurrentView('materials');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial check

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Sync state changes back to hash
  useEffect(() => {
    if (currentView === 'search') {
      window.history.replaceState(null, '', '#/tra-cuu');
    } else if (currentView === 'materials') {
      // Material ID will be handled by the click handler
      if (!window.location.hash.startsWith('#/tai-lieu/')) {
        window.history.replaceState(null, '', '#/tai-lieu');
      }
    }
  }, [currentView]);

  const PASS_SCORE = YEAR_CONFIG[selectedYear].passScore;
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
  }, [data, PASS_SCORE]);

  // Memoize chart data with 5-point intervals
  const chartData = useMemo(() => {
    const BIN_COUNT = 20; // 0-5, 5-10, ..., 95-100
    const bins = Array(BIN_COUNT).fill(0);
    const binsPassed = Array(BIN_COUNT).fill(0); // số thí sinh đậu trong mỗi bin
    const binsFailed = Array(BIN_COUNT).fill(0); // số thí sinh rớt trong mỗi bin
    
    data.forEach(c => {
      let idx = Math.floor(c.diem / 5);
      if (idx >= BIN_COUNT) idx = BIN_COUNT - 1;
      bins[idx]++;
      if (c.diem >= statistics.PASS_SCORE) binsPassed[idx]++;
      else binsFailed[idx]++;
    });
    
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

    const config = YEAR_CONFIG[selectedYear];
    fetch(config.dataFile)
      .then(res => res.json())
      .then(json => {
        if (selectedYear === '2024') {
          const parsed = parse2024Data(json.content);
          setData(parsed);
        } else if (Array.isArray(json)) {
          const mapped = json.map((item: RawCandidateData) => ({
            soBaoDanh: item["số báo danh"] || '',
            hoVaTen: item["họ và tên"] || '',
            diem: typeof item["kết quả"] === 'string' ? Number(item["kết quả"].replace(/[^\d.,-]/g, '').replace(',', '.')) : 0,
            ngaySinh: item["ngày sinh"] || '',
          })).filter((c: Candidate) => c.soBaoDanh && c.hoVaTen);
          setData(mapped);
        }
      });
  }, [selectedYear]);

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
        setResult(null);
        setResultList(null);
        setNotFound(false);
        return;
      }

      setNotFound(false);
      setResult(null);
      setResultList(null);
      const inputRaw = input.trim();
      
      if (/^\d+$/.test(inputRaw)) {
        const inputNorm = normalizeSBD(inputRaw);
        const found = data.find(c => normalizeSBD(c.soBaoDanh) === inputNorm);
        if (found) {
          setResult(found);
          return;
        }
      }
      
      const inputNormName = normalizeString(inputRaw);
      const foundList = data.filter(c => normalizeString(c.hoVaTen).includes(inputNormName));
      
      if (foundList.length === 1) {
        setResult(foundList[0]);
      } else if (foundList.length > 1) {
        setResultList(foundList);
      } else if (foundList.length === 0) {
        setNotFound(true);
      }
    }, 300);

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
      "Em đã chứng minh được rằng sự chăm chỉ luôn được đền đáp. Xin chúc mừng và chúc em tiếp tục tỏa sáng!",
      "Chúc mừng tân học sinh lớp 6 Trần Đại Nghĩa! Một trang mới đầy hứa hẹn đang chờ đón em.",
      "Thành quả ngọt ngào từ những ngày ôn luyện miệt mài. Chúc mừng em và gia đình!",
      "Em đã làm được điều kỳ diệu! Hãy tự hào về bản thân và sẵn sàng cho những thử thách mới nhé.",
      "Một kết quả xứng đáng cho tài năng và sự kiên trì của em. Tiếp tục vươn xa em nhé!",
      "Chúc mừng em đã ghi tên mình vào danh sách trúng tuyển. Đây là khởi đầu của những thành công rực rỡ sau này.",
      "Thật tự hào khi thấy em đạt được kết quả này. Chúc mừng em đã thực hiện được mục tiêu của mình!",
      "Bravo! Một kết quả thật ấn tượng. Chúc em có những năm tháng học trò thật đẹp tại ngôi trường mới.",
      "Tin vui này chắc chắn sẽ làm cả gia đình tự hào. Chúc mừng em đã vượt qua kỳ khảo sát đầy cam go!"
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
      "Cuộc sống không tránh khỏi những thất bại, nhưng điều quan trọng là cách chúng ta vượt qua. Hãy tin vào bản thân và cố gắng thêm!",
      "Cố gắng lên em nhé! Chỉ thiếu một chút may mắn thôi, hãy giữ vững ngọn lửa đam mê học tập.",
      "Kỳ thi này chỉ là một thử thách nhỏ trên con đường dài. Đừng để nó làm nản chí, tương lai vẫn đang rộng mở đón em.",
      "Học tài thi phận, đôi khi kết quả không phản ánh hết năng lực của mình. Hãy vững tin và tiếp tục rèn luyện em nhé.",
      "Bố mẹ và thầy cô vẫn luôn tự hào về sự nỗ lực của em. Nghỉ ngơi một chút rồi lại bắt đầu hành trình mới thôi nào!",
      "Mọi nỗ lực đều được ghi nhận, dù kết quả hôm nay chưa như ý. Hãy mạnh mẽ bước tiếp, thành công sẽ đến với người kiên trì.",
      "Cánh cửa này khép lại sẽ có cánh cửa khác mở ra. Hãy giữ tinh thần lạc quan và sẵn sàng cho những cơ hội mới.",
      "Thất bại là mẹ thành công. Đừng buồn lâu em nhé, hãy phân tích lỗi sai và hoàn thiện mình hơn cho lần tới.",
      "Em đã nỗ lực hết mình và đó mới là điều quan trọng nhất. Hãy tự hào vì mình đã dám đương đầu với thử thách!"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  return (
    <div className="container">
      <Helmet>
        <title>
          {currentView === 'search' 
            ? `Tra Cứu Điểm Thi Lớp 6 Trần Đại Nghĩa - Năm học ${YEAR_CONFIG[selectedYear].label}` 
            : 'Đề Thi & Tài liệu Tham Khảo Lớp 6 Trần Đại Nghĩa'}
        </title>
        <meta name="description" content={
          currentView === 'search'
            ? `Hệ thống tra cứu điểm thi khảo sát lớp 6 trường Trần Đại Nghĩa năm học ${YEAR_CONFIG[selectedYear].label}. Phân tích phổ điểm và thống kê chi tiết.`
            : 'Tổng hợp đề thi chính thức, đề thi thử và tài liệu ôn luyện hữu ích dành cho học sinh chuẩn bị kỳ thi khảo sát vào lớp 6 Trần Đại Nghĩa.'
        } />
      </Helmet>
      <a href="#main-content" className="skip-link">Bỏ qua tới nội dung chính</a>
      
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
                {theme === 'light' ? '🌙' : '☀️'}
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
      <main id="main-content">
        {currentView === 'search' ? (
          <>
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
                  <div className="stat-value">{PASS_SCORE}</div>
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
                          onChange={(e) => handleFilterChange('sortBy', e.target.value as 'soBaoDanh' | 'hoVaTen' | 'diem' | 'ngaySinh')}
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
                          onChange={(e) => handleFilterChange('sortOrder', e.target.value as 'asc' | 'desc')}
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
                        Hiển thị {filteredData.length} / {data.length} thí sinh
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {result && (
                <div className={`result-card-premium ${result.diem >= PASS_SCORE ? 'passed' : 'failed'}`}>
                  <div className="result-card-inner">
                    <div className="result-status-section">
                      <div className="result-badge-icon">
                        {result.diem >= PASS_SCORE ? <SuccessIcon /> : <InfoIcon />}
                      </div>
                      <div className="result-status-text">
                        <h3 className="result-headline">
                          {result.diem >= PASS_SCORE ? 'Chúc mừng, bạn đã ĐẬU!' : 'Rất tiếc, bạn chưa ĐẬU!'}
                        </h3>
                        <p className="result-subline">
                          {result.diem >= PASS_SCORE ? getRandomPassedMessage() : getRandomFailedMessage()}
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
                        <span>Kỳ thi khảo sát lớp 6 - Năm học {YEAR_CONFIG[selectedYear].label}</span>
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
              )}

              {resultList && (
                <div className="results-section">
                  <h3 className="search-title">Có {resultList.length} thí sinh trùng tên:</h3>
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
                        {resultList.map((c, idx) => (
                          <tr key={`${c.soBaoDanh}-${idx}`} className={c.diem >= PASS_SCORE ? 'passed-row' : 'failed-row'}>
                            <td style={{ color: getScoreColor(c.diem) }}>{c.soBaoDanh}</td>
                            <td style={{ color: getScoreColor(c.diem) }}>{c.hoVaTen}</td>
                            <td style={{ color: getScoreColor(c.diem), fontWeight: 'bold' }}>{c.diem}</td>
                            <td style={{ color: getScoreColor(c.diem) }}>{c.ngaySinh}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {notFound && (
                <div className="result-card" style={{textAlign: 'center'}}>
                  <span className="result-icon"><QuestionIcon /></span>
                  <div className="result-status">Không tìm thấy thí sinh phù hợp.</div>
                </div>
              )}

              {!result && !resultList && !notFound && filteredData.length > 0 && (
                <div className="results-section">
                  <h3 className="search-title"><ListIcon /> Danh sách thí sinh ({selectedYear})</h3>
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
                        {filteredData.slice((page-1)*pageSize, page*pageSize).map((c, idx) => (
                          <tr key={`${c.soBaoDanh}-${idx}`} className={c.diem >= PASS_SCORE ? 'passed-row' : 'failed-row'}>
                            <td style={{ color: getScoreColor(c.diem) }}>{c.soBaoDanh}</td>
                            <td style={{ color: getScoreColor(c.diem) }}>{c.hoVaTen}</td>
                            <td style={{ color: getScoreColor(c.diem), fontWeight: 'bold' }}>{c.diem}</td>
                            <td style={{ color: getScoreColor(c.diem) }}>{c.ngaySinh}</td>
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
              )}
            </section>
          </>
        ) : (
          <ExamLibrary />
        )}
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand-info">
            <BrandIcon />
            <div className="footer-brand-text">
              <span className="footer-name">Tra Cứu Điểm Thi</span>
              <span className="footer-desc">Nền tảng tra cứu và phân tích dữ liệu tuyển sinh lớp 6</span>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-copyright">
              © {new Date().getFullYear()} Cùng Nhau Học. Tất cả quyền được bảo lưu.
            </div>
            <div className="footer-nav">
              <a href="https://cungnhauhoc.net" target="_blank" rel="noopener noreferrer" className="footer-link">Trang chủ</a>
              <a href="#" className="footer-link">Liên hệ</a>
              <a href="#" className="footer-link">Chính sách</a>
            </div>
          </div>
        </div>
      </footer>
      
      {showScrollTop && (
        <button className="scroll-to-top" onClick={scrollToTop} aria-label="Lên đầu trang">
          <UpArrowIcon />
        </button>
      )}
    </div>
  );
}

// Simple Exam Library Component
function ExamLibrary() {
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [previewPdf, setPreviewPdf] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSelect = async (m: ExamMaterial) => {
    setSelectedMaterial(m.id);
    setIsLoading(true);
    // Update URL hash for SEO and deep-linking
    window.history.pushState(null, '', `#/tai-lieu/${m.id}`);
    
    try {
      const modulePath = `./exam-content/${m.path}`;
      const loadFile = mdxModules[modulePath];
      
      if (loadFile) {
        const rawContent = await loadFile() as string;
        // Strip frontmatter
        let cleanContent = rawContent.replace(/^---[\s\S]*?---/, '').trim();
        
        // Transform React-style style={{...}} to standard HTML style="..."
        cleanContent = cleanContent.replace(/style=\{\{\s*([\s\S]*?)\s*\}\}/g, (_match, p1) => {
          const styleEntries = p1.match(/([a-zA-Z]+)\s*:\s*("[^"]*"|'[^']*'|[^,}]+)/g);
          if (!styleEntries) return '';

          let boxType = 'default';
          const htmlStyles = styleEntries.map((entry: string) => {
            const [prop, val] = entry.split(':').map((s: string) => s.trim());
            const cleanVal = val.replace(/^["']|["']$/g, '');
            
            if (prop === 'background' || prop === 'backgroundColor') {
              if (cleanVal.includes('blue') || cleanVal.includes('#2196f3')) boxType = 'info';
              if (cleanVal.includes('green') || cleanVal.includes('#4caf50')) boxType = 'success';
              if (cleanVal.includes('orange') || cleanVal.includes('#ff9800')) boxType = 'warning';
              if (cleanVal.includes('purple') || cleanVal.includes('#9c27b0')) boxType = 'accent';
              return '';
            }
            
            if (prop === 'color' && (cleanVal === 'white' || cleanVal === '#fff' || cleanVal === '#ffffff')) {
              return '';
            }

            const cssProp = prop.replace(/([A-Z])/g, "-$1").toLowerCase();
            return `${cssProp}: ${cleanVal}`;
          }).filter(Boolean);

          return `class="content-box box-${boxType}" style="${htmlStyles.join('; ')}"`;
        });

        const dirPath = m.path.substring(0, m.path.lastIndexOf('/'));
        const assetBase = dirPath ? `/exam-content/${dirPath}/` : '/exam-content/';
        
        cleanContent = cleanContent.replace(/(src|href)="((?!http|https|\/)[^"]+)"/g, (_match, attr, path) => {
          return `${attr}="${assetBase}${path}"`;
        });

        cleanContent = cleanContent.replace(/(!?\[.*?\])\((?!http|https|\/)(.*?)\)/g, (_match, text, path) => {
          return `${text}(${assetBase}${path})`;
        });

        setContent(cleanContent);
      } else {
        setContent('### Lỗi: Không tìm thấy file tài liệu.');
      }
    } catch (error) {
      console.error('Error loading MDX:', error);
      setContent('### Lỗi: Không thể tải nội dung tài liệu.');
    } finally {
      setIsLoading(false);
    }
  };

  // Support for deep linking via custom event
  useEffect(() => {
    const handleSelectEvent = (e: any) => {
      handleSelect(e.detail);
    };

    window.addEventListener('select-material', handleSelectEvent);
    
    // Initial check if hash is already there on component mount
    const hash = window.location.hash;
    if (hash.startsWith('#/tai-lieu/')) {
      const materialId = hash.replace('#/tai-lieu/', '');
      const material = EXAM_MATERIALS.find(m => m.id === materialId);
      if (material) handleSelect(material);
    }

    return () => window.removeEventListener('select-material', handleSelectEvent);
  }, []);

  const handleLinkClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const anchor = target.closest('a');
    if (anchor && anchor.getAttribute('href')?.endsWith('.pdf')) {
      e.preventDefault();
      const pdfUrl = anchor.getAttribute('href')!;
      setPreviewPdf(pdfUrl);
    }
  };

  const filteredMaterials = useMemo(() => {
    if (!searchTerm.trim()) return EXAM_MATERIALS;
    const term = searchTerm.toLowerCase();
    return EXAM_MATERIALS.filter(m => 
      m.title.toLowerCase().includes(term) || 
      m.category.toLowerCase().includes(term) ||
      (m.year && m.year.includes(term))
    );
  }, [searchTerm]);

  const categories = Array.from(new Set(filteredMaterials.map(m => m.category)));

  return (
    <section className="materials-section">
      <Helmet>
        <title>
          {selectedMaterial 
            ? `${EXAM_MATERIALS.find(m => m.id === selectedMaterial)?.title} - Tra Cứu Điểm Thi`
            : 'Đề Thi & Tài liệu Tham Khảo Lớp 6 Trần Đại Nghĩa'}
        </title>
      </Helmet>
      <div className="materials-container">
        <aside className="materials-sidebar">
          <div className="sidebar-header">
            <h3 className="sidebar-title">
              <BookIcon />
              Thư viện tài liệu
            </h3>
            <div className="sidebar-search">
              <SearchIcon />
              <input 
                type="text" 
                placeholder="Tìm kiếm tài liệu..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <nav className="sidebar-nav">
            {categories.length > 0 ? categories.map(cat => (
              <div key={cat} className="category-group">
                <h4 className="category-title">{cat}</h4>
                <div className="category-list">
                  {filteredMaterials.filter(m => m.category === cat).map(m => (
                    <button 
                      key={m.id} 
                      className={`material-item ${selectedMaterial === m.id ? 'active' : ''}`}
                      onClick={() => handleSelect(m)}
                    >
                      <span className="material-icon">{m.path.endsWith('.mdx') ? '📄' : '📁'}</span>
                      <div className="material-info">
                        <span className="material-title">{m.title}</span>
                        {m.year && <span className="material-badge">{m.year}</span>}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )) : (
              <div className="no-results">Không tìm thấy tài liệu phù hợp</div>
            )}
          </nav>
        </aside>
        
        <main className="materials-content" onClick={handleLinkClick}>
          {isLoading ? (
            <div className="materials-placeholder">
              <div className="loading-spinner"></div>
              <p>Đang tải tài liệu...</p>
            </div>
          ) : selectedMaterial ? (
            <div className="material-detail">
              <div className="markdown-body">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]} 
                  rehypePlugins={[rehypeRaw]}
                >
                  {content}
                </ReactMarkdown>
              </div>
            </div>
          ) : (
            <div className="materials-placeholder">
              <div className="welcome-content">
                <BookIcon />
                <h2>Chào mừng bạn đến với Thư viện tài liệu</h2>
                <p>Hãy chọn một danh mục bên trái để bắt đầu ôn luyện và tham khảo đề thi các năm.</p>
                <div className="welcome-stats">
                  <div className="w-stat"><b>{EXAM_MATERIALS.length}</b> Tài liệu</div>
                  <div className="w-stat"><b>{categories.length}</b> Danh mục</div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {previewPdf && (
        <div className="pdf-modal-overlay" onClick={() => setPreviewPdf(null)}>
          <div className="pdf-modal-container" onClick={e => e.stopPropagation()}>
            <div className="pdf-modal-header">
              <h3>Xem tài liệu PDF</h3>
              <button className="close-modal-btn" onClick={() => setPreviewPdf(null)}>×</button>
            </div>
            <div className="pdf-modal-body">
              <iframe src={previewPdf} width="100%" height="100%" title="PDF Preview"></iframe>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default App;
