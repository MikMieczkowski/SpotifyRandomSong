import React, {useState, useEffect} from 'react';

function Spotify() {
  const [accessToken, setAccessToken] = useState(null);
  const [songData, setSongData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    document.title = "Random Song Picker";
    //from spotify API
    let authParameters = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      //Frontend .env variable was used because that was my interpretation of the instructions
      body: 'grant_type=client_credentials&client_id=' + process.env.REACT_APP_ID + '&client_secret=' + process.env.REACT_APP_SECRET_KEY
    }
    // Initial API call to get access token
    fetch('https://accounts.spotify.com/api/token', authParameters)
      .then(result => result.json())
      .then(data => setAccessToken(data.access_token));
  }, []);

  //Automatically searches again when the random query results in 0 matches
  useEffect(() => {
    if (hasSearched && !loading && songData == null) {
      search();
    }
  }, [loading]); // This runs whenever 'loading' changes

  async function search(event) {
    if (event) {
      //prevent normal submit event
      event.preventDefault();
    }
    setLoading(true);

    let query = generateRandomQuery();
    console.log('Searching for:', query);

    //from spotify API
    let searchParameters = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }
    }
    //song search query API call
    await fetch('https://api.spotify.com/v1/search?q=' + query + '&type=track', searchParameters)
      .then(response => response.json())
      .then(data => {
        //set song data to a random song(track) from the API call
        setSongData(data.tracks.items[Math.floor(Math.random() * data.tracks.items.length)])
      })
      .then(() => {
        setLoading(false);
        setHasSearched(true)
      })
  }

  function generateRandomQuery() {
    const length = Math.floor(Math.random() * 3) + 3; // Random length between 3 and 6
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    let result = '';

    for (let i = 0; i < length; i++) {
      let randomIndex = Math.floor(Math.random() * characters.length);
      //If it's a number, try again to make numbers less likely
      if (!isNaN(characters[randomIndex])) {
        randomIndex = Math.floor(Math.random() * characters.length);
      }
      result += characters[randomIndex];
    }
    return result;
  }

  function handleJokeButtonClick() {
    window.location.href = 'joke';
  }

  return (
    <div className="app">
      <h1>Spotify Random Song Picker</h1>
      {loading && (
        <h2>Loading...</h2>
      )}
      {hasSearched && (
        <h2>{songData?.name || 'No song found, trying again'}</h2>
      )}
      {songData && (<>
        <a href={songData?.external_urls?.spotify || ''} target="_blank" rel="noopener noreferrer">
          <img src={songData?.album?.images?.[0]?.url || ''}/>
          <h3>Spotify Link</h3>
        </a>
      </>)}
      <form onSubmit={search}>
        <button className="searchButton" type="submit">Search</button>
      </form>
      <button onClick={handleJokeButtonClick}>See a random joke</button>
    </div>
  );
}

export default Spotify;
