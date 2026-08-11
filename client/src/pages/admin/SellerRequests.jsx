import React, { useEffect, useState } from 'react'
import { sellerRequestsStyles as s } from '../../assets/dummyStyles'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios';
import API_URL from '../../config';
import { HiOutlineCheckCircle, HiOutlineClock, HiOutlineMail, HiOutlinePhone } from 'react-icons/hi';

const SellerRequests = () => {

    const [request, setRequest] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    // to fetch the request
    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/admin/pending-sellers`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (res.data.success) {
                    setRequest(res.data.pendingSellers);
                }
                setLoading(false);
            } catch (err) {
                console.error("Failed to load seller requests:", err);
                setLoading(false);
            }
        };
        fetchRequests();
    }, [token]);

    // to approve a seller
    const handleApprove = async (id) => {
        try {
            const res = await axios.patch(`${API_URL}/api/admin/approve-seller/${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (res.data.success) {
                setRequest(request.filter((req) => req._id !== id));
                alert("Seller approved successfully.");
            }
        } catch (err) {
            alert("Failed to approve seller. Please try again.");
        }
    };

    if (loading) {
        return (
            <div className={s.loaderFullPage}>
                <div className={s.loader}></div>
            </div>
        );
    }

    return (
        <div className={s.container}>
            <div className={s.headerContainer}>
                <h1 className={s.pageTitle}>Seller Varification</h1>
                <p className={s.pageSubtitle}>
                    Review and approve new seller registration requests.
                </p>
            </div>
            <div className={s.card}>
                <div className={s.cardInner}>
                    <h2 className={s.sectionTitle}>
                        Pending Requests ({request.length})
                    </h2>

                    {request.length === 0 ? (
                        <div className={s.emptyState}>
                            <HiOutlineCheckCircle size={48} className={s.emptyStateIcon} />
                            <p>No pending requests at the moment</p>
                        </div>
                    ) : (
                        <div className={s.requestGrid}>
                            {request.map((request) => (
                                <div key={request._id} className={s.requestCard}>
                                    <div className={s.requestHeader}>
                                        <div className={s.avatar}>
                                            {request.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className={s.requestName}>{request.name}</div>
                                            <div className={s.requestDate}>
                                                <HiOutlineClock /> Joined{" "}
                                                {new Date(request.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={s.contactInfo}>
                                        <div className={s.contactItem}>
                                            <HiOutlineMail size={18} className="text-primary" />{" "}
                                            {request.email}
                                        </div>
                                        {request.phone && (
                                            <div className={s.contactItem}>
                                                <HiOutlinePhone size={18} className="text-primary" />{" "}
                                                {request.phone}
                                            </div>
                                        )}
                                    </div>
                                    <button onClick={() => handleApprove(request._id)} className={s.approveButton}>
                                        <HiOutlineCheckCircle size={20} />
                                        Approve
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default SellerRequests
