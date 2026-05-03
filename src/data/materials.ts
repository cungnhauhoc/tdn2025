
export interface ExamMaterial {
  id: string;
  title: string;
  description?: string;
  category: string;
  tags?: string[];
  path: string;
  year?: string;
}

export const EXAM_MATERIALS: ExamMaterial[] = [
  {
    id: 'de-thi-thu-1',
    title: 'Đề thi thử vào lớp 6 - Đề số 1',
    category: 'Đề thi thử',
    path: 'de-thi-thu-so-1.mdx',
  },
  {
    id: 'de-thi-thu-2',
    title: 'Đề thi thử vào lớp 6 - Đề số 2',
    category: 'Đề thi thử',
    path: 'de-thi-thu-so-2.mdx',
  },
  {
    id: 'kinh-nghiem-on-thi',
    title: 'Kinh nghiệm làm bài thi vào lớp 6',
    category: 'Kinh nghiệm',
    path: 'kinh-nghiem-lam-bai-thi.mdx',
  },
  // Trần Đại Nghĩa
  {
    id: 'tdn-2025',
    title: 'Đề Thi & Đáp Án Trần Đại Nghĩa 2025',
    category: 'Trần Đại Nghĩa',
    year: '2025',
    path: 'tran-dai-nghia/dap-an-de-thi-lop-6-truong-tran-dai-nghia-nam-2025.mdx',
  },
  {
    id: 'tdn-2024',
    title: 'Đề Thi & Đáp Án Trần Đại Nghĩa 2024',
    category: 'Trần Đại Nghĩa',
    year: '2024',
    path: 'tran-dai-nghia/de-thi-lop-6-truong-tran-dai-nghia-nam-2024.mdx',
  },
  {
    id: 'tdn-2023',
    title: 'Đề Thi & Đáp Án Trần Đại Nghĩa 2023',
    category: 'Trần Đại Nghĩa',
    year: '2023',
    path: 'tran-dai-nghia/de-thi-lop-6-truong-tran-dai-nghia-nam-2023.mdx',
  },
  {
    id: 'tdn-2022',
    title: 'Đề Thi & Đáp Án Trần Đại Nghĩa 2022',
    category: 'Trần Đại Nghĩa',
    year: '2022',
    path: 'tran-dai-nghia/de-thi-lop-6-truong-tran-dai-nghia-nam-2022.mdx',
  },

  // Tuyển sinh khác
  {
    id: 'ts-thu-duc-2025',
    title: 'Đề và đáp án thi lớp 6 Thủ Đức 2025',
    category: 'Tuyển sinh',
    year: '2025',
    path: 'tuyen-sinh/dap-an-de-khao-sat-thu-duc-2025.mdx',
  },
  {
    id: 'ts-nguyen-an-khuong-2024',
    title: 'Đề thi lớp 6 Nguyễn An Khương 2024',
    category: 'Tuyển sinh',
    year: '2024',
    path: 'tuyen-sinh/de-thi-lop-6-nguyen-an-khuong-2024.mdx',
  },
  {
    id: 'ts-thu-duc-2024',
    title: 'Đề và đáp án thi lớp 6 Thủ Đức 2024',
    category: 'Tuyển sinh',
    year: '2024',
    path: 'tuyen-sinh/de-thi-lop-6-thu-duc-nam-2024.mdx',
  }
];
