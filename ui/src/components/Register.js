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

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [gradientIndex, setGradientIndex] = useState(0);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post('/api/save', { username, email });
            setMessage('Registration successful! Redirecting to login page...');
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (error) {
            setError('Error registering. Please try again.');
            console.error('Error during registration:', error);
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
                <div className="card mx-auto" style={{ maxWidth: "600px" }}>
                    <div className="card-header bg-primary text-white">
                        <h2>Register</h2>
                    </div>
                    <div className="card-body">
                        {error && <p className="text-danger">{error}</p>}
                        {message && <p className="text-success">{message}</p>}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label>Username</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter your username"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label>Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">
                                Register
                            </button>
                        </form>
                        <p className="mt-3">
                            Already have an account?{" "}
                            <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate('/')}>
                                Login here
                            </span>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
