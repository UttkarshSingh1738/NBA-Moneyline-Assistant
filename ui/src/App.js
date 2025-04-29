import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import UpsetTeams from './components/UpsetTeams';
import PlaceBet from './components/PlaceBet';
import SimulateBet from './components/SimulateBet';
import ManageBets from './components/ManageBets';
import AllGames from './components/AllGames';
import ProtectedRoute from './components/ProtectedRoute';
import TeamWinRates from './components/TeamWinRates';
import UnderdogWins  from './components/UnderdogWins';

function App() {
    return (
      <Router>
        <div className="App">
          <Routes>
            <Route exact path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* protected */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
            <Route path="/games" element={<ProtectedRoute><AllGames/></ProtectedRoute>} />
            <Route
                path="/advanced/upsets"
                element={
                    <ProtectedRoute>
                        <UpsetTeams />
                    </ProtectedRoute>
                }
            />
            <Route path="/advanced/winRates"   element={<TeamWinRates />} />
            <Route path="/advanced/underdogs"  element={<UnderdogWins  />} />
            <Route
                path="/bets/place"
                element={
                    <ProtectedRoute>
                        <PlaceBet />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/simulate"
                element={
                    <ProtectedRoute>
                        <SimulateBet />
                    </ProtectedRoute>
                }
            />
            <Route path="/picks" element={<ProtectedRoute><ManageBets /></ProtectedRoute>} />
          </Routes>
          <div className="site-footer bg-light text-center py-2">
            &copy; 2024 NBA Moneyline Assistant | All rights reserved
          </div>
        </div>
      </Router>
    );
}

export default App;
