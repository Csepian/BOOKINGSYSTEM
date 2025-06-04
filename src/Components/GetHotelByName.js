import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)),
              url('/Images/hotel-search-bg.jpg');
  background-size: cover;
  background-attachment: fixed;
  padding: 40px 20px;
`;

const ContentContainer = styled.div`
  max-width: 800px;
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

const InfoGrid = styled.div`
  display: grid;
  gap: 20px;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const Label = styled.strong`
  color: #34495e;
  font-size: 1.1rem;
`;

const Value = styled.span`
  color: #2c3e50;
  font-size: 1.1rem;
`;

const Rating = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #f1c40f;
  font-weight: bold;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 30px;
`;

const Button = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
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
  margin: 20px;
  border-radius: 8px;
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  text-align: center;
`;

const GetHotelsByName = () => {
  const { hotelName } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const response = await axios.get(`https://localhost:7125/api/Hotels/ByName/${hotelName}`);
        setHotel(response.data);
        setError(null);
      } catch (error) {
        setError("Error fetching hotel: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    if (hotelName) {
      fetchHotel();
    }
  }, [hotelName]);

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
          <ButtonContainer>
            <Button className="secondary" onClick={() => navigate(-1)}>
              Go Back
            </Button>
          </ButtonContainer>
        </ContentContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ContentContainer>
        <Title>Hotel Details</Title>
        <InfoGrid>
          <InfoItem>
            <Label>Hotel Name</Label>
            <Value>{hotel.name}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Location</Label>
            <Value>{hotel.location}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Manager ID</Label>
            <Value>{hotel.managerID}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Amenities</Label>
            <Value>{hotel.amenities}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Rating</Label>
            <Rating>{hotel.rating} ⭐</Rating>
          </InfoItem>
        </InfoGrid>
        <ButtonContainer>
          <Button 
            className="primary"
            onClick={() => navigate(`/getavailablerooms/${hotel.hotelID}`)}
          >
            View Rooms
          </Button>
          <Button 
            className="secondary"
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </ButtonContainer>
      </ContentContainer>
    </PageContainer>
  );
};

export default GetHotelsByName;