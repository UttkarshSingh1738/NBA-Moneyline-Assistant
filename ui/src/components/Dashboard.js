// src/components/Dashboard.js
import React, { useEffect, useState }  from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  } from 'chart.js';
  import { Line } from 'react-chartjs-2';
  
  // register chart.js components
  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

  
function Dashboard() {
    const navigate = useNavigate();
    const [board, setBoard] = useState([]);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        axios.get('/api/bets/history', {
        headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => setHistory(res.data))
        .catch(err => console.error('History load error', err));
    }, []);

    // prepare data for the line chart
    const chartData = {
        labels: history.map(r => new Date(r.ts).toLocaleDateString()),
        datasets: [
        {
            label: 'Bet Amount ($)',
            data: history.map(r => r.bet_amount),
            fill: false,
            borderColor: 'rgba(75, 192, 192, 0.7)',
            backgroundColor: 'rgba(75, 192, 192, 0.3)',
            tension: 0.3
        }
        ]
    };

    const chartOptions = {
        maintainAspectRatio: false,
        scales: {
            x: { grid: { display: false } },
            y: { grid: { color: '#eee' } }
        },
        plugins: { legend: { display: true } }
    };

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (!token) return; // not logged in
        axios.get('/advancedQuery/active-bettors', {
        headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => setBoard(res.data))
        .catch(err => console.error('Failed to load active bettors:', err));
    }, []);

    const handleLogout = async () => {
        try {
            await axios.get('/api/logout', {
                headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
            });
        } catch (err) {
            console.warn('Logout request failed', err);
        }
        sessionStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="container mt-5">
            <div className="position-absolute top-0 start-0 m-3">
                <button className="btn btn-secondary" onClick={handleLogout}>
                    Logout
                </button>
            </div>
            <h2>NBA Moneyline Assistant Dashboard</h2>
            <p>Welcome! Use the buttons below to explore betting insights, view predictions, and place your bets.</p>
            <div className="d-grid gap-3">
                <button className="btn btn-primary" onClick={() => navigate('/games')}>
                    Browse Games
                </button>
                <button className="btn btn-primary" onClick={() => navigate('/bets/place')}>
                    Place a Bet
                </button>
                <button className="btn btn-primary" onClick={() => navigate('/simulate')}>
                    Simulate a Bet
                </button>
            </div>


            <div className="card mb-4 mt-4">
                <div className="card-header">Your Betting History</div>
                <div className="card-body" style={{ height: 400}}>
                {history.length
                    ? <Line data={chartData} options={chartOptions} />
                    : <p className="text-center">No bets yet to display.</p>}
                </div>
            </div>

            <h4 className='mt-5'>🏆 Top 10 Most Active Bettors</h4>
            <table className="table table-striped ms-5">
                <thead>
                <tr>
                    <th>Rank</th>
                    <th>Username</th>
                    <th>Total Bets</th>
                </tr>
                </thead>
                <tbody>
                {board.length === 0
                    ? <tr><td colSpan="3" className="text-center">Loading…</td></tr>
                    : board.map((r, i) => (
                        <tr key={r.username}>
                        <td>{i + 1}</td>
                        <td>{r.username}</td>
                        <td>{r.total_bets}</td>
                        </tr>
                    ))
                }
                </tbody>
            </table>
        </div>
    );
}

export default Dashboard;
