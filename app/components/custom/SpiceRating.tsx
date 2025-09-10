import { Flame } from 'lucide-react';
import React from 'react';

interface SpiceRatingProps {
    rating: number;
}

const SpiceRating: React.FC<SpiceRatingProps> = ({ rating }) => {
    if (!rating || rating === 0) {
        return (
            <div className="flex items-center space-x-1">
                <span className="bg-gray-200 text-gray-700 text-xs font-bold px-2 py-1 rounded-full">Mild</span>
            </div>
        );
    }

    return (
        <div className="flex items-center space-x-1">
            {Array.from({ length: 5 }).map((_, i) => (
                <Flame
                    key={i}
                    className={`w-4 h-4 ${i < rating ? 'text-orange-500' : 'text-gray-300'} fill-current`}
                />
            ))}
        </div>
    );
};

export default SpiceRating;