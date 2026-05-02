import { useDispatch, useSelector } from "react-redux";
import { setCurrentPage, fetchMovies } from "../../store/moviesSlice";

export default function Pagination() {
  const dispatch = useDispatch();
  const { currentPage, totalPages, selectedGenre, sortBy, searchQuery } = useSelector((s) => s.movies);

  if (totalPages <= 1) return null;

  const goTo = (page) => {
    if (page < 1 || page > totalPages) return;
    dispatch(setCurrentPage(page));
    dispatch(fetchMovies({ page, genre: selectedGenre, sortBy, query: searchQuery }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pages = () => {
    const arr = [];
    const delta = 2;
    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);
    arr.push(1);
    if (left > 2) arr.push("...");
    for (let i = left; i <= right; i++) arr.push(i);
    if (right < totalPages - 1) arr.push("...");
    if (totalPages > 1) arr.push(totalPages);
    return arr;
  };

  return (
    <div className="flex items-center justify-center gap-1.5 py-8">
      {/* Prev */}
      <button
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-dark-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15,18 9,12 15,6"/>
        </svg>
      </button>

      {pages().map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-gray-500 text-sm">…</span>
        ) : (
          <button
            key={p}
            onClick={() => goTo(p)}
            className={`w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200 ${
              p === currentPage
                ? "bg-brand-500 text-white shadow-lg shadow-brand-500/30"
                : "text-gray-400 hover:text-white hover:bg-dark-600"
            }`}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => goTo(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-dark-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9,18 15,12 9,6"/>
        </svg>
      </button>
    </div>
  );
}
