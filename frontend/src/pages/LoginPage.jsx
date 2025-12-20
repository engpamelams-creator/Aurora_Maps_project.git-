import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Lock, ArrowRight, Loader2, Sparkles } from 'lucide-react';

const LoginPage = () => {
    const { login, register } = useAuth(); // Destructure register
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Falha no login. Verifique suas credenciais.');
            setLoading(false);
        }
    };

    const handleRecruiterLogin = async () => {
        setError('');
        setLoading(true);
        const demoEmail = 'recruiter@aurora.com';
        const demoPass = 'password';

        setEmail(demoEmail);
        setPassword(demoPass);

        try {
            // Try to login first
            await login(demoEmail, demoPass);
            navigate('/');
        } catch (err) {
            console.log("Login failed, attempting auto-registration for demo...");
            // Login failed (likely 422/User not found), so let's register
            try {
                await register('Recrutador Aurora', demoEmail, demoPass, demoPass);
                navigate('/');
            } catch (regErr) {
                setError("Erro ao criar conta demo. Tente manualmente.");
                setLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4">

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl"
            >
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-2 font-display">
                        Mapas da Aurora
                    </h1>
                    <p className="text-slate-400">Entre para explorar o universo.</p>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-200 text-sm rounded-xl text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">Email</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={20} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all hover:bg-slate-900/70"
                                placeholder="seu@email.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">Senha</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={20} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all hover:bg-slate-900/70"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <>Entrar na Aurora <ArrowRight size={18} /></>}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-white/5 flex flex-col gap-4">
                    <button
                        onClick={handleRecruiterLogin}
                        className="w-full py-2.5 rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm font-medium hover:bg-purple-500/20 hover:border-purple-500/50 transition-all flex items-center justify-center gap-2 group"
                    >
                        <Sparkles size={16} className="text-purple-400 group-hover:text-purple-200" />
                        Acesso Recrutador (Demo)
                    </button>

                    <p className="text-center text-slate-500 text-sm">
                        Não tem uma conta?{' '}
                        <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
                            Criar conta
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
