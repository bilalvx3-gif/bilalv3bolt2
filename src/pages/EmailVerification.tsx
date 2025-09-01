import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import EmailVerificationDebug from '../components/EmailVerificationDebug';
import { useAuth } from '../contexts/AuthContext';

export default function EmailVerification() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { markEmailVerified } = useAuth();
  const [status, setStatus] = useState<'pending' | 'verified' | 'error'>('pending');
  const [isResending, setIsResending] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }

    // Check if user is coming from email verification link
    const handleEmailConfirmation = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (data.session && data.session.user.email_confirmed_at) {
        setStatus('verified');
        setMessage('Email verified successfully! Redirecting to dashboard...');
        await markEmailVerified();
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    };

    handleEmailConfirmation();
  }, [searchParams, navigate]);

  const handleResendEmail = async () => {
    if (!email) {
      setMessage('Please provide your email address');
      return;
    }

    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) {
        setMessage('Failed to resend verification email. Please try again.');
      } else {
        setMessage('Verification email sent! Please check your inbox.');
      }
    } catch (_error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              {status === 'verified' ? (
                <CheckCircle className="text-white" size={32} />
              ) : status === 'error' ? (
                <AlertCircle className="text-white" size={32} />
              ) : (
                <Mail className="text-white" size={32} />
              )}
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              {status === 'verified' ? 'Email Verified!' : 'Verify Your Email'}
            </h2>
            <p className="text-gray-600 mt-2">
              {status === 'verified' 
                ? 'Your email has been successfully verified.'
                : 'We\'ve sent a verification link to your email address.'
              }
            </p>
          </div>

          {status === 'pending' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="animate-pulse">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="text-emerald-600" size={24} />
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  Please check your email and click the verification link to continue.
                </p>
                {email && (
                  <p className="text-sm text-gray-500 mb-4">
                    Verification email sent to: <strong>{email}</strong>
                  </p>
                )}
              </div>

              <div className="space-y-4">
                {!email && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Enter your email"
                    />
                  </div>
                )}

                <button
                  onClick={handleResendEmail}
                  disabled={isResending || !email}
                  className="w-full flex items-center justify-center space-x-2 bg-emerald-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isResending ? (
                    <>
                      <RefreshCw className="animate-spin" size={18} />
                      <span>Resending...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw size={18} />
                      <span>Resend Verification Email</span>
                    </>
                  )}
                </button>
              </div>

              {message && (
                <div className={`text-sm p-3 rounded-lg ${
                  message.includes('sent') || message.includes('successfully')
                    ? 'bg-green-50 text-green-700'
                    : 'bg-red-50 text-red-700'
                }`}>
                  {message}
                </div>
              )}

              {/* Debug Component */}
              {email && <EmailVerificationDebug email={email} />}
            </div>
          )}

          {status === 'verified' && (
            <div className="text-center">
              <div className="animate-bounce">
                <CheckCircle className="text-green-500 mx-auto mb-4" size={48} />
              </div>
              <p className="text-green-700 mb-4">{message}</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-emerald-600 h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Need help?{' '}
              <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-semibold">
                Back to Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}