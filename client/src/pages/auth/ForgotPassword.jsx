import React, { useState } from 'react'
import { forgotPasswordStyles as s } from '../../assets/dummyStyles'
import Navbar from '../../components/common/Navbar'
import axios from 'axios';
import API_URL from '../../config';
import { Link } from 'react-router';

const ForgotPassword = () => {

    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // to submit the email for password reset
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');
        
        try {
            const res = await axios.post(`${API_URL}/api/auth/forgot-password`, { email });
            if (res.data.success) {
                setSuccess("Password reset link sent to your email. Please check your inbox and follow the instructions to reset your password.");
            }
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred. Please try again.");
        }
        finally {
            setIsLoading(false);
        }
    };

  return (
    <div className={s.container}>
        <Navbar />
        <div className={s.centerWrapper}>
            <div className={s.formCard}>
                <h2 className={s.title}>
                    Forgot Password
                </h2>
                <p className={s.subtitle}>
                    Enter your email address below and we'll send you a link to reset your password.
                </p>

                {error && <div className={s.errorMessage}>{error}</div>}
                {success && <div className={s.successMessage}>{success}</div>}

                <form onSubmit={handleSubmit} className={s.form}>
                    <div>
                        <label className={s.label}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@company.com"
                            required
                            className={s.input}
                        />
                    </div>
                    <button type="submit" className={s.submitButton} disabled={isLoading}>
                        {isLoading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>

                <p className={s.footerText}>
                    Remember your password?{""} <Link to="/login" className={s.link}>Back to Login</Link>
                </p>
            </div>
        </div>
      
    </div>
  )
}

export default ForgotPassword
