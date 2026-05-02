import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearSelectedMovie, toggleWatchlist } from "../../store/moviesSlice";

const IMG_BASE = "https://image.tmdb.org/t/p/w780";
const AVATAR_BASE = "https://image.tmdb.org/t/p/w185";

export default function MovieModal() {
  const dispatch = useDispatch();
  const { selectedMovie: movie, detailStatus, watchlist } = useSelector((s) => s.movies);
  const inWatchlist = movie && watchlist.some((m) => m.id === movie.id);

  useEffect(() => {
    if (movie) {
      document.body.style.overflow = "hidden";
    }
    return () => { document.body.style.overflow = ""; };
  }, [movie]);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") dispatch(clearSelectedMovie()); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [dispatch]);

  if (!movie && detailStatus !== "loading") return null;

  const close = () => dispatch(clearSelectedMovie());

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={close}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fadeIn" />

      {/* Modal */}
      <div
        className="relative w-full max-w-3xl max-h-[90vh] bg-dark-800 sm:rounded-2xl overflow-hidden shadow-2xl animate-slideUp border border-white/5 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {detailStatus === "loading" ? (
          <div className="h-64 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
          </div>
        ) : movie ? (
          <>
            {/* Backdrop Image */}
            <div className="relative h-56 sm:h-72 shrink-0 overflow-hidden">
              {movie.backdrop_path ? (
                <img
                  src={`${IMG_BASE}${movie.backdrop_path}`}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-dark-700" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-dark-800 via-dark-800/40 to-transparent" />

              {/* Close btn */}
              <button
                onClick={close}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 backdrop-blur flex items-center justify-center text-gray-300 hover:text-white hover:bg-black/80 transition-all"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>

              {/* Title overlay */}
              <div className="absolute bottom-4 left-6 right-6">
                <h2 className="font-display text-3xl sm:text-4xl text-white tracking-wide leading-none">{movie.title}</h2>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <span className="text-xs text-gray-300">{movie.release_date?.split("-")[0]}</span>
                  <span className="text-gray-600">•</span>
                  <span className="text-xs text-gray-300">{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
                  <span className="text-gray-600">•</span>
                  <span className="flex items-center gap-1 text-xs text-yellow-400 font-medium">
                    ★ {movie.vote_average?.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto flex-1 p-6 space-y-5">
              {/* Genres */}
              <div className="flex flex-wrap gap-2">
                {movie.genres?.map((g) => (
                  <span key={g.id} className="text-xs px-3 py-1 rounded-full bg-brand-500/20 text-brand-400 border border-brand-500/30">
                    {g.name}
                  </span>
                ))}
              </div>

              {/* Overview */}
              <p className="text-gray-300 text-sm leading-relaxed">{movie.overview}</p>

              {/* Trailer */}
              {movie.trailer && (
                <a
                  href={`https://www.youtube.com/watch?v=${movie.trailer.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-5 py-2 rounded-full transition-all"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21"/></svg>
                  Watch Trailer
                </a>
              )}

              {/* Cast */}
              {movie.cast?.length > 0 && (
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-widest mb-3">Cast</h4>
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                    {movie.cast.map((c) => (
                      <div key={c.id} className="shrink-0 text-center w-16">
                        <div className="w-14 h-14 rounded-full overflow-hidden bg-dark-600 mx-auto mb-1">
                          {c.profile_path ? (
                            <img src={`${AVATAR_BASE}${c.profile_path}`} alt={c.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-lg">👤</div>
                          )}
                        </div>
                        <p className="text-xs text-gray-300 truncate leading-tight">{c.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action */}
              <button
                onClick={() => dispatch(toggleWatchlist(movie))}
                className={`w-full py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  inWatchlist
                    ? "bg-brand-500/20 border border-brand-500/40 text-brand-400 hover:bg-red-500/20 hover:border-red-500/40 hover:text-red-400"
                    : "bg-brand-500 hover:bg-brand-600 text-white"
                }`}
              >
                {inWatchlist ? "✓ In Your Watchlist (Remove)" : "+ Add to Watchlist"}
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
