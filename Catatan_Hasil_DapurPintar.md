# Catatan Hasil Pengembangan & Pembaruan — DapurPintar v2.0

**Nama Aplikasi:** DapurPintar — *Smart Kitchen (Asisten Stok Bahan & Resep Anti-Mubazir)*  
**Tanggal Pembaruan:** 25 November 2026  
**Repositori Tujuan:** `https://github.com/sihombing12/egraf-dapurpintar.git` (Branch: `main`)

---

## 1. Ringkasan Hasil Pengerjaan

Pembaruan aplikasi web **DapurPintar** telah selesai dikerjakan mencakup 4 capaian utama:
1. **Pemisahan Kode Terstruktur (HTML, CSS, dan JavaScript):** Seluruh kode tampilan dan logika dipisahkan dari satu file besar menjadi berkas modular (`style.css` dan `script.js`) yang digunakan bersama oleh seluruh halaman.
2. **Halaman Login Dummy Multi-Peran (`login.html`):** Mendukung autentikasi simulasi lokal (`localStorage`) untuk 3 tingkatan peran: **User**, **Operator**, dan **Admin**, lengkap dengan fitur *Isi Form Otomatis* dan *Login Cepat 1-Klik*.
3. **Proteksi Halaman Dashboard (`dashboard.html`):** Halaman manajemen data dan CRUD dipisahkan ke halaman tersendiri yang dilindungi *Role-Based Access Control (RBAC)* sehingga **hanya dapat diakses oleh Operator dan Admin** (akun `User` biasa maupun `Tamu` otomatis diblokir dengan tampilan peringatan akses terbatas `403`).
4. **Penggantian Identitas Logo Baru (*dapurpintar — SMART KITCHEN*):** Seluruh logo lama berbasis ikon SVG telah diganti dengan aset logo resmi berlatar transparan pada Favicon tab browser, Navbar, Header Kartu Login, dan Footer di semua halaman.

---

## 2. Struktur Berkas Proyek

| Nama Berkas | Fungsi & Keterangan |
| :--- | :--- |
| `index.html` | Halaman utama pengguna (Denah SVG 5 Zona Dapur, Simulasi Scan Struk, Katalog Resep Anti-Mubazir, Meal Planner 1–5 Hari, Kalkulator Anggaran, Daftar Belanja & Mitra UMKM). |
| `login.html` | Halaman portal login dummy untuk **User**, **Operator**, dan **Admin**. |
| `dashboard.html` | Halaman Dashboard terproteksi khusus **Operator** & **Admin** (Ringkasan KPI, Antrean Verifikasi Halal, CRUD 4 Entitas Utama, serta Manajemen Akun & Log Aktivitas khusus Admin). |
| `style.css` | Stylesheet utama mencakup tema warna Nusantara Emerald & Gold, tata letak responsif, gaya halaman login, kartu akun dummy, dan komponen dashboard. |
| `script.js` | Logika aplikasi terpusat mencakup manajemen state `localStorage`, mesin pencocokan resep & kedaluwarsa, sistem autentikasi dummy, serta penjaga hak akses (*route guard*) antarhalaman. |
| `logo-icon.png` | Akon bohlam alat masak (*whisk & spatula*) transparan untuk Navbar dan Favicon. |
| `logo-dapurpintar.png` | Logo penuh (*ikon + tipografi `dapurpintar SMART KITCHEN`*) transparan untuk halaman Login dan Footer. |
| `logo-original.jpg` | Berkas master logo asli yang diunggah. |
| `Ide_Aplikasi_DapurPintar.md` | Dokumen konsep, latar belakang masalah, dan model bisnis aplikasi. |
| `Catatan_Hasil_DapurPintar.md` | Dokumen catatan hasil pengembangan, daftar akun dummy, dan panduan penggunaan. |

---

## 3. Daftar Akun Dummy & Matriks Hak Akses (RBAC)

Seluruh akun di bawah ini telah terkonfigurasi otomatis pada penyimpanan lokal peramban (`dapurpintar_v1_auth`) dan siap langsung diuji melalui `login.html`:

| Peran (Role) | Nama Pengguna | Username / Email | Password | Akses `index.html` | Akses `dashboard.html` | Hak Akses & Kewenangan |
| :--- | :--- | :--- | :--- | :---: | :---: | :--- |
| **User** | Siti Rahma | `user` / `user@dapurpintar.id` | `user123` | Diizinkan | **Ditolak (`403`)** | Mengelola stok dapur pribadi, scan struk, mencari resep, menyusun meal plan, dan daftar belanja. |
| **Operator** | Budi Santoso | `operator` / `operator@dapurpintar.id` | `operator123` | Diizinkan | **Diizinkan** | Melihat KPI, memverifikasi status halal bahan/UMKM, mengelola CRUD Stok, Resep, UMKM, Paket Meal Plan, & ekspor JSON. |
| **Admin** | Ahmad Wijaya | `admin` / `admin@dapurpintar.id` | `admin123` | Diizinkan | **Diizinkan (Penuh)** | Seluruh kewenangan Operator **ditambah** CRUD Akun Pengguna Dummy, melihat/menghapus Log Aktivitas Login, dan Reset Sistem Awal. |

---

## 4. Cara Menguji Fitur Login & Proteksi Dashboard

1. Buka `login.html` di browser.
2. Klik **Login Cepat** pada kartu **User (`user` / `user123`)**:
   - Sistem mengarahkan ke `index.html`.
   - Klik tombol **🔒 Dashboard** di Navbar — sistem pada `dashboard.html` akan otomatis **menolak akses** dan menampilkan pesan bahwa akun `User` tidak diizinkan masuk ke Dashboard.
3. Kembali ke `login.html` lalu masuk sebagai **Operator (`operator` / `operator123`)**:
   - Sistem mengarahkan langsung ke `dashboard.html`.
   - Operator dapat mengelola tab **1. Stok Bahan**, **2. Katalog Resep**, **3. Mitra UMKM**, **4. Paket Meal Plan**, dan **Antrean Verifikasi Halal**, namun tab **5. Akun Pengguna** dan tombol **Reset Sistem** terkunci khusus Admin.
4. Masuk sebagai **Admin (`admin` / `admin123`)**:
   - Seluruh fitur terbuka penuh termasuk tab **5. Akun Pengguna** (tambah/edit/hapus akun dummy) dan tabel **Riwayat Aktivitas Login & Sistem**.

---

## 5. Status Git Lokal & Panduan Push ke GitHub

Seluruh perubahan terbaru telah disinkronkan dan di-*commit* secara lokal pada cabang **`main`** dengan remote `origin` mengarah ke `https://github.com/sihombing12/egraf-dapurpintar.git`.

Karena proses unggah ke GitHub memerlukan login akun GitHub Anda secara interaktif di jendela browser, jalankan perintah berikut pada **Terminal / PowerShell** di folder proyek untuk menyelesaikan *push*:

```powershell
& "C:\Program Files\Git\cmd\git.exe" push -u origin main
```

Saat jendela **Git Credential Manager / GitHub Sign-in** terbuka, klik **Sign in with your browser** dan setujui otorisasi pada akun `sihombing12`.
