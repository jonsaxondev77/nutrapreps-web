import { Suspense } from 'react';
import ConfirmAccount from './ConfirmAccount';

// A loading component to show while the verification is in progress.
function LoadingState() {
  return (
    <div className="flex-grow flex items-center justify-center px-4 bg-gray-50">
      <div className="max-w-2xl w-full bg-white p-10 rounded-xl shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Verifying Your Account...</h1>
        <p className="text-gray-600">Please wait, we&apos;re checking your details.</p>
        <div className="mt-6">
            <div className="animate-pulse h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
        </div>
      </div>
    </div>
  );
}

// The main page component for the /verify-email route.
// It uses Suspense to handle the loading state gracefully.
export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ConfirmAccount />
    </Suspense>
  );
}
