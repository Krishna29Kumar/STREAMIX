import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_KEY = "2dca580c2a14b55200e784d157207b4d";
const BASE_URL = "https://api.themoviedb.org/3";

export const fetchMovies = createAsyncThunk(
  "movies/fetchMovies",
  async ({ page = 1, genre = "", sortBy = "popularity.desc", query = "" }) => {
    let url;
    if (query) {
      url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`;
    } else {
      url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&page=${page}&sort_by=${sortBy}${genre ? `&with_genres=${genre}` : ""}`;
    }
    const res = await axios.get(url);
    return { ...res.data, page };
  }
);

export const fetchGenres = createAsyncThunk("movies/fetchGenres", async () => {
  const res = await axios.get(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
  return res.data.genres;
});

export const fetchMovieDetails = createAsyncThunk("movies/fetchMovieDetails", async (id) => {
  const [details, credits, videos] = await Promise.all([
    axios.get(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`),
    axios.get(`${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}`),
    axios.get(`${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}`),
  ]);
  return {
    ...details.data,
    cast: credits.data.cast.slice(0, 8),
    trailer: videos.data.results.find((v) => v.type === "Trailer" && v.site === "YouTube"),
  };
});

const moviesSlice = createSlice({
  name: "movies",
  initialState: {
    list: [],
    genres: [],
    selectedMovie: null,
    status: "idle",
    detailStatus: "idle",
    totalPages: 1,
    currentPage: 1,
    searchQuery: "",
    selectedGenre: "",
    sortBy: "popularity.desc",
    watchlist: JSON.parse(localStorage.getItem("filmspace_watchlist") || "[]"),
  },
  reducers: {
    setSearchQuery: (state, action) => { state.searchQuery = action.payload; },
    setSelectedGenre: (state, action) => { state.selectedGenre = action.payload; },
    setSortBy: (state, action) => { state.sortBy = action.payload; },
    setCurrentPage: (state, action) => { state.currentPage = action.payload; },
    clearSelectedMovie: (state) => { state.selectedMovie = null; },
    toggleWatchlist: (state, action) => {
      const movie = action.payload;
      const idx = state.watchlist.findIndex((m) => m.id === movie.id);
      if (idx === -1) {
        state.watchlist.push(movie);
      } else {
        state.watchlist.splice(idx, 1);
      }
      localStorage.setItem("filmspace_watchlist", JSON.stringify(state.watchlist));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => { state.status = "loading"; })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload.results;
        state.totalPages = Math.min(action.payload.total_pages, 500);
        state.currentPage = action.payload.page;
      })
      .addCase(fetchMovies.rejected, (state) => { state.status = "failed"; })
      .addCase(fetchGenres.fulfilled, (state, action) => { state.genres = action.payload; })
      .addCase(fetchMovieDetails.pending, (state) => { state.detailStatus = "loading"; })
      .addCase(fetchMovieDetails.fulfilled, (state, action) => {
        state.detailStatus = "succeeded";
        state.selectedMovie = action.payload;
      });
  },
});

export const { setSearchQuery, setSelectedGenre, setSortBy, setCurrentPage, clearSelectedMovie, toggleWatchlist } = moviesSlice.actions;
export default moviesSlice.reducer;
