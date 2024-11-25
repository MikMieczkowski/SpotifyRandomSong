import Spotify from "./Spotify";
import Joke from "./Joke";
function App() {
  let Component
  if (window.location.pathname === "/joke") {
    Component = Joke;
  } else {
    Component = Spotify;
  }
  return <Component/>;
}

export default App;
