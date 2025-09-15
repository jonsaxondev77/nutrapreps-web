import Link from 'next/link';
import { Frown } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex-grow flex items-center justify-center min-h-screen bg-gray-50 text-center p-4 -mt-20">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-xl w-full">
        <Frown 
            className="w-48 h-48 text-gray-500 mx-auto mb-4"
            strokeWidth={1} />
        <h1 className="text-6xl font-bold text-gray-400 mb-2">404</h1>
        <h2 className="text-3xl text-gray-400">Page not found</h2>
        <p className="text-gray-600 mt-2 mb-9 text-lg">
          The page you are looking for does not exist.
        </p>
        <Link 
          href="/" 
          className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
        >
          Return to Homepage
        </Link>
      </div>
    </div>
  );
}