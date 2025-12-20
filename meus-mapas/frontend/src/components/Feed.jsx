import React, { useState, useEffect, useRef } from 'react';
import { socialService } from '../services/socialService';
import { Heart, MessageCircle, MapPin, Share2, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';



import HybridPostCard from './HybridPostCard';

const Feed = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const observerTarget = useRef(null);

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        try {
            const data = await socialService.getFeed(page);
            if (page === 1) {
                setPosts(data.data);
            } else {
                setPosts(prev => [...prev, ...data.data]);
            }
            setLoading(false);
        } catch (err) {
            console.error("Failed to load feed", err);
            setLoading(false);
        }
    };

    return (
        <div className="max-w-[470px] mx-auto pb-20">
            {posts.map(post => (
                <HybridPostCard key={post.id} post={post} />
            ))}

            {loading && (
                <div className="space-y-6">
                    {/* Skeleton Feed for immersive loading */}
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl h-[600px] animate-pulse relative">
                        <div className="h-14 border-b border-slate-800 bg-slate-800/50" />
                        <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-slate-700" />
                    </div>
                </div>
            )}

            {/* Infinite Scroll Trigger */}
            <div ref={observerTarget} className="h-4" />
        </div>
    );
};


export default Feed;
