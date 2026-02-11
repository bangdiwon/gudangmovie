// src/MovieCard.jsx
import React from "react";

// Kita tambah "onClick" di sini
const MovieCard = ({ movie, onClick }) => {
  return (
    // Saat kartu diklik, jalankan fungsi onClick
    <div className="movie-card" onClick={() => onClick(movie.imdbID)}>
      <div>
        <p>{movie.Year}</p>
      </div>
      <div>
        <img
          src={
            movie.Poster !== "N/A"
              ? movie.Poster
              : "https://via.placeholder.com/400"
          }
          alt={movie.Title}
        />
      </div>
      <div>
        <span>{movie.Type}</span>
        <h3>{movie.Title}</h3>
      </div>
    </div>
  );
};

export default MovieCard;
