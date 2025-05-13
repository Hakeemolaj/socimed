'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

// Custom error messages for different error types
const getErrorMessage = (error: string) => {
  switch (error) {
    case 'Configuration':
      return 'There is a problem with the server configuration. Please contact support.';
    case 'AccessDenied':
      return 'You do not have permission to sign in.';
    case 'Verification':
      return 'The verification link has expired or has already been used.';
    case 'OAuthSignin':
    case 'OAuthCallback':
    case 'OAuthCreateAccount':
    case 'EmailCreateAccount':
    case 'Callback':
      return 'There was a problem with the authentication service. Please try again.';
    case 'OAuthAccountNotLinked':
      return 'This email is already associated with another account. Please sign in using your original provider.';
    case 'EmailSignin':
      return 'The email could not be sent or the email link has expired.';
    case 'CredentialsSignin':
      return 'The login credentials you provided are invalid. Please try again.';
    case 'SessionRequired':
      return 'Please sign in to access this page.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
};

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const [errorType, setErrorType] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>(
    'An unexpected error occurred. Please try again.'
  );

  useEffect(() => {
    if (searchParams) {
      const error = searchParams.get('error');
      setErrorType(error);
      if (error) {
        setErrorMessage(getErrorMessage(error));
      }
    }
  }, [searchParams]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md rounded-lg bg-white dark:bg-gray-800 p-8 shadow-md">
        <div className="text-center">
          <h1 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">
            Authentication Error
          </h1>
          <div className="mb-4 text-gray-600 dark:text-gray-300">
            {errorType && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Error code: {errorType}
              </p>
            )}
            <p className="mb-6">{errorMessage}</p>
          </div>
          <div className="flex flex-col space-y-3">
            <Link
              href="/auth/signin"
              className="w-full rounded-md bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white transition-colors"
            >
              Try signing in again
            </Link>
            <Link
              href="/"
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Return to home page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 