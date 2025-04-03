'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function SignUpVerify() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('All fields are required');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Invalid email address');
      return false;
    }
    return true;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validateForm()) return;
    setLoading(true);
    try {
      const response = await fetch('/api/auth/sign-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, username: formData.username, email: formData.email, password: formData.password })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Sign-up failed');
      setSuccess('Verification code sent! Check your email.');
      setIsVerifying(true);
      setCountdown(300); // Example: 5-minute countdown for verification
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-up failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!verificationCode.trim()) {
      setError('Please enter the verification code');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, verifyCode: verificationCode })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Verification failed');
      setSuccess('Account verified! Redirecting...');
      setTimeout(() => router.push('/sign-in'), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-md w-full space-y-6 bg-white p-8 shadow-lg rounded-2xl">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          {isVerifying ? 'Verify Your Account' : 'Create Your Account'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href="/sign-in" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in to your account
            </Link>
          </p>
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-red-50 border-l-4 border-red-400 p-4 text-red-700 rounded-md">
            {error}
          </motion.div>
        )}
        {success && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-green-50 border-l-4 border-green-400 p-4 text-green-700 rounded-md">
            {success}
          </motion.div>
        )}
        
        {!isVerifying ? (
          <form className="space-y-4" onSubmit={handleSignUp}>
            {[ 'name', 'username', 'email', 'password', 'confirmPassword'].map((field) => (
              <motion.input key={field} 
                type={field.includes('assword') ? 'password' : 'text'} 
                name={field} 
                placeholder={field === 'confirmPassword' ? 'Confirm Password' : field.charAt(0).toUpperCase() + field.slice(1)} 
                value={formData[field as keyof typeof formData]} 
                onChange={handleChange} 
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
                whileFocus={{ scale: 1.05 }} 
                whileHover={{ scale: 1.02 }}
              />
            ))}
            <button type="submit" disabled={loading} className="w-full flex items-center justify-center py-3 bg-blue-600 text-white rounded-md">
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Sign Up'}
            </button>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={handleVerify}>
            <motion.input 
              type="text" 
              name="verificationCode" 
              placeholder="6-digit verification code" 
              value={verificationCode} 
              onChange={(e) => setVerificationCode(e.target.value)} 
              maxLength={6} 
              className="w-full p-3 border border-gray-300 rounded-md"
              whileFocus={{ scale: 1.05 }} 
              whileHover={{ scale: 1.02 }}
            />
            <button type="submit" disabled={loading} className="w-full flex items-center justify-center py-3 bg-blue-600 text-white rounded-md">
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Verify Account'}
            </button>
            {countdown > 0 && <motion.div className="text-center text-sm text-gray-500 mt-4">Time left: {countdown}s</motion.div>}
          </form>
        )}
      </motion.div>
    </div>
  );
}
