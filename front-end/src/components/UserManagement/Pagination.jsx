import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-[14px]" data-test-id="pagination-container">
      <span className="text-sm text-slate-500 font-medium" data-test-id="pagination-text-current">
        Trang <span className="font-bold text-slate-800">{currentPage}</span> / {totalPages}
      </span>
      
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-9 w-9 rounded-[10px] border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center"
          data-test-id="pagination-button-prev"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-9 w-9 rounded-[10px] border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center"
          data-test-id="pagination-button-next"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
