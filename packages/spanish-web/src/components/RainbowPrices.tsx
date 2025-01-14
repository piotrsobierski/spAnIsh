import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";

interface FlightPrice {
  Klucz: string;
  Cena: number;
}

interface FlightResponse {
  Destynacje: FlightPrice[];
}

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const PriceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const PriceCard = styled.div<{ highlight: boolean }>`
  padding: 15px;
  border-radius: 8px;
  background: ${(props) => (props.highlight ? "#ffe4e4" : "#f5f5f5")};
  border: ${(props) => (props.highlight ? "2px solid #ff4444" : "none")};
  transition: transform 0.2s;
  &:hover {
    transform: translateY(-5px);
  }
`;

const Price = styled.p`
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
`;

const Error = styled.div`
  color: #ff4444;
  padding: 20px;
  text-align: center;
`;

const RainbowPrices: React.FC = () => {
  const [prices, setPrices] = useState<FlightPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrices = async () => {
    try {
      const response = await axios.get<FlightResponse>(
        "https://biletyczarterowe.r.pl/api/wyszukiwanie/wyszukaj",
        {
          params: {
            "iataSkad[]": "POP",
            oneWay: true,
            "dataUrodzenia[]": "1989-10-30",
            dataWylotuMin: "2025-04-15",
            dataWylotuMax: "2025-05-15",
            sortowanie: "cena",
          },
          headers: {
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
        }
      );

      setPrices(
        response.data.Destynacje.map((item) => ({
          Klucz: item.Klucz,
          Cena: item.Cena,
        }))
      );
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch flight prices");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 3600000); // Refresh every hour
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Loading prices...</div>;
  if (error) return <Error>{error}</Error>;

  return (
    <Container>
      <h2>Flight Prices: Dominican Republic → Poland</h2>
      <PriceGrid>
        {prices.map((price) => (
          <PriceCard key={price.Klucz} highlight={price.Cena < 2000}>
            <h3>{price.Klucz}</h3>
            <Price>{price.Cena} PLN</Price>
          </PriceCard>
        ))}
      </PriceGrid>
    </Container>
  );
};

export default RainbowPrices;
