const API = '/api/contacts';

const els = {
  id: document.getElementById('contact-id'),
  firstName: document.getElementById('firstName'),
  lastName: document.getElementById('lastName'),
  phone: document.getElementById('phone'),
  form: document.getElementById('contact-form'),
  save: document.getElementById('save-btn'),
  cancel: document.getElementById('cancel-btn'),
  tableBody: document.querySelector('#contacts-table tbody'),
  search: document.getElementById('search'),
  clearSearch: document.getElementById('clear-search'),
  phoneHint: document.getElementById('phone-hint'),
  count: document.getElementById('count-badge'),
};

function escapeHtml(str){
  return (str||'').replace(/[&<>"']/g, s=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[s]));
}

function rowTemplate(c){
  return `<tr>
    <td>${escapeHtml(c.firstName)}</td>
    <td>${escapeHtml(c.lastName)}</td>
    <td>${escapeHtml(c.phone)}</td>
    <td>
      <button data-id="${c.id}" class="icon edit" title="Düzenle" aria-label="Düzenle"><i class="bi bi-pencil-square"></i></button>
      <button data-id="${c.id}" class="icon danger delete" title="Sil" aria-label="Sil"><i class="bi bi-trash3"></i></button>
    </td>
  </tr>`;
}

async function list(query=''){
  const url = query ? `${API}/search?q=${encodeURIComponent(query)}` : API;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Listeleme hatası');
  const data = await res.json();
  els.count.textContent = data.length;
  if (!data.length) {
    els.tableBody.innerHTML = '<tr><td colspan="4" style="color:#6b7280;">Kayıt bulunamadı</td></tr>';
  } else {
    els.tableBody.innerHTML = data.map(rowTemplate).join('');
  }
}

async function create(payload){
  const res = await fetch(API, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload)});
  if(!res.ok){
    const err = await res.json().catch(()=>({error:'Hata'}));
    throw new Error(err.error || 'Oluşturma hatası');
  }
  return res.json();
}

async function update(id, payload){
  const res = await fetch(`${API}/${id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload)});
  if(!res.ok){
    const err = await res.json().catch(()=>({error:'Hata'}));
    throw new Error(err.error || 'Güncelleme hatası');
  }
  return res.json();
}

async function remove(id){
  const res = await fetch(`${API}/${id}`, { method:'DELETE' });
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

  if (!nameRe.test(firstName)) { alert('Ad sadece harf içermelidir.'); return; }
  if (!nameRe.test(lastName)) { alert('Soyad sadece harf içermelidir.'); return; }
  const phone = normalizePhoneTr(phoneRaw);
  if (!phone) { alert('Geçerli bir Türkiye telefon numarası giriniz.'); return; }

  try{
    if(els.id.value){
      await update(els.id.value, { firstName, lastName, phone });
    } else {
      await create({ firstName, lastName, phone });
    }
    resetForm();
    await list(els.search.value.trim());
  }catch(err){
    alert(err.message);
  }
});

els.cancel.addEventListener('click', resetForm);

// Row actions
els.tableBody.addEventListener('click', async (e)=>{
  const btn = e.target.closest('button');
  if(!btn) return;
  const id = btn.getAttribute('data-id');
  if(!id) return;
  if(btn.classList.contains('edit')){
    const res = await fetch(`${API}/${id}`);
    if(!res.ok){ alert('Kayıt bulunamadı'); return; }
    const c = await res.json();
    els.id.value = c.id;
    els.firstName.value = c.firstName;
    els.lastName.value = c.lastName;
    els.phone.value = c.phone;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  if(btn.classList.contains('delete')){
    if(confirm('Silmek istediğinize emin misiniz?')){
      try{ await remove(id); await list(els.search.value.trim()); }catch(err){ alert(err.message); }
    }
  }
});

// Live search (debounced)
function debounce(fn, ms){ let t; return (...args)=>{ clearTimeout(t); t=setTimeout(()=>fn(...args), ms); }; }
const refresh = debounce(()=> list(els.search.value.trim()).catch(console.error), 200);
els.search.addEventListener('input', refresh);
els.clearSearch.addEventListener('click', ()=>{ els.search.value=''; els.search.focus(); list().catch(console.error); });

// Initial load
list().catch(console.error);

// Footer year
const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();
