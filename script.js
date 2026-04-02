// 🔥 FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyBuT_SZS4Fhc42QDNBBdwFnabzxPJOPWrA",
  authDomain: "streetfood-finder.firebaseapp.com",
  projectId: "streetfood-finder",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();


// 🌙 THEME TOGGLE
function toggleTheme() {
  document.body.classList.toggle("dark");
}


// 📌 POPUP
function openPopup() {
  document.getElementById("popup").style.display = "flex";
}

function closePopup() {
  document.getElementById("popup").style.display = "none";
}


// 🖼 IMAGE PREVIEW
document.getElementById("stallImage").addEventListener("change", function () {
  let file = this.files[0];
  let preview = document.getElementById("preview");

  if (file) {
    preview.src = URL.createObjectURL(file);
    preview.style.display = "block";
  }
});


// 🚀 ADD STALL (FINAL WORKING)
function addStall() {
  let name = document.getElementById("stallName").value;
  let location = document.getElementById("stallLocation").value;
  let rating = document.getElementById("stallRating").value;
  let file = document.getElementById("stallImage").files[0];

  if (!name || !location || !rating || !file) {
    showToast("Fill all fields ❗");
    return;
  }

  document.getElementById("progressBox").style.display = "block";

  let formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "new_rd");

  let xhr = new XMLHttpRequest();
  xhr.open("POST", "https://api.cloudinary.com/v1_1/dlptddlij/image/upload");

  // 📊 PROGRESS
  xhr.upload.onprogress = function (e) {
    if (e.lengthComputable) {
      let percent = Math.round((e.loaded / e.total) * 100);
      document.getElementById("progressBar").style.width = percent + "%";
    }
  };

  // ✅ SUCCESS
  xhr.onload = function () {
    let data = JSON.parse(xhr.responseText);

    if (data.secure_url) {
      db.collection("stalls").add({
        name,
        location,
        rating,
        image: data.secure_url,
      });

      showToast("Uploaded successfully ✅");

      document.getElementById("progressBox").style.display = "none";
      document.getElementById("progressBar").style.width = "0%";

      closePopup();
      loadStalls();
    } else {
      showToast("Upload failed ❌");
    }
  };

  // ❌ ERROR
  xhr.onerror = function () {
    showToast("Network error ❌");
  };

  xhr.send(formData);
}


// 📦 LOAD STALLS
function loadStalls() {
  let container = document.getElementById("cards");
  container.innerHTML = "";

  db.collection("stalls").get().then((snapshot) => {
    snapshot.forEach((doc) => {
      let s = doc.data();

      container.innerHTML += `
        <div class="card">
          <img src="${s.image}">
          <h3>${s.name}</h3>
          <p>📍 ${s.location}</p>
          <p>⭐ ${s.rating}</p>
        </div>
      `;
    });
  });
}


// 🔍 SEARCH
function searchStalls() {
  let loc = document.getElementById("searchLocation").value.toLowerCase();
  let food = document.getElementById("searchFood").value.toLowerCase();

  let container = document.getElementById("cards");
  container.innerHTML = "";

  db.collection("stalls").get().then((snapshot) => {
    snapshot.forEach((doc) => {
      let s = doc.data();

      if (
        s.location.toLowerCase().includes(loc) &&
        s.name.toLowerCase().includes(food)
      ) {
        container.innerHTML += `
          <div class="card">
            <img src="${s.image}">
            <h3>${s.name}</h3>
            <p>📍 ${s.location}</p>
            <p>⭐ ${s.rating}</p>
          </div>
        `;
      }
    });
  });
}


// 🔔 TOAST MESSAGE
function showToast(msg) {
  let toast = document.getElementById("toast");
  toast.innerText = msg;
  toast.style.display = "block";

  setTimeout(() => {
    toast.style.display = "none";
  }, 2000);
}


// 🔄 LOAD ON START
loadStalls();

function toggleSidebar() {
  let sidebar = document.getElementById("sidebar");

  if (sidebar.style.left === "0px") {
    sidebar.style.left = "-220px";
  } else {
    sidebar.style.left = "0px";
  }
}
function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("active");
}