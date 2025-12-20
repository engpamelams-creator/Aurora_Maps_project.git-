import React, { createContext, useContext, useState, useEffect } from "react";
import api from "@/config/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Init: Check if token exists and validate
        if (token) {
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            fetchUser();
        } else {
            setLoading(false);
        }
    }, [token]);

    const fetchUser = async () => {
        try {
            const response = await api.get("/auth/me");
            const avatar = localStorage.getItem("user_avatar");
            setUser({ ...response.data, avatar }); // Merge local avatar
        } catch (error) {
            console.error("Failed to fetch user", error);
            logout(); // Invalid token
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const response = await api.post("/auth/login", { email, password });
        const { access_token, user } = response.data;
        const avatar = localStorage.getItem("user_avatar");

        localStorage.setItem("token", access_token);
        api.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

        setToken(access_token);
        setUser({ ...user, avatar });
        return user;
    };

    const register = async (name, email, password, password_confirmation) => {
        const response = await api.post("/auth/register", {
            name,
            email,
            password,
            password_confirmation
        });
        const { access_token, user } = response.data;

        localStorage.setItem("token", access_token);
        api.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

        setToken(access_token);
        setUser(user);
        return user;
    };

    const logout = async () => {
        try {
            await api.post("/auth/logout");
        } catch (error) {
            console.warn("Logout failed on server, clearing local anyway.");
        }

        localStorage.removeItem("token");
        delete api.defaults.headers.common["Authorization"];
        setToken(null);
        setUser(null);
    };

    const updateProfile = async (data) => {
        const response = await api.put("/auth/update", data);
        const avatar = localStorage.getItem("user_avatar");
        setUser({ ...response.data.user, avatar });
        return response.data;
    };

    const updateAvatar = (avatarDataUrl) => {
        localStorage.setItem("user_avatar", avatarDataUrl);
        setUser(prev => ({ ...prev, avatar: avatarDataUrl }));
    };

    const deleteAccount = async () => {
        await api.delete("/auth/delete");
        logout();
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            loading,
            login,
            register,
            logout,
            updateProfile,
            updateAvatar,
            deleteAccount,
            isAuthenticated: !!user
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
