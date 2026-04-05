const SUPABASE_URL = "https://gmutgbdldiqbwomtdepi.supabase.co";
const SUPABASE_KEY = "sb_publishable_e-gFkBqs2qG2bSs1iBJPrQ_m3PZf5lN";

const { createClient } = window.supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

// Show selected branch
const branch = localStorage.getItem("selectedBranch");
document.getElementById("branchTitle").innerText = "Branch: " + branch;

// 🔥 THIS WAS MISSING (MAIN FUNCTION)
async function searchMachine() {
  const machineNo = document.getElementById("machineInput").value;

  const { data, error } = await supabaseClient
    .from("consolidation")
    .select("*")
    .eq("machine_no", machineNo);

  if (error) {
    console.log("Error:", error);
    return;
  }

  displayResults(data);
}

// Existing function (you already had)
function displayResults(rows) {
  const tbody = document.querySelector("#resultTable tbody");
  tbody.innerHTML = "";

  rows.forEach(row => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${row.date || ""}</td>
      <td>${row.location || ""}</td>
      <td>${row.engineer_name || ""}</td>
      <td>${row.workshop_onsite || ""}</td>
      <td>${row.call_type || ""}</td>
      <td>${row.complaint || ""}</td>
      <td>${row.customer_name || ""}</td>
      <td>${row.machine_no || ""}</td>
      <td>${row.hmr || ""}</td>
      <td>${row.breakdown_status || ""}</td>
      <td>${row.site_location || ""}</td>
      <td>${row.call_id || ""}</td>
      <td>${row.labour_charge || ""}</td>
      <td>${row.distance || ""}</td>
      <td>${row.total_tada || ""}</td>
    `;

    tbody.appendChild(tr);
  });
}


// 🔥 ENTER KEY SEARCH
document.getElementById("machineInput").addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    searchMachine();
  }
});
