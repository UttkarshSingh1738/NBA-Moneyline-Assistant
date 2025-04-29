// src/components/ManageBets.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ManageBets() {
  const [picks, setPicks] = useState([]);
  const navigate = useNavigate();

  const fetchPicks = async () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      alert('No session – redirecting to login');
      return navigate('/', { replace: true });
    }
    try {
      const res = await axios.get('/api/picks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Picks response body:', res.data);
      setPicks(res.data);
    } catch (err) {
      console.error('fetchPicks error:', err.response?.status, err.response?.data);
      alert('Error loading your bets. See console.');

      if (err.response?.status === 401) {
        sessionStorage.removeItem('token');
        navigate('/', { replace: true });
      }
    }
  };

  useEffect(() => {
    fetchPicks();
  }, []);

  const handleEdit = async (pick) => {
    const newOutcome = prompt('New outcome:', pick.predictedOutcome);
    const newAmount = prompt('New bet amount:', pick.betAmount);
    if (newOutcome != null && newAmount != null) {
      try {
        await axios.post('/api/picks/update', {
          pickId: pick.pickId,
          predictedOutcome: newOutcome,
          betAmount: parseFloat(newAmount)
        }, {
          headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
        });
        fetchPicks();
      } catch (err) {
        console.error(err);
        alert('Update failed.');
      }
    }
  };

  const handleDelete = async (pickId) => {
    if (!window.confirm('Delete this bet?')) return;
    try {
      await axios.post('/api/picks/delete', { pickId }, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
      });
      fetchPicks();
    } catch (err) {
      console.error(err);
      alert('Delete failed.');
    }
  };

  return (
    <div className="container mt-5">
        <div className="mb-3" style={{ textAlign: 'left' }}>
        <button
            className="btn btn-sm btn-secondary"
            onClick={() => navigate('/bets/place')}
        >
            &larr; Back to Place Bet
        </button>
        </div>
      <h2>My Bets</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Pick ID</th>
            <th>Game ID</th>
            <th>Outcome</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {picks.map(pick => (
            <tr key={pick.pickId}>
              <td>{pick.pickId}</td>
              <td>{pick.game.gameId}</td>
              <td>{pick.predictedOutcome}</td>
              <td>${pick.betAmount.toFixed(2)}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleEdit(pick)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(pick.pickId)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-3">
        <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}