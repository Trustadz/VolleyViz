import React, { useState } from 'react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-900 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]"></div>
      
      <div className="w-full max-w-md px-6 z-10">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden p-8 md:p-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-lg mb-4 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-.46.04-.92.1-1.36.98 1.25 2.58 2.16 4.4 2.16 2.05 0 3.79-.9 4.9-2.25 1.1 1.35 2.85 2.25 4.9 2.25 1.82 0 3.42-.91 4.4-2.16.06.44.1.9.1 1.36 0 4.41-3.59 8-8 8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">VolleyViz <span className="text-blue-600">Pro</span></h1>
            <p className="text-slate-500 mt-2">Tactical Intelligence for Modern Coaches</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Account Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-slate-400"
                placeholder="coach@team.com"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-slate-400"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-600/20 transform active:scale-[0.98] transition-all mt-4"
            >
              Sign In
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-400 text-sm">
              Don't have an account? <a href="#" className="text-blue-600 font-bold hover:underline">Contact Admin</a>
            </p>
          </div>
        </div>
        
        <p className="mt-8 text-center text-slate-500 text-xs">
          &copy; 2025 VolleyViz Tactical Systems. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
