import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)),
              url('/Images/362619.jpg');
  background-size: cover;
  background-attachment: fixed;
  padding: 40px 20px;
`;

const BookingContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
  overflow: hidden;
`;

const BookingHeader = styled.div`
  background: #2c3e50;
  color: white;
  padding: 30px;
  text-align: center;
`;

const Title = styled.h2`
  margin: 0;
  color: white;
  font-size: 2rem;
`;

const BookingDetails = styled.div`
  padding: 30px;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  margin-bottom: 15px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.span`
  font-weight: 600;
  color: #34495e;
  width: 150px;
`;

const Value = styled.span`
  color: #2c3e50;
`;

const Status = styled.span`
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  color: white;
  background-color: ${props => {
    switch (props.$status?.toLowerCase()) {
      case 'confirmed': return '#28a745';
      case 'pending': return '#ffc107';
      case 'cancelled': return '#dc3545';
      case 'completed': return '#17a2b8';
      default: return '#6c757d';
    }
  }};
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #007bff;
  border-radius: 50%;
  margin: 20px auto;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ActionButton = styled.button`
  background-color: ${props => props.$variant === 'cancel' ? '#dc3545' : '#007bff'};
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 20px;

  &:hover {
    background-color: ${props => props.$variant === 'cancel' ? '#c82333' : '#0056b3'};
  }
`;

const GetBookingById = () => {
  const { bookingID} = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const token = localStorage.getItem('token');
        const tokenObj = token ? JSON.parse(token) : null;

        if (!tokenObj?.token) {
          throw new Error('No authentication token found');
        }

        const response = await axios.get(`https://localhost:7125/api/Bookings/${bookingID}`, {
          headers: {
            Authorization: `Bearer ${tokenObj.token}`,
            'Content-Type': 'application/json'
          }
        });

        setBooking(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setError(error.response?.data?.message || 'Failed to fetch booking details');
        setLoading(false);
      }
    };

    if (bookingID) {
      fetchBooking();
    }
  }, [bookingID]);

  const handleStatusUpdate = async (newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const tokenObj = token ? JSON.parse(token) : null;
      
      await axios.put(`https://localhost:7125/api/Bookings/${bookingID}/status`, 
        { status: newStatus },
        { 
          headers: {
            Authorization: `Bearer ${tokenObj?.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setBooking({...booking, status: newStatus});
    } catch (error) {
      setError('Failed to update booking status');
    }
  };

  if (loading) {
    return (
      <Container>
        <BookingContainer>
          <BookingHeader>
            <Title>Loading Booking Details...</Title>
          </BookingHeader>
          <LoadingSpinner />
        </BookingContainer>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <BookingContainer>
          <BookingHeader>
            <Title>Error</Title>
          </BookingHeader>
          <BookingDetails>
            <div style={{ color: '#dc3545', textAlign: 'center' }}>{error}</div>
            <ActionButton onClick={() => navigate('/manager-dashboard')}>
              Back to Dashboard
            </ActionButton>
          </BookingDetails>
        </BookingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <BookingContainer>
        <BookingHeader>
          <Title>Booking Details</Title>
        </BookingHeader>
        <BookingDetails>
          <DetailItem>
            <Label>Booking ID:</Label>
            <Value>{booking?.bookingID}</Value>
          </DetailItem>
          <DetailItem>
            <Label>Guest Name:</Label>
            <Value>{booking?.user.name}</Value>
          </DetailItem>
          <DetailItem>
            <Label>Room Type:</Label>
            <Value>{booking?.room?.type}</Value>
          </DetailItem>
          <DetailItem>
            <Label>Check In:</Label>
            <Value>{new Date(booking?.checkInDate).toLocaleDateString()}</Value>
          </DetailItem>
          <DetailItem>
            <Label>Check Out:</Label>
            <Value>{new Date(booking?.checkOutDate).toLocaleDateString()}</Value>
          </DetailItem>
          <DetailItem>
            <Label>Status:</Label>
            <Status $status={booking?.status}>{booking?.status}</Status>
          </DetailItem>
          <DetailItem>
            <Label>Total Price:</Label>
            <Value>${booking?.totalPrice?.toFixed(2)}</Value>
          </DetailItem>

          <ActionButton onClick={() => navigate('/manager-dashboard')}>
            Back to Dashboard
          </ActionButton>
          
          {booking?.status === 'Pending' && (
            <ActionButton 
              onClick={() => handleStatusUpdate('Confirmed')}
              style={{ marginLeft: '10px' }}
            >
              Confirm Booking
            </ActionButton>
          )}
          
          {booking?.status === 'Confirmed' && (
            <ActionButton 
              $variant="cancel"
              onClick={() => handleStatusUpdate('Cancelled')}
              style={{ marginLeft: '10px' }}
            >
              Cancel Booking
            </ActionButton>
          )}
        </BookingDetails>
      </BookingContainer>
    </Container>
  );
};

export default GetBookingById;