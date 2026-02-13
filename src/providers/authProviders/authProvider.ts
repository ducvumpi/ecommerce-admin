import { AuthProvider } from "@refinedev/core";
import { supabase } from "../../app/libs/supabaseClient";

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        error: {
          name: "LoginError",
          message: error.message,
        },
      };
    }

    return {
      success: true,
      redirectTo: "/",
    };
  },

  logout: async () => {
    await supabase.auth.signOut();
    return {
      success: true,
      redirectTo: "/login",
    };
  },

  check: async () => {
    const { data } = await supabase.auth.getUser();

    if (data?.user) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      redirectTo: "/login",
    };
  },

 getIdentity: async () => {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .single();

  return {
    id: userData.user.id,
    name: userData.user.email,
    role: profile?.role, // admin | staff
  };
},


  onError: async (error) => {
    console.error(error);
    return { error };
  },
};
