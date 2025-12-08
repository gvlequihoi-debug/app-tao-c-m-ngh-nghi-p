
import React, { useState } from 'react';

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'huyetdao9999@gmail.com' && password === 'lovele 123') {
      onLogin();
    } else {
      setError('Email hoặc mật khẩu không chính xác.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl">
        <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mx-auto text-indigo-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12.6,2.09L3.5,6.63A2.5,2.5,0,0,0,2,8.91V15.09a2.5,2.5,0,0,0,1.5,2.28l9.1,4.54a2.5,2.5,0,0,0,2.5,0l9.1-4.54A2.5,2.5,0,0,0,22,15.09V8.91a2.5,2.5,0,0,0-1.5-2.28L13.9,2.09A2.5,2.5,0,0,0,12.6,2.09ZM19,10.15l-6,2.9v5.8L19,15.5Zm-8-1.5,6-3,6,3-6,2.9Z"/></svg>
            <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">Chào mừng trở lại!</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Đăng nhập để tạo ảnh nghề nghiệp mơ ước của bạn.</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email: huyetdao9999@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password-input" className="sr-only">Mật khẩu</label>
              <input
                id="password-input"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Mật khẩu: lovele 123"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-xs text-center">{error}</p>}

          <div>
            <button type="submit" className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-indigo-500">
              Đăng nhập
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;
