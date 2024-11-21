import React, { useEffect } from "react";
import { Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { getaOrder } from "../features/auth/authSlice";

const columns = [
  {
    title: "SNo",
    dataIndex: "key",
  },
  {
    title: "Product Name",
    dataIndex: "name",
  },
  {
    title: "Brand",
    dataIndex: "brand",
  },
  {
    title: "Count",
    dataIndex: "count",
  },
  {
    title: "Color",
    dataIndex: "color",
  },
  {
    title: "Amount",
    dataIndex: "amount",
  },
  {
    title: "Image",
    dataIndex: "image",
  },
];

const ViewOrder = () => {
  const location = useLocation();
  const orderId = location.pathname.split("/")[3];
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(getaOrder(orderId));
  }, [dispatch, orderId]);
  
  const orderState = useSelector((state) => state?.auth?.singleorder?.orders);

  const data1 = [];
  if (orderState?.orderItems) {
    for (let i = 0; i < orderState.orderItems.length; i++) {
      data1.push({
        key: i + 1,
        name: orderState.orderItems[i]?.product?.title,
        brand: orderState.orderItems[i]?.product?.brand,
        count: orderState.orderItems[i]?.quantity,
        amount: orderState.orderItems[i]?.price,
        color: (
          <div className="col-3">
            <ul
              className="colors ps-0"
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                marginBottom: "10px",
                backgroundColor: orderState.orderItems[i]?.color?.title,
              }}
            ></ul>
          </div>
        ),
        image: (
          <img
            src={orderState.orderItems[i]?.product?.images[0]?.url}
            style={{ width: "100px", height: "100px" }}
          />
        ),
      });
    }
  }

  return (
    <div>
      <h3 className="mb-4 title">Xem chi tiết đơn hàng</h3>
      <div>
        {orderState && (
          <div className="order-details">
            <p><strong>ID:</strong> {orderState._id}</p>
            <p><strong>Status:</strong> {orderState.orderStatus}</p>
            <p><strong>Price:</strong> {orderState.totalPrice} đ</p>
            <p><strong>Date:</strong> {new Date(orderState.createdAt).toLocaleString()}</p>
            <p><strong>Payment Method:</strong> {orderState.paymentMethod}</p>
            <p><strong>Người nhận:</strong> {orderState.shippingInfo.firstname} {orderState.shippingInfo.lastname}</p>
            <p><strong>Recipient:</strong> {orderState.shippingInfo.address},{orderState.shippingInfo.city},{orderState.shippingInfo.state},{orderState.shippingInfo.country}</p>
            <p><strong>Phone:</strong> {orderState.shippingInfo.pincode}</p>
          </div>
        )}
        <Table columns={columns} dataSource={data1} />
      </div>
    </div>
  );
};

export default ViewOrder;
