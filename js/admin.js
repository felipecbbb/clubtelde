// ===== CONFIG =====
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'telde2026';
const STORAGE_KEY = 'clubtelde_entries';

// ===== STATE =====
let entries = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
let currentImages = [];
let editingId = null;
let deletingId = null;

// ===== ELEMENTS =====
const loginScreen = document.getElementById('loginScreen');
const adminPanel = document.getElementById('adminPanel');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const entriesList = document.getElementById('entriesList');
const editorOverlay = document.getElementById('editorOverlay');
const confirmOverlay = document.getElementById('confirmOverlay');
const entryForm = document.getElementById('entryForm');
const imagePreviews = document.getElementById('imagePreviews');
const imageInput = document.getElementById('imageInput');
const toast = document.getElementById('toast');

// ===== AUTH =====
function checkAuth() {
  if (sessionStorage.getItem('admin_auth') === 'true') {
    showAdmin();
  }
}

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const user = document.getElementById('loginUser').value;
  const pass = document.getElementById('loginPass').value;

  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    sessionStorage.setItem('admin_auth', 'true');
    showAdmin();
  } else {
    loginError.style.display = 'block';
  }
});

document.getElementById('logoutBtn').addEventListener('click', (e) => {
  e.preventDefault();
  sessionStorage.removeItem('admin_auth');
  location.reload();
});

function showAdmin() {
  loginScreen.style.display = 'none';
  adminPanel.style.display = 'flex';
  renderEntries();
}

// ===== ENTRIES CRUD =====
function saveEntries() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function renderEntries() {
  if (entries.length === 0) {
    entriesList.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
        <h3>No hay entradas</h3>
        <p>Crea tu primera entrada del blog para empezar.</p>
      </div>`;
    return;
  }

  const sorted = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date));

  entriesList.innerHTML = `
    <div class="entries-table">
      <table>
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Título</th>
            <th>Fecha</th>
            <th>Imágenes</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${sorted.map(entry => `
            <tr>
              <td>
                ${entry.images && entry.images.length > 0
                  ? `<img class="entry-thumb" src="${entry.images[0]}" alt="">`
                  : `<div class="entry-thumb" style="display:flex;align-items:center;justify-content:center;color:var(--text-muted);font-size:10px;">Sin img</div>`
                }
              </td>
              <td class="entry-title-cell">${escapeHtml(entry.title)}</td>
              <td class="entry-date">${formatDate(entry.date)}</td>
              <td><span class="entry-images-count">${(entry.images || []).length} img</span></td>
              <td>
                <div class="entry-actions">
                  <button class="btn-edit" onclick="editEntry('${entry.id}')">Editar</button>
                  <button class="btn-delete" onclick="deleteEntry('${entry.id}')">Eliminar</button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>`;
}

// ===== EDITOR =====
document.getElementById('btnNew').addEventListener('click', () => openEditor());
document.getElementById('btnCloseEditor').addEventListener('click', closeEditor);
document.getElementById('btnCancelEditor').addEventListener('click', closeEditor);

function openEditor(entry = null) {
  editingId = entry ? entry.id : null;
  document.getElementById('editorTitle').textContent = entry ? 'Editar Entrada' : 'Nueva Entrada';
  document.getElementById('entryId').value = editingId || '';
  document.getElementById('entryTitleInput').value = entry ? entry.title : '';
  document.getElementById('entryDate').value = entry ? entry.date : new Date().toISOString().split('T')[0];
  document.getElementById('entryContent').value = entry ? entry.content : '';
  currentImages = entry ? [...(entry.images || [])] : [];
  renderImagePreviews();
  editorOverlay.classList.add('open');
}

function closeEditor() {
  editorOverlay.classList.remove('open');
  entryForm.reset();
  currentImages = [];
  editingId = null;
  renderImagePreviews();
}

window.editEntry = function(id) {
  const entry = entries.find(e => e.id === id);
  if (entry) openEditor(entry);
};

// ===== SAVE =====
entryForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = {
    id: editingId || generateId(),
    title: document.getElementById('entryTitleInput').value.trim(),
    date: document.getElementById('entryDate').value,
    content: document.getElementById('entryContent').value.trim(),
    images: currentImages
  };

  if (editingId) {
    const idx = entries.findIndex(e => e.id === editingId);
    if (idx !== -1) entries[idx] = data;
    showToast('Entrada actualizada');
  } else {
    entries.push(data);
    showToast('Entrada creada');
  }

  saveEntries();
  renderEntries();
  closeEditor();
});

// ===== DELETE =====
window.deleteEntry = function(id) {
  deletingId = id;
  confirmOverlay.classList.add('open');
};

document.getElementById('btnCancelDelete').addEventListener('click', () => {
  confirmOverlay.classList.remove('open');
  deletingId = null;
});

document.getElementById('btnConfirmDelete').addEventListener('click', () => {
  entries = entries.filter(e => e.id !== deletingId);
  saveEntries();
  renderEntries();
  confirmOverlay.classList.remove('open');
  deletingId = null;
  showToast('Entrada eliminada');
});

// ===== IMAGES =====
imageInput.addEventListener('change', handleImageSelect);

document.getElementById('uploadArea').addEventListener('dragover', (e) => {
  e.preventDefault();
  e.currentTarget.style.borderColor = 'var(--blue)';
  e.currentTarget.style.background = 'var(--blue-light)';
});

document.getElementById('uploadArea').addEventListener('dragleave', (e) => {
  e.currentTarget.style.borderColor = '';
  e.currentTarget.style.background = '';
});

document.getElementById('uploadArea').addEventListener('drop', (e) => {
  e.preventDefault();
  e.currentTarget.style.borderColor = '';
  e.currentTarget.style.background = '';
  const files = e.dataTransfer.files;
  processFiles(files);
});

function handleImageSelect(e) {
  processFiles(e.target.files);
  e.target.value = '';
}

function processFiles(files) {
  Array.from(files).forEach(file => {
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      // Resize image to save storage
      resizeImage(e.target.result, 800, (resized) => {
        currentImages.push(resized);
        renderImagePreviews();
      });
    };
    reader.readAsDataURL(file);
  });
}

function resizeImage(dataUrl, maxWidth, callback) {
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    let w = img.width;
    let h = img.height;

    if (w > maxWidth) {
      h = (h * maxWidth) / w;
      w = maxWidth;
    }

    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, w, h);
    callback(canvas.toDataURL('image/jpeg', 0.75));
  };
  img.src = dataUrl;
}

function renderImagePreviews() {
  imagePreviews.innerHTML = currentImages.map((img, i) => `
    <div class="image-preview">
      <img src="${img}" alt="Imagen ${i + 1}">
      <button type="button" class="remove-img" onclick="removeImage(${i})">&times;</button>
    </div>
  `).join('');
}

window.removeImage = function(index) {
  currentImages.splice(index, 1);
  renderImagePreviews();
};

// ===== HELPERS =====
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

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

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ===== INIT =====
checkAuth();
