// lib/fields/BunnyImageField.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { BunnyFileManager } from './BunnyFileManager';
import { Modal } from '@/app/components/design/Modal';

export const bunnyImageField = (label: string) => ({
  type: 'custom' as const,
  label,
  render: ({ value, onChange }) => {
    const [isClient, setIsClient] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
      setIsClient(true);
    }, []);

    const handleSelect = (url: string) => {
      onChange(url);
      setIsOpen(false);
    };

    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={value || ''}
            readOnly
            className="w-full pl-3 py-2 border border-gray-300 rounded-lg"
          />
          {isClient && (
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Browse
            </button>
          )}
        </div>
        {value && <img src={value} alt="Selected" className="mt-2 w-full h-auto object-cover rounded-md" />}

        {isOpen && isClient && (
          <Modal onClose={() => setIsOpen(false)}>
            <BunnyFileManager onFileSelect={handleSelect} onClose={() => setIsOpen(false)} />
          </Modal>
        )}
      </div>
    );
  },
});