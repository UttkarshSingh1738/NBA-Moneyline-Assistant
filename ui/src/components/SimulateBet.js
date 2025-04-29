// src/components/SimulateBet.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

function SimulateBet() {
  const [odds, setOdds] = useState(null);
  const [userId, setUserId] = useState("");
  const [games, setGames] = useState([]);
  const [gameId, setGameId] = useState("");
  const [predictedOutcome, setPredictedOutcome] = useState("");
  const [betAmount, setBetAmount] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const initialGameId = new URLSearchParams(location.search).get('gameId');

  // load user & games
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) return navigate('/', { replace: true });

    axios.get('/api/users/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => setUserId(r.data.userId))
      .catch(() => { sessionStorage.removeItem('token'); navigate('/', { replace: true }); });

    axios.get('/api/games', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => setGames(r.data))
      .catch(console.error);
  }, [navigate]);

  // prefill gameId
  useEffect(() => {
    if (initialGameId) setGameId(initialGameId);
  }, [initialGameId]);

  // load odds when game changes
  useEffect(() => {
    if (!gameId) return setOdds(null);
    const token = sessionStorage.getItem('token');
    axios.get(`/api/games/${gameId}/odds`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => setOdds(r.data[0] || null))
      .catch(() => setOdds(null));
  }, [gameId]);

  // build allowed outcomes
  const outcomeOptions = odds ? [
    `${odds.team1Name} ${odds.team1Moneyline>0?'+':''}${odds.team1Moneyline}`,
    `${odds.team2Name} ${odds.team2Moneyline>0?'+':''}${odds.team2Moneyline}`,
    `${odds.team1Name} ${odds.team1Spread>0?'+':''}${odds.team1Spread}`,
    `${odds.team2Name} ${odds.team2Spread>0?'+':''}${odds.team2Spread}`,
    `O ${odds.team1Total}`, `U ${odds.team2Total}`
  ] : [];

  const handleSimulate = async e => {
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
      const res = await axios.post('/api/bets/simulate', {
        user_id: userId, game_id: gameId,
        predicted_outcome: predictedOutcome,
        bet_amount: parseFloat(betAmount)
      }, { headers: { Authorization: `Bearer ${token}` }});

      setMessage(
        `💡 If placed, your total bet volume would be $${res.data.simulatedTotal.toFixed(2)}`
      );
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Simulation failed.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Simulate a Bet</h2>

      {odds && (
        <div className="card mb-4">
          <div className="card-header">Odds for Game {gameId}</div>
          <div className="card-body">
            <p><strong>Moneyline:</strong><br/>
              {odds.team1Name}: {odds.team1Moneyline}<br/>
              {odds.team2Name}: {odds.team2Moneyline}
            </p>
            <p><strong>Spread:</strong><br/>
              {odds.team1Name}: {odds.team1Spread}<br/>
              {odds.team2Name}: {odds.team2Spread}
            </p>
            <p><strong>Totals:</strong><br/>
              {odds.team1Total} / {odds.team2Total}
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSimulate}>
        <div className="mb-3">
          <label>User ID</label>
          <input className="form-control" value={userId} disabled/>
        </div>
        <div className="mb-3">
          <label>Game</label>
          {initialGameId
            ? <input className="form-control" value={gameId} disabled/>
            : <select className="form-control" value={gameId}
                onChange={e=>setGameId(e.target.value)} required>
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
          <select className="form-control"
                  value={predictedOutcome}
                  onChange={e=>setPredictedOutcome(e.target.value)}
                  required>
            <option value="">— Pick one —</option>
            {outcomeOptions.map(o=>(
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label>Bet Amount</label>
          <input type="number" step="0.01" className="form-control"
                 value={betAmount}
                 onChange={e=>setBetAmount(e.target.value)}
                 required/>
        </div>
        <button className="btn btn-warning">Simulate Bet</button>
      </form>

      {message && (
        <div className="alert alert-info mt-3">{message}</div>
      )}

      <div className="mt-4">
        <button className="btn btn-secondary me-2"
                onClick={()=>navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default SimulateBet;
