// src/components/TeamWinRates.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function TeamWinRates() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    axios.get('/api/advanced/winRates', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setData(res.data))
    .catch(err => {
      console.error('Error loading win rates:', err);
      alert('Failed to load win rates.');
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
      <h2>Team Win Rates & Avg Moneyline</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Team</th>
            <th>Total Games</th>
            <th>Total Wins</th>
            <th>Win %</th>
            <th>Avg Moneyline</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r,i) => (
            <tr key={i}>
              <td>{r.team_name}</td>
              <td>{r.total_games}</td>
              <td>{r.total_wins}</td>
              <td>{r.actual_win_percentage}%</td>
              <td>{r.avg_moneyline}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
