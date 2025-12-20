import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { AuroraBackground } from '../components/AuroraBackground';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

const RegisterPage = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.password_confirmation) {
            return setError('As senhas não conferem.');
        }

        setLoading(true);
        try {
            await register(formData.name, formData.email, formData.password, formData.password_confirmation);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Falha no cadastro. Verifique os dados.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4">
            <AuroraBackground />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl"
            >
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-white mb-2 font-display">
                        Junte-se à <span className="text-cyan-400">Aurora</span>
                    </h1>
                    <p className="text-slate-400">Comece sua jornada cartográfica hoje.</p>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-200 text-sm rounded-xl text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-300 ml-1 uppercase tracking-wide">Nome</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={20} />
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all"
                                placeholder="Seu nome completo"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-300 ml-1 uppercase tracking-wide">Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={20} />
                            <input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all"
                                placeholder="seu@email.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-slate-300 ml-1 uppercase tracking-wide">Senha</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={20} />
                                <input
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all"
                                    placeholder="••••••"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-slate-300 ml-1 uppercase tracking-wide">Confirmar</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={20} />
                                <input
                                    name="password_confirmation"
                                    type="password"
                                    value={formData.password_confirmation}
                                    onChange={handleChange}
                                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all"
                                    placeholder="••••••"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-6 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <>Criar Conta <ArrowRight size={18} /></>}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-white/5 text-center">
                    <p className="text-slate-500 text-sm">
                        Já tem uma conta?{' '}
                        <Link to="/login" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
                            Fazer Login
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default RegisterPage;
