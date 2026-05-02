import { useState, useCallback, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSearchQuery, setSelectedGenre, setSortBy, setCurrentPage, fetchMovies } from "../../store/moviesSlice";

const SORT_OPTIONS = [
  { value: "popularity.desc", label: "Most Popular" },
  { value: "vote_average.desc", label: "Top Rated" },
  { value: "release_date.desc", label: "Newest First" },
  { value: "release_date.asc", label: "Oldest First" },
  { value: "revenue.desc", label: "Highest Grossing" },
];

function useDebounce(fn, delay) {
  const timer = useRef(null);
  return useCallback((...args) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => fn(...args), delay);
  }, [fn, delay]);
}

export default function SearchFilterSort() {
  const dispatch = useDispatch();
  const { genres, selectedGenre, sortBy, searchQuery } = useSelector((s) => s.movies);
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const doSearch = useCallback((q, genre, sort) => {
    dispatch(setSearchQuery(q));
    dispatch(setCurrentPage(1));
    dispatch(fetchMovies({ page: 1, genre, sortBy: sort, query: q }));
  }, [dispatch]);

  const debouncedSearch = useDebounce(doSearch, 500);

  const handleQueryChange = (e) => {
    setLocalQuery(e.target.value);
    debouncedSearch(e.target.value, selectedGenre, sortBy);
  };

  const handleGenreChange = (genreId) => {
    const next = selectedGenre === String(genreId) ? "" : String(genreId);
    dispatch(setSelectedGenre(next));
    dispatch(setCurrentPage(1));
    dispatch(fetchMovies({ page: 1, genre: next, sortBy, query: localQuery }));
  };

  const handleSortChange = (e) => {
    const val = e.target.value;
    dispatch(setSortBy(val));
    dispatch(setCurrentPage(1));
    dispatch(fetchMovies({ page: 1, genre: selectedGenre, sortBy: val, query: localQuery }));
  };

  const clearSearch = () => {
    setLocalQuery("");
    doSearch("", selectedGenre, sortBy);
  };

  return (
    <div className="space-y-4">
      {/* Search + Sort row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            value={localQuery}
            onChange={handleQueryChange}
            placeholder="Search movies, genres, keywords..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-dark-700 dark:bg-dark-700 bg-gray-100 border border-white/10 dark:border-white/10 border-gray-200 text-white dark:text-white text-gray-900 placeholder-gray-500 text-sm focus:outline-none focus:border-brand-400 transition-colors"
          />
          {localQuery && (
            <button onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={handleSortChange}
          className="px-4 py-2.5 rounded-xl bg-dark-700 dark:bg-dark-700 bg-gray-100 border border-white/10 dark:border-white/10 border-gray-200 text-white dark:text-white text-gray-900 text-sm focus:outline-none focus:border-brand-400 transition-colors cursor-pointer appearance-none pr-8 min-w-[160px]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpolyline points='6,9 12,15 18,9'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value} className="bg-dark-700 text-white">{o.label}</option>
          ))}
        </select>
      </div>

      {/* Genre pills */}
      {genres.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleGenreChange("")}
            className={`genre-pill ${!selectedGenre ? "active" : ""}`}
          >
            All
          </button>
          {genres.slice(0, 14).map((g) => (
            <button
              key={g.id}
              onClick={() => handleGenreChange(g.id)}
              className={`genre-pill ${selectedGenre === String(g.id) ? "active" : ""}`}
            >
              {g.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
