import React, { useEffect, useState } from 'react';
import { FieldLabel } from '@measured/puck';
import Image from 'next/image';
import { ChevronLeft, Folder } from 'lucide-react';

interface ImagePickerFieldProps {
  value: string;
  onChange: (value: string) => void;
  field: any;
  appState: any;
}

const ImagePicker = ({ value, onChange, field }: ImagePickerFieldProps) => {
    const [images, setImages] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchImages = async (path: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/bunny-cdn-images`); 
            if (!response.ok) {
                throw new Error('Failed to fetch images from API');
            }
            const data = await response.json();
            setImages(data.images);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <div>Loading images...</div>;
    }

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    return (
        <FieldLabel label={field.label}>
            
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-[300px] overflow-y-auto p-2 border rounded-lg bg-gray-50">
               
                {images.map((imagePath, index) => (
                    <div
                        key={index}
                        className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                            value === imagePath ? 'border-green-500 scale-105 shadow-md' : 'border-transparent hover:border-gray-300'
                        }`}
                        onClick={() => onChange(imagePath)}
                    >
                        <div className="relative w-full h-24">
                            <Image
                                src={imagePath}
                                alt={`Image ${index + 1}`}
                                fill
                                sizes="200px"
                                className="object-cover"
                            />
                        </div>
                    </div>
                ))}
            </div>
            <p className="mt-2 text-sm text-gray-500">Current selection: {value}</p>
        </FieldLabel>
    );
};

export const imagePickerField = (label: string) => ({
  type: 'custom' as const,
  label,
  render: (props: ImagePickerFieldProps) => <ImagePicker {...props} />,
});