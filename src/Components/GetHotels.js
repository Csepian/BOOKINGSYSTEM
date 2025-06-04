import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { Link } from "react-router-dom";

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)),
              url('/Images/hotel-bg.jpg');
  background-size: cover;
  background-attachment: fixed;
  padding: 40px 20px;
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 40px auto;
  padding: 30px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
`;

const Title = styled.h2`
  color: #2c3e50;
  text-align: center;
  margin-bottom: 30px;
  font-size: 2rem;
`;

const TableContainer = styled.div`
  overflow-x: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border-radius: 8px;
  overflow: hidden;

  th, td {
    padding: 15px;
    text-align: left;
    border-bottom: 1px solid #eee;
  }

  th {
    background-color: #34495e;
    color: white;
    font-weight: 500;
    text-transform: uppercase;
    font-size: 0.9rem;
    letter-spacing: 0.5px;
  }

  tr:hover {
    background-color: #f8f9fa;
  }

  td {
    color: #2c3e50;
  }
`;

const Rating = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #f1c40f;
  font-weight: bold;
`;

const ViewButton = styled(Link)`
  display: inline-block;
  padding: 6px 12px;
  background-color: #3498db;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2980b9;
    color: white;
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

const GetHotels = () => {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const response = await axios.get('https://localhost:7125/api/Hotels');
                setHotels(response.data);
                setError(null);
            } catch (error) {
                console.error("Error fetching hotels:", error);
                setError("Failed to load hotels. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchHotels();
    }, []);

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
                    <ErrorMessage>{error}</ErrorMessage>
                </ContentContainer>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <ContentContainer>
                <Title>Available Hotels</Title>
                <TableContainer>
                    <StyledTable>
                        <thead>
                            <tr>
                                <th>Hotel Name</th>
                                <th>Location</th>
                                <th>Amenities</th>
                                <th>Rating</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {hotels.map(hotel => (
                                <tr key={hotel.hotelID}>
                                    <td>{hotel.name}</td>
                                    <td>{hotel.location}</td>
                                    <td>{hotel.amenities}</td>
                                    <td>
                                        <Rating>
                                            {hotel.rating} ⭐
                                        </Rating>
                                    </td>
                                    <td>
                                        <ViewButton to={`/gethotelbyid/${hotel.hotelID}`}>
                                            View Details
                                        </ViewButton>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </StyledTable>
                </TableContainer>
            </ContentContainer>
        </PageContainer>
    );
};

export default GetHotels;