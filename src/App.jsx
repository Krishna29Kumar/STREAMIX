import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar/Navbar";

const Home = lazy(() => import("./pages/Home"));
const Browse = lazy(() => import("./pages/Browse"));
const Watchlist = lazy(() => import("./pages/Watchlist"));

function PageLoader() {
  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <div className="w-12 h-12 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-dark-900 dark:bg-dark-900 transition-colors duration-300">
            <Navbar />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/browse" element={<Browse />} />
                <Route path="/watchlist" element={<Watchlist />} />
              </Routes>
            </Suspense>
            <footer className="border-t border-white/5 py-8 mt-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p className="font-display text-xl tracking-widest text-brand-400 mb-1">STREAMIX</p>
                <p className="text-xs text-gray-600">Powered by TMDB API · Built with React + Redux + Tailwind</p>
              </div>
            </footer>
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}
