import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const gradients = [
    'linear-gradient(135deg, #00ff7f, #ff4500)',
    'linear-gradient(135deg, #7d63e6, #00ff7f)',
    'linear-gradient(135deg, #682a00, #7d63e6)',
    'linear-gradient(135deg, #ff4500, #1e90ff)',
    'linear-gradient(135deg, #1e90ff, #682a00)'
];

function Login() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [gradientIndex, setGradientIndex] = useState(0);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Send only username and email to the authentication endpoint
            const response = await axios.post('/api/authenticate', { username, email });
            if (response.data.status === 'success') {
                sessionStorage.setItem('token', response.data.token);
                navigate('/dashboard');
            } else {
                setError('Invalid credentials');
            }
        } catch (err) {
            setError('Error during authentication');
        }
    };

    const changeGradient = () => {
        const newIndex = (gradientIndex + 1) % gradients.length;
        setGradientIndex(newIndex);
    };

    return (
        <div
            className="bg-container"
            style={{ background: gradients[gradientIndex] }}
            onClick={changeGradient}
        >
            <div className="container mt-5">
                <h2>NBA Moneyline Assistant Login</h2>
                {error && <p className="text-danger">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label>Username</label>
                        <input type="text" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label>Email</label>
                        <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn btn-primary">Login</button>
                </form>
                <p className="mt-3">
                    Don't have an account?{" "}
                    <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate('/register')}>
                        Register here
                    </span>.
                </p>
            </div>
        </div>
    );
}

export default Login;
