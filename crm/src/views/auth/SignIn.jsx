import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "components/fields/InputField";
import { FcGoogle } from "react-icons/fc";
import Checkbox from "components/checkbox";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://gdzligxryodasaxnhdco.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkemxpZ3hyeW9kYXNheG5oZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTg1MDUsImV4cCI6MjEwMjczNDUwNX0.AYTyAMf22g8au51ATReRQdQc2IzDLYQ2vtQH_Uyfrpg";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ── Popup OAuth Callback Handler ──────────────────────────────────────────
  // When Google OAuth redirects back to this page inside a popup window,
  // we must NOT navigate or touch sessionStorage (those belong to the parent).
  // Just let Supabase store the session in localStorage and close the popup.
  React.useEffect(() => {
    const isInPopup = window.opener && window.opener !== window;
    const hasOAuthCallback = window.location.hash.includes("access_token") || 
                             window.location.search.includes("code=");
    if (isInPopup && hasOAuthCallback) {
      // Give Supabase a moment to process the tokens from the URL hash,
      // then close. The parent window's onAuthStateChange will do the rest.
      const timer = setTimeout(() => {
        try { window.close(); } catch (_) {}
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Audit log - now blocking to ensure it completes before navigate
  const logLogin = async (employeeName, userId) => {
    try {
      const geo = await fetch("https://ipapi.co/json/").then(r => r.json()).catch(() => ({}));
      const ip = geo?.ip || "Unknown";
      const location = geo?.city ? `${geo.city}, ${geo.country_name}` : "Unknown";
      await supabase.from("audit_logs").insert([{
        user_id: userId,
        employee_name: employeeName,
        action_type: "LOGIN",
        module: "System",
        description: `Logged in from ${location}`,
        ip_address: ip,
        device_info: navigator.userAgent,
      }]);
    } catch(e) {
      console.log("Login log error", e);
    }
  };

  const enterDashboard = async (data) => {
    // Fire-and-forget logLogin so it doesn't block the user from entering the dashboard
    logLogin(data.name, data.id).catch(console.error);
    
    sessionStorage.setItem("dayal_user", JSON.stringify(data));
    if (data.role === "Client") navigate("/client/default");
    else navigate("/admin/default");
  };


  // ── Global Auth Listener (for standard redirects) ────────────────────────
  React.useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      // If user comes back from a Google OAuth redirect, this will fire
      if (event === "SIGNED_IN" && session?.user?.email) {
        // Only run if not already in session storage to prevent loops
        const existing = sessionStorage.getItem("dayal_user");
        if (!existing) {
          const { data: emp } = await supabase
            .from("employees")
            .select("*")
            .eq("email", session.user.email)
            .single();

          if (emp && emp.is_active !== false) {
            await enterDashboard(emp);
          }
        }
      }
    });
    return () => authListener?.subscription?.unsubscribe();
  }, []);

  // ── Google Popup Sign-In ──────────────────────────────────────────────────
  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);

    const { error: oauthErr } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        queryParams: { prompt: "select_account" },
        // Use current URL so they come back here
        redirectTo: window.location.origin + "/crm/auth/sign-in",
      },
    });

    if (oauthErr) {
      setError(oauthErr.message || "Google sign-in failed.");
      setLoading(false);
    }
  };

  // ── Password Sign-In ──────────────────────────────────────────────────────
  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }

    try {
      // 1. Try proper Supabase Auth first
      const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({ email, password });
      
      let finalEmail = email;

      if (authErr) {
        // 2. Fallback for un-migrated users: check employees table directly
        const { data: dbData, error: dbErr } = await supabase
          .from("employees")
          .select("*")
          .eq("email", email)
          .eq("password", password)
          .single();

        if (dbErr || !dbData) {
          setError("Invalid email or password.");
          setLoading(false);
          return;
        }
        
        // 3. Lazy Migration: silently create their Supabase Auth account for next time
        supabase.auth.signUp({ email, password }).catch(() => {});
        finalEmail = email;
      } else {
        finalEmail = authData?.user?.email || email;
      }

      // 4. Fetch the full employee profile for roles/designation
      const { data: emp, error: empErr } = await supabase
        .from("employees")
        .select("*")
        .eq("email", finalEmail)
        .single();

      if (empErr || !emp) {
        setError(`No employee account for ${finalEmail}.`);
        setLoading(false);
        return;
      }

      if (emp.is_active === false) {
        setError("Your account has been disabled. Please contact the administrator.");
        setLoading(false);
        return;
      }

      await enterDashboard(emp);

    } catch (e) {
      setError("An error occurred during sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-16 mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">Sign In</h4>
        <p className="mb-9 ml-1 text-base text-gray-600">Enter your email and password to sign in!</p>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-500 border border-red-200">
            {error}
          </div>
        )}

        <button
          type="button"
          disabled={loading}
          onClick={handleGoogleSignIn}
          className="mb-6 flex h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-lightPrimary hover:cursor-pointer dark:bg-navy-800 disabled:opacity-60"
        >
          <div className="rounded-full text-xl"><FcGoogle /></div>
          <h5 className="text-sm font-medium text-navy-700 dark:text-white">
            {loading ? "Signing in..." : "Sign In with Google"}
          </h5>
        </button>

        <div className="mb-6 flex items-center gap-3">
          <div className="h-px w-full bg-gray-200 dark:bg-navy-700" />
          <p className="text-base text-gray-600 dark:text-white">or</p>
          <div className="h-px w-full bg-gray-200 dark:bg-navy-700" />
        </div>

        <form onSubmit={handleSignIn}>
          <InputField variant="auth" extra="mb-3" label="Email*" placeholder="your@email.com" id="email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
          <InputField variant="auth" extra="mb-3" label="Password*" placeholder="Min. 8 characters" id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <div className="mb-4 flex items-center justify-between px-2">
            <div className="flex items-center">
              <Checkbox />
              <p className="ml-2 text-sm font-medium text-navy-700 dark:text-white">Keep me logged In</p>
            </div>
            <a className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white" href="#">Forgot Password?</a>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
