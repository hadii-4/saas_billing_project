import { useState } from 'react';
import API from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            // Role ko hardcode 'Account Owner' bhej rahe hain
            await API.post('/register', { 
                fullName, 
                email, 
                password, 
                role: 'Account Owner' 
            });
            alert("Registration Successful! Please Login.");
            navigate('/'); 
        } catch (err) {
            alert(err.response?.data?.message || "Registration Failed");
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'Arial' }}>
            <div style={{ display: 'inline-block', padding: '30px', border: '1px solid #ddd', borderRadius: '10px', boxShadow: '0px 0px 10px rgba(0,0,0,0.1)' }}>
                <h2>Create Account</h2>
                <p style={{ color: 'gray', marginBottom: '20px' }}>Register as an Account Owner</p>
                <form onSubmit={handleRegister}>
                    <input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required 
                           style={{ padding: '10px', width: '250px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #ccc' }} /><br/>
                    
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required 
                           style={{ padding: '10px', width: '250px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #ccc' }} /><br/>
                    
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required 
                           style={{ padding: '10px', width: '250px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #ccc' }} /><br/>

                    <button type="submit" style={{ padding: '10px 30px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>
                        Register Now
                    </button>
                </form>
                <p style={{ marginTop: '20px' }}>Already have an account? <Link to="/">Login</Link></p>
            </div>
        </div>
    );
};

export default Register;