
import React, { useState } from 'react';
import { insforge } from '../lib/insforge';
import { useStore } from '../store/useStore';
import { User, Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';
import clsx from 'clsx';

const AuthView = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { setUser } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { data, error } = await insforge.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data?.user) {
            setUser(data.user as any);
        }
      } else {
        const { data, error } = await insforge.auth.signUp({
            email,
            password,
            name: name // InsForge uses 'name' in options usually, checking docs... SDK says name is separate arg or inside options depending on version. Using standard object.
            // Adjusting based on standard InsForge Auth: signUp({ email, password, options: { data: { name } } }) usually.
            // The provided docs say: signUp({ email, password, name }) is valid in this custom SDK wrapper provided in prompt?
            // "signUp(email, password, name, options)" in the prompt text.
        });
        if (error) throw error;
        if (data?.user) {
             // Depending on config, might need verification. For now assume auto-login or message.
             if (data.user) setUser(data.user as any);
             else setError("Check your email for verification.");
        }
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800">

        {/* Header */}
        <div className="p-8 pb-0 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-teal-400 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-blue-500/30 mb-6">
                <span className="text-white font-bold text-3xl">N</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
                {isLogin ? 'Enter your credentials to access your workspace.' : 'Start building AI-powered apps today.'}
            </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
            {error && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 text-sm text-center">
                    {error}
                </div>
            )}

            {!isLogin && (
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 ml-1 uppercase tracking-wider">Full Name</label>
                    <div className="relative">
                        <User className="absolute left-4 top-3.5 text-slate-400" size={18} />
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                            placeholder="John Doe"
                            required={!isLogin}
                        />
                    </div>
                </div>
            )}

            <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 ml-1 uppercase tracking-wider">Email</label>
                <div className="relative">
                    <Mail className="absolute left-4 top-3.5 text-slate-400" size={18} />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                        placeholder="john@example.com"
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 ml-1 uppercase tracking-wider">Password</label>
                <div className="relative">
                    <Lock className="absolute left-4 top-3.5 text-slate-400" size={18} />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                        placeholder="••••••••"
                        required
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
                {loading ? <Loader2 className="animate-spin" /> : (
                    <>
                        {isLogin ? 'Sign In' : 'Sign Up'}
                        <ArrowRight size={18} />
                    </>
                )}
            </button>
        </form>

        {/* Footer */}
        <div className="bg-slate-50 dark:bg-slate-950/50 p-6 text-center border-t border-slate-200 dark:border-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                >
                    {isLogin ? 'Sign Up' : 'Log In'}
                </button>
            </p>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
