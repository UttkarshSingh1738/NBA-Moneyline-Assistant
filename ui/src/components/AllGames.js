// src/components/AllGames.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AllGames() {
  const [games, setGames] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const fetchGames = async (q = '') => {
    try {
      const token = sessionStorage.getItem('token');
      const url = q
        ? `/api/games?q=${encodeURIComponent(q)}`
        : '/api/games';
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGames(res.data);
    } catch (err) {
      console.error('Error fetching games:', err.response || err);
      alert('Failed to load games.');
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  return (
    <div className="container mt-5">
      <h2>All Games</h2>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by team name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button
          className="btn btn-outline-secondary"
          onClick={() => fetchGames(search)}
        >
          Search
        </button>
        <button
          className="btn btn-secondary ms-2"
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </button>
      </div>

      {/* scrollable container */}
      <div style={{ maxHeight: 400, overflowY: 'auto' }}>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Game ID</th>
              <th>Team 1</th>
              <th>Team 2</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {games.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center">No games found.</td>
              </tr>
            )}
            {games.map(g => (
              <tr key={g.gameId}>
                <td>{g.gameId}</td>
                <td>{g.team1.teamName}</td>
                <td>{g.team2.teamName}</td>
                <td>{new Date(g.gameDate).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => navigate(`/bets/place?gameId=${g.gameId}`)}
                  >
                    Bet
                  </button>
                  <button
                    className="btn btn-sm btn-warning ms-2"
                    onClick={() => navigate(`/simulate?gameId=${g.gameId}`)}
                  >
                    Simulate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        className="btn btn-info btn-lg me-2 mt-4"
        onClick={() => navigate('/advanced/upsets')}
    >
        View Upsets
    </button>
    <button
        className="btn btn-info btn-lg me-2 mt-4"
        onClick={() => navigate('/advanced/winRates')}
    >
        Team Win Rates
    </button>
    <button
        className="btn btn-info btn-lg me-2 mt-4"
        onClick={() => navigate('/advanced/underdogs')}
    >
        Underdog Wins
    </button>
    </div>
  );
}