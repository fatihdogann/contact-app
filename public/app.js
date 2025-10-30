const API = '/api/contacts';
const AUTH_API = '/api/auth';
const ADMIN_API = '/api/admin';

// Auth state
let authToken = localStorage.getItem('authToken');
let currentUser = null;

// Theme state
let currentTheme = localStorage.getItem('theme') || 'auto';

const els = {
  // Auth elements
  authScreen: document.getElementById('auth-screen'),
  appScreen: document.getElementById('app-screen'),
  adminScreen: document.getElementById('admin-screen'),
  loginPanel: document.getElementById('login-panel'),
  registerPanel: document.getElementById('register-panel'),
  loginForm: document.getElementById('login-form'),
  registerForm: document.getElementById('register-form'),
  showRegisterBtn: document.getElementById('show-register-btn'),
  showLoginBtn: document.getElementById('show-login-btn'),
  logoutBtn: document.getElementById('logout-btn'),
  adminLogoutBtn: document.getElementById('admin-logout-btn'),
  adminPanelBtn: document.getElementById('admin-panel-btn'),
  backToAppBtn: document.getElementById('back-to-app-btn'),
  userNameDisplay: document.getElementById('user-name-display'),
  adminUserDisplay: document.getElementById('admin-user-display'),
  captchaQuestion: document.getElementById('captcha-question'),
  captchaAnswer: document.getElementById('captcha-answer'),
  
  // Admin elements
  pendingUsersList: document.getElementById('pending-users-list'),
  allUsersList: document.getElementById('all-users-list'),
  pendingCountBadge: document.getElementById('pending-count-badge'),
  allUsersCountBadge: document.getElementById('all-users-count-badge'),
  userSearch: document.getElementById('user-search'),
  
  // Contact elements
  id: document.getElementById('contact-id'),
  firstName: document.getElementById('firstName'),
  lastName: document.getElementById('lastName'),
  phone: document.getElementById('phone'),
  category: document.getElementById('category'),
  categoryDatalist: document.getElementById('category-datalist'),
  categoryFilter: document.getElementById('category-filter'),
  form: document.getElementById('contact-form'),
  save: document.getElementById('save-btn'),
  cancel: document.getElementById('cancel-btn'),
  contactsList: document.getElementById('contacts-list'),
  emptyState: document.getElementById('empty-state'),
  search: document.getElementById('search'),
  clearSearch: document.getElementById('clear-search'),
  phoneHint: document.getElementById('phone-hint'),
  count: document.getElementById('count-badge'),
  fileUpload: document.getElementById('file-upload'),
  uploadBtn: document.getElementById('upload-btn'),
  uploadStatus: document.getElementById('upload-status'),
  contactFormCard: document.getElementById('contact-form-card'),
  uploadCard: document.getElementById('upload-card'),
  formTitle: document.getElementById('form-title'),
  showAddFormBtn: document.getElementById('show-add-form-btn'),
  showUploadBtn: document.getElementById('show-upload-btn'),
  closeFormBtn: document.getElementById('close-form-btn'),
  closeUploadBtn: document.getElementById('close-upload-btn'),
};

function escapeHtml(str){
  return (str||'').replace(/[&<>"']/g, s=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[s]));
}

function cardTemplate(c){
  const categoryBadge = c.category 
    ? `<span class="px-2 py-1 bg-primary/20 text-primary rounded text-xs font-semibold">${escapeHtml(c.category)}</span>`
    : '';
  
  return `<div class="bg-white dark:bg-card-dark rounded-lg shadow-sm p-4 flex items-center justify-between border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
    <div class="flex-1">
      <div class="flex items-center gap-2 mb-1">
        <h3 class="text-lg font-bold text-slate-900 dark:text-white">${escapeHtml(c.firstName)} ${escapeHtml(c.lastName)}</h3>
        ${categoryBadge}
      </div>
      <p class="text-primary font-medium">${escapeHtml(c.phone)}</p>
    </div>
    <div class="flex items-center gap-2">
      <button data-id="${c.id}" class="edit-contact p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors" title="Düzenle">
        <i class="bi bi-pencil text-xl text-slate-600 dark:text-slate-300"></i>
      </button>
      <button data-id="${c.id}" class="delete-contact p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Sil">
        <i class="bi bi-trash3 text-xl text-red-500"></i>
      </button>
    </div>
  </div>`;
}

async function list(query='', category=''){
  let url = API;
  const params = new URLSearchParams();
  if (query) params.append('q', query);
  if (category) params.append('category', category);
  
  if (params.toString()) {
    url = query ? `${API}/search?${params.toString()}` : `${API}?${params.toString()}`;
  }
  
  const res = await authFetch(url);
  if (!res.ok) throw new Error('Listeleme hatası');
  const data = await res.json();
  els.count.textContent = `${data.length} kişi`;
  
  if (!data.length) {
    els.contactsList.innerHTML = '';
    const emptyState = document.getElementById('empty-state');
    
    // Arama veya filtreleme yapılmışsa farklı mesaj göster
    if (query || category) {
      emptyState.innerHTML = `
        <i class="bi bi-search text-6xl mb-4 block"></i>
        <p class="text-lg font-medium">Arama sonucu bulunamadı</p>
        <p class="text-sm mt-2">"${query || category}" için sonuç yok. Farklı bir arama yapın.</p>
      `;
    } else {
      emptyState.innerHTML = `
        <i class="bi bi-inbox text-6xl mb-4 block"></i>
        <p class="text-lg font-medium">Henüz kişi eklenmemiş</p>
        <p class="text-sm mt-2">Yeni kişi eklemek için yan menüden "+" butonuna tıklayın</p>
      `;
    }
    emptyState.style.display = 'block';
  } else {
    els.emptyState.style.display = 'none';
    els.contactsList.innerHTML = data.map(cardTemplate).join('');
  }
  
  // Update categories
  await loadCategories();
}

async function create(payload){
  const res = await authFetch(API, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload)});
  if(!res.ok){
    const err = await res.json().catch(()=>({error:'Hata'}));
    if (res.status === 413) {
      // Storage limit exceeded
      const msg = err.error || 'Depolama limitiniz doldu!';
      if (err.storageInfo) {
        const usedMB = (err.storageInfo.used / (1024 * 1024)).toFixed(2);
        const limitMB = (err.storageInfo.limit / (1024 * 1024)).toFixed(0);
        throw new Error(`${msg}\n\nKullanılan: ${usedMB} MB / ${limitMB} MB`);
      }
      throw new Error(msg);
    }
    throw new Error(err.error || 'Oluşturma hatası');
  }
  await loadCategories();
  return res.json();
}

async function update(id, payload){
  const res = await authFetch(`${API}/${id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload)});
  if(!res.ok){
    const err = await res.json().catch(()=>({error:'Hata'}));
    throw new Error(err.error || 'Güncelleme hatası');
  }
  await loadCategories();
  return res.json();
}

async function remove(id){
  const res = await authFetch(`${API}/${id}`, { method:'DELETE' });
  if(!res.ok){
    const err = await res.json().catch(()=>({error:'Hata'}));
    throw new Error(err.error || 'Silme hatası');
  }
}

function resetForm(){
  els.id.value = '';
  els.firstName.value = '';
  els.lastName.value = '';
  els.phone.value = '';
  els.category.value = '';
}

// Load categories
async function loadCategories() {
  try {
    const res = await authFetch(`${API}/categories/list`);
    const categories = await res.json();
    
    // Update datalist
    els.categoryDatalist.innerHTML = categories.map(cat => 
      `<option value="${escapeHtml(cat)}">`
    ).join('');
    
    // Update filter dropdown
    const currentFilter = els.categoryFilter.value;
    els.categoryFilter.innerHTML = '<option value="">Tüm Kategoriler</option>' + 
      categories.map(cat => 
        `<option value="${escapeHtml(cat)}">${escapeHtml(cat)}</option>`
      ).join('');
    els.categoryFilter.value = currentFilter; // Restore selection
  } catch (err) {
    console.error('Categories load error:', err);
  }
}

// Client-side validation helpers (mirror server rules)
const nameRe = /^[A-Za-zÇçĞğİıÖöŞşÜü' -]+$/u;
function normalizePhoneTr(raw){
  let digits = String(raw || '').replace(/\D+/g, '');
  if (digits.startsWith('90')) digits = digits.slice(2);
  if (digits.length === 10) digits = '0' + digits;
  if (digits.length !== 11 || digits[0] !== '0') return null;
  if (!/^0(5\d{2}|[234]\d{2})\d{7}$/.test(digits)) return null;
  return digits;
}

// Live input filtering
els.firstName.addEventListener('input', () => {
  const cleaned = els.firstName.value.replace(/[0-9]/g, '');
  if (cleaned !== els.firstName.value) els.firstName.value = cleaned;
});
els.lastName.addEventListener('input', () => {
  const cleaned = els.lastName.value.replace(/[0-9]/g, '');
  if (cleaned !== els.lastName.value) els.lastName.value = cleaned;
});
els.phone.addEventListener('input', () => {
  const onlyDigits = els.phone.value.replace(/\D+/g, '');
  if (onlyDigits !== els.phone.value) els.phone.value = onlyDigits;
  const ok = normalizePhoneTr(onlyDigits);
  els.phoneHint.style.color = ok ? '#6b7280' : '#ef4444';
});

// Submit
els.form.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const firstName = els.firstName.value.trim();
  const lastName = els.lastName.value.trim();
  const phoneRaw = els.phone.value.trim();
  const category = els.category.value.trim();

  if (!nameRe.test(firstName)) { alert('Ad sadece harf içermelidir.'); return; }
  if (!nameRe.test(lastName)) { alert('Soyad sadece harf içermelidir.'); return; }
  const phone = normalizePhoneTr(phoneRaw);
  if (!phone) { alert('Geçerli bir Türkiye telefon numarası giriniz.'); return; }

  try{
    if(els.id.value){
      await update(els.id.value, { firstName, lastName, phone, category: category || null });
    } else {
      await create({ firstName, lastName, phone, category: category || null });
    }
    resetForm();
    els.contactFormCard.style.display = 'none';
    await list(els.search.value.trim(), els.categoryFilter.value);
  }catch(err){
    alert(err.message);
  }
});

els.cancel.addEventListener('click', () => {
  resetForm();
  els.contactFormCard.style.display = 'none';
});

// Show/hide form and upload cards
els.showAddFormBtn.addEventListener('click', () => {
  els.contactFormCard.style.display = 'block';
  els.uploadCard.style.display = 'none';
  els.formTitle.textContent = 'Yeni Kişi Ekle';
  resetForm();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

els.showUploadBtn.addEventListener('click', () => {
  els.uploadCard.style.display = 'block';
  els.contactFormCard.style.display = 'none';
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

els.closeFormBtn.addEventListener('click', () => {
  els.contactFormCard.style.display = 'none';
  resetForm();
});

els.closeUploadBtn.addEventListener('click', () => {
  els.uploadCard.style.display = 'none';
});

// Card actions
els.contactsList.addEventListener('click', async (e)=>{
  const btn = e.target.closest('button');
  if(!btn) return;
  const id = btn.getAttribute('data-id');
  if(!id) return;
  
  if(btn.classList.contains('edit-contact')){
    const res = await authFetch(`${API}/${id}`);
    if(!res.ok){ alert('Kayıt bulunamadı'); return; }
    const c = await res.json();
    els.id.value = c.id;
    els.firstName.value = c.firstName;
    els.lastName.value = c.lastName;
    els.phone.value = c.phone;
    els.category.value = c.category || '';
    els.formTitle.textContent = 'Kişiyi Düzenle';
    els.contactFormCard.style.display = 'block';
    els.uploadCard.style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  if(btn.classList.contains('delete-contact')){
    if(confirm('Bu kişiyi silmek istediğinize emin misiniz?')){
      try{ await remove(id); await list(els.search.value.trim(), els.categoryFilter.value); }catch(err){ alert(err.message); }
    }
  }
});

// Live search (debounced)
function debounce(fn, ms){ let t; return (...args)=>{ clearTimeout(t); t=setTimeout(()=>fn(...args), ms); }; }
const refresh = debounce(()=> list(els.search.value.trim(), els.categoryFilter.value).catch(console.error), 200);
els.search.addEventListener('input', refresh);
els.clearSearch.addEventListener('click', ()=>{ els.search.value=''; els.search.focus(); list('', els.categoryFilter.value).catch(console.error); });

// Category filter
els.categoryFilter.addEventListener('change', ()=> {
  list(els.search.value.trim(), els.categoryFilter.value).catch(console.error);
});

// Initial load (removed - now handled by auth system)

// Footer year
const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();

// ============= AUTH SYSTEM =============

// Load provinces and districts
let provincesData = {};
fetch('/provinces.json')
  .then(res => res.json())
  .then(data => {
    provincesData = data;
    const provinceSelect = document.getElementById('reg-province');
    if (provinceSelect) {
      Object.keys(data).sort().forEach(province => {
        const option = document.createElement('option');
        option.value = province;
        option.textContent = province;
        provinceSelect.appendChild(option);
      });
    }
  })
  .catch(err => console.error('İl verileri yüklenemedi:', err));

// Province change handler
const provinceSelect = document.getElementById('reg-province');
const districtSelect = document.getElementById('reg-district');
if (provinceSelect && districtSelect) {
  provinceSelect.addEventListener('change', (e) => {
    const province = e.target.value;
    districtSelect.innerHTML = '<option value="">İlçe Seçiniz</option>';
    if (province && provincesData[province]) {
      provincesData[province].forEach(district => {
        const option = document.createElement('option');
        option.value = district;
        option.textContent = district;
        districtSelect.appendChild(option);
      });
    }
  });
}

// Check auth status
async function checkAuth() {
  if (!authToken) {
    showAuthScreen();
    return false;
  }
  
  try {
    const res = await fetch(`${AUTH_API}/me`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    
    if (!res.ok) {
      throw new Error('Auth failed');
    }
    
    currentUser = await res.json();
    showAppScreen();
    
    // Load contacts after showing app screen
    await list('', '');
    
    return true;
  } catch (err) {
    console.error('Auth error:', err);
    logout();
    return false;
  }
}

function showAuthScreen() {
  els.authScreen.style.display = 'block';
  els.appScreen.style.display = 'none';
  els.adminScreen.style.display = 'none';
  els.loginPanel.style.display = 'block';
  els.registerPanel.style.display = 'none';
}

function showAppScreen() {
  els.authScreen.style.display = 'none';
  els.appScreen.style.display = 'flex';
  els.adminScreen.style.display = 'none';
  if (currentUser) {
    els.userNameDisplay.textContent = currentUser.fullName;
    if (currentUser.role === 'admin') {
      els.adminPanelBtn.style.display = 'block';
    } else {
      els.adminPanelBtn.style.display = 'none';
    }
  }
}

function logout() {
  authToken = null;
  currentUser = null;
  localStorage.removeItem('authToken');
  showAuthScreen();
}

// Captcha system
let captchaAnswer = 0;
function generateCaptcha() {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const operations = ['+', '-', '×'];
  const operation = operations[Math.floor(Math.random() * operations.length)];
  
  let question = `${num1} ${operation} ${num2} = ?`;
  
  switch(operation) {
    case '+':
      captchaAnswer = num1 + num2;
      break;
    case '-':
      captchaAnswer = num1 - num2;
      break;
    case '×':
      captchaAnswer = num1 * num2;
      break;
  }
  
  els.captchaQuestion.textContent = question;
}

// Toggle between login and register
els.showRegisterBtn.addEventListener('click', () => {
  els.loginPanel.style.display = 'none';
  els.registerPanel.style.display = 'block';
  generateCaptcha(); // Generate captcha when showing register
});

els.showLoginBtn.addEventListener('click', () => {
  els.registerPanel.style.display = 'none';
  els.loginPanel.style.display = 'block';
});

els.logoutBtn.addEventListener('click', logout);

// Login form submit
els.loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  
  try {
    const res = await fetch(`${AUTH_API}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      alert(data.error || 'Giriş başarısız');
      return;
    }
    
    authToken = data.token;
    localStorage.setItem('authToken', authToken);
    currentUser = data.user;
    
    showAppScreen();
    list().catch(console.error);
  } catch (err) {
    alert('Giriş hatası: ' + err.message);
  }
});

// Register form submit
els.registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // Check captcha
  const userAnswer = parseInt(els.captchaAnswer.value);
  if (userAnswer !== captchaAnswer) {
    alert('Güvenlik sorusunun cevabı yanlış. Lütfen tekrar deneyin.');
    generateCaptcha();
    els.captchaAnswer.value = '';
    return;
  }
  
  const payload = {
    fullName: document.getElementById('reg-fullname').value.trim(),
    phone: document.getElementById('reg-phone').value.trim(),
    email: document.getElementById('reg-email').value.trim(),
    password: document.getElementById('reg-password').value,
    age: parseInt(document.getElementById('reg-age').value),
    province: document.getElementById('reg-province').value,
    district: document.getElementById('reg-district').value,
    gender: document.getElementById('reg-gender').value || null
  };
  
  try {
    const res = await fetch(`${AUTH_API}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      alert(data.error || 'Kayıt başarısız');
      generateCaptcha();
      els.captchaAnswer.value = '';
      return;
    }
    
    alert(data.message || 'Kayıt başarılı! Hesabınız onay bekliyor.');
    els.registerForm.reset();
    els.registerPanel.style.display = 'none';
    els.loginPanel.style.display = 'block';
  } catch (err) {
    alert('Kayıt hatası: ' + err.message);
    generateCaptcha();
    els.captchaAnswer.value = '';
  }
});

// Update API calls to include auth token
async function authFetch(url, options = {}) {
  if (!authToken) {
    throw new Error('Not authenticated');
  }
  
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${authToken}`
  };
  
  const res = await fetch(url, { ...options, headers });
  
  if (res.status === 401) {
    logout();
    throw new Error('Oturum süresi doldu. Lütfen tekrar giriş yapın.');
  }
  
  return res;
}

// Initialize auth on load
checkAuth();

// ============= FILE UPLOAD SYSTEM =============

// Parse CSV file
function parseCSV(text) {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const contacts = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    const contact = {};
    
    headers.forEach((header, index) => {
      contact[header] = values[index] ? values[index].trim() : '';
    });
    
    // Map common field names
    const firstName = contact.firstname || contact['first name'] || contact.ad || '';
    const lastName = contact.lastname || contact['last name'] || contact.soyad || '';
    const phone = contact.phone || contact.telefon || contact.number || contact.tel || '';
    const category = contact.category || contact.kategori || contact.group || '';
    
    if (firstName && lastName && phone) {
      contacts.push({ firstName, lastName, phone, category });
    }
  }
  
  return contacts;
}

// Parse VCF file
function parseVCF(text) {
  const contacts = [];
  const vcards = text.split('BEGIN:VCARD');
  
  for (const vcard of vcards) {
    if (!vcard.trim()) continue;
    
    let firstName = '';
    let lastName = '';
    let phone = '';
    let category = '';
    
    const lines = vcard.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      // Parse FN (Full Name)
      if (trimmed.startsWith('FN:')) {
        const fullName = trimmed.substring(3).trim();
        const parts = fullName.split(' ');
        firstName = parts[0] || '';
        lastName = parts.slice(1).join(' ') || '';
      }
      
      // Parse N (Name)
      if (trimmed.startsWith('N:')) {
        const parts = trimmed.substring(2).split(';');
        lastName = parts[0] || lastName;
        firstName = parts[1] || firstName;
      }
      
      // Parse TEL (Phone)
      if (trimmed.startsWith('TEL')) {
        const colonIndex = trimmed.indexOf(':');
        if (colonIndex > -1) {
          phone = trimmed.substring(colonIndex + 1).trim();
        }
      }
      
      // Parse CATEGORIES
      if (trimmed.startsWith('CATEGORIES:')) {
        category = trimmed.substring(11).trim();
      }
    }
    
    if (firstName && lastName && phone) {
      contacts.push({ firstName, lastName, phone, category });
    }
  }
  
  return contacts;
}

// Parse JSON file
function parseJSON(text) {
  try {
    const data = JSON.parse(text);
    const contacts = [];
    
    // Handle array of contacts
    const array = Array.isArray(data) ? data : [data];
    
    for (const item of array) {
      const firstName = item.firstName || item.first_name || item.ad || item.name?.split(' ')[0] || '';
      const lastName = item.lastName || item.last_name || item.soyad || item.name?.split(' ').slice(1).join(' ') || '';
      const phone = item.phone || item.telefon || item.phoneNumber || item.tel || '';
      const category = item.category || item.kategori || item.group || '';
      
      if (firstName && lastName && phone) {
        contacts.push({ firstName, lastName, phone, category });
      }
    }
    
    return contacts;
  } catch (err) {
    console.error('JSON parse error:', err);
    return [];
  }
}

// Upload button handler
els.uploadBtn.addEventListener('click', async () => {
  const file = els.fileUpload.files[0];
  
  if (!file) {
    alert('Lütfen bir dosya seçin');
    return;
  }
  
  els.uploadStatus.innerHTML = '<span style="color: #3b82f6;">Dosya işleniyor...</span>';
  els.uploadBtn.disabled = true;
  
  try {
    const text = await file.text();
    let contacts = [];
    
    // Determine file type and parse
    if (file.name.endsWith('.csv')) {
      contacts = parseCSV(text);
    } else if (file.name.endsWith('.vcf') || file.name.endsWith('.vcard')) {
      contacts = parseVCF(text);
    } else if (file.name.endsWith('.json')) {
      contacts = parseJSON(text);
    } else {
      throw new Error('Desteklenmeyen dosya formatı');
    }
    
    if (contacts.length === 0) {
      els.uploadStatus.innerHTML = '<span style="color: #f59e0b;">Dosyada geçerli kişi bulunamadı</span>';
      els.uploadBtn.disabled = false;
      return;
    }
    
    // Upload contacts one by one
    let successCount = 0;
    let failCount = 0;
    
    for (const contact of contacts) {
      try {
        await create(contact);
        successCount++;
        els.uploadStatus.innerHTML = `<span style="color: #3b82f6;">İşleniyor: ${successCount}/${contacts.length}</span>`;
      } catch (err) {
        console.error('Upload error:', err);
        failCount++;
      }
    }
    
    els.uploadStatus.innerHTML = `<span style="color: #10b981;">✓ Başarıyla yüklendi: ${successCount} kişi${failCount > 0 ? ` (${failCount} hata)` : ''}</span>`;
    els.fileUpload.value = '';
    await list(els.search.value.trim(), els.categoryFilter.value);
    
  } catch (err) {
    els.uploadStatus.innerHTML = `<span style="color: #ef4444;">Hata: ${err.message}</span>`;
  }
  
  els.uploadBtn.disabled = false;
});

// ============= THEME SYSTEM =============

function applyTheme(theme) {
  const html = document.documentElement;
  const themeIcon = document.getElementById('theme-icon');
  const adminThemeIcon = document.getElementById('admin-theme-icon');
  
  if (theme === 'auto') {
    // Auto theme based on time (6 AM - 6 PM = light, else dark)
    const hour = new Date().getHours();
    const isDay = hour >= 6 && hour < 18;
    
    if (isDay) {
      html.classList.remove('dark');
      if (themeIcon) themeIcon.className = 'bi bi-moon-fill text-xl text-slate-600 dark:text-slate-300';
      if (adminThemeIcon) adminThemeIcon.className = 'bi bi-moon-fill text-xl';
    } else {
      html.classList.add('dark');
      if (themeIcon) themeIcon.className = 'bi bi-sun-fill text-xl text-slate-600 dark:text-slate-300';
      if (adminThemeIcon) adminThemeIcon.className = 'bi bi-sun-fill text-xl';
    }
  } else if (theme === 'dark') {
    html.classList.add('dark');
    if (themeIcon) themeIcon.className = 'bi bi-sun-fill text-xl text-slate-600 dark:text-slate-300';
    if (adminThemeIcon) adminThemeIcon.className = 'bi bi-sun-fill text-xl';
  } else {
    html.classList.remove('dark');
    if (themeIcon) themeIcon.className = 'bi bi-moon-fill text-xl text-slate-600 dark:text-slate-300';
    if (adminThemeIcon) adminThemeIcon.className = 'bi bi-moon-fill text-xl';
  }
}

function cycleTheme() {
  // Cycle: light -> dark -> auto -> light
  if (currentTheme === 'light') {
    currentTheme = 'dark';
  } else if (currentTheme === 'dark') {
    currentTheme = 'auto';
  } else {
    currentTheme = 'light';
  }
  
  localStorage.setItem('theme', currentTheme);
  applyTheme(currentTheme);
  
  // Show toast notification
  const themeNames = { light: 'Aydınlık', dark: 'Karanlık', auto: 'Otomatik' };
  showToast(`Tema: ${themeNames[currentTheme]}`);
}

function showToast(message) {
  // Remove existing toast
  const existing = document.getElementById('theme-toast');
  if (existing) existing.remove();
  
  // Create toast
  const toast = document.createElement('div');
  toast.id = 'theme-toast';
  toast.className = 'fixed bottom-4 right-4 bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 px-4 py-2 rounded-lg shadow-lg z-50 transition-opacity';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  // Remove after 2 seconds
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

// Theme toggle buttons
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const adminThemeToggleBtn = document.getElementById('admin-theme-toggle-btn');

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', cycleTheme);
}

if (adminThemeToggleBtn) {
  adminThemeToggleBtn.addEventListener('click', cycleTheme);
}

// Apply theme on load
applyTheme(currentTheme);

// Update auto theme every minute
if (currentTheme === 'auto') {
  setInterval(() => {
    if (currentTheme === 'auto') {
      applyTheme('auto');
    }
  }, 60000);
}

// ============= ADMIN PANEL =============

// Show admin panel
function showAdminPanel() {
  els.authScreen.style.display = 'none';
  els.appScreen.style.display = 'none';
  els.adminScreen.style.display = 'block';
  if (currentUser) {
    els.adminUserDisplay.textContent = currentUser.fullName;
  }
  document.getElementById('admin-year').textContent = new Date().getFullYear();
  loadAdminData();
}

// Admin panel button click
els.adminPanelBtn.addEventListener('click', () => {
  if (currentUser && currentUser.role === 'admin') {
    showAdminPanel();
  } else {
    alert('Bu özellik sadece admin kullanıcılar için erişilebilir.');
  }
});

// Back to app button
els.backToAppBtn.addEventListener('click', () => {
  showAppScreen();
  list().catch(console.error);
});

// Admin logout
els.adminLogoutBtn.addEventListener('click', logout);

// Load admin data
async function loadAdminData() {
  await Promise.all([
    loadAdminStats(),
    loadPendingUsers(),
    loadAllUsers()
  ]);
}

// Load admin statistics
async function loadAdminStats() {
  try {
    const [usersRes, contactsRes] = await Promise.all([
      authFetch(`${ADMIN_API}/users`),
      authFetch(`${ADMIN_API}/contacts`)
    ]);
    
    const users = await usersRes.json();
    const contacts = await contactsRes.json();
    
    const totalUsers = users.length;
    const pendingUsers = users.filter(u => !u.approved).length;
    const approvedUsers = users.filter(u => u.approved).length;
    const totalContacts = contacts.length;
    
    document.getElementById('stat-total-users').textContent = totalUsers;
    document.getElementById('stat-pending-users').textContent = pendingUsers;
    document.getElementById('stat-approved-users').textContent = approvedUsers;
    document.getElementById('stat-total-contacts').textContent = totalContacts;
  } catch (err) {
    console.error('Stats load error:', err);
  }
}

// Load pending users
async function loadPendingUsers() {
  try {
    const res = await authFetch(`${ADMIN_API}/users/pending`);
    const users = await res.json();
    
    els.pendingCountBadge.textContent = users.length;
    
    if (users.length === 0) {
      els.pendingUsersList.innerHTML = '<p class="text-center text-slate-500">Onay bekleyen kullanıcı yok.</p>';
      return;
    }
    
    els.pendingUsersList.innerHTML = users.map(user => `
      <div class="user-card" style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 12px; background: white;">
        <div style="display: flex; justify-content: space-between; align-items: start;">
          <div style="flex: 1;">
            <h3 style="font-weight: 600; margin-bottom: 8px;">${escapeHtml(user.fullName)}</h3>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; font-size: 14px; color: #64748b;">
              <div><strong>E-posta:</strong> ${escapeHtml(user.email)}</div>
              <div><strong>Telefon:</strong> ${escapeHtml(user.phone)}</div>
              <div><strong>Yaş:</strong> ${user.age}</div>
              <div><strong>Cinsiyet:</strong> ${escapeHtml(user.gender || '-')}</div>
              <div><strong>İl:</strong> ${escapeHtml(user.province)}</div>
              <div><strong>İlçe:</strong> ${escapeHtml(user.district)}</div>
            </div>
            <div style="margin-top: 8px; font-size: 12px; color: #94a3b8;">
              Kayıt: ${new Date(user.createdAt).toLocaleString('tr-TR')}
            </div>
          </div>
          <div style="display: flex; gap: 8px; margin-left: 16px;">
            <button onclick="approveUser('${user.id}')" class="icon" style="background: #10b981; color: white; padding: 8px 16px; border-radius: 6px; border: none; cursor: pointer;" title="Onayla">
              <i class="bi bi-check-lg"></i> Onayla
            </button>
            <button onclick="rejectUser('${user.id}')" class="icon danger" style="background: #ef4444; color: white; padding: 8px 16px; border-radius: 6px; border: none; cursor: pointer;" title="Reddet">
              <i class="bi bi-x-lg"></i> Reddet
            </button>
          </div>
        </div>
      </div>
    `).join('');
  } catch (err) {
    console.error('Pending users error:', err);
    els.pendingUsersList.innerHTML = '<p class="text-center text-red-500">Hata: ' + err.message + '</p>';
  }
}

// Load all users
let allUsersCache = [];
let contactCountsCache = {};

async function loadAllUsers() {
  try {
    const [usersRes, contactsRes] = await Promise.all([
      authFetch(`${ADMIN_API}/users`),
      authFetch(`${ADMIN_API}/contacts`)
    ]);
    const users = await usersRes.json();
    const allContacts = await contactsRes.json();
    
    // Count contacts per user
    contactCountsCache = {};
    allContacts.forEach(contact => {
      contactCountsCache[contact.userId] = (contactCountsCache[contact.userId] || 0) + 1;
    });
    
    allUsersCache = users;
    renderAllUsers(users);
  } catch (err) {
    console.error('All users error:', err);
    els.allUsersList.innerHTML = '<p class="text-center text-red-500">Hata: ' + err.message + '</p>';
  }
}

function renderAllUsers(users) {
  els.allUsersCountBadge.textContent = users.length;
  
  if (users.length === 0) {
    els.allUsersList.innerHTML = '<p class="text-center text-slate-500">Kullanıcı bulunamadı.</p>';
    return;
  }
  
  els.allUsersList.innerHTML = users.map(user => {
    const statusBadge = user.approved 
      ? '<span style="background: #10b981; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px;">Onaylı</span>'
      : '<span style="background: #f59e0b; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px;">Bekliyor</span>';
    
    const roleBadge = user.role === 'admin'
      ? '<span style="background: #8b5cf6; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px;">Admin</span>'
      : '<span style="background: #3b82f6; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px;">Kullanıcı</span>';
    
    // Real contact count
    const contactCount = contactCountsCache[user.id] || 0;
    
    // Real storage data
    const storageUsedBytes = user.storageUsed || 0;
    const storageLimitBytes = user.storageLimit || (100 * 1024 * 1024); // 100 MB default
    const storageUsedMB = (storageUsedBytes / (1024 * 1024)).toFixed(2);
    const storageLimitMB = (storageLimitBytes / (1024 * 1024)).toFixed(0);
    const storagePercent = (storageUsedBytes / storageLimitBytes) * 100;
    const storageColor = storagePercent > 80 ? '#ef4444' : storagePercent > 50 ? '#f59e0b' : '#10b981';
    
    return `
      <div class="user-card" style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 12px; background: white; cursor: pointer; transition: all 0.2s;" 
           onmouseover="this.style.borderColor='#3b82f6'; this.style.boxShadow='0 4px 12px rgba(59, 130, 246, 0.15)';" 
           onmouseout="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none';"
           onclick="showUserContacts('${user.id}', '${escapeHtml(user.fullName)}')">
        <div style="display: flex; justify-content: space-between; align-items: start;">
          <div style="flex: 1;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              <h3 style="font-weight: 600; margin: 0;">${escapeHtml(user.fullName)}</h3>
              ${statusBadge}
              ${roleBadge}
            </div>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; font-size: 14px; color: #64748b;">
              <div><strong>E-posta:</strong> ${escapeHtml(user.email)}</div>
              <div><strong>Telefon:</strong> ${escapeHtml(user.phone)}</div>
              <div><strong>Yaş:</strong> ${user.age}</div>
              <div><strong>Cinsiyet:</strong> ${escapeHtml(user.gender || '-')}</div>
              <div><strong>İl:</strong> ${escapeHtml(user.province)}</div>
              <div><strong>İlçe:</strong> ${escapeHtml(user.district)}</div>
            </div>
            <div style="margin-top: 10px; padding: 8px; background: #f1f5f9; border-radius: 6px; display: inline-block;">
              <span style="font-size: 13px; color: #475569;"><strong>📇 Kişi Sayısı:</strong> <span style="color: #3b82f6; font-weight: 600;">${contactCount}</span></span>
            </div>
            <div style="margin-top: 12px;">
              <div style="display: flex; justify-content: space-between; font-size: 12px; color: #64748b; margin-bottom: 4px;">
                <span><strong>Depolama:</strong> ${storageUsedMB} MB / ${storageLimitMB} MB</span>
                <span style="color: ${storageColor}; font-weight: 600;">${storagePercent.toFixed(1)}%</span>
              </div>
              <div style="width: 100%; height: 6px; background: #e2e8f0; border-radius: 3px; overflow: hidden;">
                <div style="width: ${storagePercent}%; height: 100%; background: ${storageColor}; transition: width 0.3s;"></div>
              </div>
            </div>
            <div style="margin-top: 8px; font-size: 12px; color: #94a3b8;">
              Kayıt: ${new Date(user.createdAt).toLocaleString('tr-TR')}
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Show user contacts (admin clicks on user)
window.showUserContacts = async function(userId, userName) {
  try {
    const res = await authFetch(`${ADMIN_API}/contacts`);
    const allContacts = await res.json();
    const userContacts = allContacts.filter(c => c.userId === userId);
    
    if (userContacts.length === 0) {
      alert(`${userName} henüz kişi eklememiş.`);
      return;
    }
    
    // Create modal
    const modal = document.createElement('div');
    modal.id = 'user-contacts-modal';
    modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px;';
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = 'background: white; border-radius: 12px; max-width: 800px; width: 100%; max-height: 80vh; overflow-y: auto; padding: 24px; box-shadow: 0 20px 60px rgba(0,0,0,0.3);';
    
    modalContent.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 2px solid #e2e8f0; padding-bottom: 16px;">
        <div>
          <h2 style="font-size: 24px; font-weight: bold; color: #1e293b; margin: 0;">${escapeHtml(userName)}</h2>
          <p style="color: #64748b; font-size: 14px; margin-top: 4px;">${userContacts.length} kişi</p>
        </div>
        <button onclick="document.getElementById('user-contacts-modal').remove()" style="width: 32px; height: 32px; border-radius: 8px; border: none; background: #f1f5f9; color: #64748b; cursor: pointer; font-size: 20px; display: flex; align-items: center; justify-content: center; transition: all 0.2s;" onmouseover="this.style.background='#e2e8f0'" onmouseout="this.style.background='#f1f5f9'">×</button>
      </div>
      <div style="display: grid; gap: 12px;">
        ${userContacts.map(contact => `
          <div style="padding: 12px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
            <div style="font-weight: 600; font-size: 16px; color: #1e293b; margin-bottom: 6px;">
              ${escapeHtml(contact.firstName)} ${escapeHtml(contact.lastName)}
              ${contact.category ? `<span style="background: #dbeafe; color: #1e40af; padding: 2px 8px; border-radius: 4px; font-size: 12px; margin-left: 8px;">${escapeHtml(contact.category)}</span>` : ''}
            </div>
            <div style="color: #64748b; font-size: 14px;">
              <i class="bi bi-telephone"></i> ${escapeHtml(contact.phone)}
            </div>
          </div>
        `).join('')}
      </div>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Close on outside click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  } catch (err) {
    alert('Kişiler yüklenirken hata: ' + err.message);
  }
};

// Search users
els.userSearch.addEventListener('input', debounce(() => {
  const query = els.userSearch.value.trim().toLowerCase();
  if (!query) {
    renderAllUsers(allUsersCache);
    return;
  }
  
  const filtered = allUsersCache.filter(user => 
    user.fullName.toLowerCase().includes(query) ||
    user.email.toLowerCase().includes(query) ||
    user.phone.includes(query)
  );
  
  renderAllUsers(filtered);
}, 200));

// Approve user
window.approveUser = async function(userId) {
  try {
    const res = await authFetch(`${ADMIN_API}/users/${userId}/approve`, {
      method: 'PUT'
    });
    
    if (res.ok) {
      alert('Kullanıcı başarıyla onaylandı!');
      await loadAdminData();
    } else {
      const data = await res.json();
      alert(data.error || 'Onaylama başarısız');
    }
  } catch (err) {
    alert('Hata: ' + err.message);
  }
};

// Reject user
window.rejectUser = async function(userId) {
  if (!confirm('Bu kullanıcıyı reddetmek istediğinize emin misiniz?')) {
    return;
  }
  
  try {
    const res = await authFetch(`${ADMIN_API}/users/${userId}/reject`, {
      method: 'PUT'
    });
    
    if (res.ok) {
      alert('Kullanıcı reddedildi.');
      await loadAdminData();
    } else {
      const data = await res.json();
      alert(data.error || 'Reddetme başarısız');
    }
  } catch (err) {
    alert('Hata: ' + err.message);
  }
};

// Set footer year
const footerYearEl = document.getElementById('footer-year');
if (footerYearEl) {
  footerYearEl.textContent = new Date().getFullYear();
}
