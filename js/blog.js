// Load blog entries from localStorage and render on frontend
(function() {
  const STORAGE_KEY = 'clubtelde_entries';
  const entries = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const sorted = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date));

  // Default entries (shown when no admin entries exist)
  const defaultEntries = [
    {
      title: '1 Bronce en el Clasificatorio Sub-12 de Gran Canaria',
      date: '2026-02-25',
      content: 'Lucía Fariña Martínez logró bronce en sub-12 femenino y clasificación para la final de los Juegos de Gran Canaria 2026. Sam Escudero Cuesta (5º) y Juan Javier Deniz Hernández (6º) también clasificados.',
      images: ['https://images.unsplash.com/photo-1586165368502-1bad197a6461?w=600&q=80']
    },
    {
      title: '2 Oros, 1 Plata y 1 Bronce en el Zonal Sur de Gran Canaria',
      date: '2026-02-17',
      content: 'Thiago Sánchez Ayala oro en sub-10 open, Sara Santana Martel oro en sub-10 femenino, Itziar González Valido plata y Nayade Pulido Vega bronce.',
      images: ['https://images.unsplash.com/photo-1560174038-da43ac74f01b?w=600&q=80']
    },
    {
      title: '12 Jóvenes Valores del Telde en el Campeonato Infantil DGD 2026',
      date: '2026-01-27',
      content: 'Alba Sánchez Castro, Aidan Frances Corrales, Vik Escudero Cuesta y más jugadores compitieron en Vecindario el 18 de enero.',
      images: ['https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=600&q=80']
    },
    {
      title: '5 Representantes en la Final de los Juegos de Gran Canaria 2024',
      date: '2024-02-26',
      content: 'El ajedrez teldense logró plata y bronce en categoría sub-8 femenino en la final de los Juegos de Gran Canaria 2024.',
      images: ['https://images.unsplash.com/photo-1604948501466-4e9c339b9c24?w=600&q=80']
    }
  ];

  const allEntries = sorted.length > 0 ? sorted : defaultEntries;

  function formatDate(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function createCard(entry, showDesc) {
    const img = (entry.images && entry.images.length > 0) ? entry.images[0] : 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=600&q=80';
    return `
      <article class="news-card">
        <div class="news-card-img"><img src="${img}" alt="${escapeHtml(entry.title)}" loading="lazy"></div>
        <div class="news-card-body">
          <div class="news-card-date">${formatDate(entry.date)}</div>
          <h3 class="news-card-title">${escapeHtml(entry.title)}</h3>
          ${showDesc ? `<p class="news-card-desc">${escapeHtml(entry.content)}</p>` : ''}
          ${entry.images && entry.images.length > 1 ? `<div style="display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap">${entry.images.slice(1, 4).map(i => `<img src="${i}" style="width:60px;height:45px;object-fit:cover;border-radius:4px" loading="lazy">`).join('')}${entry.images.length > 4 ? `<span style="display:flex;align-items:center;font-size:12px;color:var(--text-muted)">+${entry.images.length - 4} más</span>` : ''}</div>` : ''}
          <a href="novedades.html" class="news-card-link">Leer más &rarr;</a>
        </div>
      </article>`;
  }

  // Render on index.html (latest 3)
  const homeGrid = document.getElementById('homeNewsGrid');
  if (homeGrid) {
    homeGrid.innerHTML = allEntries.slice(0, 3).map(e => createCard(e, true)).join('');
  }

  // Render on novedades.html (all entries)
  const newsGrid = document.getElementById('allNewsGrid');
  if (newsGrid) {
    newsGrid.innerHTML = allEntries.map(e => createCard(e, true)).join('');
  }
})();
