with open('crm/src/views/auth/SignIn.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

import re

# 1. Add global useEffect for standard redirect handling
global_listener = """
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

  // ── Google Popup Sign-In ──────────────────────────────────────────────────"""

content = content.replace("  // ── Google Popup Sign-In ──────────────────────────────────────────────────", global_listener)

# 2. Update Google Sign In to use standard redirect (more reliable than popup)
google_old = """  // ── Google Popup Sign-In ──────────────────────────────────────────────────
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

        await enterDashboard(emp);
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
  };"""

google_new = """  // ── Google Popup Sign-In ──────────────────────────────────────────────────
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
  };"""

content = content.replace(google_old, google_new)

# 3. Update Email/Password Sign In for Lazy Migration
password_old = """  // ── Password Sign-In ──────────────────────────────────────────────────────
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
        await enterDashboard(data);
      }
    } catch {
      setError("An error occurred during sign in.");
    } finally {
      setLoading(false);
    }
  };"""

password_new = """  // ── Password Sign-In ──────────────────────────────────────────────────────
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
  };"""

content = content.replace(password_old, password_new)

with open('crm/src/views/auth/SignIn.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Patched SignIn.jsx")
