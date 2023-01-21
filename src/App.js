import React, { useState, useCallback } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const controller = new AbortController();
  const signal = controller.signal;

  const onClick = () => controller.abort();

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    let data = null;
    try {
      const response = await fetch("https://swapi.dev/api/films/");
      if (!response.ok) {
        throw new Error("Something went wrong! Retrying...");
      }

      data = await response.json();
    } catch (error) {
      setInterval(async () => {
        setError(error.message);
        const newResponse = await fetch("https://swapi.dev/api/films/", {
          signal,
        });
        data = await newResponse.json();
        return data;
      }, 5000);
    }
    setIsLoading(false);

    const transformedMovies = data.results.map((movieData) => {
      return {
        id: movieData.episode_id,
        title: movieData.title,
        openingText: movieData.opening_crawl,
        releaseDate: movieData.release_date,
      };
    });
    setMovies(transformedMovies);
  }, []);
  let content = <p>Found no movies.</p>;
  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (error) {
    content = <p>{error}</p>;
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
        <button onClick={onClick}>Cancel Request</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
