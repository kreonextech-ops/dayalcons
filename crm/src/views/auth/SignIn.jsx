import React, { useState, useEffect } from "react";
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

  const logLogin = async (employeeName, userId) => {
    let ip = "Unknown";
    let location = "Unknown";
    try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        ip = data.ip || "Unknown";
        location = data.city ? `${data.city}, ${data.country_name}` : "Unknown";
    } catch(e) {}
    
    await supabase.from('audit_logs').insert([{
        user_id: userId,
        employee_name: employeeName,
        action_type: "LOGIN",
        module: "System",
        description: `Logged in from ${location}`,
        ip_address: ip,
        device_info: navigator.userAgent
    }]);
  };

  useEffect(() => {
    // Check if coming back from Google Auth
    const checkGoogleSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
         setLoading(true);
         const { data, error } = await supabase
          .from('employees')
          .select('*')
          .eq('email', session.user.email)
          .single();
          
         if (data) {
            if (data.is_active === false) {
               setError("Your account has been disabled. Please contact the administrator.");
               await supabase.auth.signOut();
              Object.keys(localStorage).forEach(key => { if (key.startsWith("sb-")) localStorage.removeItem(key); });
               setLoading(false);
               return;
            }
            await logLogin(data.name, data.id);
            localStorage.setItem("dayal_user", JSON.stringify(data));
            if (data.role === "Client") navigate("/client/default");
            else navigate("/admin/default");
         } else {
            setError(`No employee account found for ${session.user.email}.`);
            await supabase.auth.signOut();
              Object.keys(localStorage).forEach(key => { if (key.startsWith("sb-")) localStorage.removeItem(key); });
            setLoading(false);
         }
      }
    };
    checkGoogleSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
       if (event === 'SIGNED_IN' && session?.user?.email) {
           checkGoogleSession();
       }
    });
    return () => { authListener?.subscription?.unsubscribe(); };
  }, [navigate]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + window.location.pathname, queryParams: { prompt: 'select_account' }
      }
    });
    if (error) {
       setError(error.message);
       setLoading(false);
    }
  };

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
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .single();

      if (error || !data) {
        setError("Invalid email or password.");
      } else if (data.is_active === false) {
        setError("Your account has been disabled. Please contact the administrator.");
      } else {
        await logLogin(data.name, data.id);
        localStorage.setItem("dayal_user", JSON.stringify(data));
        if (data.role === "Client") {
          navigate("/client/default");
        } else {
          navigate("/admin/default");
        }
      }
    } catch (err) {
      setError("An error occurred during sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-16 mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
          Sign In
        </h4>
        <p className="mb-9 ml-1 text-base text-gray-600">
          Enter your email and password to sign in!
        </p>
        
        {error && (
          <div className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-500 border border-red-200">
            {error}
          </div>
        )}

        {/* Google Sign In Button */}
        <button
          type="button"
          disabled={loading}
          onClick={handleGoogleSignIn}
          className="mb-6 flex h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-lightPrimary hover:cursor-pointer dark:bg-navy-800"
        >
          <div className="rounded-full text-xl">
            <FcGoogle />
          </div>
          <h5 className="text-sm font-medium text-navy-700 dark:text-white">
            Sign In with Google
          </h5>
        </button>

        <div className="mb-6 flex items-center gap-3">
          <div className="h-px w-full bg-gray-200 dark:bg-navy-700" />
          <p className="text-base text-gray-600 dark:text-white"> or </p>
          <div className="h-px w-full bg-gray-200 dark:bg-navy-700" />
        </div>

        <form onSubmit={handleSignIn}>
          <InputField
            variant="auth"
            extra="mb-3"
            label="Email*"
            placeholder="admin@dayal.com"
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <InputField
            variant="auth"
            extra="mb-3"
            label="Password*"
            placeholder="Min. 8 characters"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <div className="mb-4 flex items-center justify-between px-2">
            <div className="flex items-center">
              <Checkbox />
              <p className="ml-2 text-sm font-medium text-navy-700 dark:text-white">
                Keep me logged In
              </p>
            </div>
            <a
              className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
              href="#"
            >
              Forgot Password?
            </a>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className={`linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}