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


function openBranch(branchName) {
  localStorage.setItem("selectedBranch", branchName);
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
