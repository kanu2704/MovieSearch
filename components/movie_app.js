import React, { useEffect, useState } from 'react';
import './movie_app.css';
import { FaSearch } from "react-icons/fa";
import axios from 'axios';

export default function MovieApp() {
    const [movies, setMovies] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('release_date.desc');
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [expandedMovieId, setExpandedMovieId] = useState(null);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await axios.get(
                    'https://api.themoviedb.org/3/genre/movie/list',
                    {
                        params: {
                            api_key: 'fb797cc9edb9c1482aae22ff90bb7352',
                            language: 'en-US',
                        },
                    }
                );
                setGenres(response.data.genres);
            } catch (error) {
                console.error('Error fetching genres:', error);
            }
        };

        fetchGenres();
    }, []);

    // Fetch movies (discover)
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await axios.get(
                    'https://api.themoviedb.org/3/discover/movie',
                    {
                        params: {
                            api_key: 'fb797cc9edb9c1482aae22ff90bb7352',
                            sort_by: sortBy,
                            page: 1,
                            with_genres: selectedGenre || undefined, // Avoid sending empty string
                            language: 'en-US',
                        },
                    }
                );
                setMovies(response.data.results);
            } catch (error) {
                console.error('Error fetching movies:', error);
            }
        };

        fetchMovies();
    }, [sortBy, selectedGenre]);

    // Handle search input change
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    // Handle search submission
    const handleSearchSubmit = async () => {
        if (!searchQuery.trim()) return; // Avoid empty searches
        try {
            const response = await axios.get(
                'https://api.themoviedb.org/3/search/movie',
                {
                    params: {
                        api_key: 'fb797cc9edb9c1482aae22ff90bb7352',
                        query: searchQuery,
                        language: 'en-US',
                    },
                }
            );
            setMovies(response.data.results);
        } catch (error) {
            console.error('Error searching movies:', error);
        }
    };

    // Handle sort-by change
    const handleSortChange = (event) => {
        setSortBy(event.target.value);
    };

    // Handle genre change
    const handleGenreChange = (event) => {
        setSelectedGenre(event.target.value);
    };

    // Toggle movie description
    const toggleDescription = (movieId) => {
        setExpandedMovieId(expandedMovieId === movieId ? null : movieId);
    };

    return (
        <div>
            <h1>Movie Searcher</h1>

            {/* Search Bar */}
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search Movies..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="search-input"
                />
                <button onClick={handleSearchSubmit} className="search-button">
                    <FaSearch />
                </button>
            </div>

            {/* Filters */}
            <div className="filters">
                <label htmlFor="sort-by">Sort By</label>
                <select id="sort-by" value={sortBy} onChange={handleSortChange}>
                    <option value="popularity.desc">Popularity Descending</option>
                    <option value="popularity.asc">Popularity Ascending</option>
                    <option value="release_date.desc">Latest Releases</option>
                    <option value="vote_average.desc">Higher Rated</option>
                    <option value="vote_average.asc">Lower Rated</option>
                </select>

                <label htmlFor="genre">Genre</label>
                <select id="genre" value={selectedGenre} onChange={handleGenreChange}>
                    <option value="">All Genres</option>
                    {genres.map((genre) => (
                        <option key={genre.id} value={genre.id}>
                            {genre.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Movie List */}
            <div className="movie-wrapper">
                {movies.length > 0 ? (
                    movies.map((movie) => (
                        <div key={movie.id} className="movie">
                            <img
                                src={
                                    movie.poster_path
                                        ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                                        : 'https://via.placeholder.com/500x750?text=No+Image'
                                }
                                alt={movie.title}
                            />
                            <h2>{movie.title}</h2>
                            <p className="rating">Rating: {movie.vote_average || 'N/A'}</p>
                            {expandedMovieId === movie.id ? (
                                <p>{movie.overview || 'No description available.'}</p>
                            ) : (
                                <p>{movie.overview?.substring(0, 150) || 'No description available.'}...</p>
                            )}
                            <button className='read-more' onClick={() => toggleDescription(movie.id)}>
                                {expandedMovieId === movie.id ? 'Show Less' : 'Show More'}
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No movies found.</p>
                )}
            </div>
        </div>
    );
}
