// src/components/PlaceBet.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

function PlaceBet() {
  const [odds, setOdds] = useState(null);
  const [userId, setUserId] = useState("");
  const [games, setGames] = useState([]);
  const [gameId, setGameId] = useState("");
  const [predictedOutcome, setPredictedOutcome] = useState("");
  const [betAmount, setBetAmount] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // pull ?gameId= from URL
  const initialGameId = new URLSearchParams(location.search).get('gameId');

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate('/', { replace: true });
      return;
    }

    // 1) fetch current user
    axios.get('/api/users/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setUserId(res.data.userId))
    .catch(() => {
      alert('Session expired');
      sessionStorage.removeItem('token');
      navigate('/', { replace: true });
    });

    // 2) fetch games list (for dropdown if needed)
    axios.get('/api/games', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setGames(res.data))
    .catch(err => console.error('Error loading games', err));
  }, [navigate]);

  // prefill gameId from URL, if present
  useEffect(() => {
    if (initialGameId) {
      setGameId(initialGameId);
    }
  }, [initialGameId]);

// whenever the gameId changes, fetch its odds
useEffect(() => {
    if (!gameId) {
      setOdds(null);
      return;
    }
    const token = sessionStorage.getItem('token');
    axios.get(`/api/games/${gameId}/odds`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setOdds(res.data.length ? res.data[0] : null);
    })
    .catch(err => {
      console.error('Error loading odds', err.response || err);
      setOdds(null);
    });
  }, [gameId]);


  const outcomeOptions = odds ? [
    // moneyline
    `${odds.team1Name} ${odds.team1Moneyline>0?'+':''}${odds.team1Moneyline}`,
    `${odds.team2Name} ${odds.team2Moneyline>0?'+':''}${odds.team2Moneyline}`,
    // spread
    `${odds.team1Name} ${odds.team1Spread>0?'+':''}${odds.team1Spread}`,
    `${odds.team2Name} ${odds.team2Spread>0?'+':''}${odds.team2Spread}`,
    // totals
    `O ${odds.team1Total}`,
    `U ${odds.team2Total}`
  ] : [];

  const handleSubmit = async e => {
    e.preventDefault();
    if (betAmount <= 0) {
        setMessage("❌ Bet amount must be greater than zero.");
        return;
      }
    if (!outcomeOptions.includes(predictedOutcome)) {
        setMessage("❌ Invalid predicted outcome.");
        return;
      }
      
    try {
      const token = sessionStorage.getItem('token');
      await axios.post('/api/bets/place', {
        user_id: parseInt(userId),
        game_id: parseInt(gameId),
        predicted_outcome: predictedOutcome,
        bet_amount: parseFloat(betAmount)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage("Bet placed successfully!");
      setPredictedOutcome("");
      setBetAmount("");
      if (!initialGameId) setGameId("");
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data || "Error placing bet.");
    }
  };

return (
    <div className="container mt-5">
        <h2>Place a Bet</h2>

    {/* display the odds card only once we have it */}
    {odds && (
        <div className="card mb-4">
            <div className="card-header">
                <strong>Odds for Game {gameId}</strong>
            </div>
            <div className="card-body">
                <p>
                    <strong>Moneyline:</strong><br />
                    {odds.team1Name}: {odds.team1Moneyline}<br />
                    {odds.team2Name}: {odds.team2Moneyline}
                </p>
                <p>
                    <strong>Spread:</strong><br />
                    {odds.team1Name}: {odds.team1Spread}<br />
                    {odds.team2Name}: {odds.team2Spread}
                </p>
                <p>
                    <strong>Totals:</strong><br />
                    {odds.team1Total} / {odds.team2Total}
                </p>
            </div>
        </div>
    )}

<form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>User ID</label>
          <input className="form-control" value={userId} disabled/>
        </div>

        <div className="mb-3">
          <label>Game</label>
          {initialGameId
            ? <input className="form-control" value={gameId} disabled/>
            : <select
                className="form-control"
                value={gameId}
                onChange={e=>setGameId(e.target.value)}
                required
              >
                <option value="">— Select a game —</option>
                {games.map(g=>(
                  <option key={g.gameId} value={g.gameId}>
                    {g.team1.teamName} @ {g.team2.teamName} on {new Date(g.gameDate).toLocaleDateString()}
                  </option>
                ))}
              </select>
          }
        </div>

        <div className="mb-3">
          <label>Predicted Outcome</label>
          <select
            className="form-control"
            value={predictedOutcome}
            onChange={e=>setPredictedOutcome(e.target.value)}
            required
          >
            <option value="">— Pick one —</option>
            {outcomeOptions.map(o=>(
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label>Bet Amount</label>
          <input
            type="number"
            step="0.01"
            className="form-control"
            value={betAmount}
            onChange={e=>setBetAmount(e.target.value)}
            required
          />
        </div>

        <button className="btn btn-primary">Place Bet</button>
      </form>

      <div className="mt-3">
        <button className="btn btn-info me-2" onClick={()=>navigate('/picks')}>View My Bets</button>
        <button className="btn btn-secondary" onClick={()=>navigate('/dashboard')}>Back</button>
      </div>

      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
}

export default PlaceBet;