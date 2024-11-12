import React, { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'; // To support auto tables for the invoice structure
import './Order.css';
import { FaDownload } from 'react-icons/fa'; // For the download icon

function Order() {
  const [orderProducts, setOrderProducts] = useState([]);

  const fetchInfo = async () => {
    const response = await fetch('http://localhost:4000/orderProducts');
    const data = await response.json();
    setOrderProducts(data);
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const generateInvoicePDF = (order, orderIndex) => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();

    // Add invoice header
    doc.text(`Invoice Number: ${1000 + orderIndex}`, 20, 20);
    doc.text(`Client: ${order.customerName}`, 20, 30);
    doc.text(`Address: ${order.address}`, 20, 40);
    doc.text(`Date: ${date}`, 20, 50);

    // Add the order details in a table
    const tableColumn = ['Description', 'Quantity', 'Price', 'Total'];
    const tableRows = [];

    order.products.forEach(product => {
      const productData = [
        product.name,
        product.quantity,
        `$${product.total}`,
        `$${product.quantity * product.total}`
      ];
      tableRows.push(productData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 60,
    });

    // Add total amount at the end
    const finalY = doc.autoTable.previous ? doc.autoTable.previous.finalY : 60;
    const totalAmount = order.products.reduce(
      (acc, product) => acc + product.quantity * product.total,
      0
    );
    doc.text(`Total: $${totalAmount}`, 20, finalY + 10);

    // Save the PDF
    doc.save(`Invoice_${order.customerName}_${orderIndex}.pdf`);
  };

  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Image</p>
          <p>Items</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Status</p>
          <p>Download Invoice</p>
        </div>
        <br />
      </div>

      {orderProducts.map((order, orderIndex) => (
        <div key={order._id} className="order-details">
          {/* Loop through each product in the order */}
          {order.products.map((product) => (
            <div key={product.id} className="order-product">
              <div className="cart-items-title">
                <img src={product.image} style={{ width: "50px" }} alt={product.name} className="order-product-image" />
                <p>{product.name}</p>
                <p>{product.quantity}</p>
                <p>${product.total}</p>
                <p>Pending</p>
                <FaDownload
                  style={{ cursor: 'pointer' }}
                  onClick={() => generateInvoicePDF(order, orderIndex)}
                  title="Download Invoice"
                />
              </div>
            </div>
          ))}

          {/* Display order summary under the respective headings */}
          <div className="order-summary">
            <p>Customer's Name: <strong>{order.customerName}</strong></p>
            <p>Address: <strong>{order.address}</strong></p>
            <p>Payment Method: <strong>{order.paymentMethod}</strong></p>
            <p>Total Quantity: <strong>{order.quantity}</strong></p>
            <p>Total Amount: <strong>${order.total}</strong></p>
          </div>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default Order;
