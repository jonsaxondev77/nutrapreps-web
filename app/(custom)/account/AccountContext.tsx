'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Profile from './Profile';
import { User, ShoppingBag, KeyRound } from 'lucide-react';
import Orders from './Orders';
import ChangePassword from './ChangePassword';

export const AccountContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  
  // Get the tab parameter from the URL, or default to 'profile'
  const urlTab = searchParams.get('tab') || 'profile';
  
  const [activeTab, setActiveTab] = useState(urlTab);

  // Use useEffect to keep the URL in sync with the activeTab state
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (activeTab === 'profile') {
      params.delete('tab');
    } else {
      params.set('tab', activeTab);
    }
    router.replace(`?${params.toString()}`);
  }, [activeTab, router, searchParams]);

  if (status === 'loading') {
    return (
      <div className="flex-grow flex items-center justify-center bg-gray-50">
        <p>Loading...</p>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/signin');
    return null;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <Profile />;
      case 'change-password':
        return <ChangePassword />;
      case 'orders':
        return <Orders />;
      default:
        return <Profile />;
    }
  };

  return (
    <div className="flex-grow bg-gray-50">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="md:flex md:space-x-8">
          <div className="md:w-1/4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">My Account</h2>
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center w-full text-left px-4 py-2 rounded-lg transition-colors ${activeTab === 'profile'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-600 hover:bg-gray-200'
                  }`}
              >
                <User className="mr-3" size={20} />
                Profile & Shipping
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex items-center w-full text-left px-4 py-2 rounded-lg transition-colors ${activeTab === 'orders'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-600 hover:bg-gray-200'
                  }`}
              >
                <ShoppingBag className="mr-3" size={20} />
                Order History
              </button>
              <button
                onClick={() => setActiveTab('change-password')}
                className={`flex items-center w-full text-left px-4 py-3 rounded-lg transition-colors ${activeTab === 'change-password'
                    ? 'bg-green-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-200'
                  }`}
              >
                <KeyRound className="mr-3" size={20} />
                Change Password
              </button>

            </nav>
          </div>
          <div className="md:w-3/4 mt-8 md:mt-0">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};