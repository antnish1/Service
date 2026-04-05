const SUPABASE_URL = "https://gmutgbdldiqbwomtdepi.supabase.co";
const SUPABASE_KEY = "sb_publishable_e-gFkBqs2qG2bSs1iBJPrQ_m3PZf5lN";

const { createClient } = window.supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

// Show selected branch
const branch = localStorage.getItem("selectedBranch");
document.getElementById("branchTitle").innerText = branch;


const listId = localStorage.getItem("currentListId");
const status = localStorage.getItem("currentStatus");

document.getElementById("listInfo").innerText = `List ID: ${listId} | Status: ${status}`;

const user = JSON.parse(localStorage.getItem("user"));
document.getElementById("usernameDisplay").innerText = "👤 " + user.name;


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
      <td>${formatDate(row.date)}</td>
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

    // 🔥 CLICK EVENT
    tr.style.cursor = "pointer";

    tr.addEventListener("click", () => {
      addToSVRList(row, tr);
    });

    tbody.appendChild(tr);
  });
}


async function addToSVRList(row, trElement) {

  const SUPABASE_URL = "https://gmutgbdldiqbwomtdepi.supabase.co";
  const SUPABASE_KEY = "sb_publishable_e-gFkBqs2qG2bSs1iBJPrQ_m3PZf5lN";

  const { createClient } = window.supabase;
  const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

  const listId = localStorage.getItem("currentListId");


const { data: existing } = await supabaseClient
  .from("svr_list_database")
  .select("id")
  .eq("ListId", listId)
  .eq("unique_key", row.unique_key);

if (existing.length > 0) {
  alert("Already added to list");
  return;
}
  

  // 🚫 PREVENT DOUBLE CLICK
  trElement.style.opacity = "0.5";
  trElement.style.pointerEvents = "none";

  // 🔥 INSERT INTO NEW TABLE
  const { error } = await supabaseClient
    .from("svr_list_database")
.insert([
  {
    "ListId": listId,

    unique_key: row.unique_key,
    call_id: row.call_id,
    location: row.location,
    engineer_name: row.engineer_name,
    workshop_onsite: row.workshop_onsite,
    call_type: row.call_type,
    primary_secondary_engineer: row.primary_secondary_engineer,
    complaint: row.complaint,
    customer_name: row.customer_name,
    contact_number: row.contact_number,
    machine_no: row.machine_no,
    hmr: row.hmr,
    breakdown_status: row.breakdown_status,
    mc_model: row.mc_model,
    installation_date: row.installation_date || null,
    site_location: row.site_location,
    deputation_date: row.deputation_date || null,
    deputation_time: row.deputation_time || null,
    engineer_onsite_time: row.engineer_onsite_time || null,
    work_completion_date: row.work_completion_date || null,
    work_completion_time: row.work_completion_time || null,
    labour_charge: row.labour_charge || 0,
    distance: row.distance || 0,
    da_applied: row.da_applied,
    ta_amt_approved: row.ta_amt_approved || 0,
    da_amt_approved: row.da_amt_approved || 0,
    total_tada: row.total_tada || 0,
    date: row.date || null
  }
]);

  if (error) {
    console.log("Insert error FULL:", JSON.stringify(error, null, 2));

    // restore if failed
    trElement.style.opacity = "1";
    trElement.style.pointerEvents = "auto";
    return;
  }

  // ✅ SUCCESS UI
  trElement.style.background = "#d4edda";
}


// BACK BUTTON
function goBack() {
  window.location.href = "dashboard.html";
}

// LOGOUT
function logout() {
  localStorage.removeItem("user");
  window.location.href = "index.html";
}

function formatDate(dateString) {
  if (!dateString) return "";

  const d = new Date(dateString);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = String(d.getFullYear()).slice(-2);

  return `${day}-${month}-${year}`;
}


// 🔥 ENTER KEY SEARCH
document.getElementById("machineInput").addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    searchMachine();
  }
});
