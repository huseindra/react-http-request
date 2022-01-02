import React, { useCallback, useEffect, useState } from 'react';

import MoviesList from './components/MoviesList';
import './App.css';
import AddMovie from './components/AddMovie';

function App() {
  const [movies, setMovies] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchMovieHandler = useCallback(async () => {
    try{
      setIsLoading(true)
      setError(null)
 
      const response = await fetch('https://react-movies-5077d-default-rtdb.asia-southeast1.firebasedatabase.app/movies.json')
       if(!response.ok){
         throw new Error ('Something went wrong!')
       }
      const data = await response.json()
      
      const loadedMovies =[]
      
      for(const key in data){
       loadedMovies.push({
         id: key,
         title: data[key].title,
         openingText: data[key].openingText,
         releaseDate:data[key].releaseDate
       })
      }
      setMovies(loadedMovies)
      // const transformedMovie = data.results.map((itemMovie) => {
      //    return{
      //      id: itemMovie.episode_id,
      //      title: itemMovie.title,
      //      openingText: itemMovie.opening_crawl,
      //      releaseDate: itemMovie.release_date
      //    }
      //  })
       
    }catch(error){
      setError(error.message)
    }
    setIsLoading(false)
  }, [])

  useEffect(() =>{
    fetchMovieHandler()
  },[fetchMovieHandler])


  async function addMovieHandler(movie) {
    try {
      const response = await fetch('https://react-movies-5077d-default-rtdb.asia-southeast1.firebasedatabase.app/movies.json', {
      method: 'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(movie),
      })
      const data = await response.json()
      
      console.log(data)
    } catch (error) {
      setError(error.message)
    }
  }

  let content = <p>Films not found</p>

  if(movies.length>0){
    content = <MoviesList movies={movies} />  
  }
  if(error){
    content = <p>{error}</p>
  }
  if(isLoading){
    content = <p>Loading ...</p>
  }


  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler}/>
      </section>
      <section>
        <button onClick={fetchMovieHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
