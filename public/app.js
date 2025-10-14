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
  searchBtn: document.getElementById('search-btn'),
  clearSearch: document.getElementById('clear-search'),
};

function rowTemplate(c){
  return `<tr>
    <td>${escapeHtml(c.firstName)}</td>
    <td>${escapeHtml(c.lastName)}</td>
    <td><span class="badge">${escapeHtml(c.phone)}</span></td>
    <td>
      <button data-id="${c.id}" class="edit">Düzenle</button>
      <button data-id="${c.id}" class="danger delete">Sil</button>
    </td>
  </tr>`;
}

function escapeHtml(str){
  return (str||'').replace(/[&<>"]+/g, s=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[s]));
}

async function list(query=''){
  const url = query ? `${API}/search?q=${encodeURIComponent(query)}` : API;
  const res = await fetch(url);
  const data = await res.json();
  els.tableBody.innerHTML = data.map(rowTemplate).join('');
}

async function create(payload){
  const res = await fetch(API, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload)});
  if(!res.ok) throw new Error('Oluşturma hatası');
  return res.json();
}

async function update(id, payload){
  const res = await fetch(`${API}/${id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload)});
  if(!res.ok) throw new Error('Güncelleme hatası');
  return res.json();
}

async function remove(id){
  const res = await fetch(`${API}/${id}`, { method:'DELETE' });
  if(!res.ok) throw new Error('Silme hatası');
}

function resetForm(){
  els.id.value = '';
  els.firstName.value = '';
  els.lastName.value = '';
  els.phone.value = '';
  els.save.textContent = 'Kaydet';
}

els.form.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const payload = { firstName: els.firstName.value.trim(), lastName: els.lastName.value.trim(), phone: els.phone.value.trim() };
  try{
    if(els.id.value){
      await update(els.id.value, payload);
    } else {
      await create(payload);
    }
    resetForm();
    await list(els.search.value.trim());
  }catch(err){
    alert(err.message);
  }
});

els.cancel.addEventListener('click', ()=>{
  resetForm();
});

els.tableBody.addEventListener('click', async (e)=>{
  const id = e.target.getAttribute('data-id');
  if(!id) return;
  if(e.target.classList.contains('edit')){
    const res = await fetch(`${API}/${id}`);
    if(!res.ok){ alert('Kayıt bulunamadı'); return; }
    const c = await res.json();
    els.id.value = c.id;
    els.firstName.value = c.firstName;
    els.lastName.value = c.lastName;
    els.phone.value = c.phone;
    els.save.textContent = 'Güncelle';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  if(e.target.classList.contains('delete')){
    if(confirm('Silmek istediğinize emin misiniz?')){
      try{
        await remove(id);
        await list(els.search.value.trim());
      }catch(err){
        alert(err.message);
      }
    }
  }
});

els.searchBtn.addEventListener('click', ()=> list(els.search.value.trim()));
els.clearSearch.addEventListener('click', ()=>{ els.search.value=''; list(); });

// initial
list().catch(console.error);
