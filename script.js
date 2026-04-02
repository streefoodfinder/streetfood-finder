// FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyBuT_SZS4Fhc42QDNBBdwFnabzxPJOPWrA",
  authDomain: "streetfood-finder.firebaseapp.com",
  projectId: "streetfood-finder",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// SIDEBAR
function toggleSidebar(){
  sidebar.classList.toggle("active");
}

// POPUP
function openPopup(){ popup.style.display="flex"; }
function closePopup(){ popup.style.display="none"; }

// STAR
let rating = 0;
function setRating(r){ rating = r; }

// ADD
function addStall(){
  let name = stallName.value;
  let location = stallLocation.value;
  let comment = stallComment.value;
  let file = stallImage.files[0];

  if(!name || !location || !file || rating==0){
    showToast("Fill all fields");
    return;
  }

  let formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "new_rd");

  fetch("https://api.cloudinary.com/v1_1/dlptddlij/image/upload",{
    method:"POST",
    body:formData
  })
  .then(res=>res.json())
  .then(data=>{
    db.collection("stalls").add({
      name,
      location,
      rating,
      comment,
      image:data.secure_url
    });

    showToast("Uploaded ✅");
    loadStalls();
    closePopup();
  });
}

// LOAD
function loadStalls(){
  cards.innerHTML="";
  db.collection("stalls").get().then(snap=>{
    snap.forEach(doc=>{
      let s=doc.data();

      cards.innerHTML+=`
      <div class="card">
        <img src="${s.image}">
        <h3>${s.name}</h3>
        <p>📍 ${s.location}</p>
        <p>⭐ ${s.rating}</p>
        <p>💬 ${s.comment || ""}</p>
      </div>`;
    });
  });
}

// SEARCH
function searchStalls(){
  let loc=searchLocation.value.toLowerCase();
  let food=searchFood.value.toLowerCase();

  cards.innerHTML="";
  db.collection("stalls").get().then(snap=>{
    snap.forEach(doc=>{
      let s=doc.data();

      if(s.location.toLowerCase().includes(loc) &&
         s.name.toLowerCase().includes(food)){
        cards.innerHTML+=`
        <div class="card">
          <img src="${s.image}">
          <h3>${s.name}</h3>
          <p>📍 ${s.location}</p>
          <p>⭐ ${s.rating}</p>
          <p>💬 ${s.comment || ""}</p>
        </div>`;
      }
    });
  });
}

// TOAST
function showToast(msg){
  toast.innerText=msg;
  toast.style.display="block";
  setTimeout(()=>toast.style.display="none",2000);
}

loadStalls();