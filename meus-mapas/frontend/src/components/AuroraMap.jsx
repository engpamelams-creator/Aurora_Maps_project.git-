import React, { useEffect } from 'react';
import { MapContainer, TileLayer, LayersControl, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet icons (Requested)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Helper component to capture clicks
const LocationCapture = ({ onLocationSelected }) => {
    useMapEvents({
        click(e) {
            if (onLocationSelected) onLocationSelected(e.latlng);
        },
    });
    return null;
};

export const AuroraMap = ({ center = [-15.7942, -47.8822], zoom = 4, onLocationSelected, children }) => {
    return (
        <MapContainer
            center={center}
            zoom={zoom}
            style={{ height: '100%', width: '100%' }}
            className="rounded-xl z-0 h-full w-full"
        >
            <LayersControl position="topright">
                {/* Layer 1: Satellite (Esri) - Requested as option */}
                <LayersControl.BaseLayer name="Visão de Satélite 🛰️">
                    <TileLayer
                        attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    />
                </LayersControl.BaseLayer>

                {/* Layer 2: Street (OSM) - Requested */}
                {/* Layer 2: Street (OSM) - Requested */}
                <LayersControl.BaseLayer checked name="Mapa de Rua (Claro) 🗺️">
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                </LayersControl.BaseLayer>

                {/* Layer 3: Dark (Aurora Theme Default) - Kept for consistency */}
                <LayersControl.BaseLayer name="Aurora Dark (Padrão) 🌑">
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    />
                </LayersControl.BaseLayer>

                {/* Layer 4: NASA Earth at Night (New) */}
                <LayersControl.BaseLayer name="NASA Earth at Night (Black Marble) 🌌">
                    <TileLayer
                        url="https://map1.vis.earthdata.nasa.gov/wmts-webmerc/VIIRS_CityLights_2012/default/2024-01-01/GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpg"
                        attribution='Imagery provided by &copy; NASA GIBS'
                        maxNativeZoom={8}
                        bounds={[[-85.0511287776, -179.999999975], [85.0511287776, 179.999999975]]}
                    />
                </LayersControl.BaseLayer>

                {/* Layer 5: OpenSeaMap (New Optional Overlay) */}
                <LayersControl.Overlay name="OpenSeaMap (Nautical) ⚓">
                    <TileLayer
                        url="https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png"
                        attribution='Map data: &copy; <a href="http://www.openseamap.org">OpenSeaMap</a> contributors'
                    />
                </LayersControl.Overlay>
            </LayersControl>

            {/* Click Handler */}
            {onLocationSelected && <LocationCapture onLocationSelected={onLocationSelected} />}

            {/* Markers/Children */}
            {children}
        </MapContainer>
    );
};
