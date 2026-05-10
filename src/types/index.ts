
export interface Candidate {
  soBaoDanh: string;
  hoVaTen: string;
  diem: number;
  ngaySinh: string;
}

export interface RawCandidateData {
  "số báo danh": string;
  "họ và tên": string;
  "ngày sinh": string;
  "kết quả": string;
  "đậu/rớt": string;
  "chi tiết": string;
}

export type ChartType = 'bar' | 'pie';

export interface FilterOptions {
  minScore: number | null;
  maxScore: number | null;
  sortBy: 'soBaoDanh' | 'hoVaTen' | 'diem' | 'ngaySinh';
  sortOrder: 'asc' | 'desc';
}

export interface Statistics {
  total: number;
  avg: string;
  max: number;
  passed: number;
  passRate: string;
  PASS_SCORE: number;
}

export interface ChartData {
  bins: number[];
  binsPassed: number[];
  binsFailed: number[];
  binLabels: string[];
}
