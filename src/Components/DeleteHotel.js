import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)),
              url('/Images/bookings-bg.jpg');
  background-size: cover;
  background-attachment: fixed;
  padding: 40px 20px;
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
  padding: 30px;
`;

const Title = styled.h2`
  color: #2c3e50;
  text-align: center;
  margin-bottom: 30px;
  font-size: 2rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);

  th, td {
    padding: 15px;
    text-align: left;
    border-bottom: 1px solid #eee;
  }

  th {
    background-color: #34495e;
    color: white;
    font-weight: 500;
  }

  tr:hover {
    background-color: #f8f9fa;
  }
`;

const StatusBadge = styled.span`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  color: white;
  background-color: ${props => {
    switch (props.$status.toLowerCase()) {
      case 'confirmed': return '#28a745';
      case 'pending': return '#ffc107';
      case 'cancelled': return '#dc3545';
      case 'completed': return '#17a2b8';
      default: return '#6c757d';
    }
  }};
`;

const StatusSelect = styled.select`
  padding: 6px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  background-color: white;
  font-size: 0.9rem;
  
  &:focus {
    border-color: #80bdff;
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
  }
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  margin: 20px auto;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const HotelBookings = () => {
    const { hotelId } = useParams();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchHotelBookings = async () => {
            try {
                const response = await axios.get(`http://localhost:7125/api/Hotels/${hotelId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setBookings(response.data);
                setError(null);
            } catch (error) {
                setError('Error fetching bookings: ' + (error.response?.data || error.message));
            } finally {
                setLoading(false);
            }
        };

        if (hotelId) {
            fetchHotelBookings();
        }
    }, [hotelId, token]);

    const handleStatusChange = async (bookingId, newStatus) => {
        try {
            await axios.put(`http://localhost:7125/api/Bookings/${bookingId}`, 
                { status: newStatus },
                { headers: { 'Authorization': `Bearer ${token}` }}
            );
            // Refresh bookings after status update
            const response = await axios.get(`http://localhost:7125/api/Bookings/Hotel/${hotelId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setBookings(response.data);
        } catch (error) {
            setError('Error updating booking status: ' + (error.response?.data || error.message));
        }
    };

    if (loading) {
        return (
            <PageContainer>
                <ContentContainer>
                    <LoadingSpinner />
                </ContentContainer>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <ContentContainer>
                <Title>Hotel Bookings</Title>
                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}
                <div className="table-responsive">
                    <Table>
                        <thead>
                            <tr>
                                <th>Booking ID</th>
                                <th>Guest Name</th>
                                <th>Room Number</th>
                                <th>Check In</th>
                                <th>Check Out</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map(booking => (
                                <tr key={booking.bookingId}>
                                    <td>{booking.bookingId}</td>
                                    <td>{booking.userName}</td>
                                    <td>{booking.roomNumber}</td>
                                    <td>{new Date(booking.checkInDate).toLocaleDateString()}</td>
                                    <td>{new Date(booking.checkOutDate).toLocaleDateString()}</td>
                                    <td>
                                        <StatusBadge $status={booking.status}>
                                            {booking.status}
                                        </StatusBadge>
                                    </td>
                                    <td>
                                        <StatusSelect
                                            value={booking.status}
                                            onChange={(e) => handleStatusChange(booking.bookingId, e.target.value)}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Confirmed">Confirmed</option>
                                            <option value="Cancelled">Cancelled</option>
                                            <option value="Completed">Completed</option>
                                        </StatusSelect>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </ContentContainer>
        </PageContainer>
    );
};

export default HotelBookings;