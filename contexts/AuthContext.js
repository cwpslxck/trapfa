"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (session) => {
    try {
      // چک کردن localStorage
      const cachedData = localStorage.getItem("profile");
      const cachedTimestamp = localStorage.getItem("profile_timestamp");

      if (cachedData && cachedTimestamp) {
        const CACHE_TIME = 5 * 60 * 1000; // 5 دقیقه
        if (Date.now() - parseInt(cachedTimestamp) < CACHE_TIME) {
          setProfile(JSON.parse(cachedData));
          return;
        }
      }

      // اگر کش نبود یا منقضی شده بود
      const response = await fetch("/api/me", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        localStorage.setItem("profile", JSON.stringify(userData));
        localStorage.setItem("profile_timestamp", Date.now().toString());
        setProfile(userData);
      } else {
        throw new Error("Failed to fetch profile");
      }
    } catch (error) {
      console.error("Profile fetch error:", error);
      setProfile(null);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        const {
          data: { session },
        } = await supabase.auth.getSession();

        setUser(session?.user || null);

        if (session?.user) {
          await fetchProfile(session);
        } else {
          setProfile(null);
          localStorage.removeItem("profile");
          localStorage.removeItem("profile_timestamp");
        }
      } catch (error) {
        console.error("Auth error:", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user || null);

      if (session?.user) {
        await fetchProfile(session);
      } else {
        setProfile(null);
        localStorage.removeItem("profile");
        localStorage.removeItem("profile_timestamp");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
