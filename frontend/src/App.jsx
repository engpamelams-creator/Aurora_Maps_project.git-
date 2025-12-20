import React, { useState, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { BackgroundWrapper } from './components/BackgroundWrapper';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Loading } from './components/Loading';

// Lazy Loaded Components
const MapListPage = lazy(() => import('./pages/MapListPage'));
const MapDetailPage = lazy(() => import('./pages/MapDetailPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const UserProfilePage = lazy(() => import('./pages/UserProfilePage'));
const MyMapsPage = lazy(() => import('./pages/MyMapsPage'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const RecommendationsPage = lazy(() => import('./pages/RecommendationsPage'));
const GeoFeedPage = React.lazy(() => import('./pages/GeoFeedPage'));
const NearbyGroupsPage = React.lazy(() => import('./pages/NearbyGroupsPage'));
const LocalEventsPage = React.lazy(() => import('./pages/LocalEventsPage'));

// Fallback skeleton
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
  </div>
);

// Protected Route Component
const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null; // Or a spinner
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

// Layout Component handling transitions
const Layout = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  const handleCreateClick = () => {
    window.dispatchEvent(new Event('open-create-map-modal'));
  };

  return (
    <>
      <Header
        onSearch={setSearchTerm}
        onCreateClick={location.pathname === '/' ? handleCreateClick : undefined}
      />
      <div className="relative z-10 flex flex-col min-h-screen">
        <div className="flex-grow">
          <Outlet context={{ searchTerm }} />
        </div>
        <Footer />
      </div>
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BackgroundWrapper>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<MapListPage />} />
                <Route path="/map/:id" element={<MapDetailPage />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="/feed" element={<GeoFeedPage />} />
                  <Route path="/groups" element={<NearbyGroupsPage />} />
                  <Route path="/events" element={<LocalEventsPage />} />
                  <Route path="/profile" element={<UserProfilePage />} />
                  <Route path="/my-maps" element={<MyMapsPage />} />
                  <Route path="/favorites" element={<FavoritesPage />} />
                  <Route path="/gallery" element={<GalleryPage />} />
                  <Route path="/recommendations" element={<RecommendationsPage />} />
                </Route>
              </Route>

              {/* Auth Routes (No Header) */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BackgroundWrapper>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
