import { createContext, useContext, useState, type ReactNode, } from "react";

// ประเภทของ Toast (Success, Error, Info)
type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: {
    success: (msg: string) => void;
    error: (msg: string) => void;
    info: (msg: string) => void;
  };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // ฟังก์ชันเพิ่ม Toast
  const addToast = (message: string, type: ToastType) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // ตั้งเวลาลบออกอัตโนมัติ 3 วินาที
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  // Helper functions ให้เรียกใช่ง่ายๆ
  const toastHelpers = {
    success: (msg: string) => addToast(msg, 'success'),
    error: (msg: string) => addToast(msg, 'error'),
    info: (msg: string) => addToast(msg, 'info'),
  };

  // --- Components สำหรับ Icon ---
  const Icons = {
    success: (
      <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
    ),
    error: (
      <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
    ),
    info: (
      <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
    )
  };

  return (
    <ToastContext.Provider value={{ toast: toastHelpers }}>
      {children}
      
      {/* --- ส่วนแสดงผล Toast (Overlay) --- */}
      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map((t) => (
          <div 
            key={t.id}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border bg-white min-w-[300px] max-w-sm pointer-events-auto
              transform transition-all duration-300 animate-slide-in
              ${t.type === 'error' ? 'border-l-4 border-l-red-500' : 
                t.type === 'success' ? 'border-l-4 border-l-green-500' : 
                'border-l-4 border-l-blue-500'}
            `}
          >
            <div className="shrink-0">{Icons[t.type]}</div>
            <p className="text-gray-800 font-medium text-sm">{t.message}</p>
            
            {/* ปุ่มปิด */}
            <button 
              onClick={() => setToasts(prev => prev.filter(item => item.id !== t.id))}
              className="ml-auto text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};