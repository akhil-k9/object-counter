// ===== TAB SWITCHING =====
function switchTab(tab) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  event.target.closest('.tab').classList.add('active');

  document.getElementById('upload-panel').style.display = tab === 'upload' ? 'block' : 'none';
  document.getElementById('camera-panel').style.display = tab === 'camera' ? 'block' : 'none';

  if (tab !== 'camera') stopCamera();
}

// ===== DRAG AND DROP =====
const dropZone = document.getElementById('drop-zone');

dropZone?.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.style.borderColor = 'var(--accent)';
  dropZone.style.background = 'rgba(0,229,255,0.06)';
});

dropZone?.addEventListener('dragleave', () => {
  dropZone.style.borderColor = 'rgba(0,229,255,0.25)';
  dropZone.style.background = 'var(--surface)';
});

dropZone?.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.style.borderColor = 'rgba(0,229,255,0.25)';
  dropZone.style.background = 'var(--surface)';
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) processImage(file);
});

// ===== FILE HANDLE =====
function handleFile(event) {
  const file = event.target.files[0];
  if (file) processImage(file);
}

function processImage(file) {
  // Show original image
  const reader = new FileReader();
  reader.onload = (e) => {
    document.getElementById('original-img').src = e.target.result;
  };
  reader.readAsDataURL(file);

  // Show preview area
  document.getElementById('drop-zone').style.display = 'none';
  document.getElementById('preview-area').style.display = 'block';
  document.getElementById('results-section').style.display = 'none';
  document.getElementById('loading').style.display = 'flex';
  document.getElementById('result-img').src = '';

  // Send to backend
  const formData = new FormData();
  formData.append('image', file);

  fetch('/predict', {
    method: 'POST',
    body: formData
  })
  .then(res => res.json())
  .then(data => {
    if (data.error) {
      alert('Error: ' + data.error);
      return;
    }

    // Show result image
    document.getElementById('result-img').src = 'data:image/jpeg;base64,' + data.image;
    document.getElementById('loading').style.display = 'none';

    // Show results
    document.getElementById('total-count').textContent = data.total;
    document.getElementById('results-section').style.display = 'block';

    // Build object cards
    const grid = document.getElementById('object-grid');
    grid.innerHTML = '';

    const sorted = Object.entries(data.counts).sort((a, b) => b[1] - a[1]);

    sorted.forEach(([name, count], i) => {
      const card = document.createElement('div');
      card.className = 'object-card';
      card.style.animationDelay = `${i * 0.05}s`;
      card.innerHTML = `
        <span class="object-name">${name}</span>
        <span class="object-count">${count}</span>
      `;
      grid.appendChild(card);
    });
  })
  .catch(err => {
    console.error(err);
    document.getElementById('loading').style.display = 'none';
    alert('Something went wrong. Please try again.');
  });
}

// ===== RESET =====
function resetUpload() {
  document.getElementById('drop-zone').style.display = 'block';
  document.getElementById('preview-area').style.display = 'none';
  document.getElementById('fileInput').value = '';
}

// ===== CAMERA =====
function startCamera() {
  document.getElementById('camera-placeholder').style.display = 'none';
  document.getElementById('camera-stream').style.display = 'block';
  document.getElementById('camera-stream').src = '/video_feed';
  document.getElementById('start-btn').style.display = 'none';
  document.getElementById('stop-btn').style.display = 'flex';
}

function stopCamera() {
  fetch('/stop_camera', { method: 'POST' });
  document.getElementById('camera-stream').src = '';
  document.getElementById('camera-stream').style.display = 'none';
  document.getElementById('camera-placeholder').style.display = 'block';
  document.getElementById('start-btn').style.display = 'flex';
  document.getElementById('stop-btn').style.display = 'none';
}
