import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Mail, Lock, User, KeyRound, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  
  // Modes: 'login', 'register', 'forgot'
  const [mode, setMode] = useState('login');
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('farmer'); // admin, farmer
  
  // Interface state
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await login(email, password);
        if (res.success) {
          setSuccessMsg('Session Authorized! Redirecting...');
          setTimeout(() => navigate('/'), 1200);
        } else {
          setErrorMsg(res.message);
        }
      } else if (mode === 'register') {
        const res = await register(name, email, password);
        if (res.success) {
          setSuccessMsg('Operator Registered successfully! You can now log in.');
          setMode('login');
          setPassword('');
        } else {
          setErrorMsg(res.message);
        }
      } else {
        // Forgot Password Mock
        setTimeout(() => {
          setSuccessMsg('Credential recovery link dispatched to registered email.');
          setMode('login');
        }, 1500);
      }
    } catch (err) {
      setErrorMsg('Operation failed. Please verify API server link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1118] flex items-center justify-center p-4 relative overflow-hidden tech-grid">
      
      {/* Immersive Glowing Circles in Background */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-emerald-500/10 blur-[120px] animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[#4CAF50]/10 blur-[150px] animate-glow"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="glass-card rounded-3xl p-8 border border-white/10 relative overflow-hidden shadow-2xl">
          
          {/* Top Decorative Scanning Line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent animate-pulse"></div>

          {/* Logo Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="p-3 bg-[#2E7D32]/20 border border-[#4CAF50]/40 rounded-2xl mb-4 relative shadow-[0_0_20px_rgba(76,175,80,0.15)]">
              <Shield className="w-8 h-8 text-[#4CAF50]" />
              <span className="absolute inset-0 rounded-2xl border border-emerald-400/30 animate-ping opacity-70"></span>
            </div>
            <h2 className="text-2xl font-black tracking-wider text-white">CHITTI 4.0</h2>
            <p className="text-xs text-slate-400 font-semibold tracking-widest mt-1 uppercase">Agricultural IoT Securi-Net</p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: mode === 'register' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: mode === 'register' ? -20 : 20 }}
              transition={{ duration: 0.3 }}
            >
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Error Banner */}
                {errorMsg && (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Success Banner */}
                {successMsg && (
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>{successMsg}</span>
                  </div>
                )}

                {/* Registration Operator Name */}
                {mode === 'register' && (
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400 font-bold tracking-wide">Operator Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                      <input 
                        type="text" 
                        required
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 bg-slate-900 border border-white/5 focus:border-[#4CAF50]/30 rounded-xl focus:outline-none text-white text-sm focus:ring-1 focus:ring-[#4CAF50]/30 transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-bold tracking-wide">Registered Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                    <input 
                      type="email" 
                      required
                      placeholder="operator@chitti-iot.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-2.5 bg-slate-900 border border-white/5 focus:border-[#4CAF50]/30 rounded-xl focus:outline-none text-white text-sm focus:ring-1 focus:ring-[#4CAF50]/30 transition-all"
                    />
                  </div>
                </div>

                {/* Password Input */}
                {mode !== 'forgot' && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs text-slate-400 font-bold tracking-wide">Access Password</label>
                      {mode === 'login' && (
                        <button 
                          type="button"
                          onClick={() => setMode('forgot')}
                          className="text-xs text-slate-400 hover:text-emerald-400 font-semibold cursor-pointer"
                        >
                          Forgot Key?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                      <input 
                        type="password" 
                        required
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 bg-slate-900 border border-white/5 focus:border-[#4CAF50]/30 rounded-xl focus:outline-none text-white text-sm focus:ring-1 focus:ring-[#4CAF50]/30 transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* Registration Role Selection */}
                {mode === 'register' && (
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400 font-bold tracking-wide">Assigned Network Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-white/5 focus:border-[#4CAF50]/30 rounded-xl focus:outline-none text-white text-sm focus:ring-1 focus:ring-[#4CAF50]/30 transition-all"
                    >
                      <option value="farmer">Farmer Operator (Field Manager)</option>
                      <option value="admin">Administrator (Full Access)</option>
                    </select>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] hover:from-[#338e38] hover:to-[#57c25c] text-white font-bold text-sm rounded-xl transition-all shadow-[0_4px_15px_rgba(76,175,80,0.25)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4" />
                      <span>
                        {mode === 'login' ? 'Authorize Session' : mode === 'register' ? 'Register Credentials' : 'Send Recovery Token'}
                      </span>
                    </>
                  )}
                </button>

              </form>
            </motion.div>
          </AnimatePresence>

          {/* Toggle modes */}
          <div className="mt-6 border-t border-white/5 pt-4 text-center">
            {mode === 'login' && (
              <p className="text-xs text-slate-400 font-medium">
                New operator terminal?{' '}
                <button 
                  onClick={() => setMode('register')} 
                  className="text-emerald-400 hover:text-emerald-300 font-bold cursor-pointer"
                >
                  Create credentials
                </button>
              </p>
            )}

            {mode === 'register' && (
              <p className="text-xs text-slate-400 font-medium">
                Already registered?{' '}
                <button 
                  onClick={() => setMode('login')} 
                  className="text-emerald-400 hover:text-emerald-300 font-bold cursor-pointer"
                >
                  Sign in
                </button>
              </p>
            )}

            {mode === 'forgot' && (
              <p className="text-xs text-slate-400 font-medium">
                Remember your password?{' '}
                <button 
                  onClick={() => setMode('login')} 
                  className="text-emerald-400 hover:text-emerald-300 font-bold cursor-pointer"
                >
                  Back to Sign In
                </button>
              </p>
            )}
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default Login;
