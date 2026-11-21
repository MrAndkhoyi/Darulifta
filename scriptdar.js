
setInterval(function(){
  document.getElementById("waqt").innerHTML = "[" + new Date().toLocaleTimeString() + "] [" + new Date().toLocaleDateString() + "]";
},1000);

let allFatwas = [];
let selectedCategory = "All";
let openedId = null;

function getFiltered(){
  const query = document.getElementById("search").value.trim().toLowerCase();
  return allFatwas.filter(function(f){
    const matchCat = selectedCategory === "All" || f.Category === selectedCategory;
    const matchSearch = String(f.FatwaID).includes(query) || String(f.Question).includes(query) || String(f.Answer).toLowerCase().includes(query);
    return matchCat && matchSearch;
  });
}

function renderFatwas(){
  const list = document.getElementById("fatwaList");
  const backBtn = document.getElementById("backBtn");
  list.innerHTML = "";

  // AGAR 1 FATWA KHULA HUA HAI, TO SIRF WOHI DIKHAO
  if(openedId !== null){
    const f = allFatwas.find(function(x){ return String(x.FatwaID) === String(openedId); });
    if(f){
      document.getElementById("status").textContent = "1 fatwa open";
      backBtn.style.display = "block";
      const box = document.createElement("div");
      box.className = "fatwa-box";
      const title = document.createElement("div");
      title.className = "fatwa-title";
      title.textContent = "فتوی نمبر" + f.FatwaID +"—" + f.Question;
      const answer = document.createElement("div");
      answer.className = "answer";
      answer.textContent = "جواب:"+f.Answer;
      const reference = document.createElement("div");
      reference.className = "reference";
      reference.textContent = "حواله: " + f.Reference;
      box.appendChild(title);
      box.appendChild(answer);
      box.appendChild(reference);
      list.appendChild(box);
    }
    return;
  }

  // NAHI TO LIST DIKHAO - SIRF TITLE
  const filtered = getFiltered();
  backBtn.style.display = "none";
  document.getElementById("status").textContent = filtered.length + " fatwa(s) found - Click to open 1";

  filtered.forEach(function(f){
    const btn = document.createElement("button");
    btn.className = "fatwa-item";
    btn.textContent = "فتوی نمبر" + f.FatwaID  + "— "+ f.Question;
    btn.onclick = function(){
      openedId = f.FatwaID;
      renderFatwas();
      window.scrollTo(0,0);
    };
    list.appendChild(btn);
  });
}

document.getElementById("backBtn").onclick = function(){
  openedId = null;
  renderFatwas();
};

document.getElementById("search").addEventListener("input", function(){
  openedId = null;
  renderFatwas();
});
document.querySelectorAll(".cat").forEach(function(button){
  button.addEventListener("click", function(){
    selectedCategory = button.dataset.cat;
    openedId = null;
    document.querySelectorAll(".cat").forEach(function(b){ b.classList.remove("active"); });
    button.classList.add("active");
    renderFatwas();
  });
});

fetch("fatwas.json?v=" + Date.now())
  .then(function(response){
    if(!response.ok) throw new Error("fatwas.json nahi mili - Status: " + response.status);
    return response.json();
  })
  .then(function(data){
    allFatwas = data;
    renderFatwas();
  })
  .catch(function(error){
    document.getElementById("status").textContent = "ERROR: " + error.message;
  });
