import React, { useEffect } from "react";
import { Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getOrders, updateAOrder } from "../features/auth/authSlice";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";

const columns = [
  {
    title: "SNo",
    dataIndex: "key",
    sorter: (a, b) => a.key - b.key,
  },
  {
    title: "Name",
    dataIndex: "name",
    sorter: (a, b) => a.name.localeCompare(b.name),
  },
  {
    title: "Product",
    dataIndex: "product",
    sorter: (a, b) => a.amount - b.amount,
  },
  {
    title: "Amount",
    dataIndex: "amount",
  },
  {
    title: "Date",
    dataIndex: "date",
    sorter: (a, b) => new Date(a.date) - new Date(b.date),
  },
  {
    title: "Payment Method",
    dataIndex: "paymentMethod",
  },
  {
    title: "Order Status",
    dataIndex: "orderStatus",
    sorter: (a, b) => a.orderStatus.localeCompare(b.orderStatus),
  },
  {
    title: "Action",
    dataIndex: "action",
  },
];

const getTokenFromLocalStorage = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

const config3 = {
  headers: {
    Authorization: `Bearer ${
      getTokenFromLocalStorage !== null ? getTokenFromLocalStorage.token : ""
    }`,
    Accept: "application/json",
    "ngrok-skip-browser-warning": "69420",
  },
};

const Orders = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getOrders(config3));
  }, [dispatch]);

  const orderState = useSelector((state) => state?.auth?.orders?.orders);

  const updateOrderStatus = (orderId, status) => {
    dispatch(updateAOrder({ id: orderId, status: status }));
  };

  const data1 = [];
  for (let i = 0; i < orderState?.length; i++) {
    data1.push({
      key: i + 1,
      name: orderState[i]?.user?.firstname,
      product: (
        <Link to={`/admin/order/${orderState[i]?._id}`}>View Orders</Link>
      ),
      amount: orderState[i]?.totalPrice,
      date: new Date(orderState[i]?.createdAt).toLocaleString(),
      paymentMethod: orderState[i]?.paymentMethod,
      orderStatus: orderState[i]?.orderStatus,
      action: (
        <>
          <select
            name=""
            defaultValue={orderState[i]?.orderStatus}
            onChange={(e) =>
              updateOrderStatus(orderState[i]?._id, e.target.value)
            }
            className="form-control form-select"
            id=""
          >
            <option value="Ordered" disabled>
              Ordered
            </option>
            <option value="Processed">Processed</option>
            <option value="Shipped">Shipped</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </>
      ),
    });
  }

  return (
    <div>
      <h3 className="mb-4 title">Danh sách đặt hàng</h3>
      <div>{<Table columns={columns} dataSource={data1} />}</div>
    </div>
  );
};

export default Orders;
