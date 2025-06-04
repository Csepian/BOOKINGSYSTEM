import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)),
              url('/Images/room-bg.jpg');
  background-size: cover;
  background-attachment: fixed;
  padding: 40px 20px;
`;

const ContentContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
  padding: 30px;
`;

const Title = styled.h2`
  color: #2c3e50;
  margin-bottom: 30px;
  text-align: center;
  font-size: 2rem;
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

const Alert = styled.div`
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 8px;
  color: ${props => props.$type === 'error' ? '#721c24' : '#004085'};
  background-color: ${props => props.$type === 'error' ? '#f8d7da' : '#cce5ff'};
  border: 1px solid ${props => props.$type === 'error' ? '#f5c6cb' : '#b8daff'};
`;

const RoomCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden;
`;

const CardBody = styled.div`
  padding: 25px;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
`;

const InfoItem = styled.div`
  margin-bottom: 15px;
  
  strong {
    display: block;
    color: #34495e;
    margin-bottom: 5px;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  p {
    color: #2c3e50;
    margin: 0;
    font-size: 1.1rem;
  }
`;

const StatusBadge = styled.span`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  color: white;
  background-color: ${props => props.$isAvailable ? '#28a745' : '#dc3545'};
`;

const GetRoomById = () => {
    const { id } = useParams();
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const response = await axios.get(`http://localhost:7125/api/Rooms/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setRoom(response.data);
                setError(null);
            } catch (error) {
                if (error.response?.status === 404) {
                    setError('Room not found');
                } else {
                    setError('Error fetching room details');
                }
                setRoom(null);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchRoom();
        }
    }, [id, token]);

    return (
        <PageContainer>
            <ContentContainer>
                <Title>Room Details</Title>
                
                {loading && <LoadingSpinner />}
                
                {error && <Alert $type="error">{error}</Alert>}
                
                {room && (
                    <RoomCard>
                        <CardBody>
                            <GridContainer>
                                <InfoItem>
                                    <strong>Room ID</strong>
                                    <p>{room.roomID}</p>
                                </InfoItem>
                                <InfoItem>
                                    <strong>Type</strong>
                                    <p>{room.type}</p>
                                </InfoItem>
                                <InfoItem>
                                    <strong>Price</strong>
                                    <p>${room.price}</p>
                                </InfoItem>
                                <InfoItem>
                                    <strong>Features</strong>
                                    <p>{room.features}</p>
                                </InfoItem>
                                <InfoItem>
                                    <strong>Status</strong>
                                    <p>
                                        <StatusBadge $isAvailable={room.availability}>
                                            {room.availability ? 'Available' : 'Not Available'}
                                        </StatusBadge>
                                    </p>
                                </InfoItem>
                                <InfoItem>
                                    <strong>Hotel ID</strong>
                                    <p>{room.hotelID}</p>
                                </InfoItem>
                            </GridContainer>
                        </CardBody>
                    </RoomCard>
                )}
            </ContentContainer>
        </PageContainer>
    );
};

export default GetRoomById;