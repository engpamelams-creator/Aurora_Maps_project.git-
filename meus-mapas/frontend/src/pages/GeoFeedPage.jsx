import React, { useState } from 'react'; // Ensure useState is imported if not using React.useState everywhere, though code uses React.useState
import { SidebarLeft } from '../components/SidebarLeft';
import { RightPanel } from '../components/RightPanel';
import { CreatePostWidget } from '../components/CreatePostWidget';
import { GeoStories } from '../components/GeoStories';
import PostCard from '../components/PostCard';
import { ChatWindow } from '../components/ChatWindow';
import { AnimatePresence } from 'framer-motion';

const GeoFeedPage = () => {
    const [posts, setPosts] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [activeChat, setActiveChat] = React.useState(null);

    // Mock Data simulating PostResource from Laravel
    const richMockPosts = [
        {
            id: 101,
            author: { name: 'Dra. Carla Medeiros', avatar: 'https://ui-avatars.com/api/?name=Carla+M&background=EF4444&color=fff' },
            location: { name: 'Hospital Copa Star', lat: -22.9672, lng: -43.1901 },
            content: 'Plantão tranquilo hoje na emergência. Lembrem-se de se hidratar neste calor! 🏥💧 #Saúde #Plantão',
            media_url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80',
            likes_count: 89,
            comments_count: 5,
            created_at: '30min',
            liked_by_me: false,
            stats: { likes: 89 }
        },
        {
            id: 102,
            author: { name: 'Lucas & Rex', avatar: 'https://ui-avatars.com/api/?name=Lucas+Rex&background=F59E0B&color=fff' },
            location: { name: 'Parcão da Lagoa', lat: -22.9734, lng: -43.2087 },
            content: 'Melhor lugar para os pets no RJ! Espaço enorme e muita sombra. O Rex fez vários amigos hoje. 🐕🌳 #PetFriendly #Lagoa',
            media_url: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&q=80',
            likes_count: 245,
            comments_count: 32,
            created_at: '2h',
            liked_by_me: true,
            stats: { likes: 245 }
        },
        {
            id: 103,
            author: { name: 'Chef Paola', avatar: 'https://ui-avatars.com/api/?name=Paola+C&background=EC4899&color=fff' },
            location: { name: 'Aprazível Restaurante', lat: -22.9134, lng: -43.1861 },
            content: 'Testando o novo menu de verão. A moqueca de banana da terra está divina! Venham conferir. 🥘🥂 #Gastronomia #SantaTeresa',
            media_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80',
            likes_count: 567,
            comments_count: 45,
            created_at: '4h',
            liked_by_me: false,
            stats: { likes: 567 }
        },
        {
            id: 104,
            author: { name: 'Marcos Trail', avatar: 'https://ui-avatars.com/api/?name=Marcos+T&background=10B981&color=fff' },
            location: { name: 'Pedra Bonita', lat: -22.9868, lng: -43.2878 },
            content: 'Nascer do sol inesquecível hoje. A subida foi puxada mas a vista compensa tudo! ⛰️☀️ #Trilha #RJ',
            media_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80',
            likes_count: 892,
            comments_count: 120,
            created_at: '6h',
            liked_by_me: true,
            stats: { likes: 892 }
        },
        {
            id: 105,
            author: { name: 'Evento: Jazz na Rua', avatar: 'https://ui-avatars.com/api/?name=Jazz&background=6366F1&color=fff' },
            location: { name: 'Praça São Salvador', lat: -22.9329, lng: -43.1794 },
            content: 'Daqui a pouco começando o chorinho! Tragam suas cadeiras de praia. 🎷🎻 #Música #Rua',
            media_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80',
            likes_count: 1450,
            comments_count: 340,
            created_at: '8h',
            liked_by_me: false,
            stats: { likes: 1450 }
        },
        {
            id: 1,
            author: { name: 'Dr. Sarah Connor', avatar: 'https://ui-avatars.com/api/?name=Sarah+Connor&background=7C3AED&color=fff' },
            location: { name: 'Santuário de Machu Picchu', lat: -13.1631, lng: -72.5450 },
            content: 'A energia deste lugar é inexplicável. As nuvens parecem tocar as ruínas antigas. #Peru #History',
            media_url: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&q=80',
            likes_count: 342,
            comments_count: 56,
            created_at: '2h',
            liked_by_me: true,
            stats: { likes: 342 }
        },
        {
            id: 2,
            author: { name: 'John Explorer', avatar: 'https://ui-avatars.com/api/?name=John+Explorer&background=0284C7&color=fff' },
            location: { name: 'Tóquio, Shibuya Crossing', lat: 35.6595, lng: 139.7000 },
            content: 'O caos organizado mais bonito do mundo. Luzes neon por todo lado!',
            media_url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80',
            likes_count: 890,
            comments_count: 120,
            created_at: '5h',
            liked_by_me: false,
            stats: { likes: 890 }
        },
        {
            id: 3,
            author: { name: 'Eco Traveler', avatar: 'https://ui-avatars.com/api/?name=Eco+Traveler&background=10B981&color=fff' },
            location: { name: 'Floresta Amazônica', lat: -3.4653, lng: -62.2159 },
            content: 'Descobrindo novas trilhas na reserva. A umidade aqui é intensa, mas a vida selvagem compensa.',
            media_url: null, // Test Map Snippet fallback
            likes_count: 156,
            comments_count: 12,
            created_at: '8h',
            liked_by_me: false,
            stats: { likes: 156 }
        }
    ];

    React.useEffect(() => {
        setPosts(richMockPosts);
        setLoading(false);
    }, []);

    const displayPosts = posts.length > 0 ? posts : richMockPosts;

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 md:px-6 lg:px-8 relative w-full overflow-x-hidden">
            {/* 3-Column Facebook-Style Grid */}
            <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[280px_1fr] xl:grid-cols-[280px_600px_300px] gap-8 justify-center">

                {/* 1. Left Sidebar (Hidden on Mobile) */}
                <aside className="hidden lg:block">
                    <SidebarLeft />
                </aside>

                {/* 2. Main Feed (Fluid Center) */}
                <main className="w-full max-w-[600px] mx-auto xl:mx-0">
                    <GeoStories />
                    <CreatePostWidget />

                    <div className="space-y-6">
                        {displayPosts.map(post => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                </main>

                {/* 3. Right Panel (Hidden on Tablet < XL) */}
                <aside className="hidden xl:block">
                    {/* Pass the click handler to RightPanel */}
                    <RightPanel onUserSelect={setActiveChat} />
                </aside>

            </div>

            {/* MSN Chat Overlay */}
            <AnimatePresence>
                {activeChat && (
                    <ChatWindow
                        recipient={activeChat}
                        onClose={() => setActiveChat(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default GeoFeedPage;
