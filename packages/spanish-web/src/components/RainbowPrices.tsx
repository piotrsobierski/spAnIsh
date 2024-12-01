import React, { useEffect, useState } from "react";
import axios from "axios";

interface FlightPrice {
  Key: string;
  Price: number;
}

interface FlightResponse {
  Destinations: FlightPrice[];
}

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
          Key: item.Klucz,
          Price: item.Cena,
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
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="rainbow-prices">
      <h2>Flight Prices: Dominican Republic → Poland</h2>
      <div className="price-grid">
        {prices.map((price, index) => (
          <div
            key={price.Key}
            className={`price-card ${price.Price < 2000 ? "highlight" : ""}`}
          >
            <h3>{price.Key}</h3>
            <p className="price">{price.Price} PLN</p>
          </div>
        ))}
      </div>
      <style jsx>{`
        .rainbow-prices {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .price-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }

        .price-card {
          padding: 15px;
          border-radius: 8px;
          background: #f5f5f5;
          transition: transform 0.2s;
        }

        .price-card:hover {
          transform: translateY(-5px);
        }

        .price-card.highlight {
          background: #ffe4e4;
          border: 2px solid #ff4444;
        }

        .price {
          font-size: 24px;
          font-weight: bold;
          color: #2c3e50;
        }

        .error {
          color: #ff4444;
          padding: 20px;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default RainbowPrices;
