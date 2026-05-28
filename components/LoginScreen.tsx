
import React, { useState } from 'react';
import TermsModal from './TermsModal';

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'huyetdao9999@gmail.com' && password === 'lovele123') {
      onLogin();
    } else {
      setError('Email hoặc mật khẩu không chính xác.');
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md p-8 space-y-8 bg-black/30 backdrop-blur-lg rounded-2xl shadow-2xl shadow-yellow-500/30 border border-yellow-500/40">
          <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mx-auto text-yellow-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12.6,2.09L3.5,6.63A2.5,2.5,0,0,0,2,8.91V15.09a2.5,2.5,0,0,0,1.5,2.28l9.1,4.54a2.5,2.5,0,0,0,2.5,0l9.1-4.54A2.5,2.5,0,0,0,22,15.09V8.91a2.5,2.5,0,0,0-1.5-2.28L13.9,2.09A2.5,2.5,0,0,0,12.6,2.09ZM19,10.15l-6,2.9v5.8L19,15.5Zm-8-1.5,6-3,6,3-6,2.9Z"/></svg>
              <h1 className="mt-4 text-3xl font-bold text-white">Chào mừng trở lại!</h1>
              <p className="mt-2 text-sm text-gray-300">Đăng nhập để tạo ảnh nghề nghiệp mơ ước của bạn.</p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="relative">
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="peer relative block w-full px-3 py-3 border border-yellow-500/30 bg-gray-900/50 placeholder-transparent text-white rounded-t-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-sm"
                  placeholder="Email: huyetdao9999@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                 <label htmlFor="email-address" className="absolute left-3 -top-2.5 text-yellow-400 text-xs transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-yellow-400 peer-focus:text-xs">Email</label>
              </div>
              <div className="relative">
                <input
                  id="password-input"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="peer relative block w-full px-3 py-3 border border-yellow-500/30 bg-gray-900/50 placeholder-transparent text-white rounded-b-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-sm"
                  placeholder="Mật khẩu: lovele 123"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label htmlFor="password-input" className="absolute left-3 -top-2.5 text-yellow-400 text-xs transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-yellow-400 peer-focus:text-xs">Mật khẩu</label>
              </div>

            <div className="flex items-center">
              <input
                id="terms-checkbox"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-yellow-500 bg-gray-700 border-gray-600 rounded focus:ring-yellow-600"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
              />
              <label htmlFor="terms-checkbox" className="ml-2 block text-sm text-gray-400">
                Tôi đồng ý với{' '}
                <button
                  type="button"
                  className="font-medium text-yellow-400 hover:text-yellow-300 underline"
                  onClick={() => setIsTermsModalOpen(true)}
                >
                  Điều khoản sử dụng
                </button>
              </label>
            </div>

            {error && <p className="text-red-400 text-sm text-center pt-2">{error}</p>}

            <div>
              <button
                type="submit"
                disabled={!termsAccepted}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-bold text-indigo-950 bg-yellow-400 hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-yellow-400/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-yellow-500 disabled:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              >
                Đăng nhập
              </button>
            </div>
          </form>
        </div>
      </div>
      <TermsModal isOpen={isTermsModalOpen} onClose={() => setIsTermsModalOpen(false)} />
    </>
  );
};

export default LoginScreen;
