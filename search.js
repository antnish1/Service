const SUPABASE_URL = "https://gmutgbdldiqbwomtdepi.supabase.co";
const SUPABASE_KEY = "sb_publishable_e-gFkBqs2qG2bSs1iBJPrQ_m3PZf5lN";

const { createClient } = window.supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

const branch = localStorage.getItem("selectedBranch");
document.getElementById("branchTitle").innerText = "Branch: " + branch;

async function searchMachine() {
  const machineNo = document.getElementById("machineInput").value;

  const { data, error } = await supabaseClient
    .from("consolidation")
    .select("*")
    .eq("machine_no", machineNo);

  if (error) {
    console.log(error);
    return;
  }

  const results = document.getElementById("results");
  results.innerHTML = "";

  data.forEach(row => {
    results.innerHTML += `
      <div style="background:white; padding:10px; margin:10px 0; border-radius:10px;">
        Machine: ${row.machine_no}<br>
        Engineer: ${row.engineer_name}<br>
        Location: ${row.location}
      </div>
    `;
  });
}
