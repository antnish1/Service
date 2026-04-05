// 🔑 Replace with your actual Supabase credentials


const SUPABASE_URL = "https://gmutgbdldiqbwomtdepi.supabase.co";
const SUPABASE_KEY = "sb_publishable_e-gFkBqs2qG2bSs1iBJPrQ_m3PZf5lN";

const { createClient } = window.supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

const form = document.getElementById("loginForm");
const errorMsg = document.getElementById("errorMsg");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  console.log("🔥 Login clicked");

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const { data, error } = await supabaseClient
      .from("users")
      .select("*")
      .eq("name", username)
      .eq("password", password)
      .single();

    console.log("DATA:", data);
    console.log("ERROR:", error);

    if (error || !data) {
      errorMsg.textContent = "Invalid credentials ❌";
      return;
    }

    localStorage.setItem("user", JSON.stringify(data));

    window.location.href = "dashboard.html";

  } catch (err) {
    console.log("ERROR:", err);
  }
});
