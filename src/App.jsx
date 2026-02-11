import { useState, useEffect } from "react";
import MovieCard from "./MovieCard";
import "./App.css";

const API_URL = "https://www.omdbapi.com?apikey=1ba73268";

const App = () => {
  const [movies, setMovies] = useState([]);
  const [onePiece, setOnePiece] = useState([]);
  const [horror, setHorror] = useState([]);
  const [indoMovies, setIndoMovies] = useState([]);
  const [cartoons, setCartoons] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [view, setView] = useState("home");
  const [myList, setMyList] = useState([]);

  // Set default ke vidsrc.cc karena saat ini paling stabil untuk HTTPS
  const [server, setServer] = useState("vidsrc.cc");

  const fetchCategory = async (title, setter) => {
    try {
      const response = await fetch(`${API_URL}&s=${title}`);
      const data = await response.json();
      if (data.Search) setter(data.Search);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategory("One Piece", setOnePiece);
    fetchCategory("Horror", setHorror);
    fetchCategory("Indonesia", setIndoMovies);
    fetchCategory("Cartoon", setCartoons);
  }, []);

  const addToMyList = (movie) => {
    if (!myList.find((m) => m.imdbID === movie.imdbID)) {
      setMyList([...myList, movie]);
      alert("Berhasil ditambahkan ke My List!");
    }
  };

  const fetchMovieDetail = async (id) => {
    const response = await fetch(`${API_URL}&i=${id}&plot=full`);
    const data = await response.json();
    setSelectedMovie(data);
    setIsPlaying(false);
  };

  // FUNGSI PERBAIKAN: Dinamis mengikuti state 'server'
  const getEmbedUrl = () => {
    const type = selectedMovie.Type === "series" ? "tv" : "movie";
    // Gunakan template literal untuk server agar tombol ganti server berfungsi
    return `https://${server}/v2/embed/${type}/${selectedMovie.imdbID}`;
  };

  const renderSection = (title, data) => (
    <section className="movie-section">
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        <span className="view-all">Lihat Semuanya ➔</span>
      </div>
      <div className="container scroll-container">
        {data.map((movie) => (
          <MovieCard
            key={movie.imdbID}
            movie={movie}
            onClick={() => fetchMovieDetail(movie.imdbID)}
          />
        ))}
      </div>
    </section>
  );

  return (
    <div className="app">
      <nav className="navbar">
        <div className="logo" onClick={() => setView("home")}>
          Cinema<span>Stream</span>
        </div>
        <ul className="nav-links">
          <li
            onClick={() => setView("home")}
            className={view === "home" ? "active" : ""}
          >
            Home
          </li>
          <li
            onClick={() => setView("mylist")}
            className={view === "mylist" ? "active" : ""}
          >
            My List ({myList.length})
          </li>
          <li
            onClick={() => setView("about")}
            className={view === "about" ? "active" : ""}
          >
            Tentang
          </li>
        </ul>
      </nav>

      {view === "home" ? (
        <>
          <header className="hero">
            <div className="hero-content">
              <h1>Hiburan Tanpa Batas.</h1>
              <div className="search-box">
                <input
                  placeholder="Cari film atau anime..."
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && fetchCategory(searchTerm, setMovies)
                  }
                />
                <button onClick={() => fetchCategory(searchTerm, setMovies)}>
                  Cari
                </button>
              </div>
            </div>
          </header>
          <main className="main-content">
            {searchTerm && renderSection(`Hasil: ${searchTerm}`, movies)}
            {renderSection("Anime One Piece", onePiece)}
            {renderSection("Horror Terpopuler", horror)}
            {renderSection("Bioskop Indonesia", indoMovies)}
            {renderSection("Kartun", cartoons)}
          </main>
        </>
      ) : view === "mylist" ? (
        <main className="main-content page-margin">
          <h2 className="section-title">
            Daftar <span>Saya</span>
          </h2>
          <div className="container grid-container">
            {myList.map((m) => (
              <MovieCard
                key={m.imdbID}
                movie={m}
                onClick={() => fetchMovieDetail(m.imdbID)}
              />
            ))}
          </div>
        </main>
      ) : (
        <main className="main-content page-margin about-page">
          <h2 className="section-title">
            Tentang <span>Dimas</span>
          </h2>
          <p>
            CinemaStream adalah portofolio <strong>Solusi Dimas</strong> buatan
            Dimas Pratama Adji.
          </p>
        </main>
      )}

      {selectedMovie && (
        <div className="modal-overlay" onClick={() => setSelectedMovie(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-btn"
              onClick={() => setSelectedMovie(null)}
            >
              ×
            </button>
            <div className="modal-body">
              {isPlaying ? (
                <div className="video-player-container">
                  <div className="server-selector">
                    <span>Ganti Server: </span>
                    <button
                      onClick={() => setServer("vidsrc.cc")}
                      className={server === "vidsrc.cc" ? "active" : ""}
                    >
                      S1 (Stabil)
                    </button>
                    <button
                      onClick={() => setServer("vidsrc.me")}
                      className={server === "vidsrc.me" ? "active" : ""}
                    >
                      S2
                    </button>
                    <button
                      onClick={() => setServer("vidsrc.to")}
                      className={server === "vidsrc.to" ? "active" : ""}
                    >
                      S3
                    </button>
                    <button
                      onClick={() => setServer("vidsrc.xyz")}
                      className={server === "vidsrc.xyz" ? "active" : ""}
                    >
                      S4
                    </button>
                  </div>
                  <div className="video-player-wrapper">
                    <iframe
                      src={getEmbedUrl()}
                      frameBorder="0"
                      allowFullScreen
                      sandbox="allow-forms allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation"
                    ></iframe>
                  </div>
                </div>
              ) : (
                <div className="modal-header-detail">
                  <img src={selectedMovie.Poster} alt="poster" />
                  <div className="modal-info">
                    <h2>{selectedMovie.Title}</h2>
                    <p className="plot">{selectedMovie.Plot}</p>
                    <div className="modal-actions">
                      <button
                        className="btn-play"
                        onClick={() => setIsPlaying(true)}
                      >
                        ▶ Putar Film
                      </button>
                      <button
                        className="btn-list"
                        onClick={() => addToMyList(selectedMovie)}
                      >
                        + My List
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
