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

  // Fire-and-forget audit log — never blocks login
  const logLogin = (employeeName, userId) => {
    fetch("https://ipapi.co/json/")
      .then(r => r.json())
      .catch(() => ({}))
      .then(geo => {
        const ip = geo?.ip || "Unknown";
        const location = geo?.city ? `${geo.city}, ${geo.country_name}` : "Unknown";
        supabase.from("audit_logs").insert([{
          user_id: userId,
          employee_name: employeeName,
          action_type: "LOGIN",
          module: "System",
          description: `Logged in from ${location}`,
          ip_address: ip,
          device_info: navigator.userAgent,
        }]);
      });
  };

  const enterDashboard = (data) => {
    logLogin(data.name, data.id);
    localStorage.setItem("dayal_user", JSON.stringify(data));
    if (data.role === "Client") navigate("/client/default");
    else navigate("/admin/default");
  };

  // ── Google Popup Sign-In ──────────────────────────────────────────────────
  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);

    // Open OAuth URL in a small popup — NO page redirect
    const { data, error: oauthErr } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        skipBrowserRedirect: true,
        queryParams: { prompt: "select_account" },
        redirectTo: window.location.origin + "/crm/auth/sign-in",
      },
    });

    if (oauthErr || !data?.url) {
      setError(oauthErr?.message || "Google sign-in failed.");
      setLoading(false);
      return;
    }

    const width = 500, height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    const popup = window.open(
      data.url,
      "GoogleSignIn",
      `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no`
    );

    if (!popup) {
      // Popup blocked — fall back to redirect
      window.location.href = data.url;
      return;
    }

    // Listen for session via onAuthStateChange
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if ((event === "SIGNED_IN" || event === "TOKEN_REFRESHED") && session?.user?.email) {
        listener?.subscription?.unsubscribe();
        try { popup.close(); } catch (_) {}

        const { data: emp } = await supabase
          .from("employees")
          .select("*")
          .eq("email", session.user.email)
          .single();

        if (!emp) {
          setError(`No employee account for ${session.user.email}.`);
          await supabase.auth.signOut();
          setLoading(false);
          return;
        }
        if (emp.is_active === false) {
          setError("Your account has been disabled. Contact the administrator.");
          await supabase.auth.signOut();
          setLoading(false);
          return;
        }

        enterDashboard(emp);
      }
    });

    // If user closes popup without signing in
    const pollClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(pollClosed);
        listener?.subscription?.unsubscribe();
        setLoading(false);
      }
    }, 500);
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
      const { data, error: dbErr } = await supabase
        .from("employees")
        .select("*")
        .eq("email", email)
        .eq("password", password)
        .single();

      if (dbErr || !data) {
        setError("Invalid email or password.");
      } else if (data.is_active === false) {
        setError("Your account has been disabled. Please contact the administrator.");
      } else {
        enterDashboard(data);
      }
    } catch {
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
          <InputField variant="auth" extra="mb-3" label="Email*" placeholder="admin@dayal.com" id="email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
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
