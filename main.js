const API = 'https://thesimpsonsapi.com/api';
const CDN = 'https://cdn.thesimpsonsapi.com/500';
const state = { characters: { page: 1, query: '' }, episodes: { page: 1, query: '' } };
const FAVORITES_KEY = 'springfield-favorites';

const readFavorites = () => {
  try { return new Set(JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]')); }
  catch { return new Set(); }
};
const favorites = readFavorites();
const saveFavorites = () => localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites]));

const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
const imageUrl = path => path ? `${CDN}${path}` : '';
const baseOf = type => type.slice(0, -1);

function status(type, text = '', error = false) {
  const node = document.querySelector(`#${baseOf(type)}-status`);
  node.textContent = text; node.classList.toggle('error', error);
}

function pagination(type, data) {
  const node = document.querySelector(`#${baseOf(type)}-pagination`);
  if (data.pages < 2) return void (node.innerHTML = '');
  const page = state[type].page;
  node.innerHTML = `<button data-page="${page - 1}" ${page === 1 ? 'disabled' : ''}>← Anterior</button><span>Página ${page} de ${data.pages}</span><button data-page="${page + 1}" ${page === data.pages ? 'disabled' : ''}>Siguiente →</button>`;
  node.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
    state[type].page = Number(button.dataset.page); load(type);
    document.querySelector(`#${type}`).scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));
}

function characters(items) {
  document.querySelector('#character-grid').innerHTML = items.map(item => {
    const portrait = imageUrl(item.portrait_path);
    const isFavorite = favorites.has(String(item.id));
    const favoriteButton = `<button type="button" class="favorite-button${isFavorite ? ' active' : ''}" data-id="${item.id}" aria-pressed="${isFavorite}" aria-label="${isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}: ${escapeHtml(item.name)}" title="${isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}"><span class="donut" aria-hidden="true"><span class="sprinkle s1"></span><span class="sprinkle s2"></span><span class="sprinkle s3"></span><span class="sprinkle s4"></span></span></button>`;
    return `<article class="character-card"><div class="portrait">${favoriteButton}${portrait ? `<img src="${portrait}" alt="${escapeHtml(item.name)}" loading="lazy">` : '🍩'}</div><div class="card-body"><h3>${escapeHtml(item.name)}</h3><p class="meta">${escapeHtml(item.occupation || 'Habitante de Springfield')}</p><p class="quote">“${escapeHtml(item.phrases?.[0] || 'Un habitante inolvidable de Springfield.')}”</p><span class="tag ${item.status === 'Deceased' ? 'tag-muted' : ''}">${item.status === 'Deceased' ? 'Fallecido' : 'Activo'}</span></div></article>`;
  }).join('');
}

function toggleFavorite(event) {
  const button = event.target.closest('.favorite-button');
  if (!button) return;
  const id = button.dataset.id;
  favorites.has(id) ? favorites.delete(id) : favorites.add(id);
  saveFavorites();
  const active = favorites.has(id);
  button.classList.toggle('active', active);
  button.setAttribute('aria-pressed', String(active));
}

function episodes(items) {
  document.querySelector('#episode-grid').innerHTML = items.map(item => {
    const image = imageUrl(item.image_path);
    const date = item.airdate ? new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium' }).format(new Date(`${item.airdate}T00:00:00`)) : 'Fecha no disponible';
    return `<article class="episode-card"><div class="episode-image">${image ? `<img src="${image}" alt="" loading="lazy">` : '📺'}</div><div class="card-body"><p class="episode-number">Temporada ${item.season} · Episodio ${item.episode_number}</p><h3>${escapeHtml(item.name)}</h3><p class="summary">${escapeHtml(item.synopsis || 'Sin sinopsis disponible.')}</p><p class="airdate">Emitido: ${date}</p></div></article>`;
  }).join('');
}

async function load(type) {
  const base = baseOf(type), grid = document.querySelector(`#${base}-grid`);
  status(type, 'Cargando datos de Springfield…'); grid.setAttribute('aria-busy', 'true');
  try {
    const response = await fetch(`${API}/${type}?page=${state[type].page}`);
    if (!response.ok) throw new Error('La API no respondió correctamente.');
    const data = await response.json();
    const query = state[type].query.trim().toLocaleLowerCase('es');
    const results = query ? data.results.filter(item => item.name.toLocaleLowerCase('es').includes(query)) : data.results;
    type === 'characters' ? characters(results) : episodes(results);
    document.querySelector(`#${base}-count`).textContent = query ? `${results.length} coincidencias en esta página` : `${data.count} registros disponibles`;
    status(type, results.length ? '' : 'No hubo coincidencias en esta página. Prueba otro nombre o navega de página.');
    pagination(type, data);
  } catch (error) {
    grid.innerHTML = '<div class="empty-state">No pudimos cargar la información. Revisa tu conexión e inténtalo otra vez.</div>';
    status(type, error.message, true);
  } finally { grid.removeAttribute('aria-busy'); }
}

function bind(type) {
  const base = baseOf(type), input = document.querySelector(`#${base}-search`);
  document.querySelector(`#${base}-form`).addEventListener('submit', event => { event.preventDefault(); state[type].query = input.value; load(type); });
  document.querySelector(`#clear-${base}-search`).addEventListener('click', () => { input.value = ''; state[type].query = ''; load(type); input.focus(); });
}
document.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', () => { document.querySelectorAll('.nav-link').forEach(item => item.classList.remove('active')); link.classList.add('active'); }));
document.querySelector('#character-grid').addEventListener('click', toggleFavorite);
bind('characters'); bind('episodes'); load('characters'); load('episodes');
