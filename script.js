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

  document.getElementById("loader").style.display = "block";

  let formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "new_rd");

  let xhr = new XMLHttpRequest();
  xhr.open("POST", "https://api.cloudinary.com/v1_1/dlptddlij/image/upload");

  xhr.upload.addEventListener("progress", function(e) {
    if (e.lengthComputable) {
      let percent = Math.round((e.loaded / e.total) * 100);
      document.getElementById("progress").innerText = percent + "%";
    }
  });

  xhr.onload = function() {
    let data = JSON.parse(xhr.responseText);

    if (data.secure_url) {
      db.collection("stalls").add({
        name,
        location,
        rating,
        image: data.secure_url
      });

      document.getElementById("loader").innerText = "Uploaded ✅";

      setTimeout(() => {
        document.getElementById("loader").style.display = "none";
        document.getElementById("progress").innerText = "0%";
      }, 2000);

      closePopup();
      loadStalls();
    }
  };

  xhr.send(formData);
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