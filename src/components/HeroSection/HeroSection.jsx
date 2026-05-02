import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchMovieDetails } from "../../store/moviesSlice";
import axios from "axios";

const API_KEY = "2dca580c2a14b55200e784d157207b4d";
const BACKDROP = "https://image.tmdb.org/t/p/original";

export default function HeroSection() {
  const dispatch = useDispatch();
  const [hero, setHero] = useState(null);
  const [idx, setIdx] = useState(0);
  const [heroes, setHeroes] = useState([]);

  useEffect(() => {
    axios.get(`https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&page=1`)
      .then((r) => {
        const filtered = r.data.results.filter((m) => m.backdrop_path);
        setHeroes(filtered.slice(0, 5));
        setHero(filtered[0]);
      });
  }, []);

  useEffect(() => {
    if (!heroes.length) return;
    const t = setInterval(() => {
      setIdx((i) => {
        const next = (i + 1) % heroes.length;
        setHero(heroes[next]);
        return next;
      });
    }, 7000);
    return () => clearInterval(t);
  }, [heroes]);

  if (!hero) return (
    <div className="h-[70vh] bg-dark-900 flex items-center justify-center">
      <div className="w-12 h-12 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
    </div>
  );

  return (
    <section className="relative h-[80vh] min-h-[500px] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          key={hero.id}
          src={`${BACKDROP}${hero.backdrop_path}`}
          alt={hero.title}
          className="w-full h-full object-cover animate-fadeIn"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-900 via-dark-900/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-dark-900/30" />
      </div>

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16">
        <div className="max-w-xl animate-slideUp" key={hero.id + "content"}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-400 border border-brand-500/30 uppercase tracking-widest">
              Now Playing
            </span>
            <span className="flex items-center gap-1 text-yellow-400 text-sm font-medium">
              ★ {hero.vote_average?.toFixed(1)}
            </span>
          </div>

          <h1 className="font-display text-5xl sm:text-7xl text-white leading-none tracking-wide mb-4">
            {hero.title}
          </h1>

          <p className="text-gray-300 text-sm sm:text-base leading-relaxed line-clamp-3 mb-6">
            {hero.overview}
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => dispatch(fetchMovieDetails(hero.id))}
              className="btn-primary flex items-center gap-2"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21"/></svg>
              View Details
            </button>
            <button className="btn-outline">+ Watchlist</button>
          </div>
        </div>

        {/* Dots */}
        <div className="flex gap-1.5 mt-6">
          {heroes.map((_, i) => (
            <button
              key={i}
              onClick={() => { setIdx(i); setHero(heroes[i]); }}
              className={`h-1 rounded-full transition-all duration-300 ${i === idx ? "w-8 bg-brand-400" : "w-2 bg-white/30"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
