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




function toggleBranches() {
  const container = document.getElementById("branchContainer");

  if (container.style.display === "none") {
    container.style.display = "block";
  } else {
    container.style.display = "none";
  }
}
