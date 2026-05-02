import { useSelector } from "react-redux";
import MovieCard from "../components/MovieCard/MovieCard";
import MovieModal from "../components/Modal/MovieModal";
import { Link } from "react-router-dom";

export default function Watchlist() {
  const watchlist = useSelector((s) => s.movies.watchlist);

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-display text-4xl text-white tracking-wide">My Watchlist</h1>
          <p className="text-gray-400 text-sm mt-1">{watchlist.length} {watchlist.length === 1 ? "film" : "films"} saved</p>
        </div>

        {watchlist.length === 0 ? (
          <div className="text-center py-32 animate-fadeIn">
            <div className="text-7xl mb-6">🎬</div>
            <h2 className="text-xl font-medium text-white mb-2">Your watchlist is empty</h2>
            <p className="text-gray-400 text-sm mb-8">Click the + icon on any movie to save it here</p>
            <Link to="/" className="btn-primary inline-block">Browse Films</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-fadeIn">
            {watchlist.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
      <MovieModal />
    </div>
  );
}
