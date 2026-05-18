import { useState } from 'react';
import API from '../services/api';
import { useNavigate, Link } from 'react-router-dom'; // Link import kiya

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const res = await API.post('/users/login', { email, password });
        
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role', res.data.role);
        localStorage.setItem('userName', res.data.userName);
        localStorage.setItem('ownerName', res.data.ownerName); // Owner ka naam save kiya
        
        alert("Login Success!");
        window.location.href = '/dashboard'; 
    } catch (err) {
        alert(err.response?.data?.message || "Invalid Credentials");
    }
};

    return (
        <div style={{ textAlign: 'center', marginTop: '100px', fontFamily: 'Arial' }}>
            <div style={{ display: 'inline-block', padding: '30px', border: '1px solid #ddd', borderRadius: '10px', boxShadow: '0px 0px 10px rgba(0,0,0,0.1)' }}>
                <h2>SaaS Billing Login</h2>
                <form onSubmit={handleLogin}>
                    <input 
                        type="email" 
                        placeholder="Email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        style={{ padding: '10px', width: '250px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #ccc' }}
                    /><br/>
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        style={{ padding: '10px', width: '250px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #ccc' }}
                    /><br/>
                    <button 
                        type="submit" 
                        style={{ padding: '10px 30px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}
                    >
                        Login
                    </button>
                </form>

                {/* --- Naye User ke liye Link --- */}
                <p style={{ marginTop: '20px', fontSize: '14px' }}>
                    Don't have an account? <Link to="/register" style={{ color: '#007bff', fontWeight: 'bold' }}>Register Here</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;