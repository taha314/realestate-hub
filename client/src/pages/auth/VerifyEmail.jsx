import React, { useState } from 'react'
import { verifyEmailStyles as s } from '../../assets/dummyStyles'
import Navbar from '../../components/common/Navbar'
import { useLocation, useNavigate } from 'react-router';
import API_URL from '../../config';
import axios from 'axios';

const VerifyEmail = () => {

    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    // to get email passed from register page
    const emailFromState = location.state?.email || '';
    const [email, setEmail] = useState(emailFromState);

    // to submit the code
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const res = await axios.post(`${API_URL}/api/auth/verify-email`, { email, code });
            if (res.data.success) {
                setSuccess("Verification successful! Redirecting to login...");
                setTimeout(() => navigate('/login'), 2000);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Verification failed");
        }
        finally {
            setIsLoading(false);
        }
    }; 
    
  return (
    <div className={s.pageContainer}>
      <Navbar />
      <div className={s.containerCenter}>
        <div className={s.card}>
            <h2 className={s.title}>Verify Your Email</h2>
            <p className={s.subtitle}>Enter the verification code sent to your email</p>

            {error && <div className={s.errorAlert}>{error}</div>}
            {success && <div className={s.successAlert}>{success}</div>}

            <form onSubmit={handleSubmit} className={s.form}>
                {!emailFromState && (
                   <div>
                    <label className={s.label}>Email Address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder= "name@company.com"
                        required
                        className={s.input}
                    />
                   </div>
                )}

                <div>
                    <label className={s.label}>Verification Code</label>
                    <input
                        type="text"
                        value={code}
                        maxLength="6"
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="123456"
                        required
                        className={s.codeInput}
                    />
                </div>
                <button type="submit" className={s.submitButton} disabled={isLoading}>
                    {isLoading ? "Verifying..." : "Verify Email"}
                </button>
            </form>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmail
