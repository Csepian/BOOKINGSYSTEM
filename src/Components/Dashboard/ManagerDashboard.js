import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
 
const DashboardContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;
 
const WelcomeSection = styled.div`
  background-color: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 30px;
`;
 
const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;
 
const Card = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
 
  h3 {
    color: #2c3e50;
    margin-bottom: 15px;
  }
`;
 
const StatCard = styled(Card)`
  text-align: center;
 
  .stat-value {
    font-size: 2rem;
    font-weight: bold;
    color: #007bff;
  }
`;
 
const BookingCard = styled.div`
  padding: 15px;
  margin-bottom: 15px;
  border: 1px solid #eee;
  border-radius: 5px;
  background-color: #f8f9fa;
  transition: transform 0.2s ease;
 
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
 
  p {
    margin: 5px 0;
    color: #2c3e50;
  }
`;
 
const ActionButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-right: 10px;
 
  &:hover {
    background-color: #0056b3;
  }
`;
 
const ManagerDashboard = () => {
  const { hotelID } = useParams();
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    occupancyRate: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
 
  useEffect(() => {
    const fetchData = async () => {
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
        setStats({
          totalBookings: response.data.length,
          occupancyRate: calculateOccupancyRate(response.data),
          revenue: calculateTotalRevenue(response.data)
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
 
    fetchData();
  }, []);
 
  const calculateOccupancyRate = (bookings) => {
    // Add your occupancy rate calculation logic here
    return (bookings.filter(b => b.status === 'Confirmed').length / bookings.length * 100).toFixed(1);
  };
 
  const calculateTotalRevenue = (bookings) => {
    return bookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);
  };
 
  return (
    <DashboardContainer>
      <WelcomeSection>
        <h1>Manager Dashboard</h1>
        <p>Hotel Performance Overview</p>
      </WelcomeSection>
 
      <CardGrid>
        <StatCard>
          <h3>Total Bookings</h3>
          <div className="stat-value">{stats.totalBookings}</div>
        </StatCard>
 
        <StatCard>
          <h3>Occupancy Rate</h3>
          <div className="stat-value">{stats.occupancyRate}%</div>
        </StatCard>
 
        <StatCard>
          <h3>Revenue</h3>
          <div className="stat-value">${stats.revenue.toFixed(2)}</div>
        </StatCard>
 
        <Card>
          <h3>Recent Bookings</h3>
          {loading ? (
            <p>Loading bookings...</p>
          ) : bookings.length > 0 ? (
            bookings.slice(0, 5).map(booking => (
              <BookingCard key={booking.bookingId}>
                <p>Room: {booking.room.type}</p>
                <p>Guest: {booking.user.name}</p>
                <p>Status: {booking.status}</p>
                <ActionButton
                  onClick={() => navigate(`/bookings/${booking.bookingID}`)}
                  style={{marginTop: '10px'}}
                >
                  View Details
                </ActionButton>
              </BookingCard>
            ))
          ) : (
            <p>No recent bookings</p>
          )}
        </Card>
 
        <Card>
          <h3>Quick Actions</h3>
          <ActionButton onClick={() => navigate('/bookings')}>
            View All hotel Bookings
          </ActionButton>
          <ActionButton onClick={() => navigate(`/hotels/${hotelID}`)}>
            View All hotel Booking
          </ActionButton>
 
 
          <ActionButton onClick={() => navigate('/rooms')}>
            Manage Rooms
          </ActionButton>
        </Card>
      </CardGrid>
    </DashboardContainer>
  );
};
 
export default ManagerDashboard;