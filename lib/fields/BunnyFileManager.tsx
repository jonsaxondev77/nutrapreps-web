// lib/fields/BunnyFileManager.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Folder, Image as ImageIcon, Upload, File, Loader2, X, ChevronLeft } from 'lucide-react';

interface BunnyFile {
  Guid: string;
  UserId: string;
  LastChanged: string;
  DateCreated: string;
  StorageZoneName: string;
  Path: string;
  ObjectName: string;
  Length: number;
  StorageZoneId: number;
  IsDirectory: boolean;
  ServerId: number;
  Checksum: string | null;
  ReplicatedZones: any;
  ContentType: string;
  data: () => any;
}

interface BunnyFileManagerProps {
  onFileSelect: (url: string) => void;
  onClose: () => void;
}

export const BunnyFileManager: React.FC<BunnyFileManagerProps> = ({ onFileSelect, onClose }) => {
  const [files, setFiles] = useState<BunnyFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPath, setCurrentPath] = useState('/');
  const [uploading, setUploading] = useState(false);

  const fetchFiles = useCallback(async (path: string) => {
    console.log('Fetching files for path:', path);
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('path', path);

      const response = await fetch(`/api/bunny-cdn?${params.toString()}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.details || `HTTP error: ${response.status}`);
      }

      const data = await response.json();
      setFiles(data);
      setCurrentPath(path);
    } catch (error) {
      console.error('Fetch error:', error);
      // Don't automatically fall back to root - show error instead
      setFiles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFiles('/');
  }, [fetchFiles]);

  const handleFileClick = (file: BunnyFile) => {
    console.log('Clicked file:', file.ObjectName, 'IsDirectory:', file.IsDirectory);
    console.log('Current path:', currentPath);

    if (file.IsDirectory) {
      // Construct the full path for the directory
      const newPath = currentPath === '/'
        ? `/${file.ObjectName}/`
        : `${currentPath}${file.ObjectName}/`;

      console.log('Navigating to path:', newPath);
      console.log('Encoded URL:', `/api/bunny-cdn?path=${encodeURIComponent(newPath)}`);

      fetchFiles(newPath);
    } else {
      const imageUrl = `https://${process.env.NEXT_PUBLIC_BUNNY_CDN_PULL_ZONE_HOSTNAME}${file.Path}${file.ObjectName}`;
      console.log('Selected image URL:', imageUrl);
      onFileSelect(imageUrl);
    }
  };

  const handleBackClick = () => {
    if (currentPath === '/') return;

    // Remove trailing slash and split into parts
    const pathParts = currentPath.replace(/\/$/, '').split('/').filter(Boolean);

    // If we're at a first-level directory like "/Hero/", go back to root
    if (pathParts.length === 1) {
      fetchFiles('/');
    } else {
      // Otherwise, go up one level
      const parentPath = `/${pathParts.slice(0, -1).join('/')}/`;
      fetchFiles(parentPath);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', currentPath);

    try {
      const response = await fetch('/api/bunny-cdn', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Upload failed');

      fetchFiles(currentPath);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col h-[70vh] bg-white rounded-lg shadow-xl overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="text-xl font-bold">Image Manager</h3>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
          <button onClick={handleBackClick} disabled={currentPath === '/'} className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50">
            <ChevronLeft size={16} />
          </button>
          <span>{currentPath}</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {loading ? (
            <div className="col-span-full flex justify-center items-center h-48">
              <Loader2 className="animate-spin text-gray-400" size={32} />
            </div>
          ) : (
            files.map((file) => (
              <div
                key={file.Guid}
                onClick={() => handleFileClick(file)}
                className="flex flex-col items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
              >
                {file.IsDirectory ? (
                  <Folder className="w-12 h-12 text-blue-500 mb-2" />
                ) : (
                  <Image
                    src={`https://${process.env.NEXT_PUBLIC_BUNNY_CDN_PULL_ZONE_HOSTNAME}${file.Path}${file.ObjectName}?width=100`}
                    alt={file.ObjectName}
                    width={100}
                    height={100}
                    className="object-cover rounded-md mb-2"
                  />
                )
                }
                <span className="text-xs text-center truncate w-full">{file.ObjectName}</span>
              </div>
            ))
          )}
        </div>
      </div>

      
    </div>
  );
};