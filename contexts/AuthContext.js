"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  const checkAuth = async () => {
    try {
      const cachedProfile = localStorage.getItem("cached_profile");
      const cachedUser = localStorage.getItem("cached_user");
      const lastCheck = localStorage.getItem("last_auth_check");
      const now = Date.now();

      if (
        cachedProfile &&
        cachedUser &&
        lastCheck &&
        now - parseInt(lastCheck) < 60 * 60 * 1000
      ) {
        setUser(JSON.parse(cachedUser));
        setProfile(JSON.parse(cachedProfile));
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        setUser(user);
        setProfile(profileData);
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
    }
  };

  useEffect(() => {
    checkAuth();

    // لیسنر برای تغییرات auth
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN") {
        checkAuth();
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setProfile(null);
        localStorage.removeItem("cached_user");
        localStorage.removeItem("cached_profile");
        localStorage.removeItem("last_auth_check");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
