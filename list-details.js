const SUPABASE_URL = "https://gmutgbdldiqbwomtdepi.supabase.co";
const SUPABASE_KEY = "sb_publishable_e-gFkBqs2qG2bSs1iBJPrQ_m3PZf5lN";

const { createClient } = window.supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

const listId = localStorage.getItem("openListId");

// SET TITLE
document.getElementById("listTitle").innerText = "List: " + listId;
console.log("OPEN LIST ID:", listId);
// LOAD DATA
async function loadListDetails() {

const { data, error } = await supabaseClient
  .from("svr_list_database")
  .select("*")
  .eq("ListId", listId);

console.log("DATA:", data);
console.log("ERROR:", error);

  if (error) {
    console.log(error);
    return;
  }

  const tbody = document.querySelector("#detailsTable tbody");
  tbody.innerHTML = "";

  data.forEach(row => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${formatDate(row.date)}</td>
      <td>${row.engineer_name || ""}</td>
      <td>${row.call_type || ""}</td>
      <td>${row.complaint || ""}</td>
      <td>${row.customer_name || ""}</td>
      <td>${row.machine_no || ""}</td>
      <td>${row.hmr || ""}</td>
      <td>${row.breakdown_status || ""}</td>
      <td>${row.labour_charge || ""}</td>
      <td>${row.distance || ""}</td>
      <td>${row.total_tada || ""}</td>
    `;

    tbody.appendChild(tr);
  });
}

// DATE FORMAT
function formatDate(dateString) {
  if (!dateString) return "";
  const d = new Date(dateString);
  return `${String(d.getDate()).padStart(2,'0')}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getFullYear()).slice(-2)}`;
}

// NAVIGATION
function goBack() {
  window.location.href = "dashboard.html";
}

function logout() {
  localStorage.removeItem("user");
  window.location.href = "index.html";
}

// LOAD
loadListDetails();
