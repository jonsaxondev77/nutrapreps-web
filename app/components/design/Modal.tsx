// app/components/design/Modal.tsx
import React, { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
}

export const Modal: React.FC<ModalProps> = ({ children, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="relative w-full max-w-5xl max-h-[90vh] mx-auto p-4 md:p-6 lg:p-8 bg-white rounded-lg shadow-xl overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
        >
          <X size={24} />
        </button>
        {children}
      </div>
    </div>
  );
};