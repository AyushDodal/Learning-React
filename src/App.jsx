import { useState, useEffect } from "react";
import { supabase } from "./supabase";

export default function App() {

  const [session, setSession] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => listener.subscription.unsubscribe();

  }, []);

  const signUp = async () => {
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) alert(error.message);
    else alert("Signup successful. Now login.");
  };

  const login = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) alert(error.message);
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  if (!session) {
    return (
      <div style={{ padding: "40px" }}>

        <h2>Login / Signup</h2>

        <input
          placeholder="email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <br /><br />

        <input
          type="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <br /><br />

        <button onClick={login}>Login</button>

        <button onClick={signUp} style={{ marginLeft: "10px" }}>
          Sign Up
        </button>

      </div>
    );
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>Welcome</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
