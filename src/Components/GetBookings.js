import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from 'styled-components';

const BookingsContainer = styled.div`
  max-width: 1000px;
  margin: 40px auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const BookingsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;

  th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }

  th {
    background-color: #f8f9fa;
    color: #2c3e50;
    font-weight: 600;
  }

  tr:hover {
    background-color: #f5f5f5;
  }
`;

const GetBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const token = localStorage.getItem('token');
                const tokenObj = token ? JSON.parse(token) : null;
                
                const response = await axios.get('https://localhost:7125/api/Bookings', {
                    headers: {
                        Authorization: `Bearer ${tokenObj?.token}`,
                        'Content-Type': 'application/json'
                    }
                });
                setBookings(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching bookings:", error);
                setError("Failed to load bookings");
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    if (loading) return <BookingsContainer>Loading...</BookingsContainer>;
    if (error) return <BookingsContainer>{error}</BookingsContainer>;

    return (
        <BookingsContainer>
            <h2>All Hotel Bookings</h2>
            <BookingsTable>
                <thead>
                    <tr>
                        
                        <th>Booking ID</th>
                        <th>Check-in Date</th>
                        <th>Check-out Date</th>
                        <th>Status</th>
                        <th>Guest Name</th>
                        <th>Room Type</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map(booking => (
                        <tr key={booking.bookingID}>
                            
                            <td>{booking.bookingID}</td>
                            <td>{new Date(booking.checkInDate).toLocaleDateString()}</td>
                            <td>{new Date(booking.checkOutDate).toLocaleDateString()}</td>
                            <td>{booking.status}</td>
                            <td>{booking.user.name}</td>
                            <td>{booking.room.type}</td>
                        </tr>
                    ))}
                </tbody>
            </BookingsTable>
        </BookingsContainer>
    );
};

export default GetBookings;