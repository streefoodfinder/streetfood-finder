function toggleTheme() {
  document.body.classList.toggle("dark");
}

function toggleCustomize() {
  let panel = document.getElementById("customizePanel");
  panel.style.display = panel.style.display === "block" ? "none" : "block";
}

function setBg(image) {
  document.body.style.background = `url(${image}) no-repeat center center fixed`;
  document.body.style.backgroundSize = "cover";
}

/* Popup */
function openPopup() {
  document.getElementById("popupForm").style.display = "flex";
}

function closePopup() {
  document.getElementById("popupForm").style.display = "none";
}

/* Add Stall */
function addStall() {
  let name = document.getElementById("stallName").value;
  let location = document.getElementById("stallLocation").value;
  let image = document.getElementById("stallImage").value;
  let rating = document.getElementById("stallRating").value;

  if (!name || !location || !rating) {
    alert("Fill all fields!");
    return;
  }

  let card = `
    <div class="card">
      <img src="${image || 'https://source.unsplash.com/400x300/?food'}" />
      <div class="card-content">
        <h3>${name} ❤️</h3>
        <p>⭐ ${rating} • ${location}</p>
      </div>
    </div>
  `;

  document.querySelector(".cards").innerHTML += card;

  closePopup();
}