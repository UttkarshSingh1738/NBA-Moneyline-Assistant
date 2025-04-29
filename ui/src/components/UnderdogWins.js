// src/components/UnderdogWins.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function UnderdogWins() {
  const [games, setGames] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    axios.get('/api/advanced/underdogs', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setGames(res.data))
    .catch(err => {
      console.error('Error loading underdog wins:', err);
      alert('Failed to load underdog wins.');
    });
  }, []);

  return (
    <div className="container mt-5">
        <div className="mt-4 text-start">
            <button
                className="btn btn-secondary"
                onClick={() => navigate('/games')}
            >
                Back to All Games
            </button>
        </div>
      <h2>Underdog Wins (by Spread)</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Game ID</th>
            <th>Team 1</th>
            <th>Team 2</th>
            <th>Winner</th>
          </tr>
        </thead>
        <tbody>
          {games.map((g,i) => (
            <tr key={i}>
              <td>{g.game_id}</td>
              <td>{g.team1}</td>
              <td>{g.team2}</td>
              <td>{g.winner}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}