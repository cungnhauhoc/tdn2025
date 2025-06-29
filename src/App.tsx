
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
  const total = data.length;
  const avg = total > 0 ? (data.reduce((sum, c) => sum + c.diem, 0) / total).toFixed(2) : 0;
  const max = total > 0 ? Math.max(...data.map(c => c.diem)) : 0;
  const PASS_SCORE = 73.25;
  const passed = data.filter(c => c.diem >= PASS_SCORE).length;
  const passRate = total > 0 ? ((passed / total) * 100).toFixed(2) : 0;


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
            <div className="header-title">TRA CỨU ĐIỂM THI LỚP 6</div>
            <div className="header-sub">Trường THCS - THPT Trần Đại Nghĩa - Năm học 2025 - 2026</div>
          </div>
          <img src="/logo-tdn.png" alt="Logo Trần Đại Nghĩa" style={{height: 90, width: 90, objectFit: 'contain', marginRight: 12}} />
        </div>
      </header>
      <div className="stats-box">
        <div className="stat-item"><b>Tổng số thí sinh:</b> {total}</div>
        <div className="stat-item"><b>Điểm trung bình:</b> {avg}</div>
        <div className="stat-item"><b>Điểm cao nhất:</b> {max}</div>
        <div className="stat-item"><b>Số thí sinh đậu:</b> {passed}</div>
        <div className="stat-item"><b>Tỉ lệ đậu:</b> {passRate}%</div>
      </div>

      <div className="score-chart">
        <div className="chart-title">Phổ điểm thí sinh (biểu đồ cột)</div>
        <BarChart bins={bins} binLabels={binLabels} />
      </div>





      <div className="lookup-box">
        <div className="main-title">Nhập số báo danh hoặc họ tên để tra cứu</div>
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
          <button type="submit">Tra cứu</button>
        </form>
        {result && (
          <div className={`result-card ${result.diem >= PASS_SCORE ? 'passed' : 'failed'}`}> 
            <div className="result-header">
              <span className="result-icon">{result.diem >= PASS_SCORE ? '🎉' : '❌'}</span>
              <span className="result-status">
                {result.diem >= PASS_SCORE ? 'Chúc mừng, bạn đã ĐẬU!' : 'Rất tiếc, bạn KHÔNG ĐẬU'}
              </span>
            </div>
            <div className="result-info">
              <div><b>Số báo danh:</b> {result.soBaoDanh}</div>
              <div><b>Họ và tên:</b> {result.hoVaTen}</div>
              <div><b>Điểm:</b> <span className={result.diem >= PASS_SCORE ? 'score-pass' : 'score-fail'}>{result.diem}</span></div>
              <div><b>Ngày sinh:</b> {result.ngaySinh}</div>
            </div>
          </div>
        )}
        {resultList && (
          <div className="result-list">
            <div className="main-title" style={{marginTop: 8}}>Có {resultList.length} thí sinh trùng tên:</div>
            <table className="candidate-table">
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
          <div className="notfound">Không tìm thấy thí sinh phù hợp.</div>
        )}
        {!result && !resultList && !notFound && data.length > 0 && (
          <>
            <div className="main-title" style={{marginTop: 8}}>Danh sách thí sinh</div>
            <table className="candidate-table">
              <thead>
                <tr>
                  <th>Số báo danh</th>
                  <th>Họ và tên</th>
                  <th>Điểm</th>
                  <th>Ngày sinh</th>
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
