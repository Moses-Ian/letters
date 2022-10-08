
import React, { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import Auth from "./utils/auth";
import LandingPage from "./components/LandingPage";
import Header from "./components/Header";
import QuickMatch from "./components/QuickMatch";
import JoinGame from "./components/JoinGame";
import Feedback from "./components/Feedback";
import Room from "./components/Room";
import { L3ttersProvider } from "./utils/GlobalState";

//graphql
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: "/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");
  // console.log(Auth.decodeToken(token));
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// end graphql

const swipeConfig = {
  delta: 10, // min distance(px) before a swipe starts. *See Notes*
  preventScrollOnSwipe: true, // prevents scroll during swipe (*See Details*)
  trackTouch: true, // track touch input
  trackMouse: false, // track mouse input
  rotationAngle: 0, // set a rotation angle
  swipeDuration: Infinity, // allowable duration of a swipe (ms). *See Notes*
  touchEventOptions: { passive: true }, // options for touch listeners (*See Details*)
};

function App() {
  const [room, setRoom] = useState("");
  const [display, setDisplay] = useState("game");
  const [jwt, setJWT] = useState(null);

  // constants
  const loggedIn = Auth.loggedIn();

  // app-install stuff
  const isApp =
    document.referrer.startsWith("android-app://") ||
    window.matchMedia("(display-mode: standalone)").matches ||
    navigator.standalone;

  //ask the user if they want to install the app
  const showInstallPromotion = (event) => {
    const promptEvent = window.deferredPrompt;
    if (!promptEvent) return;
    //this baby does it all -> if they say yes, it downloads and opens the app
    promptEvent.prompt();
  };

  //listen for the before-install-prompt event
  const listenInstallPrompt = () => {
    window.addEventListener("beforeinstallprompt", (event) => {
      event.preventDefault();
      window.deferredPrompt = event;
    });
  };

  const swipeHandlers = useSwipeable({
    onSwiped: (eventData) => console.log("User Swiped!", eventData),
    onSwipedLeft: (eventData) =>
      setDisplay(display === "lobby" ? "game" : "chat"),
    onSwipedRight: (eventData) =>
      setDisplay(display === "chat" ? "game" : "lobby"),
    ...swipeConfig,
  });

  useEffect(() => {
    listenInstallPrompt();

    return () => {
      console.log("unrender");
    };
    // eslint-disable-next-line
  }, []);

  console.log("App.js rendered");

  return (
    <ApolloProvider client={client}>
      <L3ttersProvider
        value={{ room, setRoom, display, loggedIn, jwt, setJWT }}
      >
        <div className="App container pt-3 pl-3 pr-3 pb-0" {...swipeHandlers}>
          {!loggedIn && room === "" ? <LandingPage /> : <Header />}
          {room === "" ? (
            <>
							<QuickMatch />
              <JoinGame />
							<Feedback />
              {!isApp && (
                <div className="field has-text-centered">
                  <button
                    onClick={showInstallPromotion}
                    className="l3tters-btn mt-2 p-2"
                  >
                    Install the app!
                  </button>
                </div>
              )}
            </>
          ) : (
            <Room />
          )}
        </div>
      </L3ttersProvider>
    </ApolloProvider>
  );
}

export default App;
