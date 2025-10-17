const loginSection = document.getElementById('loginSection');
const appSection = document.getElementById('appSection');
const emailInput = document.getElementById('emailInput');
const welcomeText = document.getElementById('welcomeText');
const dressList = document.getElementById('dressList');
const wearOptions = document.getElementById('wearOptions');
const historyList = document.getElementById('historyList');

let wardrobe = [], history = [];
let email = localStorage.getItem('currentUser');

// Auto-login if saved
if (email) showApp(email);

function login() {
  email = emailInput.value.trim();
  if (!email) { alert('Enter email'); return; }
  localStorage.setItem('currentUser', email);
  if (!localStorage.getItem(email + '_wardrobe'))
    localStorage.setItem(email + '_wardrobe', JSON.stringify([]));
  if (!localStorage.getItem(email + '_history'))
    localStorage.setItem(email + '_history', JSON.stringify([]));
  showApp(email);
}

function showApp(email) {
  loginSection.classList.add('hidden');
  appSection.classList.remove('hidden');
  welcomeText.textContent = 'Logged in as: ' + email;
  loadWardrobe();
  loadHistory();
}

function logout() {
  localStorage.removeItem('currentUser');
  location.reload();
}

// Tab Switching
function showTab(tab) {
  document.getElementById('wardrobeTab').classList.add('hidden');
  document.getElementById('wornTab').classList.add('hidden');
  document.getElementById('tabWardrobe').classList.remove('active');
  document.getElementById('tabWorn').classList.remove('active');

  if (tab === 'wardrobe') {
    document.getElementById('wardrobeTab').classList.remove('hidden');
    document.getElementById('tabWardrobe').classList.add('active');
  } else {
    document.getElementById('wornTab').classList.remove('hidden');
    document.getElementById('tabWorn').classList.add('active');
    refreshWearOptions();
  }
}

// Wardrobe
function loadWardrobe() {
  wardrobe = JSON.parse(localStorage.getItem(email + '_wardrobe')) || [];
  displayWardrobe();
}

function saveWardrobe() {
  localStorage.setItem(email + '_wardrobe', JSON.stringify(wardrobe));
  displayWardrobe();
}

function addDress() {
  const val = document.getElementById('dressInput').value.trim();
  if (!val) return alert('Enter dress name');
  wardrobe.push(val);
  document.getElementById('dressInput').value = '';
  saveWardrobe();
}

function displayWardrobe() {
  dressList.innerHTML = '';
  wardrobe.forEach((dress, i) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span contenteditable="true" onblur="editDress(${i}, this.innerText)">${dress}</span>
      <button onclick="deleteDress(${i})" class="small-btn">❌</button>
    `;
    dressList.appendChild(li);
  });
}

function editDress(i, text) {
  wardrobe[i] = text.trim();
  saveWardrobe();
}

function deleteDress(i) {
  wardrobe.splice(i, 1);
  saveWardrobe();
}

// Worn Section
function refreshWearOptions() {
  wearOptions.innerHTML = '';
  wardrobe.forEach((dress, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<label><input type="checkbox" id="dress${i}"> ${dress}</label>`;
    wearOptions.appendChild(li);
  });
}

function saveWorn() {
  const date = document.getElementById('wearDate').value;
  if (!date) return alert('Select a date');

  const worn = [];
  wardrobe.forEach((dress, i) => {
    const checkbox = document.getElementById('dress' + i);
    if (checkbox && checkbox.checked) worn.push(dress);
  });

  if (worn.length === 0) return alert('Select at least one dress');

  history.push({ date, worn });
  saveHistory();
  alert('Saved!');
  document.getElementById('wearDate').value = '';
  refreshWearOptions();
}

function loadHistory() {
  history = JSON.parse(localStorage.getItem(email + '_history')) || [];
  displayHistory();
}

function saveHistory() {
  localStorage.setItem(email + '_history', JSON.stringify(history));
  displayHistory();
}

function displayHistory() {
  historyList.innerHTML = '';
  history.forEach((item, i) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div style="text-align:left;flex:1;">
        <strong>${item.date}</strong><br>
        ${item.worn.join(', ')}
      </div>
      <button onclick="deleteHistory(${i})" class="small-btn">🗑️</button>
    `;
    historyList.appendChild(li);
  });
}

function deleteHistory(i) {
  history.splice(i, 1);
  saveHistory();
}
