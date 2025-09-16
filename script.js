// Bendras JS: aktyvus meniu, galerijos lightbox, rezervacija su localStorage
(function(){
  // Aktyvuojam meniu nuorodą
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a').forEach(a=>{
    const href = a.getAttribute('href');
    if(href === path){ a.classList.add('active'); }
  });

  // Lightbox galerija
  const gallery = document.getElementById('gallery');
  const modal = document.getElementById('lightboxModal');
  const modalImg = document.getElementById('lightboxImage');
  const closeBtn = modal ? modal.querySelector('.modal-close') : null;

  if(gallery && modal && modalImg && closeBtn){
    gallery.addEventListener('click', (e)=>{
      const a = e.target.closest('a.card');
      if(!a) return;
      e.preventDefault();
      const src = a.dataset.full || a.href;
      modalImg.src = src;
      modal.classList.remove('hidden');
    });
    closeBtn.addEventListener('click', ()=> modal.classList.add('hidden'));
    modal.addEventListener('click', (e)=>{ if(e.target === modal) modal.classList.add('hidden'); });
    document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') modal.classList.add('hidden'); });
  }

  // Rezervacijos forma
  const form = document.getElementById('bookingForm');
  const success = document.getElementById('bookingSuccess');
  const table = document.getElementById('bookingsTable')?.querySelector('tbody');
  const myBookings = document.getElementById('myBookings');

  function loadBookings(){
    try{
      const arr = JSON.parse(localStorage.getItem('giedre_bookings')||'[]');
      return Array.isArray(arr) ? arr : [];
    }catch{ return []; }
  }
  function saveBookings(list){
    localStorage.setItem('giedre_bookings', JSON.stringify(list));
  }
  function renderBookings(){
    if(!table) return;
    const list = loadBookings();
    table.innerHTML = '';
    list.forEach((b, idx)=>{
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${b.name}</td>
        <td>${b.email}</td>
        <td>${b.phone||''}</td>
        <td>${b.service}</td>
        <td><span class="badge">${b.date}</span></td>
        <td><span class="badge">${b.time}</span></td>
        <td>${b.notes||''}</td>
        <td><button data-del="${idx}" class="btn-secondary">Šalinti</button></td>`;
      table.appendChild(tr);
    });
    if(myBookings) myBookings.classList.toggle('hidden', list.length===0);
  }

  if(form){
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      // Paprasta validacija
      if(!data.name || !data.email || !data.service || !data.date || !data.time){
        alert('Užpildykite visus privalomus laukus.');
        return;
      }
      const list = loadBookings();
      list.push(data);
      saveBookings(list);
      if(success) success.classList.remove('hidden');
      renderBookings();
      form.reset();
      // Naudinga: atidaryti numatytą el. laišką (komentaras – galima įjungti)
      // location.href = `mailto:rezervacija@giedremakeup.lt?subject=Nauja%20rezervacija&body=${encodeURIComponent(JSON.stringify(data, null, 2))}`;
    });
  }

  if(table){
    table.addEventListener('click', (e)=>{
      const btn = e.target.closest('button[data-del]');
      if(!btn) return;
      const idx = +btn.dataset.del;
      const list = loadBookings();
      list.splice(idx,1);
      saveBookings(list);
      renderBookings();
    });
    renderBookings();
  }
})();
