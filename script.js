/* =========================================================================
   DAPURPINTAR — CORE STATE, SEED DATA, & UTILITIES
   ========================================================================= */
const STORAGE_KEY = "dapurpintar_v1_state";

function isoOffsetDays(offset) {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

function daysUntil(dateStr) {
  if (!dateStr) return 99;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + "T00:00:00");
  return Math.round((target - now) / 86400000);
}

function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatRupiah(num) {
  const n = Number(num) || 0;
  return "Rp " + n.toLocaleString("id-ID");
}

const ZONES = [
  "Chiller Kulkas",
  "Freezer",
  "Rak Kering / Pantry",
  "Meja Dapur / Suhu Ruang",
  "Rak Bumbu"
];

/* Curated Authentic Photography URLs (Wikimedia Commons / Public Culinary Media + Pinterest/Web URL Support) */
const WM = (file, w = 720) => `https://commons.wikimedia.org/wiki/Special:FilePath/${file}?width=${w}`;

const DEFAULT_PHOTOS = {
  hero: WM("Nasi.Tahu.Tempe.Sambal.Lalapan.jpg", 960),
  "stk-1": WM("Spinach_leaves.jpg"),
  "stk-2": WM("CHICKEN_BREAST.jpg"),
  "stk-3": WM("Tahu_putih.JPG"),
  "stk-4": WM("Glass_of_milk.jpg"),
  "stk-5": WM("Tomato_je.jpg"),
  "stk-6": WM("Pisang_raja_bulu_kuning.jpg"),
  "stk-7": WM("Santan_2.jpg"),
  "stk-8": WM("Telur_Ayam.jpg"),
  "stk-9": WM("Sliced_tempeh.jpg"),
  "stk-10": WM("Carrots.JPG"),
  "stk-11": WM("Ground_Beef.jpg"),
  "stk-12": WM("White_rice.jpg"),
  "stk-13": WM("Bawang_Merah.jpg"),
  "stk-14": WM("Kecap_manis_%26_kecap_asin.jpg"),
  "rsp-1": WM("Sayur_bening_bayam_jagung.JPG"),
  "rsp-2": WM("Tahu_tempe_goreng.jpg"),
  "rsp-3": WM("Pepes_Tahu.jpg"),
  "rsp-4": WM("Banana_on_pancake.jpg"),
  "rsp-5": WM("Telur_goreng.jpg"),
  "rsp-6": WM("Tempe_Orek.jpg"),
  "rsp-7": WM("Sup_Ayam_Kampung.jpg"),
  "rsp-8": WM("Nasi-Goreng.jpg"),
  "rsp-9": WM("Perkedel_kentang.JPG"),
  "rsp-10": WM("Tumis_Kangkung.jpg"),
  "rsp-11": WM("Bakso_kuah.jpg"),
  "rsp-12": WM("Sambal_tempe_penyet_kemangi.JPG"),
  "umkm-1": WM("Pasar_tradisional.jpg"),
  "umkm-2": WM("Indonesian_fried_tempeh.JPG"),
  "umkm-3": WM("CHICKEN_BREAST.jpg"),
  "umkm-4": WM("Cabai_rawit_merah.jpg"),
  "umkm-5": WM("White_rice.jpg"),
  "umkm-6": WM("Bananas.jpg"),
  "pkt-1": WM("Nasi.Tahu.Tempe.Sambal.Lalapan.jpg"),
  "pkt-2": WM("Nasi-Goreng.jpg"),
  "pkt-3": WM("Sup_Ayam_Kampung.jpg"),
  "pkt-4": WM("Banana_on_pancake.jpg")
};

function guessDefaultPhotoByText(text, fallbackType = "stok") {
  const n = String(text || "").toLowerCase();
  if (/bayam|kangkung|sawi|kemangi|sayur bening/.test(n)) return WM("Spinach_leaves.jpg");
  if (/wortel|kentang/.test(n)) return WM("Carrots.JPG");
  if (/tomat/.test(n)) return WM("Tomato_je.jpg");
  if (/pisang|pancake/.test(n)) return WM("Banana_on_pancake.jpg");
  if (/ayam|sup krim/.test(n)) return fallbackType === "resep" ? WM("Sup_Ayam_Kampung.jpg") : WM("CHICKEN_BREAST.jpg");
  if (/sapi|bakso|daging/.test(n)) return fallbackType === "resep" ? WM("Bakso_kuah.jpg") : WM("Ground_Beef.jpg");
  if (/tahu|pepes/.test(n)) return fallbackType === "resep" ? WM("Pepes_Tahu.jpg") : WM("Tahu_putih.JPG");
  if (/tempe|orek|penyet/.test(n)) return fallbackType === "resep" ? WM("Tempe_Orek.jpg") : WM("Sliced_tempeh.jpg");
  if (/telur|orak/.test(n)) return fallbackType === "resep" ? WM("Telur_goreng.jpg") : WM("Telur_Ayam.jpg");
  if (/susu/.test(n)) return WM("Glass_of_milk.jpg");
  if (/santan/.test(n)) return WM("Santan_2.jpg");
  if (/nasi goreng/.test(n)) return WM("Nasi-Goreng.jpg");
  if (/beras|sembako/.test(n)) return WM("White_rice.jpg");
  if (/cabai|sambal|bumbu/.test(n)) return WM("Cabai_rawit_merah.jpg");
  if (/bawang/.test(n)) return WM("Bawang_Merah.jpg");
  if (/kecap/.test(n)) return WM("Kecap_manis_%26_kecap_asin.jpg");
  if (fallbackType === "umkm") return WM("Pasar_tradisional.jpg");
  return WM("Nasi.Tahu.Tempe.Sambal.Lalapan.jpg");
}

function getItemPhoto(item, collectionType) {
  if (item && item.imageUrl && String(item.imageUrl).trim()) {
    return String(item.imageUrl).trim();
  }
  if (item && DEFAULT_PHOTOS[item.id]) {
    return DEFAULT_PHOTOS[item.id];
  }
  return guessDefaultPhotoByText(item ? item.nama : "", collectionType);
}

function makeFallbackDataUri(label) {
  const safe = escapeHtml(String(label || "DapurPintar").slice(0, 28));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0c4f3d"/><stop offset="100%" stop-color="#138a84"/></linearGradient></defs><rect width="640" height="360" fill="url(#g)"/><circle cx="520" cy="80" r="95" fill="#eab34b" opacity="0.2"/><text x="320" y="175" text-anchor="middle" fill="#ffffff" font-family="Segoe UI,sans-serif" font-size="22" font-weight="700">${safe}</text><text x="320" y="208" text-anchor="middle" fill="#e3f6f4" font-family="Segoe UI,sans-serif" font-size="14">Klik "📷 Upload Foto" untuk mengganti gambar</text></svg>`;
  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
}

function handlePhotoError(imgEl, label) {
  if (imgEl.dataset.fallbackApplied === "1") return;
  imgEl.dataset.fallbackApplied = "1";
  imgEl.src = makeFallbackDataUri(label);
}

function renderPhotoImgTag(src, label) {
  return `<img class="real-photo" src="${escapeHtml(src)}" alt="${escapeHtml(label)}" loading="lazy" referrerpolicy="no-referrer" onerror="handlePhotoError(this, '${escapeHtml(label)}')" />`;
}

/* Compress uploaded image file via Canvas so dozens of photos fit smoothly in localStorage */
function compressImageFileToDataUrl(file, maxDim = 760, quality = 0.82) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith("image/")) {
      reject(new Error("Pilih berkas gambar yang valid (JPG/PNG/WEBP)."));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Gagal membaca berkas gambar."));
    reader.onload = ev => {
      const img = new Image();
      img.onerror = () => reject(new Error("Format gambar tidak didukung."));
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          const ratio = Math.min(maxDim / width, maxDim / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });
}

let pendingModalPhotoValue = "";

function openPhotoManagerModal(collectionType, itemId) {
  if (collectionType !== "stok" && !canAccessDashboard()) {
    showToast("Akses dibatasi: Hanya Operator & Admin yang dapat mengganti foto katalog utama.");
    return;
  }
  let currentUrl = "";
  let titleLabel = "Sampul Utama DapurPintar";

  if (collectionType === "hero") {
    currentUrl = state.heroImageUrl || DEFAULT_PHOTOS.hero;
  } else {
    const col = state[collectionType] || [];
    const found = col.find(x => x.id === itemId);
    if (!found) return;
    titleLabel = found.nama;
    currentUrl = getItemPhoto(found, collectionType);
  }

  pendingModalPhotoValue = currentUrl;
  const urlInputVal = currentUrl.startsWith("data:") ? "" : currentUrl;

  document.getElementById("modalBody").innerHTML = `
    <span class="eyebrow">Pengelola Foto Asli & Upload Lokal</span>
    <h2 style="color:var(--emerald-900);margin-bottom:6px;">📷 Ganti Foto: ${escapeHtml(titleLabel)}</h2>
    <p style="font-size:0.86rem;color:var(--neutral-500);margin-bottom:14px;">
      Unggah foto asli langsung dari laptop/HP Anda atau tempel tautan gambar dari <strong>Pinterest</strong> (<code>https://i.pinimg.com/...</code>) maupun sumber web lainnya.
    </p>

    <div class="photo-preview-stage">
      <img id="modalPhotoLivePreview" src="${escapeHtml(currentUrl)}" alt="Pratinjau Foto" referrerpolicy="no-referrer" onerror="handlePhotoError(this, 'Pratinjau Gambar')" />
    </div>

    <div class="upload-dropzone" id="modalUploadDropzone" onclick="document.getElementById('modalPhotoFileInput').click()">
      <input type="file" id="modalPhotoFileInput" accept="image/*" style="display:none;" />
      <div style="font-size:1.35rem;margin-bottom:4px;">📤</div>
      <div style="font-weight:800;color:var(--emerald-900);font-size:0.92rem;">Klik untuk Upload Foto dari Perangkat (atau Seret File ke Sini)</div>
      <div style="font-size:0.78rem;color:var(--neutral-500);margin-top:2px;">Mendukung JPG, PNG, WEBP — otomatis dikompresi agar hemat penyimpanan lokal</div>
    </div>

    <div class="form-group" style="margin-top:14px;">
      <label for="modalPhotoUrlInput">Atau Tempel Link Gambar Langsung (Pinterest / Unsplash / Web)</label>
      <input type="url" id="modalPhotoUrlInput" class="input" placeholder="Contoh: https://i.pinimg.com/736x/...jpg" value="${escapeHtml(urlInputVal)}" />
      <small style="display:block;margin-top:4px;color:var(--neutral-500);font-size:0.76rem;">
        💡 <strong>Tips Pinterest:</strong> Buka foto di Pinterest → Klik kanan pada foto → Pilih <em>"Copy image address" / "Salin alamat gambar"</em> (berakhiran <code>.jpg</code>/<code>.png</code>/<code>.webp</code>), lalu tempel di kolom atas.
      </small>
    </div>

    <div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-top:18px;">
      <button type="button" class="btn btn-outline btn-sm" onclick="resetSinglePhotoToDefault('${escapeHtml(collectionType)}', '${escapeHtml(itemId)}')">↺ Kembalikan Foto Default</button>
      <div style="display:flex;gap:8px;">
        <button type="button" class="btn btn-outline" onclick="closeModal()">Batal</button>
        <button type="button" class="btn btn-primary" onclick="savePhotoFromModal('${escapeHtml(collectionType)}', '${escapeHtml(itemId)}')">✓ Simpan Foto</button>
      </div>
    </div>
  `;

  document.getElementById("appModal").classList.add("open");

  const fileInput = document.getElementById("modalPhotoFileInput");
  const urlInput = document.getElementById("modalPhotoUrlInput");
  const previewImg = document.getElementById("modalPhotoLivePreview");
  const dropzone = document.getElementById("modalUploadDropzone");

  const handleChosenFile = async file => {
    try {
      const dataUrl = await compressImageFileToDataUrl(file);
      pendingModalPhotoValue = dataUrl;
      previewImg.dataset.fallbackApplied = "0";
      previewImg.src = dataUrl;
      urlInput.value = "";
      showToast("Foto berhasil dimuat ke pratinjau! Klik Simpan Foto.");
    } catch (err) {
      showToast(err.message || "Gagal memproses foto.");
    }
  };

  fileInput.addEventListener("change", e => {
    if (e.target.files && e.target.files[0]) handleChosenFile(e.target.files[0]);
  });

  dropzone.addEventListener("dragover", e => { e.preventDefault(); dropzone.classList.add("dragover"); });
  dropzone.addEventListener("dragleave", () => dropzone.classList.remove("dragover"));
  dropzone.addEventListener("drop", e => {
    e.preventDefault();
    dropzone.classList.remove("dragover");
    if (e.dataTransfer.files && e.dataTransfer.files[0]) handleChosenFile(e.dataTransfer.files[0]);
  });

  urlInput.addEventListener("input", e => {
    const val = e.target.value.trim();
    if (val) {
      pendingModalPhotoValue = val;
      previewImg.dataset.fallbackApplied = "0";
      previewImg.src = val;
    }
  });
}

function savePhotoFromModal(collectionType, itemId) {
  const val = String(pendingModalPhotoValue || "").trim();
  if (!val) {
    showToast("Pilih foto atau masukkan URL gambar terlebih dahulu.");
    return;
  }
  if (collectionType === "hero") {
    state.heroImageUrl = val;
  } else {
    const col = state[collectionType] || [];
    const found = col.find(x => x.id === itemId);
    if (found) found.imageUrl = val;
  }
  saveState();
  renderAll();
  closeModal();
  showToast("Foto berhasil diperbarui dan disimpan di browser!");
}

function resetSinglePhotoToDefault(collectionType, itemId) {
  if (collectionType === "hero") {
    state.heroImageUrl = DEFAULT_PHOTOS.hero;
  } else {
    const col = state[collectionType] || [];
    const found = col.find(x => x.id === itemId);
    if (found) {
      found.imageUrl = DEFAULT_PHOTOS[found.id] || guessDefaultPhotoByText(found.nama, collectionType);
    }
  }
  saveState();
  renderAll();
  closeModal();
  showToast("Foto dikembalikan ke foto asli default.");
}

function hydrateStatePhotos(st) {
  if (!st.heroImageUrl) st.heroImageUrl = DEFAULT_PHOTOS.hero;
  ["stok", "resep", "umkm", "paket"].forEach(colName => {
    if (Array.isArray(st[colName])) {
      st[colName].forEach(item => {
        if (!item.imageUrl || !String(item.imageUrl).trim()) {
          item.imageUrl = DEFAULT_PHOTOS[item.id] || guessDefaultPhotoByText(item.nama, colName);
        }
      });
    }
  });
  return st;
}

function createDefaultData() {
  const base = {
    lang: "ID",
    heroImageUrl: DEFAULT_PHOTOS.hero,
    onlyFavorites: false,
    selectedZone: "ALL",
    ingredientRecipeFilter: "",
    stok: [
      { id: "stk-1", nama: "Bayam Hijau", kategori: "Sayur & Buah", zonaSimpan: "Chiller Kulkas", jumlah: 2, satuan: "ikat", tanggalMasuk: isoOffsetDays(-2), tanggalKedaluwarsa: isoOffsetDays(1), tipeTanggal: "Estimasi Referensi", estimasiNilai: 8000, statusHalal: "Bahan Segar Alami", sumberVerifikasi: "Sayuran segar non-olahan", tipsSimpan: "Bungkus kertas kering di chiller, jangan dicuci sebelum disimpan." },
      { id: "stk-2", nama: "Dada Ayam Fillet", kategori: "Protein Hewani", zonaSimpan: "Chiller Kulkas", jumlah: 400, satuan: "gram", tanggalMasuk: isoOffsetDays(-1), tanggalKedaluwarsa: isoOffsetDays(2), tipeTanggal: "Estimasi Referensi", estimasiNilai: 26000, statusHalal: "Belum Diverifikasi Resmi", sumberVerifikasi: "Ayam potong pasar pagi (perlu konfirmasi juru sembelih halal)", tipsSimpan: "Pindahkan ke Freezer jika belum akan dimasak dalam 48 jam." },
      { id: "stk-3", nama: "Tahu Putih Segar", kategori: "Protein Nabati & Telur", zonaSimpan: "Chiller Kulkas", jumlah: 1, satuan: "bungkus", tanggalMasuk: isoOffsetDays(-2), tanggalKedaluwarsa: isoOffsetDays(1), tipeTanggal: "Estimasi Referensi", estimasiNilai: 7000, statusHalal: "Bahan Segar Alami", sumberVerifikasi: "Olahan kedelai air garam lokal (tanpa aditif hewani)", tipsSimpan: "Rendam air matang bersih dan ganti airnya setiap hari." },
      { id: "stk-4", nama: "Susu UHT Full Cream (Terbuka)", kategori: "Susu & Olahan", zonaSimpan: "Chiller Kulkas", jumlah: 500, satuan: "ml", tanggalMasuk: isoOffsetDays(-2), tanggalKedaluwarsa: isoOffsetDays(2), tipeTanggal: "Kemasan Resmi", estimasiNilai: 11000, statusHalal: "Sertifikasi Halal Resmi", sumberVerifikasi: "Simulasi Referensi Label Halal Kemasan Ritel", tipsSimpan: "Susu UHT yang sudah dibuka wajib habis dalam 3–4 hari di kulkas." },
      { id: "stk-5", nama: "Tomat Merah", kategori: "Sayur & Buah", zonaSimpan: "Meja Dapur / Suhu Ruang", jumlah: 5, satuan: "buah", tanggalMasuk: isoOffsetDays(-3), tanggalKedaluwarsa: isoOffsetDays(2), tipeTanggal: "Estimasi Referensi", estimasiNilai: 6000, statusHalal: "Bahan Segar Alami", sumberVerifikasi: "Buah/sayur segar alami", tipsSimpan: "Jika sudah sangat matang, simpan di chiller atau buat sambal/saus." },
      { id: "stk-6", nama: "Pisang Kepok Matang", kategori: "Sayur & Buah", zonaSimpan: "Meja Dapur / Suhu Ruang", jumlah: 1, satuan: "sisir", tanggalMasuk: isoOffsetDays(-3), tanggalKedaluwarsa: isoOffsetDays(1), tipeTanggal: "Estimasi Referensi", estimasiNilai: 14000, statusHalal: "Bahan Segar Alami", sumberVerifikasi: "Buah segar non-olahan", tipsSimpan: "Kupas dan bekukan di freezer bila kulit mulai menghitam." },
      { id: "stk-7", nama: "Santan Peras Segar", kategori: "Susu & Olahan", zonaSimpan: "Chiller Kulkas", jumlah: 250, satuan: "ml", tanggalMasuk: isoOffsetDays(-3), tanggalKedaluwarsa: isoOffsetDays(-1), tipeTanggal: "Estimasi Referensi", estimasiNilai: 8000, statusHalal: "Bahan Segar Alami", sumberVerifikasi: "Perasan kelapa murni tanpa pengawet", tipsSimpan: "Sudah melewati batas simpan chiller! Cek aroma asam sebelum dipakai." },
      { id: "stk-8", nama: "Telur Ayam Negeri", kategori: "Protein Nabati & Telur", zonaSimpan: "Meja Dapur / Suhu Ruang", jumlah: 8, satuan: "butir", tanggalMasuk: isoOffsetDays(-2), tanggalKedaluwarsa: isoOffsetDays(10), tipeTanggal: "Estimasi Referensi", estimasiNilai: 18000, statusHalal: "Bahan Segar Alami", sumberVerifikasi: "Telur utuh segar alami", tipsSimpan: "Simpan ujung runcing di bawah agar kuning telur tetap di tengah." },
      { id: "stk-9", nama: "Tempe Papan", kategori: "Protein Nabati & Telur", zonaSimpan: "Chiller Kulkas", jumlah: 2, satuan: "papan", tanggalMasuk: isoOffsetDays(-1), tanggalKedaluwarsa: isoOffsetDays(4), tipeTanggal: "Estimasi Referensi", estimasiNilai: 10000, statusHalal: "Bahan Segar Alami", sumberVerifikasi: "Fermentasi kedelai ragi nabati", tipsSimpan: "Jangan simpan dalam plastik tertutup rapat yang lembap." },
      { id: "stk-10", nama: "Wortel Segar", kategori: "Sayur & Buah", zonaSimpan: "Chiller Kulkas", jumlah: 300, satuan: "gram", tanggalMasuk: isoOffsetDays(-2), tanggalKedaluwarsa: isoOffsetDays(8), tipeTanggal: "Estimasi Referensi", estimasiNilai: 7000, statusHalal: "Bahan Segar Alami", sumberVerifikasi: "Umbi sayur segar alami", tipsSimpan: "Potong tangkai daunnya agar wortel tidak cepat keriput." },
      { id: "stk-11", nama: "Daging Sapi Giling Beku", kategori: "Protein Hewani", zonaSimpan: "Freezer", jumlah: 350, satuan: "gram", tanggalMasuk: isoOffsetDays(-5), tanggalKedaluwarsa: isoOffsetDays(25), tipeTanggal: "Kemasan Resmi", estimasiNilai: 45000, statusHalal: "Sertifikasi Halal Resmi", sumberVerifikasi: "Simulasi Referensi RPH Bersertifikat Halal", tipsSimpan: "Cairkan perlahan di chiller semalam sebelum dimasak." },
      { id: "stk-12", nama: "Beras Putih Pulen", kategori: "Bahan Pokok & Kering", zonaSimpan: "Rak Kering / Pantry", jumlah: 3000, satuan: "gram", tanggalMasuk: isoOffsetDays(-10), tanggalKedaluwarsa: isoOffsetDays(90), tipeTanggal: "Kemasan Resmi", estimasiNilai: 45000, statusHalal: "Bahan Segar Alami", sumberVerifikasi: "Beras giling tanpa bahan tambahan", tipsSimpan: "Masukkan 2 lembar daun jeruk kering agar bebas kutu beras." },
      { id: "stk-13", nama: "Bawang Merah & Bawang Putih", kategori: "Bumbu & Rempah", zonaSimpan: "Rak Bumbu", jumlah: 250, satuan: "gram", tanggalMasuk: isoOffsetDays(-4), tanggalKedaluwarsa: isoOffsetDays(18), tipeTanggal: "Estimasi Referensi", estimasiNilai: 14000, statusHalal: "Bahan Segar Alami", sumberVerifikasi: "Rempah umbi segar alami", tipsSimpan: "Letakkan di wadah terbuka berventilasi dan kering." },
      { id: "stk-14", nama: "Kecap Manis Kemasan", kategori: "Bumbu & Rempah", zonaSimpan: "Rak Bumbu", jumlah: 1, satuan: "botol", tanggalMasuk: isoOffsetDays(-14), tanggalKedaluwarsa: isoOffsetDays(120), tipeTanggal: "Kemasan Resmi", estimasiNilai: 16000, statusHalal: "Sertifikasi Halal Resmi", sumberVerifikasi: "Simulasi Referensi Label Halal Kemasan", tipsSimpan: "Tutup rapat leher botol setelah digunakan." }
    ],
    resep: [
      { id: "rsp-1", nama: "Sayur Bening Bayam Wortel Segar", kategori: "Sup & Berkuah", zonaUtama: "Chiller Kulkas", deskripsi: "Sup bening ringan kaya zat besi untuk menyelamatkan bayam yang cepat layu di chiller.", imageSvg: "soup", waktuMenit: 15, porsiDasar: 3, estimasiBiaya: 14000, bahanUtama: ["Bayam", "Wortel", "Bawang Merah", "Tomat"], langkahMasak: ["Didihkan air bersama irisan bawang merah dan temu kunci/jagung bila ada.", "Masukkan irisan wortel hingga setengah empuk.", "Masukkan daun bayam dan potongan tomat merah, bumbui garam & gula secukupnya, matikan api dalam 2 menit."], alatMasak: ["Panci Kecil", "Pisau & Talenan"], panduanHalalPangan: "Seluruh bahan nabati alami bebas titik kritis hewani. Pastikan bayam tidak berlendir sebelum dimasak.", unggulan: true },
      { id: "rsp-2", nama: "Tumis Ayam Fillet Tahu Saus Kecap", kategori: "Tumisan Cepat", zonaUtama: "Chiller Kulkas", deskripsi: "Menu penyelamat ganda untuk menghabiskan dada ayam fillet dan tahu putih sekaligus dalam 18 menit.", imageSvg: "protein", waktuMenit: 18, porsiDasar: 3, estimasiBiaya: 32000, bahanUtama: ["Dada Ayam", "Tahu Putih", "Bawang", "Kecap Manis", "Tomat"], langkahMasak: ["Potong dadu tahu putih lalu goreng setengah berkulit; iris tipis dada ayam.", "Tumis bawang merah dan bawang putih hingga harum, masukkan ayam hingga berubah warna.", "Tambahkan tahu, potongan tomat, kecap manis, sedikit air, dan merica hingga bumbu meresap."], alatMasak: ["Wajan", "Spatula"], panduanHalalPangan: "Titik kritis ada pada sumber penyembelihan ayam segar dan kecap kemasan berlabel halal.", unggulan: true },
      { id: "rsp-3", nama: "Pepes Tahu Kemangi Tanpa Minyak", kategori: "Olahan Penyelamat Stok", zonaUtama: "Chiller Kulkas", deskripsi: "Olahan kukus sehat untuk memanfaatkan tahu putih yang mendekati batas simpan agar tetap gurih dan awet.", imageSvg: "greens", waktuMenit: 25, porsiDasar: 3, estimasiBiaya: 15000, bahanUtama: ["Tahu Putih", "Telur", "Tomat", "Bawang", "Daun Kemangi"], langkahMasak: ["Haluskan tahu putih bersama telur, irisan bawang, tomat, dan garam.", "Tambahkan daun kemangi segar, bungkus dengan daun pisang atau wadah tahan panas.", "Kukus selama 20 menit hingga padat dan harum."], alatMasak: ["Kukusan / Panci"], panduanHalalPangan: "Menggunakan protein nabati & telur; aman dan rendah minyak.", unggulan: false },
      { id: "rsp-4", nama: "Puding Roti / Pancake Pisang Susu Anti-Mubazir", kategori: "Sarapan & Camilan", zonaUtama: "Meja Dapur / Suhu Ruang", deskripsi: "Menyelamatkan pisang kepok yang sudah terlalu matang dan susu UHT terbuka menjadi sarapan manis alami.", imageSvg: "grain", waktuMenit: 15, porsiDasar: 2, estimasiBiaya: 16000, bahanUtama: ["Pisang", "Susu UHT", "Telur", "Tepung Terigu"], langkahMasak: ["Lumatkan pisang matang dengan garpu hingga lembut.", "Kocok lepas telur dan susu UHT, campurkan dengan pisang dan tepung terigu.", "Masak di wajan anti-lengket dengan api kecil 2 menit per sisi hingga keemasan."], alatMasak: ["Wajan Anti-Lengket", "Mangkuk"], panduanHalalPangan: "Pastikan susu UHT terbuka belum berbau asam atau menggumpal sebelum dicampur.", unggulan: true },
      { id: "rsp-5", nama: "Orak-Arik Telur Bayam Tomat Kilat", kategori: "Menu Hemat Kos", zonaUtama: "Meja Dapur / Suhu Ruang", deskripsi: "Menu penyelamat akhir bulan 10 menit berbahan telur, bayam, dan tomat matang.", imageSvg: "greens", waktuMenit: 10, porsiDasar: 2, estimasiBiaya: 12000, bahanUtama: ["Telur", "Bayam", "Tomat", "Bawang"], langkahMasak: ["Tumis bawang cincang dan potongan tomat hingga sedikit layu.", "Masukkan kocokan telur, buat orak-arik kasar.", "Masukkan daun bayam, aduk cepat 1 menit, beri garam dan lada."], alatMasak: ["Wajan Kecil"], panduanHalalPangan: "Bahan segar alami, sangat cocok untuk dapur kos sederhana.", unggulan: false },
      { id: "rsp-6", nama: "Orek Tempe Basah Kecap Rempah", kategori: "Lauk Nusantara", zonaUtama: "Chiller Kulkas", deskripsi: "Lauk klasik tahan simpan 2 hari dari stok tempe papan dan kecap manis di rak bumbu.", imageSvg: "spice", waktuMenit: 20, porsiDasar: 4, estimasiBiaya: 16000, bahanUtama: ["Tempe", "Bawang", "Kecap Manis", "Cabai Merah"], langkahMasak: ["Potong korek api tempe papan, goreng setengah kering.", "Tumis irisan bawang dan cabai hingga layu.", "Masukkan tempe, kecap manis, dan sedikit air hingga meresap lengket."], alatMasak: ["Wajan"], panduanHalalPangan: "Periksa label halal pada kecap manis; hindari penggunaan angciu/mirin.", unggulan: false },
      { id: "rsp-7", nama: "Sup Krim Ayam Wortel Susu Gurih", kategori: "Sup & Berkuah", zonaUtama: "Chiller Kulkas", deskripsi: "Menghabiskan sisa susu UHT terbuka, potongan dada ayam, dan wortel menjadi sup hangat mengenyangkan.", imageSvg: "soup", waktuMenit: 25, porsiDasar: 3, estimasiBiaya: 28000, bahanUtama: ["Dada Ayam", "Wortel", "Susu UHT", "Bawang", "Tepung Terigu"], langkahMasak: ["Tumis bawang cincang, masukkan dadu kecil dada ayam dan wortel.", "Taburkan 1 sdm tepung terigu, aduk rata lalu tuang air kaldu dan susu UHT perlahan.", "Masak dengan api kecil sambil diaduk hingga mengental lembut."], alatMasak: ["Panci Sedang"], panduanHalalPangan: "Gunakan kaldu dan daging ayam dari sumber sembelihan halal.", unggulan: true },
      { id: "rsp-8", nama: "Nasi Goreng Kampung Telur & Ayam Suwir", kategori: "Menu Hemat Kos", zonaUtama: "Rak Kering / Pantry", deskripsi: "Solusi terbaik mengolah nasi sisa semalam bersama stok telur, bawang, dan sisa ayam.", imageSvg: "grain", waktuMenit: 12, porsiDasar: 2, estimasiBiaya: 18000, bahanUtama: ["Beras", "Telur", "Dada Ayam", "Bawang", "Kecap Manis"], langkahMasak: ["Tumis bawang merah, bawang putih, dan suwiran ayam hingga matang.", "Geser ke tepi wajan, masukkan telur dan orak-arik.", "Masukkan nasi dingin, kecap manis, dan garam, aduk di api besar."], alatMasak: ["Wajan"], panduanHalalPangan: "Jangan gunakan minyak wijen/saus racikan tak berlabel halal.", unggulan: false },
      { id: "rsp-9", nama: "Rolade / Perkedel Tahu Wortel Kukus-Goreng", kategori: "Olahan Penyelamat Stok", zonaUtama: "Chiller Kulkas", deskripsi: "Mengubah tahu putih hampir asam (cuci air hangat dulu) dan parutan wortel menjadi lauk favorit keluarga.", imageSvg: "protein", waktuMenit: 22, porsiDasar: 4, estimasiBiaya: 15000, bahanUtama: ["Tahu Putih", "Wortel", "Telur", "Bawang"], langkahMasak: ["Peras tahu putih dengan kain bersih, campur dengan wortel parut, bawang halus, dan telur.", "Bentuk bulat pipih atau gulung kukus.", "Goreng sebentar hingga kuning keemasan."], alatMasak: ["Wajan", "Parutan"], panduanHalalPangan: "Seluruh bahan utama nabati & telur segar.", unggulan: false },
      { id: "rsp-10", nama: "Tumis Sapi Giling Buncis Kecap Lada", kategori: "Lauk Nusantara", zonaUtama: "Freezer", deskripsi: "Memanfaatkan stok daging sapi giling beku dari freezer untuk menu makan malam tinggi protein.", imageSvg: "spice", waktuMenit: 20, porsiDasar: 4, estimasiBiaya: 42000, bahanUtama: ["Daging Sapi", "Buncis", "Bawang", "Kecap Manis", "Tomat"], langkahMasak: ["Tumis bawang cincang hingga wangi, masukkan daging sapi giling hingga berubah warna.", "Masukkan potongan buncis segar dan tomat.", "Tambahkan kecap manis, lada, dan sedikit air, masak hingga bumbu menyatu."], alatMasak: ["Wajan"], panduanHalalPangan: "Pastikan daging sapi giling berasal dari RPH/pemasok bersertifikat halal.", unggulan: false },
      { id: "rsp-11", nama: "Sup Bola Daging Sapi Wortel Tomat", kategori: "Sup & Berkuah", zonaUtama: "Freezer", deskripsi: "Kuah kaldu segar dengan bola daging giling buatan sendiri dan sayuran kulkas.", imageSvg: "soup", waktuMenit: 28, porsiDasar: 4, estimasiBiaya: 39000, bahanUtama: ["Daging Sapi", "Wortel", "Tomat", "Telur", "Bawang"], langkahMasak: ["Campur daging sapi giling dengan sedikit putih telur, bawang putih halus, dan garam; bulatkan kecil.", "Rebus bola daging dalam air mendidih hingga mengapung.", "Masukkan wortel dan tomat segar, koreksi rasa."], alatMasak: ["Panci"], panduanHalalPangan: "Tanpa tambahan pengenyal sintetis; murni daging giling dan telur.", unggulan: false },
      { id: "rsp-12", nama: "Sambal Tomat Tempe Penyet Kemangi", kategori: "Tumisan Cepat", zonaUtama: "Rak Bumbu", deskripsi: "Menghabiskan stok tomat matang berlebih di meja dapur bersama tempe goreng hangat.", imageSvg: "spice", waktuMenit: 15, porsiDasar: 2, estimasiBiaya: 13000, bahanUtama: ["Tempe", "Tomat", "Bawang", "Cabai Merah"], langkahMasak: ["Goreng tempe papan yang telah dimarinasi air garam ketumbar.", "Goreng layu tomat merah matang, bawang, dan cabai merah, lalu ulek kasar.", "Penyet tempe hangat di atas sambal tomat."], alatMasak: ["Wajan", "Cobek / Blender"], panduanHalalPangan: "Jika memakai terasi tambahan, pastikan terasi kemasan memiliki sertifikasi halal.", unggulan: false }
    ],
    umkm: [
      { id: "umkm-1", nama: "Lapak Sayur Segar Bu Rahma (Pasar Pagi)", kategori: "Sayur & Panen Segar", zonaLayanan: "Pasar Pagi Lokal", komoditas: ["Bayam", "Wortel", "Tomat", "Buncis", "Daun Kemangi", "Cabai Merah"], hargaMulai: 4000, imageSvg: "greens", statusSertifikasiHalal: "Bahan Segar Alami (Ramah Muslim)", sumberVerifikasi: "Komoditas pertanian nabati mentah non-olahan", mapsUrl: "https://www.google.com/maps/search/?api=1&query=Pasar+Sayur+Pagi+Tradisional", kontakDemo: "6281200000101" },
      { id: "umkm-2", nama: "Rumah Tahu & Tempe Kedelai Murni Pak Hasan", kategori: "Protein & Olahan Kedelai", zonaLayanan: "Sentra UMKM Lokal", komoditas: ["Tahu Putih", "Tempe Papan", "Susu Kedelai"], hargaMulai: 6000, imageSvg: "protein", statusSertifikasiHalal: "Tersertifikasi Halal Resmi (Simulasi)", sumberVerifikasi: "Simulasi Data Usaha Mikro Bersertifikat Halal Pendamping PPH", mapsUrl: "https://www.google.com/maps/search/?api=1&query=Pengrajin+Tahu+Tempe+Terdekat", kontakDemo: "6281200000102" },
      { id: "umkm-3", nama: "Kios Unggas & Daging Segar Amanah", kategori: "Protein & Olahan Kedelai", zonaLayanan: "Koperasi Pasar", komoditas: ["Dada Ayam Fillet", "Daging Sapi Giling", "Telur Ayam"], hargaMulai: 24000, imageSvg: "market", statusSertifikasiHalal: "Tersertifikasi Halal Resmi (Simulasi)", sumberVerifikasi: "Simulasi Referensi Mitra RPH & Juleha Terverifikasi", mapsUrl: "https://www.google.com/maps/search/?api=1&query=Toko+Daging+Halal+Terdekat", kontakDemo: "6281200000103" },
      { id: "umkm-4", nama: "Bumbu Giling Tradisional Kak Ros", kategori: "Bumbu & Rempah Giling", zonaLayanan: "Pasar Pagi Lokal", komoditas: ["Bumbu Putih", "Cabai Giling", "Bawang Kupas", "Santan Segar"], hargaMulai: 5000, imageSvg: "spice", statusSertifikasiHalal: "Belum Diverifikasi Resmi", sumberVerifikasi: "Usaha gilingan rumahan lokal — belum memiliki nomor sertifikat halal resmi", mapsUrl: "https://www.google.com/maps/search/?api=1&query=Bumbu+Giling+Pasar+Tradisional", kontakDemo: "6281200000104" },
      { id: "umkm-5", nama: "Toko Sembako & Susu Keluarga Berkah", kategori: "Sembako & Paket Masak", zonaLayanan: "Toko Kelontong Halal", komoditas: ["Beras Putih", "Susu UHT", "Tepung Terigu", "Kecap Manis", "Minyak Goreng"], hargaMulai: 12000, imageSvg: "grain", statusSertifikasiHalal: "Tersertifikasi Halal Resmi (Simulasi)", sumberVerifikasi: "Menjual produk ritel kemasan berlabel Halal resmi pada tiap kemasan", mapsUrl: "https://www.google.com/maps/search/?api=1&query=Toko+Sembako+Terdekat", kontakDemo: "6281200000105" },
      { id: "umkm-6", nama: "Kebun Buah & Paket Sayur Siap Masak TaniMuda", kategori: "Sayur & Panen Segar", zonaLayanan: "Koperasi Tani", komoditas: ["Pisang Kepok", "Paket Sayur Bening", "Paket Sop Wortel", "Tomat Merah"], hargaMulai: 10000, imageSvg: "greens", statusSertifikasiHalal: "Bahan Segar Alami (Ramah Muslim)", sumberVerifikasi: "Hasil panen kebun segar tanpa proses olahan", mapsUrl: "https://www.google.com/maps/search/?api=1&query=Toko+Buah+dan+Sayur+Segar", kontakDemo: "6281200000106" }
    ],
    paket: [
      { id: "pkt-1", nama: "Paket Penyelamat Isi Kulkas 2 Hari", profilMinat: "Penyelamat Isi Kulkas", durasiHari: 2, daftarResep: ["rsp-1", "rsp-2", "rsp-4", "rsp-5"], estimasiBiaya: 58000, deskripsi: "Dirancang khusus menghabiskan bayam, tahu putih, dada ayam, pisang matang, dan susu UHT terbuka dalam 48 jam." },
      { id: "pkt-2", nama: "Paket Hemat Anak Kos 3 Hari", profilMinat: "Hemat Anak Kos", durasiHari: 3, daftarResep: ["rsp-5", "rsp-6", "rsp-8", "rsp-12", "rsp-1"], estimasiBiaya: 55000, deskripsi: "Menu ekonomis alat masak minimal (1 wajan/panci kecil) dengan bahan tahan simpan seperti telur, tempe, dan beras." },
      { id: "pkt-3", nama: "Paket Keluarga Seimbang 4 Hari", profilMinat: "Keluarga Seimbang", durasiHari: 4, daftarResep: ["rsp-1", "rsp-2", "rsp-7", "rsp-9", "rsp-10", "rsp-11"], estimasiBiaya: 148000, deskripsi: "Kombinasi protein hewani, nabati, dan sayuran segar untuk 4 hari makan keluarga anti-mubazir." },
      { id: "pkt-4", nama: "Paket Masak Kilat Sibuk Kerja 3 Hari", profilMinat: "Masak Kilat <20 Menit", durasiHari: 3, daftarResep: ["rsp-1", "rsp-2", "rsp-4", "rsp-5", "rsp-8", "rsp-12"], estimasiBiaya: 88000, deskripsi: "Seluruh resep selesai dalam 10–18 menit, cocok untuk pekerja muda yang ingin tetap makan masakan rumah." }
    ],
    rencana: {
      id: "plan-active",
      namaRencana: "Rencana Masak Hemat Anti-Mubazir",
      tanggalMulai: isoOffsetDays(0),
      jumlahHari: 3,
      jumlahOrang: 2,
      biayaTambahan: 15000,
      slots: {
        "1-Sarapan": "rsp-4",
        "1-Siang": "rsp-1",
        "1-Malam": "rsp-2",
        "2-Sarapan": "rsp-5",
        "2-Siang": "rsp-6",
        "2-Malam": "rsp-7"
      }
    },
    belanja: [
      { id: "shp-1", namaBahan: "Tepung Terigu (250 gram)", sumberAsal: "Kebutuhan Pancake Pisang", sudahDibeli: false },
      { id: "shp-2", namaBahan: "Daun Kemangi (1 ikat)", sumberAsal: "Kebutuhan Pepes Tahu", sudahDibeli: false }
    ],
    favorit: [
      { id: "fav-1", itemId: "rsp-1", tipeItem: "resep", tanggalDitambahkan: isoOffsetDays(0) },
      { id: "fav-2", itemId: "umkm-1", tipeItem: "umkm", tanggalDitambahkan: isoOffsetDays(0) }
    ]
  };
  return hydrateStatePhotos(base);
}

let state = loadState();
let activeCrudTab = "stok";
let editingCrudId = null;

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.stok) && Array.isArray(parsed.resep)) {
        return hydrateStatePhotos(parsed);
      }
    }
  } catch (e) {
    console.warn("Fallback in-memory state:", e);
  }
  const initial = createDefaultData();
  saveState(initial);
  return initial;
}

function saveState(nextState = state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
  } catch (e) {
    console.warn("Gagal menyimpan localStorage:", e);
    showToast("Penyimpanan browser penuh! Gunakan gambar berukuran lebih kecil atau tautan URL.");
  }
}

function showToast(msg) {
  const el = document.getElementById("appToast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => el.classList.remove("show"), 2900);
}

/* =========================================================================
   BILINGUAL DICTIONARY (ID / EN)
   ========================================================================= */
const I18N = {
  ID: {
    navTagline: "Anti-Mubazir & Kuliner Halal",
    navStock: "Stok & Zona",
    navRecipes: "Resep Pintar",
    navPlanner: "Meal Plan & Anggaran",
    navMarket: "Belanja & UMKM",
    navCrud: "Dashboard CRUD",
    navFav: "Favorit",
    heroBadge: "✦ Eco-Fresh Halal Kitchen • Nusantara Edition",
    heroTitle: "Kelola Stok Kulkas, <span>Selamatkan Bahan</span> Sebelum Mubazir.",
    heroDesc: "Catat belanjaan dalam hitungan detik, pantau pengingat kedaluwarsa di 5 zona dapur, temukan resep lezat dari bahan yang sudah ada, dan susun anggaran makan hemat tanpa sampah makanan.",
    ctaFindRecipe: "Cari Resep dari Stok Kulkas",
    ctaScanReceipt: "+ Scan Struk / Input Cepat",
    statsTitle: "Monitor Kesehatan Dapur Hari Ini",
    statTotalLbl: "Total Jenis Bahan Aktif",
    statWarnLbl: "Segera Olah (1–3 Hari)",
    statExpLbl: "Melewati Batas Simpan",
    statRescueLbl: "Nilai Bahan Kritis Terselamatkan",
    heroSafetyNote: "Info: Tanggal bertanda \"Estimasi Referensi\" dihitung dari rata-rata umur simpan pangan rumah tangga. Selalu periksa aroma, warna, dan tekstur sebelum dimasak.",
    sec1Eyebrow: "Inventaris & Peringatan Dini",
    sec1Title: "Denah 5 Zona Dapur & Stok Bahan Pangan",
    sec1Sub: "Klik zona pada denah SVG untuk memfilter isi penyimpanan, atau gunakan simulasi Scan Struk Belanja untuk mencatat bahan baru secara otomatis.",
    btnScanToggle: "🧾 Simulasi Scan Struk Cepat",
    btnAddManualStock: "+ Tambah Bahan Manual",
    scannerTitle: "Simulasi Scan Struk Belanja (Mode Demo Lokal)",
    scannerSub: "Pilih contoh struk atau ketik daftar belanjaan (1 baris per bahan, misal: Bayam Hijau | 2 | ikat). Umur simpan otomatis diestimasi.",
    zoneFilterTitle: "Filter Cepat Zona Penyimpanan",
    mapsCardTitle: "📍 Cari Pasar Segar & Toko Pangan Terdekat (Google Maps)",
    mapsCardDesc: "Tautan eksternal standar tanpa API key untuk mencari pasokan bahan segar di sekitar Anda:",
    sec2Eyebrow: "Rekomendasi Berbasis Inventaris",
    sec2Title: "Katalog Resep Anti-Mubazir",
    sec2Sub: "Sistem otomatis mencocokkan resep dengan stok dapur Anda dan memprioritaskan masakan yang menyelamatkan bahan kritis (1–3 hari menjelang kedaluwarsa).",
    sec3Eyebrow: "Perencana Masak & Anggaran Pintar",
    sec3Title: "Rekomendasi Paket & Meal Planner (1–5 Hari)",
    sec3Sub: "Gunakan penyaring berbasis aturan (rule-based) sesuai minat & anggaran, atau susun sendiri jadwal masak 1–5 hari beserta kalkulasi penghematan stok dapur.",
    recBoxTitle: "✨ Rekomendasi Paket Meal Plan (Rule-Based Filtering)",
    plannerFormTitle: "Penyusun Jadwal Masak Harian (1–5 Hari)",
    calcTitle: "Kalkulator Anggaran & Penghematan",
    sec4Eyebrow: "Belanja Cerdas & Ekosistem Lokal",
    sec4Title: "Daftar Belanja Otomatis & Mitra UMKM Pangan",
    sec4Sub: "Bahan yang habis atau kurang dari resep terkumpul otomatis di sini. Pesan ke mitra pedagang sayur & UMKM lokal (Mode Demo) dengan transparansi status halal.",
    shopListTitle: "🛒 Daftar Belanja Saya",
    umkmCatalogTitle: "Mitra Pedagang Pasar & UMKM Pangan Lokal (Data Simulasi)",
    sec5Eyebrow: "Panel Pengelola Data Lokal",
    sec5Title: "Dashboard Demo CRUD (localStorage)",
    sec5Sub: "Kelola data Stok Bahan, Katalog Resep, Mitra UMKM Pangan, dan Paket Meal Plan secara langsung tanpa backend. Perubahan tersimpan otomatis di peramban Anda."
  },
  EN: {
    navTagline: "Zero-Waste & Halal Kitchen",
    navStock: "Pantry & Zones",
    navRecipes: "Smart Recipes",
    navPlanner: "Meal Plan & Budget",
    navMarket: "Shopping & Local SMEs",
    navCrud: "CRUD Dashboard",
    navFav: "Favorites",
    heroBadge: "✦ Eco-Fresh Halal Kitchen • Nusantara Edition",
    heroTitle: "Track Your Fridge Stock, <span>Rescue Ingredients</span> Before They Spoil.",
    heroDesc: "Log groceries in seconds, track expiry reminders across 5 kitchen zones, discover recipes using ingredients you already own, and plan thrifty meals with zero food waste.",
    ctaFindRecipe: "Find Recipes from My Fridge",
    ctaScanReceipt: "+ Quick Receipt Scan (Demo)",
    statsTitle: "Today's Kitchen Health Monitor",
    statTotalLbl: "Active Pantry Items",
    statWarnLbl: "Cook Soon (1–3 Days)",
    statExpLbl: "Past Shelf-Life Limit",
    statRescueLbl: "At-Risk Value Rescued",
    heroSafetyNote: "Note: Dates labeled \"Reference Estimate\" use standard household shelf-life averages. Always inspect smell, color, and texture before cooking.",
    sec1Eyebrow: "Inventory & Early Alerts",
    sec1Title: "5-Zone Interactive Kitchen Map & Pantry Stock",
    sec1Sub: "Click any zone on the SVG diagram to filter stored items, or run the Receipt Scanner simulation to parse new groceries automatically.",
    btnScanToggle: "🧾 Quick Receipt Scanner (Demo)",
    btnAddManualStock: "+ Add Item Manually",
    scannerTitle: "Grocery Receipt Scanner Simulation (Local Demo Mode)",
    scannerSub: "Pick a sample receipt or paste items (1 per line, e.g. Spinach | 2 | bunches). Shelf life is estimated automatically.",
    zoneFilterTitle: "Quick Storage Zone Filter",
    mapsCardTitle: "📍 Find Nearby Fresh Markets & Halal Grocers (Google Maps)",
    mapsCardDesc: "Standard keyless Google Maps search links to find fresh ingredients near you:",
    sec2Eyebrow: "Inventory-Matched Suggestions",
    sec2Title: "Anti-Waste Recipe Catalog",
    sec2Sub: "Automatically matches recipes against your active pantry and prioritizes dishes that rescue ingredients expiring within 1–3 days.",
    sec3Eyebrow: "Smart Meal & Budget Planner",
    sec3Title: "Package Recommender & 1–5 Day Meal Planner",
    sec3Sub: "Use rule-based filtering by cooking style & budget, or build your own 1–5 day meal schedule with automatic pantry savings calculation.",
    recBoxTitle: "✨ Recommended Meal Plan Packages (Rule-Based Filtering)",
    plannerFormTitle: "Daily Cooking Schedule Builder (1–5 Days)",
    calcTitle: "Budget & Anti-Waste Savings Calculator",
    sec4Eyebrow: "Smart Shopping & Local Partners",
    sec4Title: "Auto Shopping List & Local Food SMEs",
    sec4Sub: "Missing recipe ingredients are gathered automatically here. Contact simulated local fresh produce & SME partners with transparent halal status.",
    shopListTitle: "🛒 My Shopping List",
    umkmCatalogTitle: "Local Fresh Market & Halal SME Partners (Simulated Data)",
    sec5Eyebrow: "Local Data Management",
    sec5Title: "Demo CRUD Dashboard (localStorage)",
    sec5Sub: "Create, read, update, and delete Pantry Stock, Recipes, SME Partners, and Meal Plan Packages directly in your browser without a backend."
  }
};

function applyLanguage() {
  const dict = I18N[state.lang] || I18N.ID;
  document.documentElement.lang = state.lang === "EN" ? "en" : "id";
  const btnId = document.getElementById("langID");
  const btnEn = document.getElementById("langEN");
  if (btnId) btnId.classList.toggle("active", state.lang === "ID");
  if (btnEn) btnEn.classList.toggle("active", state.lang === "EN");
  const navTag = document.getElementById("navTagline");
  if (navTag) navTag.textContent = dict.navTagline;
  const heroTitle = document.getElementById("heroTitle");
  if (heroTitle) heroTitle.innerHTML = dict.heroTitle;
  const heroDesc = document.getElementById("heroDesc");
  if (heroDesc) heroDesc.textContent = dict.heroDesc;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) el.textContent = dict[key];
  });
}

/* =========================================================================
   INGREDIENT MATCHING & EXPIRY ENGINE
   ========================================================================= */
function normalizeText(s) {
  return String(s || "").toLowerCase().trim();
}

function findStockForIngredient(ingKeyword) {
  const kw = normalizeText(ingKeyword);
  if (!kw) return null;
  const usableStocks = state.stok.filter(item => Number(item.jumlah) > 0 && daysUntil(item.tanggalKedaluwarsa) >= 0);
  return usableStocks.find(item => {
    const n = normalizeText(item.nama);
    return n.includes(kw) || kw.includes(n);
  }) || null;
}

function evaluateRecipeMatch(recipe) {
  const reqs = Array.isArray(recipe.bahanUtama) ? recipe.bahanUtama : [];
  const matched = [];
  const criticalSaved = [];
  const missing = [];

  reqs.forEach(ing => {
    const found = findStockForIngredient(ing);
    if (found) {
      matched.push({ req: ing, stock: found });
      const d = daysUntil(found.tanggalKedaluwarsa);
      if (d >= 0 && d <= 3) criticalSaved.push(found);
    } else {
      missing.push(ing);
    }
  });

  const matchPercent = reqs.length ? Math.round((matched.length / reqs.length) * 100) : 0;
  const priorityScore = criticalSaved.length * 35 + matchPercent;
  return { matched, criticalSaved, missing, matchPercent, priorityScore };
}

function halalBadgeHtml(status) {
  const s = String(status || "");
  if (s.includes("Sertifikasi Halal Resmi")) {
    return `<span class="badge badge-halal-cert">✓ ${escapeHtml(s)}</span>`;
  }
  if (s.includes("Segar Alami")) {
    return `<span class="badge badge-halal-natural">🌿 ${escapeHtml(s)}</span>`;
  }
  return `<span class="badge badge-unverified">⚠ ${escapeHtml(s || "Belum Diverifikasi Resmi")}</span>`;
}

function isFavorited(itemId, tipeItem) {
  return state.favorit.some(f => f.itemId === itemId && f.tipeItem === tipeItem);
}

function toggleFavorite(itemId, tipeItem) {
  const idx = state.favorit.findIndex(f => f.itemId === itemId && f.tipeItem === tipeItem);
  if (idx >= 0) {
    state.favorit.splice(idx, 1);
    showToast("Dihapus dari daftar Favorit.");
  } else {
    state.favorit.push({
      id: "fav-" + Date.now(),
      itemId,
      tipeItem,
      tanggalDitambahkan: isoOffsetDays(0)
    });
    showToast("Tersimpan ke daftar Favorit!");
  }
  saveState();
  renderAll();
}

/* =========================================================================
   RENDER HERO STATS, SVG KITCHEN ZONES, & STOCK INVENTORY
   ========================================================================= */
function renderStatsAndZones() {
  const activeItems = state.stok.filter(s => Number(s.jumlah) > 0);
  const expiringSoon = activeItems.filter(s => {
    const d = daysUntil(s.tanggalKedaluwarsa);
    return d >= 0 && d <= 3;
  });
  const expired = activeItems.filter(s => daysUntil(s.tanggalKedaluwarsa) < 0);
  const rescueVal = expiringSoon.reduce((acc, s) => acc + (Number(s.estimasiNilai) || 0), 0);

  const heroBox = document.getElementById("heroPhotoContainer");
  if (heroBox) {
    const heroSrc = state.heroImageUrl || DEFAULT_PHOTOS.hero;
    heroBox.innerHTML = `
      ${renderPhotoImgTag(heroSrc, "Kuliner Nusantara Anti-Mubazir")}
      ${canAccessDashboard() ? `<button type="button" class="upload-photo-btn" onclick="openPhotoManagerModal('hero', 'hero')">📷 Upload / Ganti Sampul</button>` : ""}
    `;
  }
  document.getElementById("todayDateLabel").textContent = new Date().toLocaleDateString(
    state.lang === "EN" ? "en-US" : "id-ID",
    { day: "numeric", month: "short", year: "numeric" }
  );
  document.getElementById("statTotalStock").textContent = activeItems.length;
  document.getElementById("statExpiringSoon").textContent = expiringSoon.length;
  document.getElementById("statExpired").textContent = expired.length;
  document.getElementById("statRescueValue").textContent = formatRupiah(rescueVal);

  document.getElementById("navExpiringBadge").textContent = expiringSoon.length;
  document.getElementById("navShopBadge").textContent = state.belanja.filter(b => !b.sudahDibeli).length;
  document.getElementById("navFavBadge").textContent = state.favorit.length;

  const favBtn = document.getElementById("btnToggleFavFilter");
  favBtn.style.background = state.onlyFavorites ? "var(--gold-100)" : "";
  favBtn.style.borderColor = state.onlyFavorites ? "var(--gold-500)" : "";

  // SVG Map Zone Counts
  const svgMapIds = {
    "Freezer": "svgCount-Freezer",
    "Chiller Kulkas": "svgCount-Chiller",
    "Rak Kering / Pantry": "svgCount-Pantry",
    "Meja Dapur / Suhu Ruang": "svgCount-Meja",
    "Rak Bumbu": "svgCount-Bumbu"
  };

  Object.entries(svgMapIds).forEach(([zoneName, elId]) => {
    const itemsInZone = activeItems.filter(s => s.zonaSimpan === zoneName);
    const critCount = itemsInZone.filter(s => daysUntil(s.tanggalKedaluwarsa) <= 3).length;
    const textEl = document.getElementById(elId);
    if (textEl) {
      textEl.textContent = critCount > 0
        ? `${itemsInZone.length} bahan (${critCount} kritis!)`
        : `${itemsInZone.length} bahan aman`;
      textEl.setAttribute("fill", critCount > 0 ? "#b7791f" : "#0c4f3d");
    }
  });

  document.querySelectorAll("#kitchenSvgMap .zone-node").forEach(g => {
    g.classList.toggle("active", g.getAttribute("data-zone") === state.selectedZone);
  });

  // Zone quick pills
  const pillsHtml = [
    `<button type="button" class="zone-pill ${state.selectedZone === "ALL" ? "active" : ""}" onclick="selectZoneFromMap('ALL')">Semua Zona (${activeItems.length})</button>`,
    ...ZONES.map(z => {
      const cnt = activeItems.filter(s => s.zonaSimpan === z).length;
      return `<button type="button" class="zone-pill ${state.selectedZone === z ? "active" : ""}" onclick="selectZoneFromMap('${escapeHtml(z)}')">${escapeHtml(z)} (${cnt})</button>`;
    })
  ].join("");
  document.getElementById("zoneQuickPills").innerHTML = pillsHtml;
  document.getElementById("activeZoneCaption").textContent =
    state.selectedZone === "ALL"
      ? "Menampilkan seluruh 5 zona dapur. Klik denah SVG atau tombol zona untuk memfilter stok."
      : `Filter Zona Aktif: ${state.selectedZone} — klik kembali untuk menampilkan semua zona.`;
}

function selectZoneFromMap(zone) {
  state.selectedZone = (state.selectedZone === zone && zone !== "ALL") ? "ALL" : zone;
  saveState();
  renderStatsAndZones();
  renderStockGrid();
}

function renderStockGrid() {
  const q = normalizeText(document.getElementById("stockSearch").value);
  const cat = document.getElementById("stockCategoryFilter").value;
  const statusFilter = document.getElementById("stockStatusFilter").value;
  const sortBy = document.getElementById("stockSort").value;

  let list = state.stok.filter(item => {
    if (state.selectedZone !== "ALL" && item.zonaSimpan !== state.selectedZone) return false;
    if (cat !== "ALL" && item.kategori !== cat) return false;
    if (q && !normalizeText(item.nama + " " + item.kategori + " " + item.zonaSimpan).includes(q)) return false;

    const d = daysUntil(item.tanggalKedaluwarsa);
    if (statusFilter === "WARN" && !(d >= 0 && d <= 3)) return false;
    if (statusFilter === "EXPIRED" && !(d < 0)) return false;
    if (statusFilter === "FRESH" && !(d > 3)) return false;
    return true;
  });

  list.sort((a, b) => {
    if (sortBy === "EXP_ASC") return daysUntil(a.tanggalKedaluwarsa) - daysUntil(b.tanggalKedaluwarsa);
    if (sortBy === "VAL_DESC") return (Number(b.estimasiNilai) || 0) - (Number(a.estimasiNilai) || 0);
    return a.nama.localeCompare(b.nama, "id");
  });

  const grid = document.getElementById("stockGrid");
  if (!list.length) {
    grid.innerHTML = `<div class="panel-card" style="grid-column:1/-1;text-align:center;color:var(--neutral-500);">Tidak ada bahan stok yang cocok dengan filter saat ini.</div>`;
    return;
  }

  grid.innerHTML = list.map(item => {
    const d = daysUntil(item.tanggalKedaluwarsa);
    let statusBadge = `<span class="badge badge-fresh">Segar (${d} hari lagi)</span>`;
    let cardClass = "status-fresh";
    if (d < 0) {
      statusBadge = `<span class="badge badge-danger">Kedaluwarsa (${Math.abs(d)} hari lalu)</span>`;
      cardClass = "status-expired";
    } else if (d === 0) {
      statusBadge = `<span class="badge badge-danger">Batas Hari Ini!</span>`;
      cardClass = "status-warn";
    } else if (d <= 3) {
      statusBadge = `<span class="badge badge-warn">Segera Olah (${d} hari lagi)</span>`;
      cardClass = "status-warn";
    }

    const dateTypeBadge = item.tipeTanggal === "Kemasan Resmi"
      ? `<span class="badge" style="background:#eef2ff;color:#3730a3;border:1px solid #c7d2fe;">📅 Tanggal Kemasan Resmi</span>`
      : `<span class="badge" style="background:#f8fafc;color:#475569;border:1px solid #cbd5e1;">⏱ Estimasi Referensi</span>`;

    const photoUrl = getItemPhoto(item, "stok");
    return `
      <article class="card stock-card ${cardClass}">
        <div class="card-thumb" style="height:148px;">
          ${renderPhotoImgTag(photoUrl, item.nama)}
          <div class="thumb-badges">
            ${statusBadge}
          </div>
          <button type="button" class="upload-photo-btn" onclick="openPhotoManagerModal('stok', '${escapeHtml(item.id)}')">📷 Upload Foto</button>
        </div>

        <div class="card-body">
          <div>
            <div class="card-title">${escapeHtml(item.nama)}</div>
            <div class="card-meta" style="margin-top:3px;">
              <span>📍 ${escapeHtml(item.zonaSimpan)}</span> • <span>${escapeHtml(item.kategori)}</span>
            </div>
          </div>

          <div style="display:flex;flex-wrap:wrap;gap:6px;">
            ${dateTypeBadge}
            ${halalBadgeHtml(item.statusHalal)}
          </div>

          <div style="font-size:0.82rem;color:var(--neutral-700);background:var(--neutral-100);padding:8px 10px;border-radius:8px;">
            <div><strong>Batas Simpan:</strong> ${escapeHtml(item.tanggalKedaluwarsa)} • <strong>Nilai Simulasi:</strong> ${formatRupiah(item.estimasiNilai)}</div>
            <div style="margin-top:3px;color:var(--neutral-500);">💡 ${escapeHtml(item.tipsSimpan || item.sumberVerifikasi)}</div>
          </div>

          <div class="card-footer">
            <div class="qty-ctrl">
              <button type="button" onclick="adjustStockQty('${escapeHtml(item.id)}', -1)" title="Kurangi Stok">−</button>
              <span><strong>${escapeHtml(item.jumlah)}</strong> ${escapeHtml(item.satuan)}</span>
              <button type="button" onclick="adjustStockQty('${escapeHtml(item.id)}', 1)" title="Tambah Stok">+</button>
            </div>
            <div style="display:flex;gap:6px;">
              <button type="button" class="btn btn-outline btn-sm" onclick="addSingleToShopping('${escapeHtml(item.nama)} (${escapeHtml(item.satuan)})', 'Restok Dapur')">+ Belanja</button>
              <button type="button" class="btn btn-primary btn-sm" onclick="filterRecipesByIngredient('${escapeHtml(item.nama)}')">Cari Resep</button>
            </div>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

function adjustStockQty(id, delta) {
  const item = state.stok.find(s => s.id === id);
  if (!item) return;
  const step = item.satuan === "gram" || item.satuan === "ml" ? 100 : 1;
  item.jumlah = Math.max(0, Number(item.jumlah) + delta * step);
  if (item.jumlah === 0) {
    addSingleToShopping(`${item.nama} (1 ${item.satuan})`, "Stok Habis Otomatis", true);
    showToast(`Stok "${item.nama}" habis & otomatis masuk Daftar Belanja.`);
  }
  saveState();
  renderAll();
}

function filterRecipesByIngredient(ingName) {
  const shortName = ingName.split("(")[0].trim().split(" ").slice(0, 2).join(" ");
  state.ingredientRecipeFilter = shortName;
  saveState();
  renderRecipeGrid();
  document.getElementById("resepSection").scrollIntoView({ behavior: "smooth" });
}

function clearIngredientRecipeFilter() {
  state.ingredientRecipeFilter = "";
  saveState();
  renderRecipeGrid();
}

/* =========================================================================
   RECEIPT SCANNER SIMULATION
   ========================================================================= */
const SAMPLE_RECEIPTS = {
  pasar: "Kangkung Segar | 2 | ikat\nTempe Papan | 2 | papan\nCabai Merah Keriting | 200 | gram\nTomat Merah | 6 | buah",
  kos: "Telur Ayam Negeri | 6 | butir\nSusu UHT Full Cream | 1 | kotak\nTahu Putih Segar | 1 | bungkus",
  keluarga: "Dada Ayam Fillet | 500 | gram\nBayam Hijau | 2 | ikat\nWortel Segar | 500 | gram\nPisang Kepok | 1 | sisir"
};

function loadSampleReceipt(type) {
  document.getElementById("receiptTextarea").value = SAMPLE_RECEIPTS[type] || SAMPLE_RECEIPTS.pasar;
}

function inferIngredientMetadata(name) {
  const n = normalizeText(name);
  if (/bayam|kangkung|sawi|kemangi/.test(n)) {
    return { kategori: "Sayur & Buah", zonaSimpan: "Chiller Kulkas", shelfDays: 2, nilai: 7000, statusHalal: "Bahan Segar Alami" };
  }
  if (/wortel|buncis|kentang/.test(n)) {
    return { kategori: "Sayur & Buah", zonaSimpan: "Chiller Kulkas", shelfDays: 7, nilai: 9000, statusHalal: "Bahan Segar Alami" };
  }
  if (/tomat|pisang|buah/.test(n)) {
    return { kategori: "Sayur & Buah", zonaSimpan: "Meja Dapur / Suhu Ruang", shelfDays: 3, nilai: 10000, statusHalal: "Bahan Segar Alami" };
  }
  if (/ayam|ikan|udang/.test(n)) {
    return { kategori: "Protein Hewani", zonaSimpan: "Chiller Kulkas", shelfDays: 2, nilai: 28000, statusHalal: "Belum Diverifikasi Resmi" };
  }
  if (/sapi|beku|frozen/.test(n)) {
    return { kategori: "Protein Hewani", zonaSimpan: "Freezer", shelfDays: 21, nilai: 42000, statusHalal: "Belum Diverifikasi Resmi" };
  }
  if (/tahu/.test(n)) {
    return { kategori: "Protein Nabati & Telur", zonaSimpan: "Chiller Kulkas", shelfDays: 2, nilai: 7000, statusHalal: "Bahan Segar Alami" };
  }
  if (/tempe|telur/.test(n)) {
    return { kategori: "Protein Nabati & Telur", zonaSimpan: /telur/.test(n) ? "Meja Dapur / Suhu Ruang" : "Chiller Kulkas", shelfDays: /telur/.test(n) ? 10 : 4, nilai: 14000, statusHalal: "Bahan Segar Alami" };
  }
  if (/susu|keju|yogurt|santan/.test(n)) {
    return { kategori: "Susu & Olahan", zonaSimpan: "Chiller Kulkas", shelfDays: 3, nilai: 14000, statusHalal: "Sertifikasi Halal Resmi" };
  }
  if (/bawang|cabai|kecap|bumbu|garam/.test(n)) {
    return { kategori: "Bumbu & Rempah", zonaSimpan: "Rak Bumbu", shelfDays: 14, nilai: 12000, statusHalal: "Bahan Segar Alami" };
  }
  return { kategori: "Bahan Pokok & Kering", zonaSimpan: "Rak Kering / Pantry", shelfDays: 30, nilai: 15000, statusHalal: "Belum Diverifikasi Resmi" };
}

function processReceiptInput() {
  const raw = document.getElementById("receiptTextarea").value.trim();
  if (!raw) {
    showToast("Tempel atau pilih contoh teks struk terlebih dahulu.");
    return;
  }
  const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  let addedCount = 0;

  lines.forEach(line => {
    let nama = line;
    let jumlah = 1;
    let satuan = "pcs";

    if (line.includes("|")) {
      const parts = line.split("|").map(p => p.trim());
      nama = parts[0] || "Bahan Baru";
      jumlah = Number(parts[1]) || 1;
      satuan = parts[2] || "pcs";
    } else {
      const m = line.match(/^(.+?)\s+(\d+)\s*([a-zA-Z]+)?$/);
      if (m) {
        nama = m[1].trim();
        jumlah = Number(m[2]) || 1;
        satuan = m[3] || "pcs";
      }
    }

    const meta = inferIngredientMetadata(nama);
    state.stok.unshift({
      id: "stk-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
      nama,
      imageUrl: guessDefaultPhotoByText(nama, "stok"),
      kategori: meta.kategori,
      zonaSimpan: meta.zonaSimpan,
      jumlah,
      satuan,
      tanggalMasuk: isoOffsetDays(0),
      tanggalKedaluwarsa: isoOffsetDays(meta.shelfDays),
      tipeTanggal: "Estimasi Referensi",
      estimasiNilai: meta.nilai,
      statusHalal: meta.statusHalal,
      sumberVerifikasi: "Hasil ekstraksi simulasi struk — harap periksa label fisik",
      tipsSimpan: `Estimasi umur simpan otomatis ${meta.shelfDays} hari di ${meta.zonaSimpan}.`
    });
    addedCount++;
  });

  document.getElementById("receiptTextarea").value = "";
  document.getElementById("scannerPanel").style.display = "none";
  saveState();
  renderAll();
  showToast(`${addedCount} bahan dari struk berhasil ditambahkan ke stok dapur!`);
}

/* =========================================================================
   RENDER RECIPES CATALOG & DETAIL MODAL
   ========================================================================= */
function renderRecipeGrid() {
  const q = normalizeText(document.getElementById("recipeSearch").value);
  const cat = document.getElementById("recipeCategoryFilter").value;
  const zone = document.getElementById("recipeZoneFilter").value;
  const sortBy = document.getElementById("recipeSort").value;

  const banner = document.getElementById("activeIngredientFilterBanner");
  if (state.ingredientRecipeFilter) {
    banner.style.display = "inline-flex";
    document.getElementById("activeIngredientFilterText").textContent = `Filter Bahan Aktif: "${state.ingredientRecipeFilter}"`;
  } else {
    banner.style.display = "none";
  }

  let decorated = state.resep.map(r => ({ recipe: r, eval: evaluateRecipeMatch(r) }));

  decorated = decorated.filter(({ recipe }) => {
    if (state.onlyFavorites && !isFavorited(recipe.id, "resep")) return false;
    if (cat !== "ALL" && recipe.kategori !== cat) return false;
    if (zone !== "ALL" && recipe.zonaUtama !== zone) return false;
    if (state.ingredientRecipeFilter) {
      const ingKw = normalizeText(state.ingredientRecipeFilter);
      const hit = (recipe.bahanUtama || []).some(b => normalizeText(b).includes(ingKw) || ingKw.includes(normalizeText(b)))
        || normalizeText(recipe.nama).includes(ingKw);
      if (!hit) return false;
    }
    if (q) {
      const hay = normalizeText(recipe.nama + " " + recipe.kategori + " " + recipe.deskripsi + " " + (recipe.bahanUtama || []).join(" "));
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  decorated.sort((a, b) => {
    if (sortBy === "RESCUE_DESC") return b.eval.priorityScore - a.eval.priorityScore;
    if (sortBy === "MATCH_DESC") return b.eval.matchPercent - a.eval.matchPercent;
    if (sortBy === "COST_ASC") return (Number(a.recipe.estimasiBiaya) || 0) - (Number(b.recipe.estimasiBiaya) || 0);
    if (sortBy === "TIME_ASC") return (Number(a.recipe.waktuMenit) || 0) - (Number(b.recipe.waktuMenit) || 0);
    return a.recipe.nama.localeCompare(b.recipe.nama, "id");
  });

  const grid = document.getElementById("recipeGrid");
  if (!decorated.length) {
    grid.innerHTML = `<div class="panel-card" style="grid-column:1/-1;text-align:center;color:var(--neutral-500);">Tidak ditemukan resep yang sesuai filter pencarian.</div>`;
    return;
  }

  grid.innerHTML = decorated.map(({ recipe, eval: ev }) => {
    const fav = isFavorited(recipe.id, "resep");
    const rescueBadge = ev.criticalSaved.length > 0
      ? `<span class="badge badge-warn">⚡ Selamatkan ${ev.criticalSaved.length} Bahan Kritis</span>`
      : `<span class="badge badge-fresh">Kecocokan Stok ${ev.matchPercent}%</span>`;

    return `
      <article class="card">
        <div class="card-thumb" style="height:172px;">
          ${renderPhotoImgTag(getItemPhoto(recipe, "resep"), recipe.nama)}
          <div class="thumb-badges">
            <div style="display:flex;flex-direction:column;gap:5px;">
              ${rescueBadge}
              ${recipe.unggulan ? `<span class="badge badge-gold">★ Rekomendasi Utama</span>` : ""}
            </div>
            <button type="button" class="fav-btn ${fav ? "active" : ""}" onclick="toggleFavorite('${escapeHtml(recipe.id)}', 'resep')" title="Simpan Resep Favorit">♥</button>
          </div>
          ${canAccessDashboard() ? `<button type="button" class="upload-photo-btn" onclick="openPhotoManagerModal('resep', '${escapeHtml(recipe.id)}')">📷 Upload Foto</button>` : ""}
        </div>

        <div class="card-body">
          <div class="card-title">${escapeHtml(recipe.nama)}</div>
          <div class="card-meta">
            <span>⏱ ${escapeHtml(recipe.waktuMenit)} mnt</span> •
            <span>🍽 ${escapeHtml(recipe.porsiDasar)} porsi</span> •
            <span>💰 ${formatRupiah(recipe.estimasiBiaya)} (simulasi)</span>
          </div>
          <p class="card-desc">${escapeHtml(recipe.deskripsi)}</p>

          <div style="font-size:0.79rem;background:var(--neutral-100);padding:8px 10px;border-radius:8px;">
            <div><strong>Tersedia di Dapur (${ev.matched.length}/${recipe.bahanUtama.length}):</strong> ${ev.matched.length ? ev.matched.map(m => escapeHtml(m.req)).join(", ") : "Belum ada"}</div>
            ${ev.missing.length ? `<div style="color:var(--warn-700);margin-top:3px;"><strong>Kurang:</strong> ${ev.missing.map(escapeHtml).join(", ")}</div>` : `<div style="color:var(--emerald-700);margin-top:3px;"><strong>✓ Semua bahan utama tersedia!</strong></div>`}
          </div>

          <div class="card-footer">
            <button type="button" class="btn btn-outline btn-sm" onclick="quickAddRecipeToPlanner('${escapeHtml(recipe.id)}')">+ Meal Plan</button>
            <button type="button" class="btn btn-primary btn-sm" onclick="openRecipeModal('${escapeHtml(recipe.id)}')">Detail & Masak</button>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

function openRecipeModal(recipeId) {
  const recipe = state.resep.find(r => r.id === recipeId);
  if (!recipe) return;
  const ev = evaluateRecipeMatch(recipe);

  const ingItemsHtml = (recipe.bahanUtama || []).map(ing => {
    const found = findStockForIngredient(ing);
    if (found) {
      const d = daysUntil(found.tanggalKedaluwarsa);
      const tag = d <= 3
        ? `<span class="badge badge-warn">Tersedia • Segera Olah (${d} hr)</span>`
        : `<span class="badge badge-fresh">Tersedia di ${escapeHtml(found.zonaSimpan)}</span>`;
      return `<li style="margin-bottom:6px;display:flex;justify-content:space-between;gap:8px;align-items:center;"><span><strong>${escapeHtml(ing)}</strong> (${escapeHtml(found.jumlah)} ${escapeHtml(found.satuan)})</span> ${tag}</li>`;
    }
    return `<li style="margin-bottom:6px;display:flex;justify-content:space-between;gap:8px;align-items:center;"><span><strong>${escapeHtml(ing)}</strong></span> <span class="badge badge-danger">Belum Tersedia / Habis</span></li>`;
  }).join("");

  const stepsHtml = (recipe.langkahMasak || []).map(s => `<li style="margin-bottom:6px;">${escapeHtml(s)}</li>`).join("");

  document.getElementById("modalBody").innerHTML = `
    <div class="card-thumb" style="border-radius:14px;overflow:hidden;height:220px;margin-bottom:16px;">
      ${renderPhotoImgTag(getItemPhoto(recipe, "resep"), recipe.nama)}
      ${canAccessDashboard() ? `<button type="button" class="upload-photo-btn" onclick="openPhotoManagerModal('resep', '${escapeHtml(recipe.id)}')">📷 Ganti Foto Masakan</button>` : ""}
    </div>
    <span class="eyebrow">${escapeHtml(recipe.kategori)} • ${escapeHtml(recipe.zonaUtama)}</span>
    <h2 style="color:var(--emerald-900);margin-bottom:6px;">${escapeHtml(recipe.nama)}</h2>
    <p style="color:var(--neutral-700);font-size:0.92rem;margin-bottom:14px;">${escapeHtml(recipe.deskripsi)}</p>

    <div style="display:flex;flex-wrap:wrap;gap:10px;margin-bottom:16px;font-size:0.85rem;">
      <span class="badge badge-fresh">Kecocokan Stok: ${ev.matchPercent}%</span>
      <span class="badge badge-gold">Estimasi Biaya Simulasi: ${formatRupiah(recipe.estimasiBiaya)} / ${escapeHtml(recipe.porsiDasar)} porsi</span>
      <span class="badge badge-halal-natural">⏱ Waktu: ${escapeHtml(recipe.waktuMenit)} menit</span>
    </div>

    <h4 style="color:var(--emerald-900);margin-bottom:8px;">Kecocokan Bahan Dapur</h4>
    <ul style="list-style:none;background:var(--neutral-100);padding:12px 14px;border-radius:10px;margin-bottom:16px;font-size:0.88rem;">
      ${ingItemsHtml}
    </ul>

    <h4 style="color:var(--emerald-900);margin-bottom:8px;">Langkah Memasak</h4>
    <ol style="padding-left:20px;margin-bottom:16px;font-size:0.9rem;color:var(--neutral-700);">
      ${stepsHtml}
    </ol>

    <div style="background:var(--emerald-50);border:1px solid #b8e3d2;padding:12px;border-radius:10px;font-size:0.84rem;margin-bottom:18px;">
      <div><strong>Alat Masak:</strong> ${(recipe.alatMasak || ["Wajan/Panci"]).map(escapeHtml).join(", ")}</div>
      <div style="margin-top:4px;"><strong>Catatan Keamanan & Titik Kritis Halal:</strong> ${escapeHtml(recipe.panduanHalalPangan)}</div>
    </div>

    <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:flex-end;">
      ${ev.missing.length ? `<button type="button" class="btn btn-gold" onclick="addMissingFromRecipe('${escapeHtml(recipe.id)}')">🛒 Tambah ${ev.missing.length} Bahan Kurang ke Daftar Belanja</button>` : ""}
      <button type="button" class="btn btn-primary" onclick="markRecipeCooked('${escapeHtml(recipe.id)}')">🍳 Tandai Sudah Dimasak (Gunakan Stok)</button>
    </div>
  `;
  document.getElementById("appModal").classList.add("open");
}

function closeModal() {
  document.getElementById("appModal").classList.remove("open");
}

function addMissingFromRecipe(recipeId) {
  const recipe = state.resep.find(r => r.id === recipeId);
  if (!recipe) return;
  const ev = evaluateRecipeMatch(recipe);
  if (!ev.missing.length) {
    showToast("Semua bahan resep ini sudah tersedia di dapur!");
    return;
  }
  ev.missing.forEach(ing => addSingleToShopping(ing, `Resep: ${recipe.nama}`, true));
  saveState();
  renderAll();
  closeModal();
  showToast(`${ev.missing.length} bahan yang kurang ditambahkan ke Daftar Belanja.`);
}

function markRecipeCooked(recipeId) {
  const recipe = state.resep.find(r => r.id === recipeId);
  if (!recipe) return;
  let usedCount = 0;
  (recipe.bahanUtama || []).forEach(ing => {
    const stock = findStockForIngredient(ing);
    if (stock && Number(stock.jumlah) > 0) {
      const deduct = (stock.satuan === "gram" || stock.satuan === "ml") ? Math.min(150, stock.jumlah) : 1;
      stock.jumlah = Math.max(0, Number(stock.jumlah) - deduct);
      usedCount++;
    }
  });
  saveState();
  renderAll();
  closeModal();
  showToast(`Masakan selesai! ${usedCount} stok bahan dapur otomatis diperbarui.`);
}

/* =========================================================================
   RULE-BASED PACKAGE RECOMMENDER & 1-5 DAY MEAL PLANNER
   ========================================================================= */
function renderPackages() {
  const interest = document.getElementById("pkgInterestFilter").value;
  const maxBudget = Number(document.getElementById("pkgMaxBudget").value) || 9999999;
  const maxDays = Number(document.getElementById("pkgMaxDays").value) || 5;

  const filtered = state.paket.filter(p => {
    if (interest !== "ALL" && p.profilMinat !== interest) return false;
    if (Number(p.estimasiBiaya) > maxBudget) return false;
    if (Number(p.durasiHari) > maxDays) return false;
    return true;
  }).map(p => {
    const validRecipes = (p.daftarResep || []).map(id => state.resep.find(r => r.id === id)).filter(Boolean);
    const avgMatch = validRecipes.length
      ? Math.round(validRecipes.reduce((acc, r) => acc + evaluateRecipeMatch(r).matchPercent, 0) / validRecipes.length)
      : 0;
    return { pkg: p, validRecipes, avgMatch };
  }).sort((a, b) => b.avgMatch - a.avgMatch);

  const grid = document.getElementById("pkgGrid");
  if (!filtered.length) {
    grid.innerHTML = `<div style="grid-column:1/-1;padding:16px;text-align:center;color:var(--neutral-500);">Tidak ada paket yang memenuhi batas anggaran/minat tersebut. Coba naikkan batas anggaran.</div>`;
    return;
  }

  grid.innerHTML = filtered.map(({ pkg, validRecipes, avgMatch }) => `
    <article class="card" style="border-top:4px solid var(--turquoise-600);">
      <div class="card-thumb" style="height:145px;">
        ${renderPhotoImgTag(getItemPhoto(pkg, "paket"), pkg.nama)}
        ${canAccessDashboard() ? `<button type="button" class="upload-photo-btn" onclick="openPhotoManagerModal('paket', '${escapeHtml(pkg.id)}')">📷 Upload Foto</button>` : ""}
      </div>
      <div class="card-body">
        <div style="display:flex;justify-content:space-between;gap:8px;align-items:flex-start;">
          <span class="badge badge-gold">${escapeHtml(pkg.profilMinat)}</span>
          <span class="badge badge-fresh">Sinergi Stok ${avgMatch}%</span>
        </div>
        <div class="card-title">${escapeHtml(pkg.nama)}</div>
        <div class="card-meta">
          <span>📅 ${escapeHtml(pkg.durasiHari)} Hari</span> •
          <span>🍲 ${validRecipes.length} Menu</span> •
          <span>💰 Est. ${formatRupiah(pkg.estimasiBiaya)}</span>
        </div>
        <p class="card-desc">${escapeHtml(pkg.deskripsi)}</p>
        <div style="font-size:0.78rem;color:var(--neutral-500);">
          <strong>Menu:</strong> ${validRecipes.map(r => escapeHtml(r.nama)).join(" • ")}
        </div>
        <div class="card-footer">
          <button type="button" class="btn btn-primary btn-sm" style="width:100%;" onclick="applyPackageToPlanner('${escapeHtml(pkg.id)}')">Terapkan ke Meal Planner</button>
        </div>
      </div>
    </article>
  `).join("");
}

function resetPkgFilters() {
  document.getElementById("pkgInterestFilter").value = "ALL";
  document.getElementById("pkgMaxBudget").value = "9999999";
  document.getElementById("pkgMaxDays").value = "5";
  renderPackages();
}

function applyPackageToPlanner(pkgId) {
  const pkg = state.paket.find(p => p.id === pkgId);
  if (!pkg) return;
  state.rencana.namaRencana = pkg.nama;
  state.rencana.jumlahHari = Math.min(5, Math.max(1, Number(pkg.durasiHari) || 3));
  state.rencana.slots = {};
  const times = ["Sarapan", "Siang", "Malam"];
  let idx = 0;
  for (let d = 1; d <= state.rencana.jumlahHari; d++) {
    for (const t of times) {
      if (idx < pkg.daftarResep.length) {
        state.rencana.slots[`${d}-${t}`] = pkg.daftarResep[idx++];
      }
    }
  }
  saveState();
  renderPlanner();
  showToast(`Paket "${pkg.nama}" berhasil dimuat ke Meal Planner!`);
}

function quickAddRecipeToPlanner(recipeId) {
  const times = ["Sarapan", "Siang", "Malam"];
  for (let d = 1; d <= state.rencana.jumlahHari; d++) {
    for (const t of times) {
      const key = `${d}-${t}`;
      if (!state.rencana.slots[key]) {
        state.rencana.slots[key] = recipeId;
        saveState();
        renderPlanner();
        showToast("Resep ditambahkan ke slot kosong Meal Planner!");
        return;
      }
    }
  }
  state.rencana.slots["1-Malam"] = recipeId;
  saveState();
  renderPlanner();
  showToast("Slot penuh — resep ditempatkan pada Hari 1 (Malam).");
}

function renderPlanner() {
  const r = state.rencana;
  document.getElementById("planName").value = r.namaRencana || "";
  document.getElementById("planStartDate").value = r.tanggalMulai || isoOffsetDays(0);
  document.getElementById("planDays").value = String(r.jumlahHari || 3);
  document.getElementById("planPeople").value = String(r.jumlahOrang || 2);
  document.getElementById("planExtraBudget").value = String(r.biayaTambahan ?? 15000);

  const times = ["Sarapan", "Siang", "Malam"];
  const recipeOptionsBase = `<option value="">— Pilih Resep —</option>` + state.resep.map(rsp =>
    `<option value="${escapeHtml(rsp.id)}">${escapeHtml(rsp.nama)} (${formatRupiah(rsp.estimasiBiaya)})</option>`
  ).join("");

  let daysHtml = "";
  for (let d = 1; d <= r.jumlahHari; d++) {
    const slotBoxes = times.map(t => {
      const key = `${d}-${t}`;
      const selectedId = r.slots[key] || "";
      return `
        <div class="meal-slot">
          <label>${t}</label>
          <select onchange="updatePlannerSlot('${key}', this.value)">
            ${recipeOptionsBase.replace(`value="${escapeHtml(selectedId)}"`, `value="${escapeHtml(selectedId)}" selected`)}
          </select>
        </div>
      `;
    }).join("");

    daysHtml += `
      <div class="day-card">
        <h4><span>Hari ke-${d}</span> <span style="font-weight:600;color:var(--neutral-500);font-size:0.8rem;">3 Waktu Makan</span></h4>
        <div class="meal-slots">${slotBoxes}</div>
      </div>
    `;
  }
  document.getElementById("plannerDaysContainer").innerHTML = daysHtml;
  calculatePlannerBudget();
}

function updatePlannerSlot(slotKey, recipeId) {
  if (!recipeId) {
    delete state.rencana.slots[slotKey];
  } else {
    state.rencana.slots[slotKey] = recipeId;
  }
  saveState();
  calculatePlannerBudget();
}

function getPlannerComputedSummary() {
  const r = state.rencana;
  const people = Math.max(1, Number(r.jumlahOrang) || 2);
  const days = Math.max(1, Number(r.jumlahHari) || 1);
  const extra = Math.max(0, Number(r.biayaTambahan) || 0);

  let menuCount = 0;
  let grossCost = 0;
  let savedFromStock = 0;
  const criticalIds = new Set();
  const missingSet = new Set();

  Object.entries(r.slots || {}).forEach(([key, recipeId]) => {
    const dayNum = Number(key.split("-")[0]);
    if (dayNum > days || !recipeId) return;
    const recipe = state.resep.find(x => x.id === recipeId);
    if (!recipe) return;

    menuCount++;
    const scale = people / Math.max(1, Number(recipe.porsiDasar) || 2);
    const scaledCost = Math.round((Number(recipe.estimasiBiaya) || 0) * scale);
    grossCost += scaledCost;

    const ev = evaluateRecipeMatch(recipe);
    savedFromStock += Math.round(scaledCost * (ev.matchPercent / 100) * 0.75);
    ev.criticalSaved.forEach(c => criticalIds.add(c.id));
    ev.missing.forEach(m => missingSet.add(m));
  });

  const netGrocery = Math.max(0, grossCost - savedFromStock) + (menuCount > 0 ? extra : 0);
  const perPersonDay = Math.round(netGrocery / (people * days));

  return { menuCount, grossCost, savedFromStock, extra: menuCount > 0 ? extra : 0, netGrocery, perPersonDay, criticalCount: criticalIds.size, missingItems: Array.from(missingSet) };
}

function calculatePlannerBudget() {
  const sum = getPlannerComputedSummary();
  document.getElementById("calcMenuCount").textContent = `${sum.menuCount} sesi makan`;
  document.getElementById("calcGrossCost").textContent = formatRupiah(sum.grossCost);
  document.getElementById("calcSavedFromStock").textContent = "- " + formatRupiah(sum.savedFromStock);
  document.getElementById("calcExtraReserve").textContent = formatRupiah(sum.extra);
  document.getElementById("calcNetGrocery").textContent = formatRupiah(sum.netGrocery);
  document.getElementById("calcPerPersonDay").textContent = formatRupiah(sum.perPersonDay);
  document.getElementById("calcCriticalSavedCount").textContent = `${sum.criticalCount} bahan`;
  document.getElementById("calcMissingListCount").textContent = `${sum.missingItems.length} jenis`;
}

/* =========================================================================
   SHOPPING LIST & UMKM LOCAL PARTNERS (WITH DEMO WHATSAPP MODAL)
   ========================================================================= */
function addSingleToShopping(namaBahan, sumberAsal = "Input Manual", silent = false) {
  const exists = state.belanja.some(b => !b.sudahDibeli && normalizeText(b.namaBahan) === normalizeText(namaBahan));
  if (!exists) {
    state.belanja.unshift({
      id: "shp-" + Date.now() + "-" + Math.floor(Math.random() * 999),
      namaBahan,
      sumberAsal,
      sudahDibeli: false
    });
    saveState();
    renderShoppingAndUmkm();
    renderStatsAndZones();
  }
  if (!silent) showToast(`"${namaBahan}" ditambahkan ke Daftar Belanja.`);
}

function toggleShopItem(id) {
  const item = state.belanja.find(b => b.id === id);
  if (item) {
    item.sudahDibeli = !item.sudahDibeli;
    saveState();
    renderShoppingAndUmkm();
    renderStatsAndZones();
  }
}

function removeShopItem(id) {
  state.belanja = state.belanja.filter(b => b.id !== id);
  saveState();
  renderShoppingAndUmkm();
  renderStatsAndZones();
}

function renderShoppingAndUmkm() {
  const container = document.getElementById("shoppingListContainer");
  if (!state.belanja.length) {
    container.innerHTML = `<p style="color:var(--neutral-500);font-size:0.88rem;padding:12px 0;">Daftar belanja kosong. Tambahkan dari resep atau meal planner!</p>`;
  } else {
    container.innerHTML = state.belanja.map(item => `
      <div class="shop-item ${item.sudahDibeli ? "done" : ""}">
        <label style="display:flex;align-items:center;gap:9px;cursor:pointer;flex:1;">
          <input type="checkbox" ${item.sudahDibeli ? "checked" : ""} onchange="toggleShopItem('${escapeHtml(item.id)}')" />
          <div>
            <span style="font-weight:700;display:block;">${escapeHtml(item.namaBahan)}</span>
            <small style="color:var(--neutral-500);font-size:0.74rem;">Sumber: ${escapeHtml(item.sumberAsal)}</small>
          </div>
        </label>
        <button type="button" class="btn btn-outline btn-sm" onclick="removeShopItem('${escapeHtml(item.id)}')" aria-label="Hapus">✕</button>
      </div>
    `).join("");
  }

  const halalFilter = document.getElementById("umkmHalalFilter").value;
  const list = state.umkm.filter(u => {
    if (state.onlyFavorites && !isFavorited(u.id, "umkm")) return false;
    if (halalFilter !== "ALL" && u.statusSertifikasiHalal !== halalFilter) return false;
    return true;
  });

  const umkmGrid = document.getElementById("umkmGrid");
  if (!list.length) {
    umkmGrid.innerHTML = `<div class="panel-card" style="grid-column:1/-1;text-align:center;color:var(--neutral-500);">Tidak ada mitra UMKM yang cocok dengan filter.</div>`;
    return;
  }

  umkmGrid.innerHTML = list.map(u => {
    const fav = isFavorited(u.id, "umkm");
    return `
      <article class="card">
        <div class="card-thumb" style="height:155px;">
          ${renderPhotoImgTag(getItemPhoto(u, "umkm"), u.nama)}
          <div class="thumb-badges">
            <span class="badge badge-gold">${escapeHtml(u.kategori)}</span>
            <button type="button" class="fav-btn ${fav ? "active" : ""}" onclick="toggleFavorite('${escapeHtml(u.id)}', 'umkm')" title="Favoritkan Mitra">♥</button>
          </div>
          ${canAccessDashboard() ? `<button type="button" class="upload-photo-btn" onclick="openPhotoManagerModal('umkm', '${escapeHtml(u.id)}')">📷 Upload Foto</button>` : ""}
        </div>
        <div class="card-body">
          <div class="card-title">${escapeHtml(u.nama)}</div>
          <div>${halalBadgeHtml(u.statusSertifikasiHalal)}</div>
          <div style="font-size:0.8rem;color:var(--neutral-500);">
            <strong>Keterangan Verifikasi:</strong> ${escapeHtml(u.sumberVerifikasi)}
          </div>
          <div style="font-size:0.82rem;background:var(--neutral-100);padding:8px;border-radius:8px;">
            <strong>Komoditas:</strong> ${(u.komoditas || []).map(escapeHtml).join(", ")}<br/>
            <strong>Harga Simulasi Mulai:</strong> ${formatRupiah(u.hargaMulai)}
          </div>
          <div class="card-footer">
            <a class="btn btn-outline btn-sm" href="${escapeHtml(u.mapsUrl)}" target="_blank" rel="noopener noreferrer">📍 Google Maps ↗</a>
            <button type="button" class="btn btn-primary btn-sm" onclick="openWhatsAppDemoModal('${escapeHtml(u.id)}')">💬 WhatsApp (Demo)</button>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

function openWhatsAppDemoModal(umkmId) {
  const u = state.umkm.find(x => x.id === umkmId);
  if (!u) return;
  const activeShop = state.belanja.filter(b => !b.sudahDibeli).map(b => `- ${b.namaBahan}`);
  const itemsText = activeShop.length
    ? activeShop.join("\n")
    : "- Mohon info ketersediaan komoditas: " + (u.komoditas || []).slice(0, 3).join(", ");
  const msg = `Halo ${u.nama} (Simulasi Demo DapurPintar),\nSaya ingin menanyakan ketersediaan bahan berikut:\n${itemsText}\nTerima kasih.`;
  const waHref = `https://wa.me/${encodeURIComponent(u.kontakDemo)}?text=${encodeURIComponent(msg)}`;

  document.getElementById("modalBody").innerHTML = `
    <span class="eyebrow">Mode Simulasi / Demo Kontak UMKM</span>
    <h2 style="color:var(--emerald-900);margin-bottom:8px;">Pratinjau Pesan WhatsApp</h2>
    <div style="background:var(--warn-100);border:1px solid #f5d08a;padding:12px;border-radius:10px;font-size:0.85rem;color:var(--warn-700);margin-bottom:14px;">
      <strong>Pemberitahuan Data Simulasi:</strong> Nomor tujuan <code>${escapeHtml(u.kontakDemo)}</code> dan kisaran harga mitra <strong>${escapeHtml(u.nama)}</strong> adalah data contoh nonpribadi untuk pengujian prototipe.
    </div>
    <div class="form-group">
      <label>Isi Pesan Otomatis (Dari Daftar Belanja Aktif Anda)</label>
      <textarea class="input" rows="6" id="waPreviewText" readonly>${escapeHtml(msg)}</textarea>
    </div>
    <div style="display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap;">
      <button type="button" class="btn btn-outline" onclick="navigator.clipboard?.writeText(document.getElementById('waPreviewText').value);showToast('Pesan disalin ke clipboard!')">📋 Salin Teks Pesan</button>
      <a class="btn btn-primary" href="${escapeHtml(waHref)}" target="_blank" rel="noopener noreferrer" onclick="closeModal()">Buka Tautan Simulasi wa.me ↗</a>
    </div>
  `;
  document.getElementById("appModal").classList.add("open");
}

/* =========================================================================
   DASHBOARD DEMO CRUD (4 ENTITIES)
   ========================================================================= */
let pendingCrudUploadedDataUrl = "";

function renderCrudPhotoControl(item, collectionType) {
  const currentPhoto = item && item.id ? getItemPhoto(item, collectionType) : "";
  const urlVal = currentPhoto.startsWith("data:") ? "" : currentPhoto;
  return `
    <div class="form-group" style="background:var(--neutral-100);padding:10px 12px;border-radius:10px;border:1px solid var(--neutral-200);">
      <label>📷 Foto Asli (Upload dari Perangkat atau Link Pinterest/Web)</label>
      <div style="display:flex;gap:10px;align-items:center;margin-top:6px;flex-wrap:wrap;">
        <img id="crudFormPhotoPreview" src="${escapeHtml(currentPhoto || DEFAULT_PHOTOS.hero)}" alt="Preview" referrerpolicy="no-referrer" onerror="handlePhotoError(this, 'Preview')" style="width:68px;height:52px;object-fit:cover;border-radius:8px;border:1px solid var(--neutral-300);background:#fff;" />
        <div style="flex:1;min-width:180px;">
          <input type="file" id="crudFormPhotoFile" accept="image/*" style="font-size:0.78rem;margin-bottom:6px;width:100%;" />
          <input type="url" class="input" name="imageUrl" id="crudFormPhotoUrl" placeholder="Atau tempel link foto Pinterest (https://i.pinimg.com/...)" value="${escapeHtml(urlVal)}" style="padding:6px 10px;font-size:0.82rem;" />
        </div>
      </div>
    </div>
  `;
}

function wireCrudPhotoInputs() {
  pendingCrudUploadedDataUrl = "";
  const fileEl = document.getElementById("crudFormPhotoFile");
  const urlEl = document.getElementById("crudFormPhotoUrl");
  const prevEl = document.getElementById("crudFormPhotoPreview");
  if (!fileEl || !urlEl || !prevEl) return;

  fileEl.addEventListener("change", async e => {
    if (e.target.files && e.target.files[0]) {
      try {
        const compressed = await compressImageFileToDataUrl(e.target.files[0]);
        pendingCrudUploadedDataUrl = compressed;
        prevEl.dataset.fallbackApplied = "0";
        prevEl.src = compressed;
        urlEl.value = "";
        showToast("Foto siap disimpan pada form CRUD!");
      } catch (err) {
        showToast(err.message || "Gagal memuat file gambar.");
      }
    }
  });

  urlEl.addEventListener("input", e => {
    const v = e.target.value.trim();
    if (v) {
      pendingCrudUploadedDataUrl = "";
      prevEl.dataset.fallbackApplied = "0";
      prevEl.src = v;
    }
  });
}

/* =========================================================================
   DUMMY MULTI-ROLE AUTHENTICATION (USER, OPERATOR, ADMIN) & RBAC GUARD
   ========================================================================= */
const AUTH_STORAGE_KEY = "dapurpintar_v1_auth";

function createDefaultDummyUsers() {
  return [
    {
      id: "usr-1",
      nama: "Siti Rahma",
      username: "user",
      email: "user@dapurpintar.id",
      password: "user123",
      role: "user",
      jabatan: "Pengguna Dapur Rumah Tangga",
      aktif: true
    },
    {
      id: "usr-2",
      nama: "Budi Santoso",
      username: "operator",
      email: "operator@dapurpintar.id",
      password: "operator123",
      role: "operator",
      jabatan: "Operator Konten & Verifikasi Pangan",
      aktif: true
    },
    {
      id: "usr-3",
      nama: "Ahmad Wijaya",
      username: "admin",
      email: "admin@dapurpintar.id",
      password: "admin123",
      role: "admin",
      jabatan: "Administrator Sistem Utama",
      aktif: true
    }
  ];
}

function loadAuthState() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.users) && parsed.users.length) {
        if (!Array.isArray(parsed.logs)) parsed.logs = [];
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Fallback auth state:", e);
  }
  const initial = {
    users: createDefaultDummyUsers(),
    currentUserId: null,
    logs: [
      {
        id: "log-init",
        waktu: new Date().toLocaleString("id-ID"),
        aktor: "Sistem",
        role: "admin",
        aksi: "Inisialisasi 3 akun dummy default (user, operator, admin)."
      }
    ]
  };
  saveAuthState(initial);
  return initial;
}

function saveAuthState(nextAuth = authState) {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextAuth));
  } catch (e) {
    console.warn("Gagal menyimpan sesi auth:", e);
  }
}

let authState = loadAuthState();
let selectedLoginRolePreset = "user";

function addAuthLog(aktor, role, aksi) {
  authState.logs.unshift({
    id: "log-" + Date.now() + "-" + Math.floor(Math.random() * 999),
    waktu: new Date().toLocaleString("id-ID"),
    aktor,
    role,
    aksi
  });
  if (authState.logs.length > 40) authState.logs = authState.logs.slice(0, 40);
  saveAuthState();
}

function getCurrentUser() {
  if (!authState.currentUserId) return null;
  const u = authState.users.find(x => x.id === authState.currentUserId);
  if (!u || u.aktif === false) return null;
  return u;
}

function getCurrentRole() {
  const u = getCurrentUser();
  return u ? u.role : "guest";
}

function canAccessDashboard() {
  const r = getCurrentRole();
  return r === "operator" || r === "admin";
}

function isAdmin() {
  return getCurrentRole() === "admin";
}

function roleLabelBadge(role) {
  if (role === "admin") return `<span class="role-pill role-admin">👑 Admin</span>`;
  if (role === "operator") return `<span class="role-pill role-operator">🛠 Operator</span>`;
  if (role === "user") return `<span class="role-pill role-user">👤 User</span>`;
  return `<span class="role-pill role-guest">Tamu</span>`;
}

function performDummyLogin(identifier, password) {
  const idClean = normalizeText(identifier);
  const pwClean = String(password || "");
  const found = authState.users.find(
    u => normalizeText(u.username) === idClean || normalizeText(u.email) === idClean
  );

  if (!found) {
    return { ok: false, message: "Username atau email tidak ditemukan. Gunakan akun dummy: user, operator, atau admin." };
  }
  if (found.aktif === false) {
    return { ok: false, message: "Akun ini sedang dinonaktifkan oleh Administrator." };
  }
  if (found.password !== pwClean) {
    return { ok: false, message: "Password salah! Cek password akun dummy pada kartu di sebelah kiri." };
  }

  authState.currentUserId = found.id;
  addAuthLog(found.nama, found.role, `Login berhasil sebagai ${found.role.toUpperCase()} (${found.username}).`);
  saveAuthState();
  return { ok: true, user: found };
}

function logoutDummyUser(redirectToLogin = false) {
  const curr = getCurrentUser();
  if (curr) {
    addAuthLog(curr.nama, curr.role, "Logout dari sesi aplikasi.");
  }
  authState.currentUserId = null;
  saveAuthState();
  if (redirectToLogin) {
    window.location.href = "login.html";
    return;
  }
  renderAll();
  showToast("Anda telah keluar (Logout) dari sesi akun.");
}

function quickSwitchDummyRole(role) {
  const target = authState.users.find(u => u.role === role && u.aktif !== false);
  if (!target) {
    showToast(`Akun dummy untuk peran "${role}" tidak ditemukan.`);
    return;
  }
  authState.currentUserId = target.id;
  addAuthLog(target.nama, target.role, `Beralih peran cepat (Simulasi) ke ${target.role.toUpperCase()}.`);
  saveAuthState();
  renderAll();
  showToast(`Aktif sebagai ${target.nama} (${target.role.toUpperCase()}).`);
}

function renderNavbarAuthWidget() {
  const widget = document.getElementById("navUserWidget");
  const curr = getCurrentUser();

  if (widget) {
    if (!curr) {
      widget.innerHTML = `
        <span class="role-pill role-guest" title="Belum Login">Mode Tamu</span>
        <a href="login.html" class="btn btn-primary btn-sm">🔐 Login</a>
      `;
    } else {
      const initials = curr.nama
        .split(" ")
        .map(w => w[0] || "")
        .join("")
        .slice(0, 2)
        .toUpperCase();
      widget.innerHTML = `
        <div class="user-chip" title="${escapeHtml(curr.jabatan || curr.email)}">
          <span class="user-avatar">${escapeHtml(initials)}</span>
          <span>${escapeHtml(curr.nama.split(" ")[0])}</span>
          ${roleLabelBadge(curr.role)}
        </div>
        <a href="login.html" class="btn btn-outline btn-sm" title="Ganti Peran / Akun">Ganti Akun</a>
        <button type="button" class="btn btn-danger btn-sm" onclick="logoutDummyUser()">Keluar</button>
      `;
    }
  }

  ["mainNavDashLink", "loginNavDashLink"].forEach(id => {
    const link = document.getElementById(id);
    if (!link) return;
    if (canAccessDashboard()) {
      link.classList.remove("locked");
      link.innerHTML = "📊 Halaman Dashboard";
      link.title = "Buka Halaman Dashboard (Akses Diizinkan)";
    } else {
      link.classList.add("locked");
      link.innerHTML = "🔒 Dashboard";
      link.title = "Halaman Dashboard khusus Operator & Admin";
    }
  });

  const heroAuthBtn = document.getElementById("heroAuthBtn");
  if (heroAuthBtn) {
    if (!curr) {
      heroAuthBtn.textContent = "🔐 Portal Login (User / Operator / Admin)";
      heroAuthBtn.href = "login.html";
    } else if (canAccessDashboard()) {
      heroAuthBtn.textContent = `📊 Buka Dashboard (${curr.role.toUpperCase()})`;
      heroAuthBtn.href = "dashboard.html";
    } else {
      heroAuthBtn.textContent = `👤 Sesi Aktif: ${curr.nama} (Ganti Peran)`;
      heroAuthBtn.href = "login.html";
    }
  }

  const homeStrip = document.getElementById("homeRoleStrip");
  if (homeStrip) {
    if (!curr) {
      homeStrip.innerHTML = `
        <div class="role-QuickSwitch-bar" style="margin-bottom:0;">
          <div>
            <strong>Status Akses Saat Ini: Mode Tamu (Belum Login)</strong> — Silakan masuk menggunakan akun dummy <strong>User</strong>, <strong>Operator</strong>, atau <strong>Admin</strong>. Halaman Dashboard dikunci khusus Operator &amp; Admin.
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <a href="login.html" class="btn btn-primary btn-sm">🔐 Buka Halaman Login Dummy</a>
          </div>
        </div>
      `;
    } else {
      const dashAction = canAccessDashboard()
        ? `<a href="dashboard.html" class="btn btn-gold btn-sm">📊 Masuk ke Halaman Dashboard →</a>`
        : `<a href="dashboard.html" class="btn btn-outline btn-sm" title="Klik untuk menguji proteksi halaman dashboard">🔒 Uji Buka Dashboard (Ditolak untuk User)</a>`;
      homeStrip.innerHTML = `
        <div class="role-QuickSwitch-bar" style="margin-bottom:0;">
          <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
            ${roleLabelBadge(curr.role)}
            <span>Login sebagai <strong>${escapeHtml(curr.nama)}</strong> (<code>${escapeHtml(curr.username)}</code>) — ${
              canAccessDashboard()
                ? "Anda memiliki hak akses penuh ke <strong>Halaman Dashboard</strong>."
                : "Peran <strong>User</strong> hanya dapat mengakses fitur dapur utama (Halaman Dashboard dibatasi untuk Operator &amp; Admin)."
            }</span>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            ${dashAction}
            <a href="login.html" class="btn btn-outline btn-sm">🔄 Ganti Peran</a>
          </div>
        </div>
      `;
    }
  }
}

/* =========================================================================
   QUICK ADD STOCK MODAL FOR REGULAR USERS ON INDEX.HTML
   ========================================================================= */
function openQuickAddStockModal() {
  const modal = document.getElementById("appModal");
  if (!modal) return;
  document.getElementById("modalBody").innerHTML = `
    <span class="eyebrow">Input Cepat Inventaris Dapur</span>
    <h2 style="color:var(--emerald-900);margin-bottom:6px;">+ Tambah Bahan ke Stok Dapur</h2>
    <p style="font-size:0.86rem;color:var(--neutral-500);margin-bottom:14px;">
      Tambahkan bahan makanan baru langsung ke salah satu dari 5 zona dapur Anda.
    </p>
    <form id="quickUserStockForm">
      <div class="form-group">
        <label>Nama Bahan Makanan</label>
        <input class="input" name="nama" required placeholder="Contoh: Kangkung Segar, Telur Ayam, Susu UHT" />
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Kategori Bahan</label>
          <select name="kategori">
            ${["Sayur & Buah","Protein Hewani","Protein Nabati & Telur","Susu & Olahan","Bumbu & Rempah","Bahan Pokok & Kering"].map(c => `<option value="${c}">${c}</option>`).join("")}
          </select>
        </div>
        <div class="form-group">
          <label>Zona Penyimpanan</label>
          <select name="zonaSimpan">
            ${ZONES.map(z => `<option value="${z}">${z}</option>`).join("")}
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Jumlah</label>
          <input type="number" step="any" min="0.1" class="input" name="jumlah" required value="1" />
        </div>
        <div class="form-group">
          <label>Satuan</label>
          <input class="input" name="satuan" required value="ikat" placeholder="ikat / gram / butir / bungkus" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Batas Simpan / Kedaluwarsa</label>
          <input type="date" class="input" name="tanggalKedaluwarsa" required value="${isoOffsetDays(3)}" />
        </div>
        <div class="form-group">
          <label>Estimasi Nilai (Rp Simulasi)</label>
          <input type="number" min="0" class="input" name="estimasiNilai" value="10000" />
        </div>
      </div>
      <div class="form-group">
        <label>Status Kehalalan Bahan</label>
        <select name="statusHalal">
          <option value="Bahan Segar Alami">Bahan Segar Alami</option>
          <option value="Sertifikasi Halal Resmi">Sertifikasi Halal Resmi</option>
          <option value="Belum Diverifikasi Resmi">Belum Diverifikasi Resmi</option>
        </select>
      </div>
      <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:14px;">
        <button type="button" class="btn btn-outline" onclick="closeModal()">Batal</button>
        <button type="submit" class="btn btn-primary">✓ Simpan ke Stok Dapur</button>
      </div>
    </form>
  `;
  modal.classList.add("open");

  document.getElementById("quickUserStockForm").addEventListener("submit", e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const d = Object.fromEntries(fd.entries());
    state.stok.unshift({
      id: "stk-" + Date.now(),
      nama: d.nama.trim(),
      imageUrl: guessDefaultPhotoByText(d.nama, "stok"),
      kategori: d.kategori,
      zonaSimpan: d.zonaSimpan,
      jumlah: Number(d.jumlah) || 1,
      satuan: d.satuan.trim() || "pcs",
      tanggalMasuk: isoOffsetDays(0),
      tanggalKedaluwarsa: d.tanggalKedaluwarsa || isoOffsetDays(3),
      tipeTanggal: "Estimasi Referensi",
      estimasiNilai: Number(d.estimasiNilai) || 0,
      statusHalal: d.statusHalal,
      sumberVerifikasi: "Input manual pengguna dapur",
      tipsSimpan: `Disimpan pada ${d.zonaSimpan}. Periksa kesegaran fisik sebelum diolah.`
    });
    saveState();
    closeModal();
    renderAll();
    showToast(`Bahan "${d.nama.trim()}" berhasil ditambahkan ke stok dapur!`);
  });
}

/* =========================================================================
   LOGIN PAGE CONTROLLER (login.html)
   ========================================================================= */
function selectRolePreset(role, autoFill = true) {
  selectedLoginRolePreset = role;
  document.querySelectorAll("[data-role-tab]").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-role-tab") === role);
  });
  document.querySelectorAll(".dummy-card[data-dummy-role]").forEach(card => {
    card.classList.toggle("selected", card.getAttribute("data-dummy-role") === role);
  });

  const hintEl = document.getElementById("selectedRoleHint");
  if (hintEl) {
    const descMap = {
      user: "Peran terpilih: <strong>User (Akses Beranda Utama — Tanpa Dashboard)</strong>",
      operator: "Peran terpilih: <strong>Operator (Akses Halaman Dashboard &amp; CRUD Katalog)</strong>",
      admin: "Peran terpilih: <strong>Admin (Akses Penuh Dashboard + Manajemen Akun)</strong>"
    };
    hintEl.innerHTML = descMap[role] || descMap.user;
  }
  if (autoFill) fillSelectedRoleCredentials(role);
}

function fillSelectedRoleCredentials(roleOverride) {
  const role = roleOverride || selectedLoginRolePreset || "user";
  const acc = authState.users.find(u => u.role === role && u.aktif !== false) || authState.users[0];
  if (!acc) return;
  const uInput = document.getElementById("loginUsername");
  const pInput = document.getElementById("loginPassword");
  if (uInput && pInput) {
    uInput.value = acc.username;
    pInput.value = acc.password;
  }
}

function instantDummyLogin(role) {
  const acc = authState.users.find(u => u.role === role && u.aktif !== false);
  if (!acc) {
    showLoginAlert("error", `Akun dummy dengan peran ${role} tidak ditemukan atau sedang nonaktif.`);
    return;
  }
  const res = performDummyLogin(acc.username, acc.password);
  if (res.ok) {
    redirectAfterLogin(res.user);
  } else {
    showLoginAlert("error", res.message);
  }
}

function showLoginAlert(type, msg) {
  const box = document.getElementById("loginAlertBox");
  if (!box) return;
  box.className = `auth-alert show ${type}`;
  box.textContent = msg;
}

function redirectAfterLogin(user) {
  const params = new URLSearchParams(window.location.search);
  const nextUrl = params.get("next");
  const target = (user.role === "operator" || user.role === "admin")
    ? (nextUrl || "dashboard.html")
    : "index.html";
  showLoginAlert("success", `Login berhasil sebagai ${user.nama} (${user.role.toUpperCase()})! Mengalihkan halaman...`);
  setTimeout(() => {
    window.location.href = target;
  }, 450);
}

function renderLoginPage() {
  const listEl = document.getElementById("dummyAccountsList");
  if (listEl) {
    const roleOrder = { user: 1, operator: 2, admin: 3 };
    const sortedUsers = [...authState.users].sort((a, b) => (roleOrder[a.role] || 9) - (roleOrder[b.role] || 9));

    listEl.innerHTML = sortedUsers.map(u => {
      const hasDash = u.role === "operator" || u.role === "admin";
      const accessBadge = hasDash
        ? `<span class="badge badge-fresh">✓ Bisa Akses Dashboard</span>`
        : `<span class="badge badge-danger">✗ Ditolak di Dashboard</span>`;

      return `
        <div class="dummy-card ${selectedLoginRolePreset === u.role ? "selected" : ""}" data-dummy-role="${escapeHtml(u.role)}">
          <div class="dummy-card-head">
            <div>
              <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                ${roleLabelBadge(u.role)}
                <strong style="font-size:1rem;color:#fff;">${escapeHtml(u.nama)}</strong>
              </div>
              <div style="font-size:0.79rem;color:rgba(255,255,255,0.78);margin-top:3px;">${escapeHtml(u.jabatan || "")}</div>
            </div>
            ${accessBadge}
          </div>

          <div class="dummy-cred-box">
            <code>Username: ${escapeHtml(u.username)}</code>
            <code>Password: ${escapeHtml(u.password)}</code>
          </div>

          <div class="dummy-card-actions">
            <span style="font-size:0.76rem;color:rgba(255,255,255,0.75);">${u.aktif === false ? "⚠ Status: Nonaktif" : "Status: Aktif Siap Uji"}</span>
            <div style="display:flex;gap:8px;">
              <button type="button" class="btn btn-outline btn-sm" style="background:rgba(255,255,255,0.12);color:#fff;border-color:rgba(255,255,255,0.3);" onclick="selectRolePreset('${escapeHtml(u.role)}', true)">Isi Form</button>
              <button type="button" class="btn btn-gold btn-sm" onclick="instantDummyLogin('${escapeHtml(u.role)}')">⚡ Login Cepat</button>
            </div>
          </div>
        </div>
      `;
    }).join("");
  }

  const sessBox = document.getElementById("activeSessionBox");
  const curr = getCurrentUser();
  if (sessBox) {
    if (!curr) {
      sessBox.innerHTML = "";
    } else {
      sessBox.innerHTML = `
        <div class="active-session-banner">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;">
            <div>
              <strong>Sesi Aktif Saat Ini:</strong> ${escapeHtml(curr.nama)} ${roleLabelBadge(curr.role)}
            </div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              <a href="index.html" class="btn btn-outline btn-sm">Beranda</a>
              ${canAccessDashboard() ? `<a href="dashboard.html" class="btn btn-primary btn-sm">Buka Dashboard</a>` : ""}
              <button type="button" class="btn btn-danger btn-sm" onclick="logoutDummyUser()">Logout</button>
            </div>
          </div>
        </div>
      `;
    }
  }
}

/* =========================================================================
   PROTECTED DASHBOARD CONTROLLER (dashboard.html — ONLY OPERATOR & ADMIN)
   ========================================================================= */
function renderDashboardPage() {
  const deniedEl = document.getElementById("dashboardAccessDenied");
  const protectedEl = document.getElementById("dashboardProtectedContent");
  const navLinks = document.getElementById("dashProtectedNavLinks");
  if (!deniedEl || !protectedEl) return;

  const curr = getCurrentUser();
  const role = getCurrentRole();

  if (!canAccessDashboard()) {
    protectedEl.style.display = "none";
    if (navLinks) {
      navLinks.innerHTML = `<a href="index.html">← Kembali ke Halaman Utama</a>`;
    }
    deniedEl.style.display = "block";

    const statusReason = curr
      ? `Anda saat ini login sebagai <strong>${escapeHtml(curr.nama)}</strong> dengan peran ${roleLabelBadge(curr.role)}. Akun <strong>User</strong> hanya diizinkan mengakses Halaman Utama Aplikasi dan <strong>tidak memiliki izin</strong> membuka Halaman Dashboard.`
      : `Anda belum login (<strong>Mode Tamu</strong>). Halaman Dashboard dilindungi dan hanya dapat diakses oleh pengguna dengan peran <strong>Operator</strong> atau <strong>Admin</strong>.`;

    deniedEl.innerHTML = `
      <div class="access-denied-wrap">
        <div class="access-denied-card">
          <div class="access-denied-icon" aria-hidden="true">🔒</div>
          <span class="badge badge-danger" style="margin-bottom:10px;">HTTP 403 • Akses Ditolak (Restricted Area)</span>
          <h1 style="font-family:var(--font-serif);color:var(--emerald-900);font-size:1.75rem;margin-bottom:10px;">
            Halaman Dashboard Khusus Operator &amp; Admin
          </h1>
          <p style="color:var(--neutral-700);font-size:0.94rem;margin-bottom:20px;line-height:1.6;">
            ${statusReason}
          </p>

          <div style="display:flex;justify-content:center;gap:10px;flex-wrap:wrap;margin-bottom:20px;">
            <a href="index.html" class="btn btn-outline">← Kembali ke Beranda Pengguna</a>
            <a href="login.html?next=dashboard.html" class="btn btn-primary">🔐 Login sebagai Operator / Admin</a>
          </div>

          <div style="background:var(--neutral-100);border:1px dashed var(--neutral-300);padding:12px 14px;border-radius:12px;font-size:0.82rem;color:var(--neutral-700);">
            <div style="margin-bottom:8px;"><strong>Pintasan Uji Demo Langsung:</strong> Masuk cepat untuk melihat isi Halaman Dashboard:</div>
            <div style="display:flex;justify-content:center;gap:8px;flex-wrap:wrap;">
              <button type="button" class="btn btn-outline btn-sm" onclick="quickSwitchDummyRole('operator')">🛠 Masuk Cepat Operator</button>
              <button type="button" class="btn btn-gold btn-sm" onclick="quickSwitchDummyRole('admin')">👑 Masuk Cepat Admin</button>
            </div>
          </div>
        </div>
      </div>
    `;
    return;
  }

  // Authorized: Operator or Admin
  deniedEl.style.display = "none";
  protectedEl.style.display = "block";
  if (navLinks) {
    navLinks.innerHTML = `
      <a href="index.html">🏠 Lihat Halaman Pengguna</a>
      <a href="#kpiSection">Ringkasan KPI</a>
      <a href="#verifikasiSection">Verifikasi Halal <span class="pill-count" id="dashUnverifiedBadge">0</span></a>
      <a href="#crudSection">Kelola Data CRUD</a>
      ${isAdmin() ? `<a href="#adminLogSection">Log Sistem</a>` : ""}
    `;
  }

  const badgeHdr = document.getElementById("dashRoleBadgeHeader");
  const welcomeTitle = document.getElementById("dashWelcomeTitle");
  const roleDesc = document.getElementById("dashRoleDesc");
  const resetBtn = document.getElementById("btnResetAllDemo");
  const adminLogSec = document.getElementById("adminLogSection");
  const usersTabBtn = document.getElementById("crudTabUsersBtn");

  if (badgeHdr) {
    badgeHdr.textContent = role === "admin"
      ? "👑 Mode Administrator Sistem (Full Access)"
      : "🛠 Mode Operator Konten & Verifikasi Pangan";
  }
  if (welcomeTitle && curr) {
    welcomeTitle.textContent = `Selamat bertugas, ${curr.nama}!`;
  }
  if (roleDesc) {
    roleDesc.textContent = role === "admin"
      ? "Anda memiliki hak akses penuh untuk mengelola Stok, Resep, UMKM, Paket Meal Plan, Manajemen Akun Dummy (User/Operator/Admin), Log Login, serta Reset Sistem."
      : "Anda memiliki hak akses operasional untuk mengelola Stok Bahan, Katalog Resep, Verifikasi Halal UMKM, dan Paket Meal Plan. (Manajemen Akun & Reset Sistem dikhususkan bagi Admin).";
  }
  if (resetBtn) {
    resetBtn.style.display = isAdmin() ? "inline-flex" : "none";
  }
  if (adminLogSec) {
    adminLogSec.style.display = isAdmin() ? "block" : "none";
  }
  if (usersTabBtn) {
    usersTabBtn.classList.toggle("locked-tab", !isAdmin());
    usersTabBtn.innerHTML = `${isAdmin() ? "👑" : "🔒"} 5. Akun Pengguna (<span id="crudCountUsers">${authState.users.length}</span>)`;
  }

  if (activeCrudTab === "users" && !isAdmin()) {
    activeCrudTab = "stok";
  }

  renderDashboardKpis();
  renderVerificationQueue();
  renderCrudSection();
  if (isAdmin()) renderAdminLogs();
}

function renderDashboardKpis() {
  const grid = document.getElementById("dashKpiGrid");
  if (!grid) return;

  const activeStocks = state.stok.filter(s => Number(s.jumlah) > 0);
  const criticalStocks = activeStocks.filter(s => {
    const d = daysUntil(s.tanggalKedaluwarsa);
    return d >= 0 && d <= 3;
  });
  const unverifiedCount =
    state.stok.filter(s => String(s.statusHalal).includes("Belum Diverifikasi")).length +
    state.umkm.filter(u => String(u.statusSertifikasiHalal).includes("Belum Diverifikasi")).length;

  const unvBadge = document.getElementById("dashUnverifiedBadge");
  if (unvBadge) unvBadge.textContent = unverifiedCount;

  grid.innerHTML = `
    <div class="dash-kpi-card">
      <div class="kpi-label">Inventaris Bahan Dapur</div>
      <div class="kpi-num">${activeStocks.length}</div>
      <div class="kpi-sub"><strong style="color:var(--warn-700);">${criticalStocks.length} bahan kritis</strong> perlu segera diolah</div>
    </div>
    <div class="dash-kpi-card turquoise">
      <div class="kpi-label">Katalog Resep &amp; Paket</div>
      <div class="kpi-num">${state.resep.length} <span style="font-size:0.95rem;font-weight:600;color:var(--neutral-500);">Resep</span></div>
      <div class="kpi-sub">Tersedia dalam <strong>${state.paket.length} paket</strong> meal plan</div>
    </div>
    <div class="dash-kpi-card ${unverifiedCount > 0 ? "danger" : "gold"}">
      <div class="kpi-label">Mitra UMKM &amp; Halal</div>
      <div class="kpi-num">${state.umkm.length} <span style="font-size:0.95rem;font-weight:600;color:var(--neutral-500);">Mitra</span></div>
      <div class="kpi-sub"><strong>${unverifiedCount} item</strong> menunggu verifikasi halal</div>
    </div>
    <div class="dash-kpi-card gold">
      <div class="kpi-label">Akun Pengguna Dummy</div>
      <div class="kpi-num">${authState.users.length} <span style="font-size:0.95rem;font-weight:600;color:var(--neutral-500);">Akun</span></div>
      <div class="kpi-sub">Peran aktif: <strong>${getCurrentRole().toUpperCase()}</strong></div>
    </div>
  `;
}

function renderVerificationQueue() {
  const wrap = document.getElementById("verificationQueueContainer");
  if (!wrap) return;

  const unvStok = state.stok
    .filter(s => String(s.statusHalal).includes("Belum Diverifikasi"))
    .map(s => ({ tipe: "stok", id: s.id, nama: s.nama, sub: `Stok Zona: ${s.zonaSimpan}`, ket: s.sumberVerifikasi || s.tipsSimpan }));

  const unvUmkm = state.umkm
    .filter(u => String(u.statusSertifikasiHalal).includes("Belum Diverifikasi"))
    .map(u => ({ tipe: "umkm", id: u.id, nama: u.nama, sub: `Mitra UMKM • ${u.kategori}`, ket: u.sumberVerifikasi }));

  const combined = [...unvStok, ...unvUmkm];

  if (!combined.length) {
    wrap.innerHTML = `
      <div class="panel-card" style="text-align:center;color:var(--emerald-800);background:var(--emerald-50);">
        ✓ Seluruh data Stok Bahan dan Mitra UMKM telah memiliki klasifikasi status kehalalan yang jelas.
      </div>
    `;
    return;
  }

  wrap.innerHTML = `
    <div class="verify-queue-grid">
      ${combined.map(item => `
        <div class="verify-card">
          <div>
            <div style="display:flex;justify-content:space-between;gap:8px;align-items:flex-start;">
              <span class="badge badge-unverified">⚠ Belum Diverifikasi</span>
              <small style="font-weight:700;color:var(--turquoise-600);text-transform:uppercase;">${escapeHtml(item.tipe)}</small>
            </div>
            <div style="font-weight:800;color:var(--emerald-900);font-size:0.98rem;margin-top:6px;">${escapeHtml(item.nama)}</div>
            <div style="font-size:0.79rem;color:var(--neutral-500);">${escapeHtml(item.sub)}</div>
            <div style="font-size:0.8rem;color:var(--neutral-700);margin-top:5px;">Catatan: ${escapeHtml(item.ket || "-")}</div>
          </div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;padding-top:8px;border-top:1px dashed var(--neutral-300);">
            <button type="button" class="btn btn-outline btn-sm" onclick="verifyItemHalalStatus('${escapeHtml(item.tipe)}', '${escapeHtml(item.id)}', 'natural')">🌿 Segar Alami</button>
            <button type="button" class="btn btn-primary btn-sm" onclick="verifyItemHalalStatus('${escapeHtml(item.tipe)}', '${escapeHtml(item.id)}', 'cert')">✓ Halal Resmi (Simulasi)</button>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

function verifyItemHalalStatus(tipe, id, mode) {
  if (!canAccessDashboard()) return;
  const actor = getCurrentUser();
  if (tipe === "stok") {
    const found = state.stok.find(s => s.id === id);
    if (!found) return;
    found.statusHalal = mode === "cert" ? "Sertifikasi Halal Resmi" : "Bahan Segar Alami";
    found.sumberVerifikasi = `Diverifikasi oleh ${actor ? actor.nama : "Operator"} (${new Date().toLocaleDateString("id-ID")})`;
    addAuthLog(actor.nama, actor.role, `Memverifikasi status halal bahan "${found.nama}" → ${found.statusHalal}.`);
  } else {
    const found = state.umkm.find(u => u.id === id);
    if (!found) return;
    found.statusSertifikasiHalal = mode === "cert"
      ? "Tersertifikasi Halal Resmi (Simulasi)"
      : "Bahan Segar Alami (Ramah Muslim)";
    found.sumberVerifikasi = `Diverifikasi oleh ${actor ? actor.nama : "Operator"} (${new Date().toLocaleDateString("id-ID")})`;
    addAuthLog(actor.nama, actor.role, `Memverifikasi status halal UMKM "${found.nama}" → ${found.statusSertifikasiHalal}.`);
  }
  saveState();
  renderAll();
  showToast("Status verifikasi halal berhasil diperbarui!");
}

function renderAdminLogs() {
  const box = document.getElementById("adminLogContainer");
  if (!box) return;
  if (!authState.logs.length) {
    box.innerHTML = `<div style="padding:16px;text-align:center;color:var(--neutral-500);">Belum ada catatan aktivitas.</div>`;
    return;
  }
  box.innerHTML = `
    <table>
      <thead><tr><th>Waktu</th><th>Pengguna</th><th>Peran</th><th>Aktivitas</th></tr></thead>
      <tbody>
        ${authState.logs.map(l => `
          <tr>
            <td style="white-space:nowrap;font-size:0.78rem;color:var(--neutral-500);">${escapeHtml(l.waktu)}</td>
            <td><strong>${escapeHtml(l.aktor)}</strong></td>
            <td>${roleLabelBadge(l.role)}</td>
            <td>${escapeHtml(l.aksi)}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function clearAuthLogs() {
  if (!isAdmin()) return;
  authState.logs = [];
  const curr = getCurrentUser();
  addAuthLog(curr ? curr.nama : "Admin", "admin", "Membersihkan riwayat log sistem.");
  renderAdminLogs();
  showToast("Log aktivitas berhasil dibersihkan.");
}

/* =========================================================================
   DASHBOARD CRUD (4 OPERATIONAL ENTITIES + ADMIN USER ACCOUNTS)
   ========================================================================= */
function switchCrudTab(tab) {
  if (!canAccessDashboard()) {
    showToast("Akses ditolak: Halaman Dashboard hanya untuk Operator & Admin.");
    return;
  }
  if (tab === "users" && !isAdmin()) {
    showToast("Akses dibatasi: Tab Manajemen Akun Pengguna hanya dapat diakses oleh Admin!");
    return;
  }
  activeCrudTab = tab;
  editingCrudId = null;
  document.querySelectorAll(".crud-tab").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-tab") === tab);
  });
  renderCrudSection();
}

function renderCrudSection() {
  const form = document.getElementById("crudForm");
  const titleEl = document.getElementById("crudFormTitle");
  if (!form || !titleEl) return;

  const setCnt = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };
  setCnt("crudCountStok", state.stok.length);
  setCnt("crudCountResep", state.resep.length);
  setCnt("crudCountUmkm", state.umkm.length);
  setCnt("crudCountPaket", state.paket.length);
  setCnt("crudCountUsers", authState.users.length);

  document.querySelectorAll(".crud-tab").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-tab") === activeCrudTab);
  });

  const isEdit = Boolean(editingCrudId);

  if (activeCrudTab === "stok") {
    const item = state.stok.find(x => x.id === editingCrudId) || {};
    titleEl.textContent = isEdit ? `Edit Stok Bahan: ${item.nama}` : "Tambah Stok Bahan Baru";
    form.innerHTML = `
      <div class="form-group"><label>Nama Bahan</label><input class="input" name="nama" required value="${escapeHtml(item.nama || "")}"/></div>
      <div class="form-row">
        <div class="form-group"><label>Kategori</label>
          <select name="kategori">
            ${["Sayur & Buah","Protein Hewani","Protein Nabati & Telur","Susu & Olahan","Bumbu & Rempah","Bahan Pokok & Kering"].map(c => `<option value="${c}" ${item.kategori===c?"selected":""}>${c}</option>`).join("")}
          </select>
        </div>
        <div class="form-group"><label>Zona Penyimpanan</label>
          <select name="zonaSimpan">
            ${ZONES.map(z => `<option value="${z}" ${item.zonaSimpan===z?"selected":""}>${z}</option>`).join("")}
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Jumlah</label><input type="number" step="any" min="0" class="input" name="jumlah" required value="${escapeHtml(item.jumlah ?? 1)}"/></div>
        <div class="form-group"><label>Satuan</label><input class="input" name="satuan" required value="${escapeHtml(item.satuan || "ikat")}"/></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Tanggal Kedaluwarsa</label><input type="date" class="input" name="tanggalKedaluwarsa" required value="${escapeHtml(item.tanggalKedaluwarsa || isoOffsetDays(3))}"/></div>
        <div class="form-group"><label>Tipe Tanggal</label>
          <select name="tipeTanggal">
            <option value="Estimasi Referensi" ${item.tipeTanggal==="Estimasi Referensi"?"selected":""}>Estimasi Referensi</option>
            <option value="Kemasan Resmi" ${item.tipeTanggal==="Kemasan Resmi"?"selected":""}>Kemasan Resmi</option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Estimasi Nilai (Rp Simulasi)</label><input type="number" min="0" class="input" name="estimasiNilai" value="${escapeHtml(item.estimasiNilai ?? 10000)}"/></div>
        <div class="form-group"><label>Status Halal Pangan</label>
          <select name="statusHalal">
            ${["Bahan Segar Alami","Sertifikasi Halal Resmi","Belum Diverifikasi Resmi"].map(h => `<option value="${h}" ${item.statusHalal===h?"selected":""}>${h}</option>`).join("")}
          </select>
        </div>
      </div>
      <div class="form-group"><label>Tips Simpan / Sumber Verifikasi</label><input class="input" name="tipsSimpan" value="${escapeHtml(item.tipsSimpan || "Simpan di wadah bersih tertutup.")}"/></div>
      ${renderCrudPhotoControl(item, "stok")}
      <div style="display:flex;gap:8px;">
        <button type="submit" class="btn btn-primary">${isEdit ? "Simpan Perubahan" : "+ Simpan Bahan"}</button>
        ${isEdit ? `<button type="button" class="btn btn-outline" onclick="editingCrudId=null;renderCrudSection()">Batal</button>` : ""}
      </div>
    `;
  } else if (activeCrudTab === "resep") {
    const item = state.resep.find(x => x.id === editingCrudId) || {};
    titleEl.textContent = isEdit ? `Edit Resep: ${item.nama}` : "Tambah Resep Anti-Mubazir Baru";
    form.innerHTML = `
      <div class="form-group"><label>Nama Masakan</label><input class="input" name="nama" required value="${escapeHtml(item.nama || "")}"/></div>
      <div class="form-row">
        <div class="form-group"><label>Kategori Resep</label>
          <select name="kategori">
            ${["Tumisan Cepat","Sup & Berkuah","Lauk Nusantara","Sarapan & Camilan","Olahan Penyelamat Stok","Menu Hemat Kos"].map(c => `<option value="${c}" ${item.kategori===c?"selected":""}>${c}</option>`).join("")}
          </select>
        </div>
        <div class="form-group"><label>Zona Asal Bahan Dominan</label>
          <select name="zonaUtama">
            ${ZONES.map(z => `<option value="${z}" ${item.zonaUtama===z?"selected":""}>${z}</option>`).join("")}
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Waktu Masak (Menit)</label><input type="number" min="1" class="input" name="waktuMenit" required value="${escapeHtml(item.waktuMenit ?? 15)}"/></div>
        <div class="form-group"><label>Estimasi Biaya (Rp Simulasi)</label><input type="number" min="0" class="input" name="estimasiBiaya" required value="${escapeHtml(item.estimasiBiaya ?? 18000)}"/></div>
      </div>
      <div class="form-group"><label>Bahan Utama (Pisahkan dengan koma)</label><input class="input" name="bahanUtama" required placeholder="Bayam, Telur, Bawang" value="${escapeHtml((item.bahanUtama || []).join(", "))}"/></div>
      <div class="form-group"><label>Deskripsi Singkat</label><textarea class="input" rows="2" name="deskripsi" required>${escapeHtml(item.deskripsi || "")}</textarea></div>
      <div class="form-group"><label>Langkah Masak (Pisahkan tiap langkah dengan baris baru)</label><textarea class="input" rows="3" name="langkahMasak" required>${escapeHtml((item.langkahMasak || []).join("\n"))}</textarea></div>
      <div class="form-group"><label>Catatan Keamanan &amp; Halal Bahan</label><input class="input" name="panduanHalalPangan" value="${escapeHtml(item.panduanHalalPangan || "Gunakan bahan segar layak konsumsi dan bumbu berlabel halal.")}"/></div>
      ${renderCrudPhotoControl(item, "resep")}
      <div style="display:flex;gap:8px;">
        <button type="submit" class="btn btn-primary">${isEdit ? "Simpan Perubahan" : "+ Simpan Resep"}</button>
        ${isEdit ? `<button type="button" class="btn btn-outline" onclick="editingCrudId=null;renderCrudSection()">Batal</button>` : ""}
      </div>
    `;
  } else if (activeCrudTab === "umkm") {
    const item = state.umkm.find(x => x.id === editingCrudId) || {};
    titleEl.textContent = isEdit ? `Edit Mitra UMKM: ${item.nama}` : "Tambah Mitra UMKM Pangan (Simulasi)";
    form.innerHTML = `
      <div class="form-group"><label>Nama Usaha / Mitra</label><input class="input" name="nama" required value="${escapeHtml(item.nama || "")}"/></div>
      <div class="form-row">
        <div class="form-group"><label>Kategori Produk</label>
          <select name="kategori">
            ${["Sayur & Panen Segar","Protein & Olahan Kedelai","Bumbu & Rempah Giling","Sembako & Paket Masak"].map(c => `<option value="${c}" ${item.kategori===c?"selected":""}>${c}</option>`).join("")}
          </select>
        </div>
        <div class="form-group"><label>Harga Mulai (Rp Simulasi)</label><input type="number" min="0" class="input" name="hargaMulai" required value="${escapeHtml(item.hargaMulai ?? 10000)}"/></div>
      </div>
      <div class="form-group"><label>Status Verifikasi Halal (Dilarang Klaim Tanpa Dasar)</label>
        <select name="statusSertifikasiHalal">
          ${["Belum Diverifikasi Resmi","Bahan Segar Alami (Ramah Muslim)","Tersertifikasi Halal Resmi (Simulasi)"].map(s => `<option value="${s}" ${item.statusSertifikasiHalal===s?"selected":""}>${s}</option>`).join("")}
        </select>
      </div>
      <div class="form-group"><label>Keterangan Sumber Verifikasi</label><input class="input" name="sumberVerifikasi" required value="${escapeHtml(item.sumberVerifikasi || "Belum diverifikasi sertifikat resmi")}"/></div>
      <div class="form-group"><label>Komoditas Dijual (Pisahkan dengan koma)</label><input class="input" name="komoditas" required value="${escapeHtml((item.komoditas || []).join(", "))}"/></div>
      <div class="form-group"><label>Nomor WhatsApp Simulasi Nonpribadi</label><input class="input" name="kontakDemo" required value="${escapeHtml(item.kontakDemo || "6281200000199")}"/></div>
      ${renderCrudPhotoControl(item, "umkm")}
      <div style="display:flex;gap:8px;">
        <button type="submit" class="btn btn-primary">${isEdit ? "Simpan Perubahan" : "+ Simpan Mitra UMKM"}</button>
        ${isEdit ? `<button type="button" class="btn btn-outline" onclick="editingCrudId=null;renderCrudSection()">Batal</button>` : ""}
      </div>
    `;
  } else if (activeCrudTab === "paket") {
    const item = state.paket.find(x => x.id === editingCrudId) || {};
    titleEl.textContent = isEdit ? `Edit Paket: ${item.nama}` : "Tambah Paket Meal Plan Baru";
    form.innerHTML = `
      <div class="form-group"><label>Nama Paket Meal Plan</label><input class="input" name="nama" required value="${escapeHtml(item.nama || "")}"/></div>
      <div class="form-row">
        <div class="form-group"><label>Profil Minat</label>
          <select name="profilMinat">
            ${["Penyelamat Isi Kulkas","Hemat Anak Kos","Keluarga Seimbang","Masak Kilat <20 Menit"].map(p => `<option value="${p}" ${item.profilMinat===p?"selected":""}>${p}</option>`).join("")}
          </select>
        </div>
        <div class="form-group"><label>Durasi Hari (1–5)</label><input type="number" min="1" max="5" class="input" name="durasiHari" required value="${escapeHtml(item.durasiHari ?? 3)}"/></div>
      </div>
      <div class="form-group"><label>Estimasi Biaya Paket (Rp Simulasi)</label><input type="number" min="0" class="input" name="estimasiBiaya" required value="${escapeHtml(item.estimasiBiaya ?? 75000)}"/></div>
      <div class="form-group"><label>ID Resep Terkait (Pisahkan koma, mis: rsp-1, rsp-2)</label><input class="input" name="daftarResep" required value="${escapeHtml((item.daftarResep || ["rsp-1","rsp-2"]).join(", "))}"/></div>
      <div class="form-group"><label>Deskripsi Paket</label><textarea class="input" rows="2" name="deskripsi" required>${escapeHtml(item.deskripsi || "")}</textarea></div>
      ${renderCrudPhotoControl(item, "paket")}
      <div style="display:flex;gap:8px;">
        <button type="submit" class="btn btn-primary">${isEdit ? "Simpan Perubahan" : "+ Simpan Paket"}</button>
        ${isEdit ? `<button type="button" class="btn btn-outline" onclick="editingCrudId=null;renderCrudSection()">Batal</button>` : ""}
      </div>
    `;
  } else if (activeCrudTab === "users") {
    const item = authState.users.find(x => x.id === editingCrudId) || {};
    titleEl.textContent = isEdit ? `Edit Akun Dummy: ${item.nama}` : "Tambah Akun Dummy Baru (Khusus Admin)";
    form.innerHTML = `
      <div class="form-group"><label>Nama Lengkap</label><input class="input" name="nama" required value="${escapeHtml(item.nama || "")}" placeholder="Contoh: Rina Putri"/></div>
      <div class="form-row">
        <div class="form-group"><label>Username Login</label><input class="input" name="username" required value="${escapeHtml(item.username || "")}" placeholder="Contoh: rina.op"/></div>
        <div class="form-group"><label>Email</label><input type="email" class="input" name="email" required value="${escapeHtml(item.email || "")}" placeholder="rina@dapurpintar.id"/></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Peran (Role Hak Akses)</label>
          <select name="role">
            <option value="user" ${item.role==="user"?"selected":""}>User (Hanya Halaman Utama)</option>
            <option value="operator" ${item.role==="operator"?"selected":""}>Operator (Bisa Akses Dashboard)</option>
            <option value="admin" ${item.role==="admin"?"selected":""}>Admin (Akses Penuh Sistem)</option>
          </select>
        </div>
        <div class="form-group"><label>Password Dummy</label><input type="text" class="input" name="password" required value="${escapeHtml(item.password || "123456")}"/></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Jabatan / Keterangan</label><input class="input" name="jabatan" value="${escapeHtml(item.jabatan || "Pengguna Terdaftar")}"/></div>
        <div class="form-group"><label>Status Akun</label>
          <select name="aktif">
            <option value="true" ${item.aktif !== false ? "selected" : ""}>Aktif</option>
            <option value="false" ${item.aktif === false ? "selected" : ""}>Nonaktif</option>
          </select>
        </div>
      </div>
      <div style="display:flex;gap:8px;">
        <button type="submit" class="btn btn-primary">${isEdit ? "Simpan Akun" : "+ Tambah Akun Dummy"}</button>
        ${isEdit ? `<button type="button" class="btn btn-outline" onclick="editingCrudId=null;renderCrudSection()">Batal</button>` : ""}
      </div>
    `;
  }

  wireCrudPhotoInputs();
  renderCrudTable();
}

function renderCrudTable() {
  const searchEl = document.getElementById("crudTableSearch");
  const wrap = document.getElementById("crudTableContainer");
  if (!wrap) return;
  const q = normalizeText(searchEl ? searchEl.value : "");

  if (activeCrudTab === "users") {
    const rows = authState.users.filter(u => normalizeText(JSON.stringify(u)).includes(q));
    if (!rows.length) {
      wrap.innerHTML = `<div style="padding:18px;text-align:center;color:var(--neutral-500);">Tidak ada akun pengguna yang cocok.</div>`;
      return;
    }
    const curr = getCurrentUser();
    const bodyHtml = rows.map(u => `
      <tr>
        <td>
          <strong>${escapeHtml(u.nama)}</strong>
          <div style="font-size:0.76rem;color:var(--neutral-500);"><code>${escapeHtml(u.username)}</code> • ${escapeHtml(u.email)}</div>
        </td>
        <td>
          ${roleLabelBadge(u.role)}
          <span class="badge ${u.aktif === false ? "badge-danger" : "badge-fresh"}" style="margin-left:4px;">${u.aktif === false ? "Nonaktif" : "Aktif"}</span>
          <div style="font-size:0.76rem;color:var(--neutral-500);margin-top:3px;">Pass: <code>${escapeHtml(u.password)}</code> • ${escapeHtml(u.jabatan || "-")}</div>
        </td>
        <td style="white-space:nowrap;">
          <button type="button" class="btn btn-outline btn-sm" onclick="startCrudEdit('${escapeHtml(u.id)}')">Edit</button>
          ${curr && curr.id === u.id
            ? `<span style="font-size:0.75rem;color:var(--neutral-500);margin-left:6px;">(Sedang Aktif)</span>`
            : `<button type="button" class="btn btn-danger btn-sm" onclick="deleteCrudItem('${escapeHtml(u.id)}')">Hapus</button>`
          }
        </td>
      </tr>
    `).join("");

    wrap.innerHTML = `
      <table>
        <thead><tr><th>Nama &amp; Kredensial</th><th>Peran &amp; Status</th><th>Aksi</th></tr></thead>
        <tbody>${bodyHtml}</tbody>
      </table>
    `;
    return;
  }

  const collection = state[activeCrudTab] || [];
  const rows = collection.filter(item => normalizeText(JSON.stringify(item)).includes(q));
  if (!rows.length) {
    wrap.innerHTML = `<div style="padding:18px;text-align:center;color:var(--neutral-500);">Tidak ada data pada tabel ini.</div>`;
    return;
  }

  const bodyHtml = rows.map(item => {
    let infoCol = "";
    if (activeCrudTab === "stok") infoCol = `${escapeHtml(item.zonaSimpan)} • ${escapeHtml(item.jumlah)} ${escapeHtml(item.satuan)} • Exp: ${escapeHtml(item.tanggalKedaluwarsa)}`;
    if (activeCrudTab === "resep") infoCol = `${escapeHtml(item.kategori)} • ${formatRupiah(item.estimasiBiaya)} • ${(item.bahanUtama || []).length} bahan`;
    if (activeCrudTab === "umkm") infoCol = `${escapeHtml(item.statusSertifikasiHalal)} • Mulai ${formatRupiah(item.hargaMulai)}`;
    if (activeCrudTab === "paket") infoCol = `${escapeHtml(item.profilMinat)} • ${escapeHtml(item.durasiHari)} hari • ${formatRupiah(item.estimasiBiaya)}`;

    const thumbSrc = getItemPhoto(item, activeCrudTab);
    return `
      <tr>
        <td>
          <div style="display:flex;align-items:center;gap:10px;">
            <img src="${escapeHtml(thumbSrc)}" alt="" referrerpolicy="no-referrer" onerror="handlePhotoError(this, '${escapeHtml(item.nama)}')" style="width:46px;height:38px;object-fit:cover;border-radius:6px;flex-shrink:0;border:1px solid var(--neutral-200);" />
            <div>
              <strong>${escapeHtml(item.nama)}</strong>
              <div style="font-size:0.74rem;color:var(--neutral-500);">ID: ${escapeHtml(item.id)}</div>
            </div>
          </div>
        </td>
        <td>${infoCol}</td>
        <td style="white-space:nowrap;">
          <button type="button" class="btn btn-outline btn-sm" onclick="openPhotoManagerModal('${escapeHtml(activeCrudTab)}', '${escapeHtml(item.id)}')" title="Upload / Ganti Foto">📷</button>
          <button type="button" class="btn btn-outline btn-sm" onclick="startCrudEdit('${escapeHtml(item.id)}')">Edit</button>
          <button type="button" class="btn btn-danger btn-sm" onclick="deleteCrudItem('${escapeHtml(item.id)}')">Hapus</button>
        </td>
      </tr>
    `;
  }).join("");

  wrap.innerHTML = `
    <table>
      <thead><tr><th>Nama Item</th><th>Ringkasan Detail</th><th>Aksi</th></tr></thead>
      <tbody>${bodyHtml}</tbody>
    </table>
  `;
}

function startCrudEdit(id) {
  if (!canAccessDashboard()) return;
  editingCrudId = id;
  renderCrudSection();
  const sec = document.getElementById("crudSection");
  if (sec) sec.scrollIntoView({ behavior: "smooth" });
}

function deleteCrudItem(id) {
  if (!canAccessDashboard()) return;
  const actor = getCurrentUser();

  if (activeCrudTab === "users") {
    if (!isAdmin()) {
      showToast("Hanya Admin yang dapat menghapus akun pengguna!");
      return;
    }
    if (actor && actor.id === id) {
      showToast("Tidak dapat menghapus akun Admin yang sedang digunakan saat ini.");
      return;
    }
    const idx = authState.users.findIndex(u => u.id === id);
    if (idx >= 0) {
      const removed = authState.users[idx];
      authState.users.splice(idx, 1);
      if (editingCrudId === id) editingCrudId = null;
      addAuthLog(actor.nama, actor.role, `Menghapus akun dummy "${removed.nama}" (${removed.username}).`);
      saveAuthState();
      renderAll();
      showToast(`Akun "${removed.nama}" berhasil dihapus.`);
    }
    return;
  }

  const col = state[activeCrudTab];
  const idx = col.findIndex(x => x.id === id);
  if (idx >= 0) {
    const removedName = col[idx].nama;
    col.splice(idx, 1);
    if (editingCrudId === id) editingCrudId = null;
    if (actor) addAuthLog(actor.nama, actor.role, `Menghapus data ${activeCrudTab}: "${removedName}".`);
    saveState();
    renderAll();
    showToast(`Data "${removedName}" berhasil dihapus.`);
  }
}

function handleCrudSubmit(e) {
  e.preventDefault();
  if (!canAccessDashboard()) {
    showToast("Akses ditolak: Hanya Operator & Admin yang dapat mengubah data Dashboard.");
    return;
  }

  const fd = new FormData(e.target);
  const data = Object.fromEntries(fd.entries());
  const actor = getCurrentUser();

  if (activeCrudTab === "users") {
    if (!isAdmin()) {
      showToast("Hanya Admin yang dapat mengelola akun pengguna!");
      return;
    }
    const cleanUser = data.username.trim();
    const conflict = authState.users.find(
      u => u.id !== editingCrudId && normalizeText(u.username) === normalizeText(cleanUser)
    );
    if (conflict) {
      showToast(`Username "${cleanUser}" sudah digunakan akun lain.`);
      return;
    }
    const record = {
      id: editingCrudId || ("usr-" + Date.now()),
      nama: data.nama.trim(),
      username: cleanUser,
      email: data.email.trim(),
      password: data.password,
      role: data.role,
      jabatan: (data.jabatan || "").trim() || "Pengguna Terdaftar",
      aktif: data.aktif !== "false"
    };
    upsertRecord(authState.users, record);
    addAuthLog(actor.nama, actor.role, `${editingCrudId ? "Memperbarui" : "Menambahkan"} akun dummy "${record.nama}" (${record.role}).`);
    editingCrudId = null;
    saveAuthState();
    renderAll();
    showToast("Data akun pengguna dummy berhasil disimpan!");
    return;
  }

  const col = state[activeCrudTab];
  const existingItem = editingCrudId ? col.find(x => x.id === editingCrudId) : null;
  const chosenImageUrl = pendingCrudUploadedDataUrl
    || (data.imageUrl && data.imageUrl.trim())
    || (existingItem && existingItem.imageUrl)
    || guessDefaultPhotoByText(data.nama, activeCrudTab);

  if (activeCrudTab === "stok") {
    const record = {
      id: editingCrudId || ("stk-" + Date.now()),
      nama: data.nama.trim(),
      imageUrl: chosenImageUrl,
      kategori: data.kategori,
      zonaSimpan: data.zonaSimpan,
      jumlah: Number(data.jumlah) || 0,
      satuan: data.satuan.trim(),
      tanggalMasuk: isoOffsetDays(0),
      tanggalKedaluwarsa: data.tanggalKedaluwarsa,
      tipeTanggal: data.tipeTanggal,
      estimasiNilai: Number(data.estimasiNilai) || 0,
      statusHalal: data.statusHalal,
      sumberVerifikasi: data.tipsSimpan.trim(),
      tipsSimpan: data.tipsSimpan.trim()
    };
    upsertRecord(col, record);
  } else if (activeCrudTab === "resep") {
    const record = {
      id: editingCrudId || ("rsp-" + Date.now()),
      nama: data.nama.trim(),
      imageUrl: chosenImageUrl,
      kategori: data.kategori,
      zonaUtama: data.zonaUtama,
      deskripsi: data.deskripsi.trim(),
      imageSvg: "greens",
      waktuMenit: Number(data.waktuMenit) || 15,
      porsiDasar: 3,
      estimasiBiaya: Number(data.estimasiBiaya) || 15000,
      bahanUtama: data.bahanUtama.split(",").map(s => s.trim()).filter(Boolean),
      langkahMasak: data.langkahMasak.split(/\r?\n/).map(s => s.trim()).filter(Boolean),
      alatMasak: ["Wajan / Panci"],
      panduanHalalPangan: data.panduanHalalPangan.trim(),
      unggulan: false
    };
    upsertRecord(col, record);
  } else if (activeCrudTab === "umkm") {
    const record = {
      id: editingCrudId || ("umkm-" + Date.now()),
      nama: data.nama.trim(),
      imageUrl: chosenImageUrl,
      kategori: data.kategori,
      zonaLayanan: "Mitra Lokal Simulasi",
      komoditas: data.komoditas.split(",").map(s => s.trim()).filter(Boolean),
      hargaMulai: Number(data.hargaMulai) || 10000,
      imageSvg: "market",
      statusSertifikasiHalal: data.statusSertifikasiHalal,
      sumberVerifikasi: data.sumberVerifikasi.trim(),
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(data.nama.trim()),
      kontakDemo: data.kontakDemo.trim()
    };
    upsertRecord(col, record);
  } else {
    const record = {
      id: editingCrudId || ("pkt-" + Date.now()),
      nama: data.nama.trim(),
      imageUrl: chosenImageUrl,
      profilMinat: data.profilMinat,
      durasiHari: Math.min(5, Math.max(1, Number(data.durasiHari) || 3)),
      daftarResep: data.daftarResep.split(",").map(s => s.trim()).filter(Boolean),
      estimasiBiaya: Number(data.estimasiBiaya) || 60000,
      deskripsi: data.deskripsi.trim()
    };
    upsertRecord(col, record);
  }

  if (actor) {
    addAuthLog(actor.nama, actor.role, `${editingCrudId ? "Memperbarui" : "Menambahkan"} data ${activeCrudTab}: "${data.nama.trim()}".`);
  }
  editingCrudId = null;
  saveState();
  renderAll();
  showToast("Data berhasil disimpan ke localStorage!");
}

function upsertRecord(col, record) {
  const idx = col.findIndex(x => x.id === record.id);
  if (idx >= 0) col[idx] = { ...col[idx], ...record };
  else col.unshift(record);
}

/* =========================================================================
   MASTER MULTI-PAGE RENDER & SAFE EVENT LISTENERS
   ========================================================================= */
function renderAll() {
  renderNavbarAuthWidget();
  applyLanguage();

  if (document.getElementById("mainAppRoot")) {
    renderStatsAndZones();
    renderStockGrid();
    renderRecipeGrid();
    renderPackages();
    renderPlanner();
    renderShoppingAndUmkm();
  }

  if (document.getElementById("loginPageRoot")) {
    renderLoginPage();
  }

  if (document.getElementById("dashboardPageRoot")) {
    renderDashboardPage();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const on = (id, evt, fn) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener(evt, fn);
  };

  // Shared language buttons
  on("langID", "click", () => { state.lang = "ID"; saveState(); renderAll(); });
  on("langEN", "click", () => { state.lang = "EN"; saveState(); renderAll(); });

  // Main App (index.html) listeners
  on("btnToggleFavFilter", "click", () => {
    state.onlyFavorites = !state.onlyFavorites;
    saveState();
    renderAll();
    showToast(state.onlyFavorites ? "Menampilkan hanya Resep & UMKM Favorit." : "Menampilkan seluruh katalog.");
  });

  const toggleScanner = () => {
    const p = document.getElementById("scannerPanel");
    if (!p) return;
    p.style.display = p.style.display === "none" ? "block" : "none";
    if (p.style.display === "block") p.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  on("btnToggleScanner", "click", toggleScanner);
  on("btnHeroOpenScanner", "click", () => {
    const p = document.getElementById("scannerPanel");
    if (!p) return;
    p.style.display = "block";
    p.scrollIntoView({ behavior: "smooth", block: "center" });
  });
  on("btnProcessReceipt", "click", processReceiptInput);

  ["stockSearch", "stockCategoryFilter", "stockStatusFilter", "stockSort"].forEach(id => {
    on(id, "input", renderStockGrid);
    on(id, "change", renderStockGrid);
  });
  on("btnResetStockFilter", "click", () => {
    state.selectedZone = "ALL";
    document.getElementById("stockSearch").value = "";
    document.getElementById("stockCategoryFilter").value = "ALL";
    document.getElementById("stockStatusFilter").value = "ALL";
    document.getElementById("stockSort").value = "EXP_ASC";
    saveState();
    renderStatsAndZones();
    renderStockGrid();
  });

  ["recipeSearch", "recipeCategoryFilter", "recipeZoneFilter", "recipeSort"].forEach(id => {
    on(id, "input", renderRecipeGrid);
    on(id, "change", renderRecipeGrid);
  });
  on("btnResetRecipeFilter", "click", () => {
    state.ingredientRecipeFilter = "";
    document.getElementById("recipeSearch").value = "";
    document.getElementById("recipeCategoryFilter").value = "ALL";
    document.getElementById("recipeZoneFilter").value = "ALL";
    document.getElementById("recipeSort").value = "RESCUE_DESC";
    saveState();
    renderRecipeGrid();
  });

  ["pkgInterestFilter", "pkgMaxBudget", "pkgMaxDays"].forEach(id => {
    on(id, "change", renderPackages);
  });

  on("planName", "input", e => { state.rencana.namaRencana = e.target.value; saveState(); });
  on("planStartDate", "change", e => { state.rencana.tanggalMulai = e.target.value; saveState(); });
  on("planDays", "change", e => {
    state.rencana.jumlahHari = Math.min(5, Math.max(1, Number(e.target.value) || 3));
    saveState();
    renderPlanner();
  });
  on("planPeople", "input", e => {
    state.rencana.jumlahOrang = Math.max(1, Number(e.target.value) || 1);
    saveState();
    calculatePlannerBudget();
  });
  on("planExtraBudget", "input", e => {
    state.rencana.biayaTambahan = Math.max(0, Number(e.target.value) || 0);
    saveState();
    calculatePlannerBudget();
  });

  on("btnAutoFillPlanner", "click", () => {
    const sorted = [...state.resep]
      .map(r => ({ r, score: evaluateRecipeMatch(r).priorityScore }))
      .sort((a, b) => b.score - a.score);
    const times = ["Sarapan", "Siang", "Malam"];
    state.rencana.slots = {};
    let i = 0;
    for (let d = 1; d <= state.rencana.jumlahHari; d++) {
      for (const t of times) {
        if (sorted.length) {
          state.rencana.slots[`${d}-${t}`] = sorted[i % sorted.length].r.id;
          i++;
        }
      }
    }
    saveState();
    renderPlanner();
    showToast("Jadwal masak diisi otomatis berdasarkan prioritas penyelamat stok kulkas!");
  });

  on("btnClearPlanner", "click", () => {
    state.rencana.slots = {};
    saveState();
    renderPlanner();
    showToast("Jadwal Meal Planner dikosongkan.");
  });

  on("btnExportMissingToShop", "click", () => {
    const sum = getPlannerComputedSummary();
    if (!sum.missingItems.length) {
      showToast("Tidak ada kekurangan bahan pada rencana masak saat ini!");
      return;
    }
    sum.missingItems.forEach(m => addSingleToShopping(m, `Meal Plan: ${state.rencana.namaRencana}`, true));
    saveState();
    renderAll();
    showToast(`${sum.missingItems.length} bahan yang kurang masuk ke Daftar Belanja!`);
  });

  on("formAddShopItem", "submit", e => {
    e.preventDefault();
    const input = document.getElementById("shopItemInput");
    if (input && input.value.trim()) {
      addSingleToShopping(input.value.trim(), "Input Manual");
      input.value = "";
    }
  });
  on("btnClearCheckedShop", "click", () => {
    state.belanja = state.belanja.filter(b => !b.sudahDibeli);
    saveState();
    renderShoppingAndUmkm();
    renderStatsAndZones();
    showToast("Item belanja yang sudah dicentang dibersihkan.");
  });
  on("umkmHalalFilter", "change", renderShoppingAndUmkm);

  // Login Page (login.html) listeners
  on("dummyLoginForm", "submit", e => {
    e.preventDefault();
    const uVal = document.getElementById("loginUsername").value.trim();
    const pVal = document.getElementById("loginPassword").value;
    const res = performDummyLogin(uVal, pVal);
    if (!res.ok) {
      showLoginAlert("error", res.message);
      return;
    }
    redirectAfterLogin(res.user);
  });

  on("btnTogglePw", "click", () => {
    const pwInput = document.getElementById("loginPassword");
    const btn = document.getElementById("btnTogglePw");
    if (!pwInput || !btn) return;
    const isPw = pwInput.type === "password";
    pwInput.type = isPw ? "text" : "password";
    btn.textContent = isPw ? "Sembunyi" : "Lihat";
  });

  // Dashboard (dashboard.html) listeners
  on("crudForm", "submit", handleCrudSubmit);
  on("crudTableSearch", "input", renderCrudTable);

  on("btnExportJson", "click", () => {
    if (!canAccessDashboard()) return;
    const payload = { appData: state, dummyUsers: authState.users };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dapurpintar-dashboard-backup.json";
    a.click();
    URL.revokeObjectURL(url);
    showToast("Berkas JSON berhasil diekspor.");
  });

  on("btnResetAllDemo", "click", () => {
    if (!isAdmin()) {
      showToast("Hanya Admin yang diizinkan mereset seluruh data sistem!");
      return;
    }
    const curr = getCurrentUser();
    state = createDefaultData();
    authState.users = createDefaultDummyUsers();
    if (curr) {
      const matchSameRole = authState.users.find(u => u.role === curr.role);
      authState.currentUserId = matchSameRole ? matchSameRole.id : null;
      addAuthLog(curr.nama, curr.role, "Melakukan Reset Data Contoh Awal (Hard Reset Sistem).");
    }
    editingCrudId = null;
    saveState();
    saveAuthState();
    renderAll();
    showToast("Seluruh data sistem & akun dummy dikembalikan ke setelan awal!");
  });

  // Modal close listeners
  on("appModal", "click", e => {
    if (e.target.id === "appModal") closeModal();
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeModal();
  });

  // Pre-fill default role on login page
  if (document.getElementById("loginPageRoot")) {
    const params = new URLSearchParams(window.location.search);
    selectRolePreset(params.get("next") === "dashboard.html" ? "operator" : "user", true);
  }

  renderAll();
});
