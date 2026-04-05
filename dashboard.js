// Load user info
const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
  window.location.href = "index.html";
}

// Display username
document.getElementById("usernameDisplay").textContent = `👤 ${user.name}`;

// Section switching
function showSection(sectionId) {
  document.querySelectorAll(".section").forEach(sec => {
    sec.classList.remove("active");
  });

  document.getElementById(sectionId).classList.add("active");
}

// Logout
function logout() {
  localStorage.removeItem("user");
  window.location.href = "index.html";
}


async function openBranch(branchName) {
  closeModal();
  const SUPABASE_URL = "https://gmutgbdldiqbwomtdepi.supabase.co";
  const SUPABASE_KEY = "sb_publishable_e-gFkBqs2qG2bSs1iBJPrQ_m3PZf5lN";

  const { createClient } = window.supabase;
  const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

  const today = new Date();

  // FORMAT DATE ddmmyyyy
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();

  const datePrefix = `${day}${month}${year}`;


  // 🔥 LOADER START
  document.getElementById("loader").style.display = "flex";
  document.querySelectorAll("button").forEach(btn => {
    btn.disabled = true;
    btn.style.opacity = "0.6";
  });




  
  // 🔍 COUNT EXISTING LISTS TODAY
  const { data: existingLists, error: countError } = await supabaseClient
    .from("svr_list")
    .select("ListId")
    .like("ListId", `${datePrefix}-%`);

  if (countError) {
    console.log(countError);
    return;
  }

  const newNumber = existingLists.length + 1;
  const newListId = `${datePrefix}-${newNumber}`;

  // ✅ INSERT NEW LIST
  const { error: insertError } = await supabaseClient
    .from("svr_list")
    .insert([
      {
        ListId: newListId,
        Location: branchName,
        Status: "Open"
      }
    ]);

  if (insertError) {
    console.log(insertError);
    document.getElementById("loader").style.display = "none";
    return;
  }

  // 💾 SAVE TO LOCAL STORAGE
  localStorage.setItem("selectedBranch", branchName);
  localStorage.setItem("currentListId", newListId);
  localStorage.setItem("currentStatus", "Open");

  // 🚀 GO TO SEARCH PAGE
  document.getElementById("loader").style.display = "none";
  window.location.href = "search.html";
}


// OPEN MODAL
function openBranchModal() {
  document.getElementById("branchModal").style.display = "flex";
}

// CLOSE MODAL
function closeModal() {
  document.getElementById("branchModal").style.display = "none";
}


async function loadLists() {

  const SUPABASE_URL = "https://gmutgbdldiqbwomtdepi.supabase.co";
  const SUPABASE_KEY = "sb_publishable_e-gFkBqs2qG2bSs1iBJPrQ_m3PZf5lN";

  const { createClient } = window.supabase;
  const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

  const { data, error } = await supabaseClient
    .from("svr_list")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error);
    return;
  }

  const tbody = document.getElementById("listTableBody");
  tbody.innerHTML = "";

  data.forEach(row => {
    const tr = document.createElement("tr");

  tr.innerHTML = `
  <td>${row.ListId}</td>
  <td>${row.Location}</td>
  <td>${row.Status}</td>
  <td>${row.SVRCount || 0}</td>
  <td>${row.TotalTADA || 0}</td>
  <td>${row.PassedTADA || 0}</td>
  <td>${formatDate(row.created_at)}</td>
`;

    tbody.appendChild(tr);
  });
}


function formatDate(dateString) {
  const d = new Date(dateString);

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = String(d.getFullYear()).slice(-2);

  return `${day}-${month}-${year}`;
}


loadLists();
