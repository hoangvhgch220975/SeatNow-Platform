import React from 'react';

/**
 * @file Pagination.jsx
 * @description Component phân trang cao cấp phong cách Glassmorphism.
 */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null; 


  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Nút Previous */}
      <button
        onClick={() => {
          console.log('--- DEBUG: PREV BUTTON CLICKED ---');
          onPageChange(Math.max(1, currentPage - 1));
        }}
        disabled={currentPage === 1}

        className="w-10 h-10 rounded-xl flex items-center justify-center transition-all border-2 border-slate-100 bg-white shadow-soft hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-white"
      >
        <span className="material-symbols-outlined text-[20px]">chevron_left</span>
      </button>

      {/* Danh sách các trang */}
      <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm p-1 rounded-2xl border-2 border-slate-100 shadow-soft">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${
              currentPage === page
                ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-110'
                : 'text-slate-500 hover:bg-white hover:text-primary'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Nút Next */}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="w-10 h-10 rounded-xl flex items-center justify-center transition-all border-2 border-slate-100 bg-white shadow-soft hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-white"
      >

        <span className="material-symbols-outlined text-[20px]">chevron_right</span>
      </button>
    </div>
  );
};

export default Pagination;
