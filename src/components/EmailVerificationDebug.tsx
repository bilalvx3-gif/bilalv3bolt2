import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';

interface EmailVerificationDebugProps {
  email: string;
}

export default function EmailVerificationDebug({ email }: EmailVerificationDebugProps) {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  const checkEmailVerificationStatus = async () => {
    setIsLoading(true);
    try {
      // Check current session
      const { data: sessionData } = await supabase.auth.getSession();
      
      // Check if user exists
      const { data: userData, error: userError } = await supabase.auth.admin.listUsers();
      
      // Check email confirmation status
      const currentUser = userData?.users?.find(u => u.email === email);
      
      setDebugInfo({
        session: sessionData.session,
        user: currentUser,
        userError: userError?.message,
        timestamp: new Date().toISOString(),
        email: email,
        environment: {
          supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
          hasAnonKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
        }
      });
    } catch (error) {
      setDebugInfo({
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        email: email
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerificationEmail = async () => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) {
        alert(`Failed to resend: ${error.message}`);
      } else {
        alert('Verification email sent!');
        await checkEmailVerificationStatus();
      }
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  useEffect(() => {
    if (showDebug) {
      checkEmailVerificationStatus();
    }
  }, [showDebug, email]);

  if (!showDebug) {
    return (
      <div className="mt-4 text-center">
        <button
          onClick={() => setShowDebug(true)}
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Having trouble? Show debug info
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Debug Information</h3>
        <button
          onClick={() => setShowDebug(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <XCircle size={20} />
        </button>
      </div>

      <div className="space-y-4">
        {/* Email Status */}
        <div className="flex items-center space-x-2">
          <Info size={16} className="text-blue-500" />
          <span className="text-sm font-medium">Email:</span>
          <span className="text-sm text-gray-600">{email}</span>
        </div>

        {/* Verification Status */}
        {debugInfo?.user && (
          <div className="flex items-center space-x-2">
            {debugInfo.user.email_confirmed_at ? (
              <CheckCircle size={16} className="text-green-500" />
            ) : (
              <AlertTriangle size={16} className="text-yellow-500" />
            )}
            <span className="text-sm font-medium">Email Confirmed:</span>
            <span className="text-sm text-gray-600">
              {debugInfo.user.email_confirmed_at ? 'Yes' : 'No'}
            </span>
            {debugInfo.user.email_confirmed_at && (
              <span className="text-xs text-gray-500">
                ({new Date(debugInfo.user.email_confirmed_at).toLocaleString()})
              </span>
            )}
          </div>
        )}

        {/* User Status */}
        {debugInfo?.user && (
          <div className="flex items-center space-x-2">
            <Info size={16} className="text-blue-500" />
            <span className="text-sm font-medium">User Status:</span>
            <span className="text-sm text-gray-600">
              {debugInfo.user.confirmed_at ? 'Confirmed' : 'Pending Confirmation'}
            </span>
          </div>
        )}

        {/* Environment Info */}
        <div className="text-xs text-gray-500 space-y-1">
          <div>Supabase URL: {debugInfo?.environment?.supabaseUrl ? '✓ Set' : '✗ Missing'}</div>
          <div>Anonymous Key: {debugInfo?.environment?.hasAnonKey ? '✓ Set' : '✗ Missing'}</div>
          <div>Timestamp: {debugInfo?.timestamp}</div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <button
            onClick={checkEmailVerificationStatus}
            disabled={isLoading}
            className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? 'Checking...' : 'Refresh Status'}
          </button>
          
          <button
            onClick={resendVerificationEmail}
            className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
          >
            Resend Email
          </button>
        </div>

        {/* Error Display */}
        {debugInfo?.error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
            <strong>Error:</strong> {debugInfo.error}
          </div>
        )}

        {/* Raw Debug Data */}
        <details className="text-xs">
          <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
            Show Raw Debug Data
          </summary>
          <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto max-h-40">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
} 