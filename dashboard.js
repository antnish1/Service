// Load user info

let currentFilter = "all";
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

  const status = (row.Status || "").toLowerCase().trim();

  let show = false;

  switch (currentFilter) {

    case "open":
      show = status === "open";
      break;

    case "closed":
      show = status === "closed";
      break;

    case "verified":
      show = status === "verified";
      break;

    case "pending":
      show = ["open", "closed", "verified"].includes(status);
      break;

    case "unverified":
      show = ["open", "closed"].includes(status);
      break;

    case "verified_claim":
      show = ["verified", "passed"].includes(status);
      break;

    case "passed":
      show = status === "passed";
      break;

    case "all":
    default:
      show = true;
  }

  // 🚫 SKIP ROW IF NOT MATCHING
  if (!show) return;

  // ✅ KEEP YOUR EXISTING CODE BELOW THIS
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

tr.style.cursor = "pointer";

tr.addEventListener("click", () => {
  localStorage.setItem("openListId", row.ListId);
  window.location.href = "list-details.html";
});

    
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

async function loadDashboardStats() {

  const SUPABASE_URL = "https://gmutgbdldiqbwomtdepi.supabase.co";
  const SUPABASE_KEY = "sb_publishable_e-gFkBqs2qG2bSs1iBJPrQ_m3PZf5lN";

  const { createClient } = window.supabase;
  const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

  const { data: lists, error } = await supabaseClient
    .from("svr_list")
    .select("*");

  if (error) {
    console.log("Error:", error);
    return;
  }

  // ✅ COUNTERS
  let open = 0;
  let closed = 0;
  let verified = 0;

  let totalSVR = 0;
  let unverifiedAmt = 0;
  let verifiedAmt = 0;
  let passedAmt = 0;

  // 🔥 LOOP THROUGH ALL LISTS
  lists.forEach(l => {

    const status = (l.Status || "").trim().toLowerCase();

    const total = Number(l.TotalTADA) || 0;
    const passed = Number(l.PassedTADA) || 0;
    const svr = Number(l.SVRCount) || 0;

    // ✅ LIST STATUS COUNT
    if (status === "open") open++;
    else if (status === "closed") closed++;
    else if (status === "verified") verified++;

    // ✅ TOTAL SVR
    totalSVR += svr;

    // ✅ CLAIM STATUS LOGIC

    // 🔸 UNVERIFIED = OPEN + CLOSED
    if (status === "open" || status === "closed") {
      unverifiedAmt += total;
    }

    // 🔸 VERIFIED = VERIFIED + PASSED
    if (status === "verified" || status === "passed") {
      verifiedAmt += total;
    }

    // 🔸 PASSED ONLY
    if (status === "passed") {
      passedAmt += passed || total;
    }

  });

  // ✅ UPDATE UI
  document.getElementById("openCount").innerText = open;
  document.getElementById("closedCount").innerText = closed;
  document.getElementById("verifiedCount").innerText = verified;
  document.getElementById("totalPending").innerText = open + closed + verified;

  document.getElementById("totalSVR").innerText = totalSVR;
  document.getElementById("unverifiedAmt").innerText = "₹" + unverifiedAmt;
  document.getElementById("verifiedAmt").innerText = "₹" + verifiedAmt;
  document.getElementById("passedAmt").innerText = "₹" + passedAmt;
}


// CALL IT
loadDashboardStats();


function applyFilter(filter, element) {

  currentFilter = filter;

  // 🔥 REMOVE ACTIVE FROM ALL
  document.querySelectorAll(".mini").forEach(el => {
    el.classList.remove("active-card");
  });

  // ✅ ADD ACTIVE
  element.classList.add("active-card");

  // 🔄 RELOAD TABLE
  loadLists();
}

document.addEventListener("DOMContentLoaded", () => {

  // ✅ set default filter
  currentFilter = "pending";

  // 🔥 find pending card
  const pendingCard = document.querySelector(
    ".mini.highlight[onclick*='pending']"
  );

  if (pendingCard) {
    pendingCard.classList.add("active-card");
  }

  // 🔄 load filtered data
  loadLists();
});
