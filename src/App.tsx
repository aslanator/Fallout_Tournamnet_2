import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
//Импорт необходим для работы firebase
import firebase from "firebase/app";
import logo from './logo.svg';
import './App.css';
import { MainScreen } from './screens/main/MainScreen';
import { TournamentsScreen } from './screens/tournament/TournamentsScreen';
import { PlayerScreen } from './screens/players/PlayerScreen';
import 'antd/dist/antd.css';
import { PlayersScreen } from './screens/players/PlayersScreen';
import { TournamentScreen } from './screens/tournament/TournamentScreen';



function App() {
  return (
    <div className="App">
      <Router>
       <Switch>
          <Route path="/tournaments/:slug">
            <TournamentScreen />
          </Route>
          <Route path="/tournaments">
            <TournamentsScreen />
          </Route>
          <Route path="/players/:slug">
            <PlayerScreen />
          </Route>
          <Route path="/players">
            <PlayersScreen />
          </Route>
          <Route path="/">
            <MainScreen/>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
