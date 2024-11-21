
import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const DiscountCodeModal = ({ show, handleClose, handleSelectCode }) => {
  const discountCodes = [
    // { code: 'FEE50K', description: 'Giảm 10% cho tất cả đơn hàng tối đa 50K', amount: 50000, expiry: '28 tháng 07 2028' },
    { code: 'GIAM10K', description: 'Giảm 20% cho tất cả đơn hàng tối đa 10K', amount: 10000, expiry: '30 tháng 11 2024' },
    { code: 'GIAM20K', description: 'Giảm 20% cho tất cả đơn hàng tối đa 20K', amount: 20000, expiry: '30 tháng 11 2024' },
    { code: 'GIAM50K', description: 'Giảm 20% cho tất cả đơn hàng tối đa 50K', amount: 50000, expiry: '30 tháng 11 2024' },
    { code: 'GIAM100K', description: 'Giảm 20% cho tất cả đơn hàng tối đa 100K', amount: 100000, expiry: '30 tháng 11 2024' },
    { code: 'GIAM200K', description: 'Giảm 20% cho tất cả đơn hàng tối đa 200K', amount: 200000, expiry: '30 tháng 11 2024' },
    { code: 'GIAM500K', description: 'Giảm 50% cho tất cả đơn hàng tối đa 500K', amount: 500000, expiry: '30 tháng 11 2024' },
    // Add more discount codes here
  ];


  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Chọn mã giảm giá</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {discountCodes.map((discount, index) => (
          <div key={index} className="discount-code">
            <h5>{discount.code}</h5>
            <p>{discount.description}</p>
            <p>Giảm tối đa {discount.amount.toLocaleString('vi-VN')}₫</p>
            <p>Có giá trị đến ngày {discount.expiry}</p>
            <Button variant="success" onClick={() => handleSelectCode(discount)}>
              Chọn
            </Button>
          </div>
        ))}
      </Modal.Body>
    </Modal>
  );
};

export default DiscountCodeModal;
