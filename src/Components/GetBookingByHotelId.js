import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const GetBookingByHotelId = () => {
    const {userID} = useParams();
    const { hotelID } = useParams();
    const [hotelId, setHotelID] = useState(hotelID);
    const token = localStorage.getItem('token');
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get(`https://localhost:7125/api/Bookings/Hotel/${hotelID}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                setBookings(response.data);
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch bookings');
                setLoading(false);
            }
        };

        fetchBookings();
    }, [hotelID, token]);

    if (loading) return <div className="container mt-4">Loading...</div>;
    if (error) return <div className="container mt-4 alert alert-danger">{error}</div>;

    return (
        <div className="container mt-4">
            <h2>Hotel Bookings</h2>
            {bookings.length === 0 ? (
                <div className="alert alert-info">No bookings found for this hotel.</div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Booking ID</th>
                                <th>Room Number</th>
                                <th>Guest Name</th>
                                <th>Check In</th>
                                <th>Check Out</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map(booking => (
                                <tr key={booking.bookingID}>
                                    <td>{booking.bookingID}</td>
                                    <td>{booking.roomID}</td>
                                    <td>{booking.user.name}</td>
                                    <td>{new Date(booking.checkInDate).toLocaleDateString()}</td>
                                    <td>{new Date(booking.checkOutDate).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`badge ${
                                            booking.status === 'Confirmed' ? 'bg-success' :
                                            booking.status === 'Pending' ? 'bg-warning' :
                                            booking.status === 'Cancelled' ? 'bg-danger' :
                                            'bg-secondary'
                                        }`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default GetBookingByHotelId;