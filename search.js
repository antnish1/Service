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
