
import { useState, useEffect } from 'react';
import './App.css';
// import { PieChart } from './PieChart';
import { BarChart } from './BarChart';

type Candidate = {
  soBaoDanh: string;
  hoVaTen: string;
  diem: number;
  ngaySinh: string;
};

// Đã bỏ hàm parseData vì không còn sử dụng

function App() {
  const [data, setData] = useState<Candidate[]>([]);
  const [input, setInput] = useState('');
  const [result, setResult] = useState<Candidate | null>(null);
  const [resultList, setResultList] = useState<Candidate[] | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 100;
  const totalPages = Math.ceil(data.length / pageSize);

  useEffect(() => {
    fetch('/data.json')
      .then(res => res.json())
      .then(json => {
        if (Array.isArray(json)) {
          // Chuyển đổi dữ liệu từ định dạng mới sang Candidate[]
          const mapped = json.map((item: any) => ({
            soBaoDanh: item["số báo danh"] || '',
            hoVaTen: item["họ và tên"] || '',
            diem: typeof item["kết quả"] === 'string' ? Number(item["kết quả"].replace(/[^\d.,-]/g, '').replace(',', '.')) : 0,
            ngaySinh: item["ngày sinh"] || '',
          })).filter((c: any) => c.soBaoDanh && c.hoVaTen);
          setData(mapped);
        }
      });
  }, []);

  // Hàm chuẩn hóa chuỗi: loại bỏ dấu, chuyển thường, loại bỏ khoảng trắng thừa
  function normalizeString(str: string) {
    return str
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLowerCase()
      .replace(/\s+/g, '')
      .trim();
  }

  // Hàm chuẩn hóa số báo danh: chỉ lấy số, bỏ số 0 đầu
  function normalizeSBD(s: string) {
    return s.replace(/\D/g, '').replace(/^0+/, '').trim();
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setNotFound(false);
    setResult(null);
    setResultList(null);
    const inputRaw = input.trim();
    if (!inputRaw) return;
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
    } else {
      setNotFound(true);
    }
  };

  // --- Thống kê ---
  const total: number = data.length;
  const avg: string = total > 0 ? (data.reduce((sum, c) => sum + c.diem, 0) / total).toFixed(2) : '0.00';
  const max: number = total > 0 ? Math.max(...data.map(c => c.diem)) : 0;
  const PASS_SCORE = 73.25;
  const passed: number = data.filter(c => c.diem >= PASS_SCORE).length;
  const passRate: string = total > 0 ? ((passed / total) * 100).toFixed(2) : '0.00';


  // Phổ điểm: chia các mốc 5 điểm, chỉ lấy đến 100, nhãn đẹp, không có 100–104.99
  const BIN_COUNT = 20; // 0–4.99, 5–9.99, ..., 95–99.99
  const bins = Array(BIN_COUNT).fill(0);
  const binsPassed = Array(BIN_COUNT).fill(0); // số thí sinh đậu trong mỗi bin
  const binsFailed = Array(BIN_COUNT).fill(0); // số thí sinh rớt trong mỗi bin
  data.forEach(c => {
    let idx = Math.floor(c.diem / 5);
    if (idx >= BIN_COUNT) idx = BIN_COUNT - 1;
    bins[idx]++;
    if (c.diem >= PASS_SCORE) binsPassed[idx]++;
    else binsFailed[idx]++;
  });
  const binLabels = bins.map((_, i) => `${i*5}–${(i*5+4.99).toFixed(2)}`);

  return (
    <div>

      <header className="main-header">
        <div className="header-bg"></div>
        <div className="header-content" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, padding: '0 32px'}}>
          <img src="/logo-tdn.png" alt="Logo Trần Đại Nghĩa" style={{height: 90, width: 90, objectFit: 'contain', marginLeft: 12}} />
          <div style={{flex: 1, minWidth: 0}}>
            <div style={{display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 4}}>
              <a href="https://cungnhauhoc.net/" target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none', color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4}}>
                <span role="img" aria-label="home">🏠</span> Trang chủ
              </a>
              <a href="https://tdn2024.cungnhauhoc.net/" target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none', color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4}}>
                <span role="img" aria-label="2024">📅</span> Tra cứu điểm năm 2024
              </a>
              <a href="https://tdn2025.cungnhauhoc.net/" target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none', color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4}}>
                <span role="img" aria-label="2025">🆕</span> Tra cứu điểm năm 2025
              </a>
            </div>
            <div className="header-title">TRA CỨU ĐIỂM THI LỚP 6</div>
            <div className="header-sub">Trường THCS - THPT Trần Đại Nghĩa - Năm học 2025 - 2026</div>
          </div>
          <img src="/logo-tdn.png" alt="Logo Trần Đại Nghĩa" style={{height: 90, width: 90, objectFit: 'contain', marginRight: 12}} />
        </div>
      </header>
      <div className="stats-container" style={{ display: 'flex', justifyContent: 'center', margin: '32px 0' }}>
        <div className="stats-box" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 24, background: '#f8fafc', borderRadius: 16, boxShadow: '0 2px 12px #0001', padding: '24px 40px', minWidth: 600 }}>
          <div className="stats-group" style={{ display: 'flex', flexDirection: 'row', gap: 48, justifyContent: 'center', alignItems: 'center' }}>
            <div className="stat-item">
              <span className="stat-icon" role="img" aria-label="Tổng số thí sinh">👥</span>
              <div className="stat-label" style={{ color: '#222', fontWeight: 600 }}>Tổng số thí sinh</div>
              <div className="stat-value" style={{ color: '#1565c0', fontWeight: 700 }}>{total}</div>
            </div>
            <div className="stat-item">
              <span className="stat-icon" role="img" aria-label="Điểm trung bình">📊</span>
              <div className="stat-label" style={{ color: '#222', fontWeight: 600 }}>Điểm trung bình</div>
              <div className="stat-value" style={{ color: '#2e7d32', fontWeight: 700 }}>{avg}</div>
            </div>
            <div className="stat-item">
              <span className="stat-icon" role="img" aria-label="Điểm cao nhất">🏆</span>
              <div className="stat-label" style={{ color: '#222', fontWeight: 600 }}>Điểm cao nhất</div>
              <div className="stat-value" style={{ color: '#d84315', fontWeight: 700 }}>{max}</div>
            </div>
          </div>
          <div className="stats-group" style={{ display: 'flex', flexDirection: 'row', gap: 48, justifyContent: 'center', alignItems: 'center' }}>
            <div className="stat-item">
              <span className="stat-icon" role="img" aria-label="Số thí sinh đậu">✅</span>
              <div className="stat-label" style={{ color: '#222', fontWeight: 600 }}>Số thí sinh đậu</div>
              <div className="stat-value" style={{ color: '#388e3c', fontWeight: 700 }}>{passed}</div>
            </div>
            <div className="stat-item">
              <span className="stat-icon" role="img" aria-label="Tỉ lệ đậu">📈</span>
              <div className="stat-label" style={{ color: '#222', fontWeight: 600 }}>Tỉ lệ đậu</div>
              <div className="stat-value" style={{ color: '#6d4c41', fontWeight: 700 }}>{passRate}%</div>
            </div>
          </div>
        </div>
      </div>

      <div className="score-chart">
        <div className="chart-title">Phổ điểm thí sinh (biểu đồ cột)</div>
        <BarChart bins={bins} binLabels={binLabels} />
      </div>





      <div className="lookup-box">
        <div className="main-title" style={{display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center'}}>
          <span role="img" aria-label="Tra cứu">🔎</span>
          Nhập số báo danh hoặc họ tên để tra cứu
        </div>
        <form className="lookup-form" onSubmit={handleSearch} autoComplete="off">
          <input
            id="sbd"
            type="text"
            placeholder="Nhập số báo danh hoặc họ tên..."
            value={input}
            onChange={e => setInput(e.target.value)}
            required
            autoFocus
          />
          <button type="submit"><span role="img" aria-label="Tra cứu">🔍</span> Tra cứu</button>
        </form>
        {result && (
          <div className={`result-card ${result.diem >= PASS_SCORE ? 'passed' : 'failed'}`}> 
            <div className="result-header">
              <span className="result-icon" style={{fontSize: 32}}>{result.diem >= PASS_SCORE ? '🎉' : '💡'}</span>
              <span className="result-status">
                {result.diem >= PASS_SCORE
                  ? <>
                      <b>Chúc mừng, bạn đã ĐẬU!</b> <span role="img" aria-label="Vương miện">👑</span><br/>
                      <span style={{fontSize: '1.05em', color: '#2e7d32', fontWeight: 500}}>Hãy tiếp tục phát huy, chúc bạn luôn thành công và hạnh phúc trên con đường phía trước!</span>
                    </>
                  : <>
                      <b>Rất tiếc, bạn chưa ĐẬU!</b> <span role="img" aria-label="Cố lên">💪</span><br/>
                      <span style={{fontSize: '1.05em', color: '#d84315', fontWeight: 500}}>Đừng buồn nhé, hãy cố gắng hơn ở những kỳ thi tiếp theo. Thành công sẽ đến với người không bỏ cuộc!</span>
                    </>
                }
              </span>
            </div>
            <div className="result-info">
              <div><b><span role="img" aria-label="Số báo danh">🔢</span> Số báo danh:</b> {result.soBaoDanh}</div>
              <div><b><span role="img" aria-label="Tên">🧑‍🎓</span> Họ và tên:</b> {result.hoVaTen}</div>
              <div><b><span role="img" aria-label="Điểm">📝</span> Điểm:</b> <span className={result.diem >= PASS_SCORE ? 'score-pass' : 'score-fail'}>{result.diem}</span></div>
              <div><b><span role="img" aria-label="Ngày sinh">🎂</span> Ngày sinh:</b> {result.ngaySinh}</div>
            </div>
          </div>
        )}
        {resultList && (
          <div className="result-list">
            <div className="main-title" style={{marginTop: 8, display: 'flex', alignItems: 'center', gap: 8}}>
              <span role="img" aria-label="Trùng tên">👥</span>
              Có {resultList.length} thí sinh trùng tên:
            </div>
            <table className="candidate-table">
              <thead>
                <tr>
                  <th><span role="img" aria-label="Số báo danh">🔢</span> Số báo danh</th>
                  <th><span role="img" aria-label="Tên">🧑‍🎓</span> Họ và tên</th>
                  <th><span role="img" aria-label="Điểm">📝</span> Điểm</th>
                  <th><span role="img" aria-label="Ngày sinh">🎂</span> Ngày sinh</th>
                </tr>
              </thead>
              <tbody>
                {resultList.map((c, idx) => (
                  <tr key={c.soBaoDanh+idx}>
                    <td>{c.soBaoDanh}</td>
                    <td>{c.hoVaTen}</td>
                    <td className={c.diem >= PASS_SCORE ? 'score-pass' : 'score-fail'}>{c.diem}</td>
                    <td>{c.ngaySinh}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {notFound && (
          <div className="notfound" style={{display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center'}}>
            <span role="img" aria-label="Không tìm thấy">❓</span>
            Không tìm thấy thí sinh phù hợp.
          </div>
        )}
        {!result && !resultList && !notFound && data.length > 0 && (
          <>
            <div className="main-title" style={{marginTop: 8, display: 'flex', alignItems: 'center', gap: 8}}>
              <span role="img" aria-label="Danh sách">📋</span>
              Danh sách thí sinh
            </div>
            <table className="candidate-table">
              <thead>
                <tr>
                  <th><span role="img" aria-label="Số báo danh">🔢</span> Số báo danh</th>
                  <th><span role="img" aria-label="Tên">🧑‍🎓</span> Họ và tên</th>
                  <th><span role="img" aria-label="Điểm">📝</span> Điểm</th>
                  <th><span role="img" aria-label="Ngày sinh">🎂</span> Ngày sinh</th>
                </tr>
              </thead>
              <tbody>
                {data.slice((page-1)*pageSize, page*pageSize).map((c, idx) => (
                  <tr key={c.soBaoDanh+idx}>
                    <td>{c.soBaoDanh}</td>
                    <td>{c.hoVaTen}</td>
                    <td className={c.diem >= PASS_SCORE ? 'score-pass' : 'score-fail'}>{c.diem}</td>
                    <td>{c.ngaySinh}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination-controls">
              <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}>&lt;</button>
              <span>Trang {page} / {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages}>&gt;</button>
            </div>
          </>
        )}
      </div>
      <div className="footer">
        <span>© {new Date().getFullYear()} Tra cứu điểm thi lớp 6 Trường Trần Đại Nghĩa</span>
        <span className="credit">Nguồn: <a href="https://cungnhauhoc.net" target="_blank" rel="noopener noreferrer">cungnhauhoc.net</a></span>
      </div>
    </div>
  );
}

export default App;
