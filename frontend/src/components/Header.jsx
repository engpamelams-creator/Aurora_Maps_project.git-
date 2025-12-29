import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Search, Plus, Sun, Moon, Map, ArrowRight, Activity } from "lucide-react";
import { getMaps } from "@/features/maps/services/mapService";
import { logSearch } from "../services/analyticsService";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { useAuth } from "../context/AuthContext";

export function Header({ onCreateClick }) {
    // Auth debug
    const authContext = useAuth();
    console.log("Header AuthContext:", authContext);

    if (!authContext) {
        console.error("AuthContext is missing in Header! Check provider.");
        return null;
    }

    const { isAuthenticated, user, logout } = authContext;


    // Force Dark Mode
    useEffect(() => {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
    }, []);

    const [commandOpen, setCommandOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [allMaps, setAllMaps] = useState([]);

    // Scroll Hooks
    const { scrollY } = useScroll();
    const headerHeight = useTransform(scrollY, [0, 50], [80, 64]);
    const headerBackground = useTransform(
        scrollY,
        [0, 50],
        ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.05)"]
    );
    const backdropBlur = useTransform(scrollY, [0, 50], ["blur(0px)", "blur(12px)"]);

    const navigate = useNavigate();

    // Effect: Keyboard Shortcuts (Cmd+K)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setCommandOpen((open) => !open);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Effect: Fetch Maps for Search
    useEffect(() => {
        if (commandOpen && allMaps.length === 0) {
            getMaps().then(setAllMaps).catch(console.error);
        }
    }, [commandOpen, allMaps]);

    // Effect: Analytics (Debounced)
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (query.trim().length > 2) {
                logSearch(query);
            }
        }, 1500);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    // Effect: Filter Results
    useEffect(() => {
        if (!query) {
            setResults([]);
            return;
        }
        const lowerQuery = query.toLowerCase();
        const filtered = allMaps.filter((map) =>
            map.name.toLowerCase().includes(lowerQuery) ||
            (map.description && map.description.toLowerCase().includes(lowerQuery))
        );
        setResults(filtered);
    }, [query, allMaps]);

    const handleSelectMap = (id) => {
        navigate(`/map/${id}`);
        setCommandOpen(false);
        setQuery("");
    };

    return (
        <>
            <motion.nav
                style={{
                    height: headerHeight,
                    backgroundColor: headerBackground,
                    backdropFilter: backdropBlur,
                }}
                className="sticky top-0 z-50 border-b border-white/5 flex items-center transition-colors duration-500"
            >
                <div className="mx-auto w-full max-w-7xl px-4 flex items-center justify-between gap-4">
                    {/* Brand */}
                    <div
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => navigate('/')}
                    >
                        <motion.div
                            whileHover={{ rotate: 10, scale: 1.1 }}
                            className="h-10 w-10 md:h-12 md:w-12 flex items-center justify-center relative"
                        >
                            {/* Inner Glow */}
                            <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <img
                                src="/aurora-logo.png"
                                alt="Aurora Maps Logo"
                                className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(34,211,238,0.6)] group-hover:drop-shadow-[0_0_15px_rgba(34,211,238,0.9)] transition-all duration-300"
                            />
                        </motion.div>
                        <span className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-white hidden sm:block tracking-tight">
                            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent font-bold">
                                Aurora
                            </span>{" "}
                            Maps
                        </span>
                    </div>

                    {/* Command Bar Trigger */}
                    <button
                        onClick={() => setCommandOpen(true)}
                        className="hidden md:flex flex-1 max-w-md items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 border border-transparent dark:border-white/5 text-slate-500 dark:text-slate-400 hover:ring-2 hover:ring-cyan-400/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group backdrop-blur-sm"
                    >
                        <Search size={16} className="group-hover:text-cyan-400 transition-colors" />
                        <span className="font-medium">Buscar mapas...</span>
                        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-1.5 font-mono text-[10px] font-medium text-slate-600 dark:text-slate-400 opacity-100">
                            <span className="text-xs">⌘</span>K
                        </kbd>
                    </button>

                    {/* Mobile Search Icon */}
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="md:hidden p-2 text-slate-400"
                        onClick={() => setCommandOpen(true)}
                    >
                        <Search size={22} />
                    </motion.button>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        {/* Theme Toggle Removed */}

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/pulse')}
                            className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 text-white font-medium hover:bg-slate-700 hover:text-cyan-400 transition-colors border border-white/5"
                        >
                            <Activity size={18} />
                            <span>Pulse</span>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onCreateClick}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-600 text-white font-semibold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-shadow"
                        >
                            <Plus size={18} />
                            <span className="hidden sm:inline">Criar Mapa</span>
                        </motion.button>

                        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>

                        {isAuthenticated && user ? (
                            <div className="relative group">
                                <button className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                    <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-500 p-[2px]">
                                        <div className="h-full w-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center font-bold text-xs">
                                            {user.name?.charAt(0)}
                                        </div>
                                    </div>
                                    <span className="text-sm font-medium hidden md:block text-slate-700 dark:text-slate-200 max-w-[100px] truncate">{user.name}</span>
                                </button>
                                {/* Dropdown */}
                                <div className="absolute right-0 top-full mt-2 w-48 py-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform translate-y-2 group-hover:translate-y-0 z-50">
                                    <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800 mb-2">
                                        <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Conta</p>
                                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user.email}</p>
                                    </div>
                                    <button onClick={() => navigate('/profile')} className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                        Meu Perfil
                                    </button>
                                    <button onClick={() => navigate('/my-maps')} className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                        Meus Mapas
                                    </button>
                                    <button onClick={() => navigate('/favorites')} className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                        Meus Favoritos
                                    </button>
                                    <button onClick={() => navigate('/gallery')} className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                        Galeria de Fotos
                                    </button>
                                    <button onClick={() => navigate('/recommendations')} className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                        Recomendações
                                    </button>
                                    <div className="h-px bg-slate-200 dark:bg-slate-800 my-1"></div>
                                    <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                        Sair
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/login')}
                                className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-medium hover:ring-2 hover:ring-indigo-500/50 transition-all border border-transparent dark:border-white/5"
                            >
                                Entrar
                            </motion.button>
                        )}
                    </div>
                </div>
            </motion.nav>

            {/* Command Palette Modal */}
            <AnimatePresence>
                {commandOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm flex items-start justify-center pt-[15vh] px-4"
                        onClick={() => setCommandOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: -20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: -20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-4xl flex flex-col rounded-2xl bg-white dark:bg-[#0f172a] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
                        >
                            {/* Input Header */}
                            <div className="flex items-center px-4 py-4 border-b border-slate-200 dark:border-slate-800 gap-3">
                                <Search className="text-slate-400" size={20} />
                                <input
                                    autoFocus
                                    placeholder="O que você está procurando?"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    className="flex-1 bg-transparent border-none focus:outline-none text-lg text-slate-900 dark:text-white placeholder:text-slate-400"
                                />
                                <div className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs text-slate-500 font-medium">
                                    ESC
                                </div>
                            </div>

                            {/* Content Grid */}
                            <div className="flex flex-col md:grid md:grid-cols-2 h-[500px]">
                                {/* Left: Results List */}
                                <div className="overflow-y-auto border-r border-slate-200 dark:border-slate-800 p-2 scrollbar-hide">
                                    {query === "" && (
                                        <div className="p-4 text-sm text-slate-500 dark:text-slate-400">
                                            <p className="font-semibold mb-2 text-xs uppercase tracking-wider opacity-70">Sugestões</p>
                                            <div className="space-y-1">
                                                {allMaps.slice(0, 3).map(map => (
                                                    <div
                                                        key={map.id}
                                                        onClick={() => handleSelectMap(map.id)}
                                                        className="flex items-center justify-between px-3 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors group"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                                                                <Map size={16} />
                                                            </div>
                                                            <span className="text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white font-medium">{map.name}</span>
                                                        </div>
                                                        <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {query !== "" && results.length > 0 && (
                                        <div className="space-y-1">
                                            {results.map((map) => (
                                                <div
                                                    key={map.id}
                                                    onClick={() => handleSelectMap(map.id)}
                                                    className="flex items-center justify-between px-3 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-cyan-500/10 cursor-pointer transition-colors group"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 group-hover:text-cyan-500 transition-colors">
                                                            <Map size={16} />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-slate-900 dark:text-white font-medium">{map.name}</span>
                                                            {map.description && (
                                                                <span className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{map.description}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 text-cyan-500 transition-opacity" />
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {query !== "" && results.length === 0 && (
                                        <div className="py-12 flex flex-col items-center justify-center text-center text-slate-500 h-full">
                                            <Search size={48} className="opacity-20 mb-4" />
                                            <p className="text-lg font-medium">Nenhum mapa encontrado</p>
                                        </div>
                                    )}
                                </div>

                                {/* Right: Mini Map Preview */}
                                <div className="hidden md:block h-full w-full bg-slate-100 dark:bg-slate-900 relative">
                                    <MapContainer center={[-14.235, -51.9253]} zoom={3} className="h-full w-full z-10" attributionControl={false} zoomControl={false}>
                                        <TileLayer
                                            url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
                                        />
                                        {results.map((map) => (
                                            map.latitude && map.longitude && (
                                                <Marker
                                                    key={map.id}
                                                    position={[map.latitude, map.longitude]}
                                                    eventHandlers={{
                                                        click: () => handleSelectMap(map.id),
                                                    }}
                                                />
                                            )
                                        ))}
                                    </MapContainer>
                                    <div className="absolute bottom-4 right-4 z-20 bg-black/50 text-white text-[10px] px-2 py-1 rounded backdrop-blur-md pointer-events-none">
                                        Visualização Global
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between text-xs text-slate-500">
                                <div className="flex gap-4">
                                    <span><strong>↑↓</strong> navegar</span>
                                    <span><strong>↵</strong> selecionar</span>
                                </div>
                                <span className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                    Analytics Active
                                </span>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
