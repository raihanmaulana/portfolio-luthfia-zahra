# Portfolio Lutfiah Zahra Larosa (Sasa)

Web portfolio UI/UX dan visual designer. Situs statis (HTML, CSS, JS), tanpa build step.

## Deploy ke Vercel
1. Import repo ini di Vercel.
2. Framework Preset: **Other**. Build Command dan Output Directory dikosongkan.
3. Deploy.

## Struktur
- `index.html`, `styles.css`, `script.js`: halaman satu layar panjang
- `assets/img`: gambar karya yang diambil dari PDF portofolio (WebP)
- `assets/video`: loop walk cycle 2D buatan Sasa

## Yang perlu dicek sebelum rilis
- Tautan placeholder (`data-placeholder` di `index.html`): App Store Broceries, PDF portofolio UI/UX, PDF portofolio desain. Masih mengarah ke `#`, ganti dengan URL asli.
- Angka survei Broceries (7, 5, 6 dari 10) adalah data pengisi, ganti dengan data riset asli atau hapus.
- Teks dan angka pada bagian intro, studi kasus Broceries, dan "Worked and studied with" ditulis dari CV dan portofolio; mohon dikonfirmasi oleh Sasa.
- Font Switzer dimuat dari Fontshare. Jika ingin self-host, unduh dari fontshare.com dan ganti tag `<link>` di `index.html`.
- Gambar diekstrak dari PDF, resolusinya terbatas. Ganti dengan file asli dari Figma untuk hasil lebih tajam.
