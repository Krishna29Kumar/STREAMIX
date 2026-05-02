import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovieDetails, toggleWatchlist } from "../../store/moviesSlice";

const IMG_BASE = "https://image.tmdb.org/t/p/w500";

const StarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
  </svg>
);

const PlusIcon = ({ added }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    {added ? (
      <polyline points="20,6 9,17 4,12"/>
    ) : (
      <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>
    )}
  </svg>
);

export default function MovieCard({ movie }) {
  const dispatch = useDispatch();
  const watchlist = useSelector((s) => s.movies.watchlist);
  const [imgLoaded, setImgLoaded] = useState(false);
  const inWatchlist = watchlist.some((m) => m.id === movie.id);

  const handleCardClick = () => dispatch(fetchMovieDetails(movie.id));
  const handleWatchlist = (e) => {
    e.stopPropagation();
    dispatch(toggleWatchlist(movie));
  };

  const year = movie.release_date?.split("-")[0];
  const rating = movie.vote_average?.toFixed(1);

  return (
    <div
      onClick={handleCardClick}
      className="group relative cursor-pointer card-hover rounded-xl overflow-hidden bg-dark-700 border border-white/5"
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] overflow-hidden">
        {!imgLoaded && <div className="absolute inset-0 shimmer" />}
        {movie.poster_path ? (
          <img
            src={`${IMG_BASE}${movie.poster_path}`}
            alt={movie.title}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setImgLoaded(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-dark-600 flex items-center justify-center">
            <span className="text-4xl">🎬</span>
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />

        {/* Play button on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="w-14 h-14 rounded-full bg-brand-500/90 flex items-center justify-center shadow-xl shadow-brand-500/50 hover:bg-brand-500 transform scale-75 group-hover:scale-100 transition-all duration-300">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white" className="ml-1">
              <polygon points="5,3 19,12 5,21"/>
            </svg>
          </div>
        </div>

        {/* Watchlist btn */}
        <button
          onClick={handleWatchlist}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg z-10 ${
            inWatchlist
              ? "bg-brand-500 text-white"
              : "bg-black/60 backdrop-blur text-gray-300 opacity-0 group-hover:opacity-100 hover:bg-brand-500 hover:text-white"
          }`}
          title={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
        >
          <PlusIcon added={inWatchlist} />
        </button>

        {/* Rating badge */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-black/70 backdrop-blur px-2 py-0.5 rounded-full">
          <span className="text-yellow-400"><StarIcon /></span>
          <span className="text-xs font-medium text-white">{rating}</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-medium text-sm text-white truncate leading-tight">{movie.title}</h3>
        <p className="text-xs text-gray-400 mt-0.5">{year}</p>
      </div>
    </div>
  );
}
