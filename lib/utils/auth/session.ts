 export async function setSession(token: string){
    await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
  };

export async function clearSession(){
    await fetch("/api/auth/logout", { method: "POST" });
};

