import React from "react";
import "./App.css";
import Sidebar from "./Sidebar";
import "react-router-dom";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import Chat from "./Chat";
import PageNotFound from "./PageNotFound";
import Login from "./Login";
import { useStateValue } from "./StateProvider";

function App() {
  const { user } = useStateValue();

  return (
    <div className="app">
      {!user ? (
        <Login />
      ) : (
        <div className="app__body">
          <BrowserRouter>
            <Switch>
              <Route path="/rooms/:roomId">
                <Sidebar />
                <Chat />
              </Route>
              <Route path="/rooms">
                <Redirect to="/" />
              </Route>
              <Route path="/" exact>
                <Sidebar />
              </Route>
              <Route component={PageNotFound} />
            </Switch>
          </BrowserRouter>
        </div>
      )}
    </div>
  );
}

export default App;
