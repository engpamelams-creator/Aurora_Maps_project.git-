import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMaps, createMap } from '../services/mapService';
import { Map as MapIcon, Plus, ChevronRight } from 'lucide-react';

const MapList = () => {
    const [maps, setMaps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newMapName, setNewMapName] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        fetchMaps();
    }, []);

    const fetchMaps = async () => {
        try {
            const data = await getMaps();
            setMaps(data);
        } catch (error) {
            console.error('Error fetching maps:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateMap = async (e) => {
        e.preventDefault();
        if (!newMapName.trim()) return;

        try {
            await createMap({ name: newMapName });
            setNewMapName('');
            setIsCreating(false);
            fetchMaps();
        } catch (error) {
            console.error('Error creating map:', error);
        }
    };

    if (loading) return <div className="loading">Loading maps...</div>;

    return (
        <div className="map-list-container">
            <header className="header">
                <h1><MapIcon /> Aurora Maps</h1>
                <button
                    className="btn btn-primary"
                    onClick={() => setIsCreating(true)}
                >
                    <Plus size={16} /> New Map
                </button>
            </header>

            {isCreating && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Create New Map</h2>
                        <form onSubmit={handleCreateMap}>
                            <input
                                type="text"
                                value={newMapName}
                                onChange={(e) => setNewMapName(e.target.value)}
                                placeholder="Map Name"
                                autoFocus
                            />
                            <div className="modal-actions">
                                <button type="button" onClick={() => setIsCreating(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="maps-grid">
                {maps.map(map => (
                    <Link to={`/map/${map.id}`} key={map.id} className="map-card">
                        <div className="map-card-content">
                            <h3>{map.name}</h3>
                            <p>{map.points_count || 0} points</p>
                        </div>
                        <ChevronRight className="icon-arrow" />
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default MapList;
