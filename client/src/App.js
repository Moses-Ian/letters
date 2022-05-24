import "./App.css";
import MainGame from "./components/MainGame";
import Room from "./components/Room";
import Header from "./components/Header";

function App() {
  return (
    <div className="App">
      <Header />

      {/* <MainGame room={room} /> */}
      <MainGame />
    </div>
  );
}

export default App;
