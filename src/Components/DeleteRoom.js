import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const DeleteRoom = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this room?')) {
            return;
        }

        setLoading(true);
        try {
            await axios.delete(`http://localhost:7125/api/Rooms/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            navigate('/manager/rooms/list');
        } catch (error) {
            if (error.response?.status === 404) {
                setError('Room not found');
            } else {
                setError('Error deleting room');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Delete Room</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Confirm Deletion</h5>
                    <p className="card-text">Are you sure you want to delete room #{id}?</p>
                    <p className="card-text text-danger">This action cannot be undone.</p>
                    
                    <button 
                        className="btn btn-danger me-2" 
                        onClick={handleDelete}
                        disabled={loading}
                    >
                        {loading ? 'Deleting...' : 'Delete Room'}
                    </button>
                    <button 
                        className="btn btn-secondary" 
                        onClick={() => navigate('/manager/rooms/list')}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteRoom;