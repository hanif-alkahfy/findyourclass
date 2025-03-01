const express = require("express");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const cors = require("cors");

const app = express();
const PORT = 5000;

let scheduleData = [];

// Izinkan akses dari frontend (localhost:3000)
app.use(cors());

// Gunakan path relatif untuk mengakses file CSV
const filePath = path.join(__dirname, "public", "jadwal.csv");

fs.createReadStream(filePath)
  .pipe(csv())
  .on("data", (row) => {
    scheduleData.push(row);
  })
  .on("end", () => {
    console.log("CSV file has been loaded.");
  })
  .on("error", (err) => {
    console.error("Error reading CSV file:", err);
  });

// Fungsi pencarian jadwal
// function searchSchedule(keyword) {
//   keyword = keyword.trim().toUpperCase();
//   let words = keyword.split(" ");

//   // Ambil semua mata kuliah unik
//   let mataKuliahCandidates = [...new Set(scheduleData.map(row => row["MATA KULIAH"].toUpperCase()))];
//   let matchedMataKuliah = [];

//   for (let i = 1; i <= words.length; i++) {
//     let potentialMatkul = words.slice(0, i).join(" ");
//     if (mataKuliahCandidates.some(mk => mk.includes(potentialMatkul))) {
//       matchedMataKuliah.push(potentialMatkul);
//     }
//   }

//   // Ambil mata kuliah dengan kecocokan terpanjang
//   let mataKuliah = matchedMataKuliah.sort((a, b) => b.length - a.length)[0] || "";
//   let dosen = mataKuliah ? words.slice(mataKuliah.split(" ").length).join(" ") : keyword;

//   // Filter berdasarkan mata kuliah dan/atau dosen
//   return scheduleData.filter(row => {
//     let matchMatkul = mataKuliah ? row["MATA KULIAH"].toUpperCase().includes(mataKuliah) : true;
//     let matchDosen = dosen ? row["DOSEN"].toUpperCase().includes(dosen) : true;
//     return matchMatkul && matchDosen;
//   });
// }

// Fungsi pencarian jadwal dengan logika baru
function searchSchedule(keyword) {
  keyword = keyword.trim().toUpperCase();
  const words = keyword.split(" "); // Pecah input menjadi kata-kata

  return scheduleData.filter(row => {
    // Gabungkan "MATA KULIAH" dan "DOSEN" dalam satu string
    const combinedText = `${row["MATA KULIAH"]} ${row["DOSEN"]}`.toUpperCase();

    // Pastikan semua kata dari input ditemukan dalam teks gabungan
    return words.every(word => combinedText.includes(word));
  });
}

// Endpoint untuk memastikan server berjalan
app.get("/api/data", (req, res) => {
  res.json({ message: "Server is up and running!" });
});

app.get("/search", (req, res) => {
  const keyword = req.query.keyword;

  if (!keyword) {
    return res.status(400).json({ error: "Keyword harus diberikan" });
  }

  const result = searchSchedule(keyword);

  res.json(result);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server berjalan di PORT: ${PORT}`);
});
