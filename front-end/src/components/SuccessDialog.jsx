import React from 'react';
import { CheckCircle } from 'lucide-react';

const SuccessDialog = ({ open, message, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[4000] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in" data-test-id="success-dialog-container">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden p-6 text-center animate-in zoom-in-95" data-test-id="success-dialog">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 mb-6">
          <CheckCircle className="h-10 w-10 text-emerald-500" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Thành công!</h3>
        <p className="text-slate-600 font-medium mb-8" data-test-id="success-dialog-message">{message}</p>
        <button
          onClick={onClose}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-95"
          data-test-id="success-dialog-button-ok"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default SuccessDialog;
