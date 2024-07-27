import React, { useEffect, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';

const brands = [
  'apple', 'samsung', 'netechnics', 'hp', 'sony', 'magnetta',
  'nakamichi', 'lucente', 'maxxis', 'cortland', 'carfashion', 'xiaomi', ''
];

const Dashboard = () => {
  const { data: session } = useSession() as any;
  const [brand, setBrand] = useState<string>(brands[0]);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    fetchDashboardData(brand);
  };

  useEffect(() => {
    fetchDashboardData(brand);
  }, []);

  const fetchDashboardData = async (brand: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/report/${brand}`);
      if (!response.ok) {
        throw new Error('Error fetching data');
      }
      const data = await response.json();
      setData(data);
    } catch (err: any) {
      setError(err.message || 'Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <header>
        <h1>Dashboard</h1>
        <Button onClick={() => signOut()}>Logout</Button>
      </header>

      <div className="brand-selection">
        <select
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        >
          {brands.map((brandName) => (
            <option key={brandName} value={brandName}>{brandName}</option>
          ))}
        </select>
        <Button onClick={handleSubmit}>Fetch Report</Button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {data && (
        <div className="report">
          <h2>Report for {data.brand}</h2>
          <div className="report-metrics">
            <div className="metric">
              <span className="metric-title">Views</span>
              <span className="metric-value">{data.views}</span>
            </div>
            <div className="metric">
              <span className="metric-title">Purchases</span>
              <span className="metric-value">{data.purchases}</span>
            </div>
            <div className="metric">
              <span className="metric-title">Total Sales</span>
              <span className="metric-value">${data.total_sales ? data.total_sales.toFixed(2) : 'N/A'}</span>
            </div>
            <div className="metric">
              <span className="metric-title">Unique Users</span>
              <span className="metric-value">{data.unique_users}</span>
            </div>
            <div className="metric">
              <span className="metric-title">Unique Sessions</span>
              <span className="metric-value">{data.unique_sessions}</span>
            </div>
            <div className="metric">
              <span className="metric-title">Avg Session Duration</span>
              <span className="metric-value">{data.avg_session_duration ? data.avg_session_duration.toFixed(2) : 'N/A'} seconds</span>
            </div>
            <div className="metric">
              <span className="metric-title">Avg Purchase Value</span>
              <span className="metric-value">${data.avg_purchase_value ? data.avg_purchase_value.toFixed(2) : 'N/A'}</span>
            </div>
          </div>

          <h3>Top Categories</h3>
          <ul className="categories">
            {data.top_category_metrics && Object.keys(data.top_category_metrics.views).map((category) => (
              <li key={category} className="category">
                <h4>{category}</h4>
                <p>Views: {data.top_category_metrics.views[category]}</p>
                <p>Purchases: {data.top_category_metrics.purchases[category]}</p>
                <p>Sales: ${data.top_category_metrics.sales[category] ? data.top_category_metrics.sales[category].toFixed(2) : 'N/A'}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <style jsx>{`
        .dashboard {
          padding: 20px;
          background-color: #f4f7f6;
          min-height: 100vh;
          font-family: Arial, sans-serif;
          color: #333; /* Ensure text color is always visible */
        }
        header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        h1 {
          margin: 0;
          color: #333;
        }
        .brand-selection {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }
        select {
          padding: 10px;
          border-radius: 4px;
          border: 1px solid #ccc;
          flex-grow: 1;
          color: #333;
        }
        .report {
          background: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          color: #333; /* Ensure text color is always visible */
        }
        .report h2 {
          margin-top: 0;
          color: #333;
        }
        .report-metrics {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin: 20px 0;
        }
        .metric {
          flex: 1 1 200px;
          background: #f9f9f9;
          padding: 10px;
          border-radius: 4px;
          text-align: center;
          color: #333; /* Ensure text color is always visible */
        }
        .metric-title {
          display: block;
          font-weight: bold;
          margin-bottom: 5px;
          color: #666;
        }
        .metric-value {
          font-size: 1.2em;
          color: #333;
        }
        .categories {
          list-style: none;
          padding: 0;
        }
        .category {
          background: #f9f9f9;
          padding: 10px;
          margin: 10px 0;
          border-radius: 4px;
          color: #333; /* Ensure text color is always visible */
        }
        .category h4 {
          margin: 0 0 5px 0;
          color: #333;
        }
        .error {
          color: red;
        }
        .button {
          background-color: #0070f3;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .button:hover {
          background-color: #005bb5;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
