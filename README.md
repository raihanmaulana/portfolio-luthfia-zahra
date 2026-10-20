# Portfolio Lutfiah Zahra Larosa (Sasa)

Web portfolio UI/UX dan visual designer. Situs statis (HTML, CSS, JS), tanpa build step.

## Deploy ke Vercel
1. Import repo ini di Vercel.
2. Framework Preset: **Other**. Build Command dan Output Directory dikosongkan.
3. Deploy.

## Struktur
- `index.html`, `styles.css`, `tokens.css`, `script.js`: halaman satu layar panjang (token warna OKLCH dan font ada di `tokens.css`)
- `assets/fonts`: Bricolage Grotesque dan Geist (self-host, tanpa request ke CDN)
- `.hallmark/log.json`: catatan keputusan desain dari skill Hallmark
- `assets/img`: gambar karya yang diambil dari PDF portofolio (WebP)
- `assets/video`: loop walk cycle 2D (saat ini tidak dipakai di halaman; bagian About memakai Pomoboo)

## Yang perlu dicek sebelum rilis
- Tautan portofolio UI/UX, portofolio desain, dan CV sudah mengarah ke Google Drive. Tombol "App Store" diganti "Read the case study, PDF" karena link App Store belum ada; tambahkan lagi bila sudah rilis.
- Angka survei Broceries (7, 5, 6 dari 10) adalah data pengisi, ganti dengan data riset asli atau hapus.
- Seluruh isi CV (pengalaman, pendidikan, skill, sertifikasi, penghargaan, organisasi, publikasi) sudah masuk ke bagian Résumé; mohon dicek kembali oleh Sasa.
- Teks dan angka pada bagian intro, studi kasus Broceries, dan "Worked and studied with" ditulis dari CV dan portofolio; mohon dikonfirmasi oleh Sasa.
- Font di-host sendiri di `assets/fonts` (Bricolage Grotesque untuk judul, Geist untuk teks); tidak perlu konfigurasi tambahan.
- Gambar diekstrak dari PDF, resolusinya terbatas. Ganti dengan file asli dari Figma untuk hasil lebih tajam.
