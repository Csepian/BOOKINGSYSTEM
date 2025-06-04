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

const ErrorMessage = styled.div`
  padding: 15px;
  margin: 20px 0;
  border-radius: 8px;
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  text-align: center;
`;

const NoRoomsMessage = styled.div`
  text-align: center;
  padding: 30px;
  color: #666;
  font-size: 1.1rem;
`;

const Price = styled.span`
  font-weight: 600;
  color: #2ecc71;
`;

const AvailableRooms = () => {
    const { hotelId } = useParams();
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchAvailableRooms = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:7125/api/Rooms/Hotel/${hotelId}/available`,
                    { headers: { 'Authorization': `Bearer ${token}` }}
                );
                setRooms(response.data);
                setError(null);
            } catch (error) {
                setError('Error fetching available rooms: ' + (error.response?.data || error.message));
            } finally {
                setLoading(false);
            }
        };

        if (hotelId) {
            fetchAvailableRooms();
        }
    }, [hotelId, token]);

    if (loading) {
        return (
            <PageContainer>
                <ContentContainer>
                    <LoadingSpinner />
                </ContentContainer>
            </PageContainer>
        );
    }

    if (error) {
        return (
            <PageContainer>
                <ContentContainer>
                    <Title>Available Rooms</Title>
                    <ErrorMessage>{error}</ErrorMessage>
                </ContentContainer>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <ContentContainer>
                <Title>Available Rooms</Title>
                {rooms.length === 0 ? (
                    <NoRoomsMessage>No available rooms found for this hotel.</NoRoomsMessage>
                ) : (
                    <div className="table-responsive">
                        <Table>
                            <thead>
                                <tr>
                                    <th>Room Number</th>
                                    <th>Type</th>
                                    <th>Price</th>
                                    <th>Features</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rooms.map(room => (
                                    <tr key={room.roomId}>
                                        <td>{room.roomNumber}</td>
                                        <td>{room.type}</td>
                                        <td><Price>${room.price}</Price></td>
                                        <td>{room.features}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                )}
            </ContentContainer>
        </PageContainer>
    );
};

export default AvailableRooms;