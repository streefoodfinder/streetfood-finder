// 🔥 Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBuT_SZS4Fhc42QDNBBdwFnabzxPJOPWrA",
  authDomain: "streetfood-finder.firebaseapp.com",
  projectId: "streetfood-finder",
  storageBucket: "streetfood-finder.firebasestorage.app",
  messagingSenderId: "541010943511",
  appId: "1:541010943511:web:9f70509b949b2f20f0c652"
};

// Init
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Popup
function openPopup() {
  document.getElementById("popupForm").style.display = "flex";
}

function closePopup() {
  document.getElementById("popupForm").style.display = "none";
}

// ➕ Add Stall
function addStall() {
  let name = document.getElementById("stallName").value;
  let location = document.getElementById("stallLocation").value;
  let image = document.getElementById("stallImage").value;
  let rating = document.getElementById("stallRating").value;

  if (!name || !location || !rating) {
    alert("Fill all fields!");
    return;
  }

  db.collection("stalls").add({
    name,
    location,
    image,
    rating,
    comments: []
  });

  closePopup();
}

// 📋 Show Stalls (REALTIME)
function showStalls() {
  db.collection("stalls").onSnapshot(snapshot => {
    let container = document.querySelector(".cards");
    container.innerHTML = "";

    snapshot.forEach(doc => {
      let stall = doc.data();

      container.innerHTML += `
        <div class="card">
          <img src="${stall.image || 'https://source.unsplash.com/400x300/?street-food'}" />
          
          <div class="card-content">
            <h3>${stall.name} ❤️</h3>
            <p>📍 ${stall.location}</p>
            <p>⭐ ${stall.rating}/5</p>

            <input placeholder="Write comment..." id="c-${doc.id}">
            <button onclick="addComment('${doc.id}')">Post</button>

            <div>
              ${(stall.comments || []).map(c => `<p>💬 ${c}</p>`).join("")}
            </div>
          </div>
        </div>
      `;
    });
  });
}

// 💬 Add Comment
function addComment(id) {
  let input = document.getElementById("c-" + id).value;

  if (!input) return;

  db.collection("stalls").doc(id).update({
    comments: firebase.firestore.FieldValue.arrayUnion(input)
  });
}

// Load
window.onload = function () {
  showStalls();
};

// Welcome Popup
function closeWelcome() {
  document.getElementById("welcomePopup").style.display = "none";
}

// Auto close after 7 sec
window.onload = function () {
  setTimeout(() => {
    let popup = document.getElementById("welcomePopup");
    if (popup) popup.style.display = "none";
  }, 7000);

  showStalls(); // keep your existing function
};

// Theme toggle
function toggleTheme() {
  document.body.classList.toggle("dark");
}

// Customize toggle (basic for now)
function toggleCustomize() {
  alert("Customize panel coming next 🔥");
}