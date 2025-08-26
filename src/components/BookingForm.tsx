import React, { useState } from 'react';
import { User, MapPin, Calendar, CreditCard, Check, AlertCircle } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_...');

interface BookingFormProps {
  packageData: {
    id: string;
    title: string;
    price: number;
    duration: number;
  };
  bookingDetails: {
    rooms: number;
    guests: number;
  };
  onSuccess: () => void;
  onCancel: () => void;
}

interface PersonalInfo {
  title: string;
  givenName: string;
  surname: string;
  countryOfResidence: string;
  nationality: string;
  birthDate: string;
  passportNumber: string;
  passportIssueCountry: string;
  passportIssueDate: string;
  passportExpirationDate: string;
  hasValidVisa: boolean;
  email: string;
  phone: string;
}

function PaymentForm({ 
  personalInfo, 
  packageData, 
  bookingDetails, 
  totalAmount, 
  onSuccess, 
  onError 
}: {
  personalInfo: PersonalInfo;
  packageData: any;
  bookingDetails: any;
  totalAmount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements || !user) {
      onError('Payment system not ready');
      return;
    }

    setIsProcessing(true);

    try {
      // Create booking with pending_payment status
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          package_id: packageData.id,
          user_id: user.id,
          customer_name: `${personalInfo.givenName} ${personalInfo.surname}`,
          customer_email: personalInfo.email,
          customer_phone: personalInfo.phone,
          number_of_rooms: bookingDetails.rooms,
          number_of_guests: bookingDetails.guests,
          total_amount: totalAmount,
          status: 'pending_payment',
          personal_info: personalInfo
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Create payment intent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: totalAmount * 100, // Convert to cents
          bookingId: booking.id,
          customerEmail: personalInfo.email
        }),
      });

      const { clientSecret } = await response.json();

      // Confirm payment
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error('Card element not found');

      const { error: paymentError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${personalInfo.givenName} ${personalInfo.surname}`,
            email: personalInfo.email,
          },
        },
      });

      if (paymentError) {
        onError(paymentError.message || 'Payment failed');
        return;
      }

      // Update booking status to confirmed
      await supabase
        .from('bookings')
        .update({ status: 'confirmed' })
        .eq('id', booking.id);

      onSuccess();
    } catch (error: any) {
      onError(error.message || 'Payment processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handlePayment} className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-2">Payment Details</h3>
        <div className="bg-white p-4 rounded border">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
              },
            }}
          />
        </div>
      </div>

      <div className="flex justify-between items-center text-lg font-semibold">
        <span>Total Amount:</span>
        <span className="text-emerald-600">${totalAmount.toLocaleString()}</span>
      </div>

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Processing Payment...
          </>
        ) : (
          <>
            <CreditCard className="mr-2" size={20} />
            Pay ${totalAmount.toLocaleString()}
          </>
        )}
      </button>
    </form>
  );
}

export default function BookingForm({ packageData, bookingDetails, onSuccess, onCancel }: BookingFormProps) {
  const { user } = useAuth();
  const [step, setStep] = useState<'personal' | 'payment' | 'success'>('personal');
  const [error, setError] = useState('');
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    title: '',
    givenName: '',
    surname: '',
    countryOfResidence: '',
    nationality: '',
    birthDate: '',
    passportNumber: '',
    passportIssueCountry: '',
    passportIssueDate: '',
    passportExpirationDate: '',
    hasValidVisa: false,
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const totalAmount = packageData.price * bookingDetails.guests;

  const validatePersonalInfo = () => {
    const required = [
      'title', 'givenName', 'surname', 'countryOfResidence', 'nationality',
      'birthDate', 'passportNumber', 'passportIssueCountry', 
      'passportIssueDate', 'passportExpirationDate', 'email', 'phone'
    ];

    for (const field of required) {
      if (!personalInfo[field as keyof PersonalInfo]) {
        setError(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }

    // Validate dates
    const birthDate = new Date(personalInfo.birthDate);
    const issueDate = new Date(personalInfo.passportIssueDate);
    const expirationDate = new Date(personalInfo.passportExpirationDate);
    const today = new Date();

    if (birthDate >= today) {
      setError('Birth date must be in the past');
      return false;
    }

    if (expirationDate <= today) {
      setError('Passport must not be expired');
      return false;
    }

    if (issueDate >= expirationDate) {
      setError('Passport issue date must be before expiration date');
      return false;
    }

    setError('');
    return true;
  };

  const handlePersonalInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePersonalInfo()) {
      setStep('payment');
    }
  };

  const handlePaymentSuccess = () => {
    setStep('success');
    setTimeout(() => {
      onSuccess();
    }, 3000);
  };

  if (step === 'success') {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="text-green-600" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
        <p className="text-gray-600 mb-4">
          Your payment has been processed successfully. You will receive a confirmation email shortly.
        </p>
        <div className="animate-pulse text-sm text-gray-500">
          Redirecting to your bookings...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            step === 'personal' ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-600'
          }`}>
            <User size={16} />
          </div>
          <div className={`h-1 w-16 ${step === 'payment' || step === 'success' ? 'bg-emerald-600' : 'bg-gray-200'}`}></div>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            step === 'payment' ? 'bg-emerald-600 text-white' : 
            step === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-200 text-gray-400'
          }`}>
            <CreditCard size={16} />
          </div>
          <div className={`h-1 w-16 ${step === 'success' ? 'bg-emerald-600' : 'bg-gray-200'}`}></div>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            step === 'success' ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-400'
          }`}>
            <Check size={16} />
          </div>
        </div>
      </div>

      {step === 'personal' && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="text-red-600 mr-2" size={20} />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          <form onSubmit={handlePersonalInfoSubmit} className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                <select
                  required
                  value={personalInfo.title}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Select Title</option>
                  <option value="Mr">Mr</option>
                  <option value="Ms">Ms</option>
                  <option value="Mrs">Mrs</option>
                  <option value="Dr">Dr</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Given Name *</label>
                <input
                  type="text"
                  required
                  value={personalInfo.givenName}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, givenName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Surname *</label>
                <input
                  type="text"
                  required
                  value={personalInfo.surname}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, surname: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country of Residence *</label>
                <input
                  type="text"
                  required
                  value={personalInfo.countryOfResidence}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, countryOfResidence: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nationality *</label>
                <input
                  type="text"
                  required
                  value={personalInfo.nationality}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, nationality: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Birth Date *</label>
              <input
                type="date"
                required
                value={personalInfo.birthDate}
                onChange={(e) => setPersonalInfo({ ...personalInfo, birthDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Passport Number *</label>
                <input
                  type="text"
                  required
                  value={personalInfo.passportNumber}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, passportNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Passport Issue Country *</label>
                <input
                  type="text"
                  required
                  value={personalInfo.passportIssueCountry}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, passportIssueCountry: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Passport Issue Date *</label>
                <input
                  type="date"
                  required
                  value={personalInfo.passportIssueDate}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, passportIssueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Passport Expiration Date *</label>
                <input
                  type="date"
                  required
                  value={personalInfo.passportExpirationDate}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, passportExpirationDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  required
                  value={personalInfo.email}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                <input
                  type="tel"
                  required
                  value={personalInfo.phone}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="hasValidVisa"
                checked={personalInfo.hasValidVisa}
                onChange={(e) => setPersonalInfo({ ...personalInfo, hasValidVisa: e.target.checked })}
                className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
              />
              <label htmlFor="hasValidVisa" className="text-sm font-medium text-gray-700">
                Do you have a valid visa?
              </label>
            </div>

            <div className="flex justify-between pt-6">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Continue to Payment
              </button>
            </div>
          </form>
        </div>
      )}

      {step === 'payment' && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Information</h2>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="text-red-600 mr-2" size={20} />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          <Elements stripe={stripePromise}>
            <PaymentForm
              personalInfo={personalInfo}
              packageData={packageData}
              bookingDetails={bookingDetails}
              totalAmount={totalAmount}
              onSuccess={handlePaymentSuccess}
              onError={setError}
            />
          </Elements>

          <button
            onClick={() => setStep('personal')}
            className="mt-4 text-emerald-600 hover:text-emerald-700 font-medium"
          >
            ← Back to Personal Information
          </button>
        </div>
      )}
    </div>
  );
}