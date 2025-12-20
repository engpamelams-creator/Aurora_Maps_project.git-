import React from 'react';
import { SidebarLeft } from '../components/SidebarLeft';
import { RightPanel } from '../components/RightPanel';
import { EventCard } from '../components/EventCard';
import { Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const LocalEventsPage = () => {
    const mockEvents = [
        { id: 1, name: 'Jazz no Parque', month: 'DEZ', day: '24', time: '18:00', location: 'Parque Lage', attendees: 142, image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80' },
        { id: 2, name: 'Workshop de React 19', month: 'JAN', day: '10', time: '14:00', location: 'WeWork Botafogo', attendees: 56, image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80' },
        { id: 3, name: 'Feira Orgânica', month: 'JAN', day: '12', time: '08:00', location: 'Praça N.S. da Paz', attendees: 320, image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&q=80' },
    ];

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 md:px-6 lg:px-8 relative w-full overflow-x-hidden">
            <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[280px_1fr] xl:grid-cols-[280px_600px_300px] gap-8 justify-center">
                <aside className="hidden lg:block"><SidebarLeft /></aside>

                <main className="w-full max-w-[600px] mx-auto xl:mx-0">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 flex items-center gap-3 text-white"
                    >
                        <div className="p-3 bg-purple-500/20 rounded-xl">
                            <Calendar size={32} className="text-purple-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Eventos Locais</h1>
                            <p className="text-slate-400">Não perca o que está acontecendo na sua região.</p>
                        </div>
                    </motion.div>

                    <div className="space-y-6">
                        {mockEvents.map(event => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                </main>

                <aside className="hidden xl:block"><RightPanel /></aside>
            </div>
        </div>
    );
};

export default LocalEventsPage;
