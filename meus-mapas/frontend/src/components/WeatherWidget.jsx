import React, { useState, useEffect } from 'react';
import { CloudRain, Sun, Wind, Droplets, MapPin, Check, X, Cloud, CloudLightning, CloudSnow } from 'lucide-react';

export const WeatherWidget = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [location, setLocation] = useState({
        city: 'São Bernardo do Campo',
        state: 'SP',
        country: 'Brasil'
    });
    const [tempLocation, setTempLocation] = useState(location);
    const [weatherData, setWeatherData] = useState({
        temp: 28,
        description: 'Ensolarado',
        wind: 12,
        humidity: 84,
        icon: Sun,
        iconColor: 'text-amber-400'
    });
    const [loading, setLoading] = useState(false);

    const getWeatherIcon = (code) => {
        // WMO Weather interpretation codes (ww)
        if (code === 0) return { icon: Sun, color: 'text-amber-400', label: 'Céu Limpo' };
        if (code >= 1 && code <= 3) return { icon: Cloud, color: 'text-gray-400', label: 'Nublado' };
        if ([45, 48].includes(code)) return { icon: Wind, color: 'text-slate-400', label: 'Nevoeiro' };
        if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return { icon: CloudRain, color: 'text-blue-400', label: 'Chuva' };
        if ([71, 73, 75, 77, 85, 86].includes(code)) return { icon: CloudSnow, color: 'text-white', label: 'Neve' };
        if ([95, 96, 99].includes(code)) return { icon: CloudLightning, color: 'text-yellow-400', label: 'Tempestade' };
        return { icon: Sun, color: 'text-amber-400', label: 'Ensolarado' };
    };

    const fetchWeather = async (cityQuery) => {
        setLoading(true);
        try {
            // 1. Geocoding
            const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityQuery)}&count=1&language=pt&format=json`);
            const geoData = await geoRes.json();

            if (!geoData.results || geoData.results.length === 0) {
                alert('Cidade não encontrada');
                setLoading(false);
                return;
            }

            const { latitude, longitude, name, admin1, country } = geoData.results[0];

            // Update Location Display with verified data
            setLocation({
                city: name,
                state: admin1 || '',
                country: country || ''
            });

            // 2. Weather Data
            const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`);
            const data = await weatherRes.json();

            const current = data.current;
            const weatherInfo = getWeatherIcon(current.weather_code);

            setWeatherData({
                temp: Math.round(current.temperature_2m),
                description: weatherInfo.label,
                wind: Math.round(current.wind_speed_10m),
                humidity: current.relative_humidity_2m,
                icon: weatherInfo.icon,
                iconColor: weatherInfo.color
            });

        } catch (error) {
            console.error("Error fetching weather:", error);
            alert("Erro ao buscar clima.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Initial fetch
        fetchWeather(`${location.city}`);
    }, []);

    const handleSave = () => {
        setIsEditing(false);
        // Trigger fetch with new city
        fetchWeather(tempLocation.city);
    };

    const WeatherIcon = weatherData.icon;

    return (
        <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 p-5 rounded-2xl mb-6 text-white font-sans relative overflow-hidden group transition-all duration-300 hover:border-cyan-500/30">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/20 blur-[50px] rounded-full group-hover:bg-cyan-400/30 transition-colors" />

            {isEditing ? (
                <div className="relative z-10 space-y-2 animate-in fade-in zoom-in duration-200">
                    <input
                        type="text"
                        value={tempLocation.city}
                        onChange={(e) => setTempLocation({ ...tempLocation, city: e.target.value })}
                        className="w-full bg-slate-800/80 border border-white/20 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-cyan-400"
                        placeholder="Cidade (ex: São Paulo)"
                        onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                        autoFocus
                    />
                    {/* Simplified editing for API ease - standard API relies heavily on City Name */}
                    <div className="text-[10px] text-slate-500 italic">* Digite o nome da cidade e pressione Enter para buscar</div>

                    <div className="flex gap-2 mt-2">
                        <button onClick={handleSave} className="flex-1 bg-green-500/20 hover:bg-green-500/40 text-green-400 py-1 rounded flex items-center justify-center gap-1 transition-colors">
                            <Check size={14} /> Buscar
                        </button>
                        <button onClick={() => setIsEditing(false)} className="flex-1 bg-red-500/20 hover:bg-red-500/40 text-red-400 py-1 rounded flex items-center justify-center gap-1 transition-colors">
                            <X size={14} /> Cancelar
                        </button>
                    </div>
                </div>
            ) : (
                <div
                    className="flex justify-between items-start mb-4 relative z-10 cursor-pointer"
                    onClick={() => { setTempLocation(location); setIsEditing(true); }}
                    title="Clique para alterar cidade"
                >
                    <div className="group-hover:translate-x-1 transition-transform">
                        <h4 className="text-sm font-uppercase tracking-wider text-slate-400 flex items-center gap-1 hover:text-cyan-400 transition-colors">
                            {loading ? 'Buscando...' : `${location.city}, ${location.state}`}
                            {!loading && <MapPin size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-cyan-500" />}
                        </h4>
                        <span className="text-[10px] text-slate-600 uppercase tracking-widest">{location.country}</span>
                        <div className="mt-1">
                            <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-300">
                                {loading ? '--' : `${weatherData.temp}°C`}
                            </span>
                        </div>
                    </div>
                    {loading ? (
                        <div className="w-8 h-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
                    ) : (
                        <WeatherIcon className={`${weatherData.iconColor} animate-spin-slow group-hover:scale-110 transition-transform`} size={32} />
                    )}
                </div>
            )}

            <div className="flex justify-between text-xs text-slate-300 relative z-10 mt-2">
                <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg">
                    <Wind size={12} className="text-cyan-400" />
                    <span>{weatherData.wind} km/h</span>
                </div>
                <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg">
                    <Droplets size={12} className="text-blue-400" />
                    <span>{weatherData.humidity}%</span>
                </div>
            </div>
        </div>
    );
};
