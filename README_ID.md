# PC3000-6E Troubleshooting Assistant — Website Android

## Fitur prototipe
- Tampilan responsif untuk Chrome Android.
- Form identitas unit, HM, mekanik, tanggal, dan gejala.
- Alur checklist B15 dengan pilihan Belum diperiksa / OK / Tidak OK / Tidak dapat diuji.
- Input temperatur oli, hasil sensor B75/PT100, setelan K100, Y101, dan catatan pengukuran.
- Arahan langkah berikutnya berdasarkan status checklist.
- Laporan yang dapat disalin, diunduh sebagai TXT, atau dicetak / disimpan sebagai PDF.
- Simpan/muat data menggunakan localStorage browser.
- Service worker agar halaman bisa dibuka kembali setelah pertama kali dimuat melalui HTTPS.

## Cara termudah publikasi melalui GitHub Pages
1. Buka repository GitHub Anda di Chrome Android.
2. Unggah seluruh isi folder ini (index.html, style.css, app.js, manifest.webmanifest, sw.js, icon.svg, README_ID.md) ke folder root repository atau folder publik yang dipakai Pages.
3. Jika file bernama sama sudah ada, buat backup terlebih dahulu lalu ganti dengan file versi ini.
4. Buka Settings > Pages, pastikan sumber publikasi menunjuk ke branch/folder yang benar.
5. Tunggu hingga GitHub Pages selesai membangun situs, lalu buka URL Pages repository Anda di Chrome.
6. Dari menu Chrome (⋮), pilih Add to Home screen / Tambahkan ke layar utama.

## Batasan penting
- Versi awal hanya menyusun alur pemeriksaan awal B15 dari bagian B15 manual yang telah teridentifikasi. Tidak semua langkah B15 halaman cetak 83–88 telah dimasukkan.
- Tidak ada nilai batas sensor/temperatur yang direka. Isi nilai standar dari standard value table resmi yang sesuai.
- Aplikasi bukan AI dan tidak dapat membaca manual lengkap otomatis. Trouble code baru harus ditambahkan sebagai alur terstruktur setelah langkah-langkahnya diverifikasi dari manual.
- Data disimpan di browser perangkat yang digunakan; membersihkan data situs/browser dapat menghapus simpanan. Jangan menyimpan informasi sensitif yang tidak diperlukan.
- Gunakan Shop Manual/O&M Manual sesuai serial number dan konfigurasi unit, prosedur LOTOTO, serta persetujuan site.
