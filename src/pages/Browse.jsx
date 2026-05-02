import { useEffect, useRef, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovies, fetchGenres, setCurrentPage } from "../store/moviesSlice";
import MovieCard from "../components/MovieCard/MovieCard";
import SkeletonGrid from "../components/Loader/SkeletonGrid";
import SearchFilterSort from "../components/SearchBar/SearchFilterSort";
import MovieModal from "../components/Modal/MovieModal";

export default function Browse() {
  const dispatch = useDispatch();
  const { list, status, genres, currentPage, totalPages, selectedGenre, sortBy, searchQuery } = useSelector((s) => s.movies);
  const [allMovies, setAllMovies] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const loaderRef = useRef(null);

  useEffect(() => {
    setAllMovies([]);
    dispatch(setCurrentPage(1));
    dispatch(fetchMovies({ page: 1, genre: selectedGenre, sortBy, query: searchQuery }));
    if (!genres.length) dispatch(fetchGenres());
  }, []);

  useEffect(() => {
    if (status === "succeeded") {
      if (currentPage === 1) {
        setAllMovies(list);
      } else {
        setAllMovies((prev) => {
          const existing = new Set(prev.map((m) => m.id));
          const fresh = list.filter((m) => !existing.has(m.id));
          return [...prev, ...fresh];
        });
      }
      setLoadingMore(false);
    }
  }, [list, status, currentPage]);

  const loadMore = useCallback(() => {
    if (loadingMore || currentPage >= totalPages || status === "loading") return;
    setLoadingMore(true);
    const next = currentPage + 1;
    dispatch(setCurrentPage(next));
    dispatch(fetchMovies({ page: next, genre: selectedGenre, sortBy, query: searchQuery }));
  }, [loadingMore, currentPage, totalPages, status, dispatch, selectedGenre, sortBy, searchQuery]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) loadMore(); },
      { rootMargin: "200px" }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-2">
          <h1 className="font-display text-4xl text-white tracking-wide">Discover</h1>
          <p className="text-gray-400 text-sm mt-1">Infinite scroll — just keep going</p>
        </div>

        <div className="my-6">
          <SearchFilterSort />
        </div>

        {status === "loading" && currentPage === 1 ? (
          <SkeletonGrid />
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {allMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>

            {/* Infinite scroll trigger */}
            <div ref={loaderRef} className="py-8">
              {loadingMore && (
                <div className="flex justify-center">
                  <div className="w-8 h-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
                </div>
              )}
              {currentPage >= totalPages && allMovies.length > 0 && (
                <p className="text-center text-gray-600 text-sm">You've reached the end 🎬</p>
              )}
            </div>
          </>
        )}
      </div>
      <MovieModal />
    </div>
  );
}
