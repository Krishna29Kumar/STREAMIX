import { lazy, Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovies, fetchGenres } from "../store/moviesSlice";
import HeroSection from "../components/HeroSection/HeroSection";
import MovieCard from "../components/MovieCard/MovieCard";
import SkeletonGrid from "../components/Loader/SkeletonGrid";
import Pagination from "../components/Pagination/Pagination";
import SearchFilterSort from "../components/SearchBar/SearchFilterSort";
import MovieModal from "../components/Modal/MovieModal";

export default function Home() {
  const dispatch = useDispatch();
  const { list, status, genres } = useSelector((s) => s.movies);

  useEffect(() => {
    dispatch(fetchMovies({ page: 1 }));
    if (!genres.length) dispatch(fetchGenres());
  }, [dispatch]);

  return (
    <div className="min-h-screen">
      <HeroSection />

      {/* Browse section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-3xl text-white tracking-wide">Browse Films</h2>
        </div>

        <div className="mb-8">
          <SearchFilterSort />
        </div>

        {status === "loading" ? (
          <SkeletonGrid />
        ) : status === "failed" ? (
          <div className="text-center py-24 text-gray-500">
            <p className="text-5xl mb-4">😔</p>
            <p className="font-medium">Failed to load movies. Check your connection.</p>
          </div>
        ) : list.length === 0 ? (
          <div className="text-center py-24 text-gray-500">
            <p className="text-5xl mb-4">🎬</p>
            <p className="font-medium">No movies found. Try a different search.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {list.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
            <Pagination />
          </>
        )}
      </section>

      <MovieModal />
    </div>
  );
}
