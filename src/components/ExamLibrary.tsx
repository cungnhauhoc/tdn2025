import React, { useState, useEffect, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Helmet } from 'react-helmet-async';
import { EXAM_MATERIALS, type ExamMaterial } from '../data/materials';
import { BookIcon, SearchIcon } from './Icons';

// Vite glob import for MDX files
const mdxModules = import.meta.glob('../exam-content/**/*.mdx', { query: '?raw', import: 'default' });

export function ExamLibrary() {
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [previewPdf, setPreviewPdf] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');

  const handleSelect = async (m: ExamMaterial) => {
    setSelectedMaterial(m.id);
    setIsLoading(true);
    // Update URL hash for SEO and deep-linking
    window.history.pushState(null, '', `#/tai-lieu/${m.id}`);
    
    // Auto-scroll to content on mobile
    if (window.innerWidth < 992) {
      setTimeout(() => {
        const contentArea = document.querySelector('.materials-content');
        contentArea?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
    
    try {
      const modulePath = `../exam-content/${m.path}`;
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
      const pdfUrl = anchor.getAttribute('href')!;
      const isMobile = window.innerWidth < 768;
      
      if (isMobile) {
        // On mobile, let it open in new tab (default behavior or forced)
        anchor.setAttribute('target', '_blank');
        return;
      }

      e.preventDefault();
      setPreviewPdf(pdfUrl);
    }
  };

  const filteredMaterials = useMemo(() => {
    let filtered = EXAM_MATERIALS;
    if (selectedCategory !== 'Tất cả') {
      filtered = filtered.filter(m => m.category === selectedCategory);
    }
    if (!searchTerm.trim()) return filtered;
    const term = searchTerm.toLowerCase();
    return filtered.filter(m => 
      m.title.toLowerCase().includes(term) || 
      m.category.toLowerCase().includes(term) ||
      (m.year && m.year.includes(term))
    );
  }, [searchTerm, selectedCategory]);

  const categories = ['Tất cả', ...Array.from(new Set(EXAM_MATERIALS.map(m => m.category)))];

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
            
            <div className="category-tabs-mobile">
              {categories.map(cat => (
                <button 
                  key={cat} 
                  className={`cat-tab ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

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
            {selectedCategory === 'Tất cả' && !searchTerm ? (
              // Desktop-like grouped view for 'All'
              categories.filter(c => c !== 'Tất cả').map(cat => (
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
              ))
            ) : (
              // Flat list for specific category or search
              <div className="category-list flat">
                {filteredMaterials.map(m => (
                  <button 
                    key={m.id} 
                    className={`material-item ${selectedMaterial === m.id ? 'active' : ''}`}
                    onClick={() => handleSelect(m)}
                  >
                    <span className="material-icon">{m.path.endsWith('.mdx') ? '📄' : '📁'}</span>
                    <div className="material-info">
                      <span className="material-title">{m.title}</span>
                      <div className="material-meta">
                        <span className="material-badge cat">{m.category}</span>
                        {m.year && <span className="material-badge">{m.year}</span>}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {filteredMaterials.length === 0 && (
              <div className="no-results">Không tìm thấy tài liệu phù hợp</div>
            )}
          </nav>
        </aside>
        
        <main className="materials-content" onClick={handleLinkClick}>
          {selectedMaterial && (
            <div className="content-header-mobile">
              <h3>Đang xem: {EXAM_MATERIALS.find(m => m.id === selectedMaterial)?.title}</h3>
            </div>
          )}
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
