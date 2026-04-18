let entries = [];
let html5QrCode;
let lastScannedData = "No identificado"; 

const imageInput = document.getElementById('imageInput');
const preview = document.getElementById('preview');

imageInput.addEventListener('change', function() {
  const file = this.files[0];
  if (file) {
    const url = URL.createObjectURL(file);
    preview.src = url;
    preview.style.display = 'block';
  }
});

document.getElementById("dolor").addEventListener("input", function () {
  let value = parseInt(this.value);
  if (value < 0) this.value = 0;
  if (value > 10) this.value = 10;
});


function startScanner() {
    const qrRegionId = "qr-reader";
    if (html5QrCode) {
        html5QrCode.stop().then(() => startScanningProcess(qrRegionId));
    } else {
        startScanningProcess(qrRegionId);
    }
}

function startScanningProcess(qrRegionId) {
    html5QrCode = new Html5Qrcode(qrRegionId);
    
    const qrCodeSuccessCallback = (decodedText, decodedResult) => {
        lastScannedData = decodedText; 
        document.getElementById('qr-result').innerText = "Paciente detectado: " + decodedText;
        
        html5QrCode.stop().then(() => {
            console.log("Escaneo finalizado correctamente.");
        }).catch((err) => console.error("Error al detener escáner", err));
    };

    const config = { fps: 10, qrbox: { width: 250, height: 250 } };

    html5QrCode.start({ facingMode: "environment" }, config, qrCodeSuccessCallback)
    .catch((err) => {
        alert("Error al acceder a la cámara: " + err);
    });
}


function addEntry() {
  const text = document.getElementById('textInput').value;
  const imageSrc = preview.src;

  const borde = document.getElementById("borde").value;
  const tejido = document.getElementById("tejido").value;
  const exudado = document.getElementById("exudado").value;
  const infeccion = document.getElementById("infeccion").value;
  const piel = document.getElementById("piel").value;
  const dolor = document.getElementById("dolor").value;

  if (!text && (!imageSrc || preview.style.display === "none")) return;

  const entry = {
    date: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
    text,
    image: preview.style.display === "none" ? null : imageSrc,
    borde,
    tejido,
    exudado,
    infeccion,
    piel,
    dolor,
    paciente: lastScannedData 
  };

  entries.push(entry);
  renderEntries();

  // Resetear formulario
  document.getElementById('textInput').value = '';
  preview.style.display = 'none';
  imageInput.value = '';
  document.getElementById('qr-result').innerText = '';
  lastScannedData = "No identificado"; 
}

function renderEntries() {
  const container = document.getElementById('entries');
  container.innerHTML = '';

  entries.forEach(e => {
    const div = document.createElement('div');
    div.className = 'card';

    div.innerHTML = `
      <div class="date">${e.date}</div>
      ${e.image ? `<img src="${e.image}">` : ""}
      <p><strong>Paciente (QR):</strong> ${e.paciente}</p>
      <p><strong>Borde:</strong> ${e.borde}</p>
      <p><strong>Tejido:</strong> ${e.tejido}</p>
      <p><strong>Exudado:</strong> ${e.exudado}</p>
      <p><strong>Infección:</strong> ${e.infeccion}</p>
      <p><strong>Piel perilesional:</strong> ${e.piel}</p>
      <p><strong>Dolor:</strong> ${e.dolor}/10</p>
      <p><strong>Observaciones:</strong> ${e.text}</p>
    `;

    container.appendChild(div);
  });

  container.scrollTo({ left: container.scrollWidth, behavior: 'smooth' });
}

function scrollLeft2(){
  document.getElementById('entries').scrollBy({ left: -300, behavior: 'smooth' });
}

function scrollRight2(){
  document.getElementById('entries').scrollBy({ left: 300, behavior: 'smooth' });
}