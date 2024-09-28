import React, { useState, useEffect } from 'react';
import './Dashboard.css'; // Custom CSS for styling if required

const Dashboard = () => {
  // Placeholder data (this can come from props or API)
  const stockAlerts = [
    { orderId: '001', date: '2024-09-01', quantity: 100, alertAmt: 20, status: 'Low' },
    { orderId: '002', date: '2024-09-05', quantity: 50, alertAmt: 10, status: 'OK' },
    { orderId: '003', date: '2024-09-10', quantity: 200, alertAmt: 30, status: 'Low' },
  ];

  const topSellingProducts = [
    { orderId: '004', quantity: 300, alertAmt: 50 },
    { orderId: '005', quantity: 150, alertAmt: 20 },
    { orderId: '006', quantity: 500, alertAmt: 60 },
  ];

  const [allproducts, setAllproducts] = useState([]);
  const [itemNo, setItemno] = useState(0);

  const fetchInfo = async () => {
    try {
      const response = await fetch('http://localhost:4000/allproducts');
      const data = await response.json();
      setAllproducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []); // Runs only once when the component mounts

  useEffect(() => {
    setItemno(allproducts.length); // Updates item count when allproducts changes
  }, [allproducts]); // Adds allproducts as a dependency

  return (
    <div className="dashboard">
      {/* Revenue, Sales Return, Purchase, Income Section */}
      <div className="metrics">
        <div className="metric-card">
          <p>Total Products</p>
          <h3>{itemNo}</h3>
        </div>
        <div className="metric-card">
          <p>Total Store Value</p>
          <h3>+ 30,000</h3>
        </div>
        <div className="metric-card">
          <p>Out of Stock</p>
          <h3>1</h3>
        </div>
        <div className="metric-card">
          <p>All Categories</p>
          <h3>5</h3>
        </div>
      </div>

      {/* Stock Alert and Top Selling Products Section */}
      <div className="tables">
        <div className="table-section">
          <h4>Stock Alert</h4>
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Quantity</th>
                <th>Alert Amt.</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stockAlerts.map((alert) => (
                <tr key={alert.orderId}>
                  <td>{alert.orderId}</td>
                  <td>{alert.date}</td>
                  <td>{alert.quantity}</td>
                  <td>{alert.alertAmt}</td>
                  <td>{alert.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-section">
          <h4>Top Selling Products</h4>
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Quantity</th>
                <th>Alert Amt.</th>
              </tr>
            </thead>
            <tbody>
              {topSellingProducts.map((product) => (
                <tr key={product.orderId}>
                  <td>{product.orderId}</td>
                  <td>{product.quantity}</td>
                  <td>{product.alertAmt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
