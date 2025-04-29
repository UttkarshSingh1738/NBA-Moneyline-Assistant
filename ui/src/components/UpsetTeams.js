import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function UpsetTeams() {
    const [teams, setTeams] = useState([]);
        const navigate = useNavigate();
    
    useEffect(() => {
        const fetchUpsets = async () => {
            try {
                const token = sessionStorage.getItem("token");
                const response = await axios.get('/advancedQuery/upsets', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setTeams(response.data);
            } catch (error) {
                console.error("Error fetching upset teams:", error);
            }
        };
        fetchUpsets();
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
            <h2>Teams Ranked by Betting Upsets</h2>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Team Name</th>
                        <th>Upsets</th>
                    </tr>
                </thead>
                <tbody>
                    {teams.map((row, index) => (
                        <tr key={index}>
                            <td>{row.team_name}</td>
                            <td>{row.upsets}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
        </div>
    );
}

export default UpsetTeams;
