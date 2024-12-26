import { useState , React ,useEffect } from 'react'
import './App.css'
import { useCallback } from 'react';



function Movie({name,year,poster,type}){
     
  const img=[
  'src/assets/bookmark-white.png',
  'src/assets/bookmark.png',
  ];



  const [book,setBook] = useState(()=> isMarked(name));
  const [bImage,setBImage]=useState(()=>{
   return  img[isMarked(name)];
  });

  function addBookmark(name,year,type,poster){
    setBImage(img[1]);
    setBook(true);

    let collection =  JSON.parse(localStorage.getItem('collection')) || [];

    collection.push({
      name,
      year,
      type,
      poster
    })

    localStorage.setItem('collection',JSON.stringify(collection));
    console.log(collection);

  }
  function removeBookmark(name){
    setBImage(img[0]);
    setBook(false);

    let collection =  JSON.parse(localStorage.getItem('collection')) || [];
    let  match;

    collection.forEach((movie,index)=>{
      if(name === movie.name){
        match=index;
      }
    })

    collection.splice(match,1);
    localStorage.setItem('collection',JSON.stringify(collection));

    console.log(collection);

  }

  function isMarked(mov){
    let collection = JSON.parse(localStorage.getItem('collection')) || [];
    let f=0;
    collection.forEach(movie=>{
      if(movie.name === mov )
        f=1;
    })
    return (f===1)?1:0;
  }

  return (


    <div className="movie-container">
  <div className="movie-image" >
    <img src={poster} alt="Movie Image" />
  </div>  
  
  <div className="movie-details">
  
      <div className='bookmarks'>   
        <h2 className='movie-title'>{name}</h2>
       <img src={bImage} className='book-icon' 
       onClick={()=>{
        (book)?removeBookmark(name):addBookmark(name,year,poster,type);
       }}/>
    </div>
    
    
    <p>Release Date : {year}</p>
    <p>Genre/Type : {type}</p>
    <p>Description : A captivating movie about suspense and thrill , A gripping tale of suspense and mystery, this movie takes you on a thrilling journey where nothing is as it seems. The story follows a group of strangers who find themselves entangled in a web of secrets, betrayal, and danger. As they uncover hidden truths, they must confront their darkest fears. With unexpected twists and heart-pounding action, the film keeps you on the edge of your seat until the very end. A cinematic masterpiece that blends suspense with emotional depth, leaving a lasting impact.</p>
  </div>
</div>
  )
}


function App() {

  const [search,setSearch] = useState('');
  const [movieDetails,setMovieDetails] = useState(null);
  const [loading,setLoading] = useState(false);
  const [noResult,setNoResult] = useState(false);
  const [initial,setInitial]=useState(true);
  const [error,setError] = useState(false);


  const searchResult = useCallback(async()=>{
    
    if(search.trim() === '')
      setInitial(true);
  
      setLoading(true);
  
      try{
      const url=`http://www.omdbapi.com/?apikey=c7aa5a7e&s=${search}`
      const response = await fetch(url);
      const result = await response.json();
      setMovieDetails(result.Search);
  
      if(result.Response === 'True'){
        setLoading(false);
        setNoResult(false);
        setError(false);
      } else if(search !== ''){
        setNoResult(true);
        setLoading(false);
        setInitial(false);
      }
      }
      catch{
        setError(true);
      }finally{
        setLoading(false);
      }
  
  
  },[search])

  return (
    <>
    <div className='frame-container'>
    <div className='search-top'>
      <img src="./src/assets/movie-icon-removebg.png" className='icon' />
      <input type="text"
       placeholder='Type here to search'
       value={search}
       onKeyDown={e=> {
        e.target.value === 'Enter'
        searchResult();
       }}
       onChange={e => setSearch(e.target.value)}/>
      <img src="./src/assets/search-icon.png" className='icon search-icon' onClick={searchResult} />
      <span >About |</span>
      <span onClick={e=>window.location.href='https://mail.google.com/mail/u/0/#inbox?compose=CllgCJTNqGCPmWDqdCFkjWTttqGSmdnPtLpcmwQRFgKFVvxVxWFvgbHZjkBlbPHKkHbZNwMfkkg'}> Contact |</span>
      <span onClick={e=>{window.location.href='https://github.com/suhail-z'}}> github</span>
      <br/>
    </div>
        { initial && !loading &&
          <div className='defaults'>
          <img className='icon' src="./src/assets/popcorn.png"  />
          <h2>Search for a Movie / Series </h2>
          </div>
        }
        {
          loading && (
            <div className='defaults'>
              <p>Loading ...</p>
            </div>
            
          )
        }
        {
          noResult  && !loading &&  !initial && (
            <div className='defaults'>
              <img src="./src/assets/no-match.png" className='icon' />
            <h2> sorry couldn't find any result for ' {search} ' , try using other keywords </h2>
            </div>

          )
        }
      
        {
          
           movieDetails && !noResult && !loading && !error && (movieDetails.map((movie,index)=>(

          <Movie key={index} name={movie.Title.toUpperCase()} year={movie.Year} poster={movie.Poster} type={movie.Type}/> )
        ))}
        <div className='defaults'>
        <h5>Designed by Suhail</h5>
        </div>


    </div>
    
    </>
  )
}

export default App
