import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const AddRoom = () => {
    const navigate = useNavigate();
    const { hotelId } = useParams(); // Get hotelId from URL params
    const token = localStorage.getItem('token');

    const [formData, setFormData] = useState({
        type: '',
        price: '',
        availability: true,
        features: ''
    });

    const [errorMessage, setErrorMessage] = useState({});
    const [message, setMessage] = useState("");
    const validate = () => {
        let isValid = true;
        const errors = {};
        
        if (!formData.type || formData.type.trim() === '') {
            errors.type = "Room type is required";
            isValid = false;
        }

        if (!formData.price || formData.price <= 0) {
            errors.price = "Price must be greater than 0";
            isValid = false;
        }

        if (!formData.features || formData.features.trim() === '') {
            errors.features = "Features are required";
            isValid = false;
        }

        setErrorMessage(errors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            await axios.post(`http://localhost:5000/api/Rooms/${hotelId}`, formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setMessage("Room added successfully!");
            navigate(`/manager/hotels/${hotelId}/rooms`);
        } catch (error) {
            console.error('Error adding room:', error);
            setMessage("Error Adding room: " + error.message);
        }
    };
    return (
        <div className="container mt-4">
            <h2>Add New Room</h2>
            {message && (
                <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'}`}>
                    {message}
                </div>
            )}
            
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Room Type*</label>
                    <select 
                        className={`form-control ${errorMessage.type ? 'is-invalid' : ''}`}
                        value={formData.type}
                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                    >
                        <option value="">Select Room Type</option>
                        <option value="Single">Single</option>
                        <option value="Double">Double</option>
                        <option value="Suite">Suite</option>
                        <option value="Deluxe">Deluxe</option>
                    </select>
                    {errorMessage.type && <div className="invalid-feedback">{errorMessage.type}</div>}
                </div>

                <div className="mb-3">
                    <label className="form-label">Price per Night*</label>
                    <input
                        type="number"
                        className={`form-control ${errorMessage.price ? 'is-invalid' : ''}`}
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                        min="0"
                    />
                    {errorMessage.price && <div className="invalid-feedback">{errorMessage.price}</div>}
                </div>

                <div className="mb-3">
                    <label className="form-label">Features/Amenities*</label>
                    <input
                        type="text"
                        className={`form-control ${errorMessage.features ? 'is-invalid' : ''}`}
                        value={formData.features}
                        onChange={(e) => setFormData({...formData, features: e.target.value})}
                        placeholder="WiFi, TV, AC, etc."
                    />
                    {errorMessage.features && <div className="invalid-feedback">{errorMessage.features}</div>}
                </div>

                <div className="mb-3">
                    <div className="form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            checked={formData.availability}
                            onChange={(e) => setFormData({...formData, availability: e.target.checked})}
                            id="availability"
                        />
                        <label className="form-check-label" htmlFor="availability">
                            Room is Available
                        </label>
                    </div>
                </div>

                <div className="mb-3">
                    <button type="submit" className="btn btn-primary me-2">Add Room</button>
                    <button 
                        type="button" 
                        className="btn btn-secondary"
                        onClick={() => navigate('/manager/rooms/list')}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddRoom;