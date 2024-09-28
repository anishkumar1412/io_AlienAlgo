import React, { useEffect, useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import './invoice.css'

const InvoiceGenerator = () => {
  const [orderProducts, setOrderProducts] = useState([]);
  const [invoiceNumber, setInvoiceNumber] = useState(Math.floor(1000 + Math.random() * 9000));
  const invoiceRef = useRef();


  const fetchOrders = async () => {
    const response = await fetch('http://localhost:4000/orderProducts');
    const data = await response.json();
    setOrderProducts(data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);


  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current,
  });

  const calculateTotal = (products) => {
    return products.reduce((acc, product) => acc + product.quantity * product.total, 0);
  };

  return (
  <div>
      <h1>Invoices</h1>
    <div className='Invoice-space'>

      {orderProducts.map((order, orderIndex) => (
        <div key={order._id} className="invoice-section">
          <h2>Invoice for {order.customerName}</h2>


          <div ref={invoiceRef}>
            <h3>Invoice Number: {invoiceNumber + orderIndex}</h3>
            <p>Client: {order.customerName}</p>
            <p>Address: {order.address}</p>
            <p>Date: {new Date().toLocaleDateString()}</p>
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {order.products.map((product, index) => (
                  <tr key={index}>
                    <td>{product.name}</td>
                    <td>{product.quantity}</td>
                    <td>${product.total}</td>
                    <td>${product.quantity * product.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h3>Total: ${calculateTotal(order.products)}</h3>
          </div>


          <button onClick={handlePrint}>Print Invoice</button>
          <hr />
        </div>
      ))}
    </div>
    </div>
  );
};

export default InvoiceGenerator;
