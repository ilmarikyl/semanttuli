("use strict");

function toggleStatVisibility() {
	let statsDiv = document.getElementById("stats");
	let toggleButton = document.getElementById("toggle-stats-btn");

	if (statsDiv.style.display === "none" || !statsDiv.style.display) {
		statsDiv.style.display = "flex";
		toggleButton.textContent = "Piilota tilastot";
	} else {
		statsDiv.style.display = "none";
		toggleButton.textContent = "Näytä tilastot";
	}
}