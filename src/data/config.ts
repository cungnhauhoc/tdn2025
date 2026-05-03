
export type Year = '2024' | '2025' | '2026';

export const EXAM_YEARS: Year[] = ['2024', '2025'];

export const YEAR_CONFIG: Record<Year, { label: string; dataFile: string; passScore: number }> = {
  '2024': {
    label: '2024-2025',
    dataFile: '/data2024.json',
    passScore: 67.5,
  },
  '2025': {
    label: '2025-2026',
    dataFile: '/data.json',
    passScore: 73.25,
  },
  '2026': {
    label: '2026-2027',
    dataFile: '/data.json', // Placeholder
    passScore: 75, // Placeholder
  },
};

export const parse2024Data = (content: string) => {
  const lines = content.split('\n');
  const result: any[] = [];
  
  // Skip the header line if it exists
  const startIdx = lines[0].includes('SBD') ? 1 : 0;
  
  for (let i = startIdx; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Pattern: SBD (numbers) Name (text) Score (number) Date (dd/mm/yyyy)
    // Using regex to capture parts
    const match = line.match(/^(\d+)\s+(.+)\s+(\d+\.?\d*)\s+(\d{1,2}\/\d{1,2}\/\d{4})$/);
    
    if (match) {
      result.push({
        soBaoDanh: match[1],
        hoVaTen: match[2].trim(),
        diem: parseFloat(match[3]),
        ngaySinh: match[4]
      });
    }
  }
  
  return result;
};
