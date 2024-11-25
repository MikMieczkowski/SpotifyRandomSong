import React, {useEffect, useState} from "react";

function Joke() {

  const [joke, setJoke] = useState(null);
  const [jokeNumber, setJokeNumber] = useState(0);
  const [isPunchline, setIsPunchline] = useState(false); // Tracks whether we're showing the punchline

  //Initial Joke API call
  useEffect(() => {
    fetch('https://api.sampleapis.com/jokes/goodJokes')
      .then(result => result.json())
      .then(data => setJoke(data))
  }, []);

  //Set random joke number initially after joke is changed
  useEffect(() => {
    setJokeNumber(Math.floor(Math.random() * 387));
  }, [joke]);

  function handleJokeButtonClick() {
    setIsPunchline(true);
  }

  function handleNextButtonClick() {
    setIsPunchline(false);
    setJokeNumber(Math.floor(Math.random() * 387));
  }

  function handleSpotifyButtonClick() {
    window.location.href = '/';
  }

  return (
    <div className="joke">
      <button className="jokeButton"
              onClick={handleJokeButtonClick}>{isPunchline ? joke?.[jokeNumber]?.punchline : joke?.[jokeNumber]?.setup}</button>
      <button className="jokeButton2" onClick={handleNextButtonClick}>Another Joke</button>
      <button className="jokeButton2" onClick={handleSpotifyButtonClick}>Spotify Random Song Picker</button>
    </div>
  )
}

export default Joke;