import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
//backend pending
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

const Badge = styled.span`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  color: white;
  background-color: ${props => props.$isAvailable ? '#28a745' : '#dc3545'};
`;

const Button = styled.button`
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  margin: 0 5px;
  cursor: pointer;
  transition: all 0.2s;

  &.edit {
    background-color: #ffc107;
    color: #000;
    &:hover { background-color: #e0a800; }
  }

  &.delete {
    background-color: #dc3545;
    color: white;
    &:hover { background-color: #c82333; }
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

const ViewAllRooms = () => {
    const { hotelId } = useParams();
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const fetchRooms = async () => {
        try {
            const response = await axios.get(`http://localhost:7125/api/Rooms/Hotel/${hotelId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setRooms(response.data);
            setError(null);
        } catch (error) {
            setError('Error fetching rooms: ' + (error.response?.data || error.message));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (hotelId) {
            fetchRooms();
        }
    }, [hotelId]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this room?')) {
            try {
                await axios.delete(`http://localhost:7125/api/Rooms/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                fetchRooms();
            } catch (error) {
                setError('Error deleting room: ' + (error.response?.data || error.message));
            }
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

    if (error) {
        return (
            <PageContainer>
                <ContentContainer>
                    <Title>All Rooms</Title>
                    <ErrorMessage>{error}</ErrorMessage>
                </ContentContainer>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <ContentContainer>
                <Title>All Rooms</Title>
                <div className="table-responsive">
                    <Table>
                        <thead>
                            <tr>
                                <th>Room Number</th>
                                <th>Type</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rooms.map(room => (
                                <tr key={room.roomId}>
                                    <td>{room.roomNumber}</td>
                                    <td>{room.roomType}</td>
                                    <td>${room.price}</td>
                                    <td>
                                        <Badge $isAvailable={room.isAvailable}>
                                            {room.isAvailable ? 'Available' : 'Booked'}
                                        </Badge>
                                    </td>
                                    <td>
                                        <Button 
                                            className="edit"
                                            onClick={() => navigate(`/manager/rooms/update/${room.roomId}`)}
                                        >
                                            Edit
                                        </Button>
                                        <Button 
                                            className="delete"
                                            onClick={() => handleDelete(room.roomId)}
                                        >
                                            Delete
                                        </Button>
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

export default ViewAllRooms;