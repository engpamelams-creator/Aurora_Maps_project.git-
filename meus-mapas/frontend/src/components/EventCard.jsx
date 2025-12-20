import React from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';

export const EventCard = ({ event }) => (
    <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all group flex flex-col md:flex-row">
        {/* Date Badge (Left/Top) */}
        <div className="bg-purple-500/10 p-4 flex flex-col items-center justify-center min-w-[100px] border-r border-white/5">
            <span className="text-purple-400 font-bold text-xl uppercase">{event.month}</span>
            <span className="text-white font-bold text-3xl">{event.day}</span>
        </div>

        {/* Content */}
        <div className="p-5 flex-1">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">{event.name}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-400 mb-4">
                        <div className="flex items-center gap-1.5">
                            <Clock size={16} className="text-cyan-400" />
                            {event.time}
                        </div>
                        <div className="flex items-center gap-1.5">
                            <MapPin size={16} className="text-green-400" />
                            {event.location}
                        </div>
                    </div>
                </div>
                <img
                    src={event.image}
                    alt={event.name}
                    className="w-12 h-12 rounded-full border-2 border-slate-700"
                />
            </div>

            <div className="flex items-center justify-between mt-2">
                <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-900" />
                    ))}
                    <span className="text-xs text-slate-500 ml-3 self-center">+{event.attendees} confirmados</span>
                </div>
                <button className="bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold py-2 px-6 rounded-xl transition-all shadow-lg shadow-purple-900/20">
                    Confirmar Presença
                </button>
            </div>
        </div>
    </div>
);
