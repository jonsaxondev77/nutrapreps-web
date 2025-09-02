"use client";

import { Suspense } from 'react';

import { Loader2 } from 'lucide-react';
import { AccountContent } from './AccountContext';

const LoadingFallback = () => (
    <div className="flex-grow flex items-center justify-center p-8">
        <Loader2 className="animate-spin text-gray-500" size={48} />
    </div>
);

const AccountPage = () => {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <AccountContent />
        </Suspense>
    );
};

export default AccountPage;