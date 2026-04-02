// 🔥 FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyBuT_SZS4Fhc42QDNBBdwFnabzxPJOPWrA",
  authDomain: "streetfood-finder.firebaseapp.com",
  projectId: "streetfood-finder",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();


// 📌 POPUP
function openPopup() {
  document.getElementById("popup").style.display = "flex";
}

function closePopup() {
  document.getElementById("popup").style.display = "none";
}


// 🚀 ADD STALL (WITH CLOUDINARY IMAGE UPLOAD)
function addStall() {
  let name = document.getElementById("stallName").value;
  let location = document.getElementById("stallLocation").value;
  let rating = document.getElementById("stallRating").value;
  let file = document.getElementById("stallImage").files[0];

  if (!name || !location || !rating || !file) {
    alert("Fill all fields!");
    return;
  }

  let formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "new_rd");

  // ⚠️ IMPORTANT: YOUR CORRECT CLOUD NAME USED HERE
  fetch("https://api.cloudinary.com/v1_1/dlptddlij/image/upload", {
    method: "POST",
    body: formData
  })
  .then(res => res.json())
  .then(data => {

    if (data.secure_url) {

      db.collection("stalls").add({
        name: name,
        location: location,
        rating: rating,
        image: data.secure_url
      });

      alert("Upload successful ✅");
      closePopup();
      loadStalls();

    } else {
      alert("Upload failed ❌");
      console.log(data);
    }

  })
  .catch(err => {
    console.error(err);
    alert("Error uploading image ❌");
  });
}


// 📦 LOAD STALLS
function loadStalls() {
  let container = document.getElementById("cards");
  container.innerHTML = "";

  db.collection("stalls").get().then(snapshot => {
    snapshot.forEach(doc => {
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

  db.collection("stalls").get().then(snapshot => {
    snapshot.forEach(doc => {
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


// 🔄 LOAD ON START
loadStalls();
