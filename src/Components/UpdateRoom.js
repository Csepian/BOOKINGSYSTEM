import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)),
              url('/Images/room-bg.jpg');
  background-size: cover;
  background-attachment: fixed;
  padding: 40px 20px;
`;

const FormContainer = styled.div`
  max-width: 800px;
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

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #34495e;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  font-size: 16px;

  &:focus {
    border-color: #3498db;
    outline: none;
    box-shadow: 0 0 0 2px rgba(52,152,219,0.2);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  font-size: 16px;
  
  &:focus {
    border-color: #3498db;
    outline: none;
    box-shadow: 0 0 0 2px rgba(52,152,219,0.2);
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 20px 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 30px;
`;

const Button = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;

  &.primary {
    background-color: #3498db;
    color: white;

    &:hover {
      background-color: #2980b9;
    }
  }

  &.secondary {
    background-color: #95a5a6;
    color: white;

    &:hover {
      background-color: #7f8c8d;
    }
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
  margin-bottom: 20px;
  border-radius: 8px;
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
`;

const UpdateRoom = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [room, setRoom] = useState({
        roomID: '',
        type: '',
        price: '',
        availability: true,
        features: '',
        hotelID: ''
    });

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const response = await axios.get(`http://localhost:7125/api/Rooms/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setRoom(response.data);
                setError('');
            } catch (error) {
                setError('Failed to fetch room details');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchRoom();
        }
    }, [id, token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:7125/api/Rooms/${id}`, room, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            navigate('/manager/rooms/list');
        } catch (error) {
            setError(error.response?.data || 'Error updating room');
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setRoom(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    if (loading) {
        return (
            <PageContainer>
                <FormContainer>
                    <LoadingSpinner />
                </FormContainer>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <FormContainer>
                <Title>Update Room</Title>
                {error && <ErrorMessage>{error}</ErrorMessage>}
                
                <form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label>Room Type</Label>
                        <Select 
                            name="type"
                            value={room.type}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Room Type</option>
                            <option value="Single">Single</option>
                            <option value="Double">Double</option>
                            <option value="Suite">Suite</option>
                            <option value="Deluxe">Deluxe</option>
                        </Select>
                    </FormGroup>

                    <FormGroup>
                        <Label>Price</Label>
                        <Input
                            type="number"
                            name="price"
                            value={room.price}
                            onChange={handleChange}
                            required
                            min="0"
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label>Features</Label>
                        <Input
                            type="text"
                            name="features"
                            value={room.features}
                            onChange={handleChange}
                            placeholder="WiFi, TV, AC, etc."
                        />
                    </FormGroup>

                    <CheckboxContainer>
                        <input
                            type="checkbox"
                            name="availability"
                            checked={room.availability}
                            onChange={handleChange}
                            id="availability"
                        />
                        <Label htmlFor="availability" style={{ margin: 0 }}>
                            Available
                        </Label>
                    </CheckboxContainer>

                    <ButtonGroup>
                        <Button type="submit" className="primary">
                            Update Room
                        </Button>
                        <Button 
                            type="button" 
                            className="secondary"
                            onClick={() => navigate('/manager/rooms/list')}
                        >
                            Cancel
                        </Button>
                    </ButtonGroup>
                </form>
            </FormContainer>
        </PageContainer>
    );
};

export default UpdateRoom;