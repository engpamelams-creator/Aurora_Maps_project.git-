import React from 'react';
import { SidebarLeft } from '../components/SidebarLeft';
import { RightPanel } from '../components/RightPanel';
import { GroupCard } from '../components/GroupCard';
import { Users } from 'lucide-react';
import { motion } from 'framer-motion';

const NearbyGroupsPage = () => {
    const mockGroups = [
        { id: 1, name: 'Trilheiros do Rio', location: 'Rio de Janeiro, RJ', members: 1250, image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80' },
        { id: 2, name: 'Fotografia Urbana', location: 'Centro, RJ', members: 840, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80' },
        { id: 3, name: 'Tech Startups Meetup', location: 'Botafogo, RJ', members: 450, image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80' },
        { id: 4, name: 'Yoga na Praia', location: 'Copacabana, RJ', members: 2100, image: 'https://images.unsplash.com/photo-1544367563-12123d8965cd?auto=format&fit=crop&q=80' },
        { id: 5, name: 'Gastronomia Carioca', location: 'Leblon, RJ', members: 920, image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80' }
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
                        <div className="p-3 bg-cyan-500/20 rounded-xl">
                            <Users size={32} className="text-cyan-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Grupos Próximos</h1>
                            <p className="text-slate-400">Conecte-se com pessoas com os mesmos interesses.</p>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
                        {mockGroups.map(group => (
                            <GroupCard key={group.id} group={group} />
                        ))}
                    </div>
                </main>

                <aside className="hidden xl:block"><RightPanel /></aside>
            </div>
        </div>
    );
};

export default NearbyGroupsPage;
