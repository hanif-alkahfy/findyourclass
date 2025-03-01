import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import axios from "axios";
import Navbar from "./components/Navbar";
import Footer from './components/Footer';
import SearchBar from "./components/SearchBar";
import SearchResults from "./components/SearchResults";
import "./index.css";

function App() {
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false); // Default: belum mencari

  const handleSearch = async (keyword) => {
    if (!keyword.trim()) {
      setResults([]);
      setSearched(true);
      return;
    }

    try {
      const response = await axios.get(
        `http://192.168.0.103:5000/search?keyword=${encodeURIComponent(keyword)}`
      );
      setResults(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setResults([]);
    }

    setSearched(true); // Tandai bahwa pencarian sudah dilakukan
  };

  return (
    <Router>
      <Navbar />
      <div className="min-h-screen min-w-screen flex flex-col items-center justify-center p-6 text-black">
        <h2 className="text-4xl font-bold mb-5 mt-25">Jadwal Kuliah S1 Informatika Amikom</h2>
        <SearchBar onSearch={handleSearch} />
  
        {/* Tampilkan pesan "Tidak ada hasil" jika sudah mencari tetapi tidak ditemukan */}
        {searched && results.length === 0 ? (
          <div className="text-center mt-30">
            <h2 className="text-4xl font-bold text-purple-600">
              Tidak ada hasil pencarian
            </h2>
            <p className="text-lg text-black mt-2">
              Silakan cari kata kunci lain
            </p>
          </div>
        ) : (
          results.length > 0 && <SearchResults data={results} />
        )}
        <Footer />
      </div>
    </Router>
  );    
}

export default App;
