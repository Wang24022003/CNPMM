import React, { useEffect, useState } from "react";
import Container from "../components/Container";
import BreadCrumb from "../components/BreadCrumb";
import { useDispatch, useSelector } from "react-redux";
import { getOrders } from "../features/user/userSlice";
import { FaPlus, FaMinus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { updateOrder } from "../features/products/productSlilce";
import { toast } from "react-toastify";


const Orders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orderState = useSelector(
    (state) => state?.auth?.getorderedProduct?.orders
  );

  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [expandedOrders, setExpandedOrders] = useState({});

  const getTokenFromLocalStorage = localStorage.getItem("customer")
    ? JSON.parse(localStorage.getItem("customer"))
    : null;

  const config2 = {
    headers: {
      Authorization: `Bearer ${
        getTokenFromLocalStorage !== null ? getTokenFromLocalStorage.token : ""
      }`,
      Accept: "application/json",
    },
  };

  useEffect(() => {
    dispatch(getOrders(config2));
  }, [dispatch, config2]);

  useEffect(() => {
    if (orderState) {
      setFilteredOrders(
        statusFilter
          ? orderState.filter((order) => order.orderStatus === statusFilter)
          : orderState
      );
    }
  }, [orderState, statusFilter]);

  const toggleExpandOrder = (orderId) => {
    setExpandedOrders((prevState) => ({
      ...prevState,
      [orderId]: !prevState[orderId],
    }));
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Ordered":
        return "badge bg-secondary";
      case "Processed":
        return "badge bg-info";
      case "Shipped":
        return "badge bg-warning";
      case "Out for Delivery":
        return "badge bg-primary";
      case "Delivered":
        return "badge bg-success";
      case "Cancelled":
        return "badge bg-danger";
      default:
        return "badge bg-light text-dark";
    }
  };


  const handleReview = (productId) => {
    if (productId) {
      navigate(`/product/${productId}`);
    } else {
      console.error("Không tìm thấy ID sản phẩm");
    }
  };
  
  const handleCancelOrder = (orderId) => {
    if (orderId) {
      // Gọi API hủy đơn hàng
      dispatch(updateOrder({id: orderId, status:"Cancelled" }))
        .unwrap()
        .then(() => {
          toast.success("Đơn hàng đã được hủy thành công!");
          
          dispatch(getOrders(config2));
        })
        .catch((error) => {
          console.error("Lỗi khi hủy đơn hàng:", error);
          toast.error("Không thể hủy đơn hàng. Vui lòng thử lại sau.");
        });
    }
  };
  

  const styles = {
    orderList: {
      width: "100%",
      maxWidth: "1200px",
      margin: "auto",
      backgroundColor: "#fff",
      borderRadius: "8px",
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    },
    orderHeader: {
      display: "flex",
      justifyContent: "space-between",
      padding: "10px 20px",
      borderBottom: "1px solid #ccc",
      backgroundColor: "#f7f7f7",
    },
    orderColumn: {
      flex: 1,
      textAlign: "center",
    },
    orderItem: {
      marginBottom: "20px",
      borderRadius: "8px",
      overflow: "hidden",
      border: "1px solid #ccc",
    },
    orderProducts: {
      backgroundColor: "#fff",
      color: "#000",
      padding: "10px 20px",
    },
    productHeader: {
      display: "flex",
      justifyContent: "space-between",
      padding: "10px 0",
      borderBottom: "1px solid #ccc",
    },
    productItem: {
      display: "flex",
      justifyContent: "space-between",
      padding: "10px 0",
      borderBottom: "1px solid #eee",
    },
    productColumn: {
      flex: 1,
      textAlign: "center",
    },
    colors: {
      listStyle: "none",
      padding: 0,
      margin: 0,
    },
    colorItem: {
      width: "20px",
      height: "20px",
      borderRadius: "50%",
      display: "inline-block",
    },
    filterContainer: {
      display: "flex",
      justifyContent: "center",
      marginBottom: "20px",
    },
    filterSelect: {
      padding: "10px",
      borderRadius: "4px",
      border: "1px solid #ccc",
    },
    orderDetails: {
      padding: "10px 20px",
      backgroundColor: "#f7f7f7",
      borderBottom: "1px solid #ccc",
    },
    orderDetailsColumn: {
      textAlign: "left",
      paddingBottom: "10px",
    },
    detailSection: {
      marginBottom: "10px",
    },
    toggleButton: {
      cursor: "pointer",
      backgroundColor: "#007bff",
      color: "#fff",
      border: "none",
      borderRadius: "50%",
      width: "30px",
      height: "30px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  };

  return (
    <>
      <BreadCrumb title="My Orders" />
      <Container class1="cart-wrapper home-wrapper-2 py-5">
      <div className="mb-4 d-flex justify-content-end">
        <select
          className="form-select w-auto"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="Ordered">Đã đặt hàng</option>
          <option value="Processed">Đã xử lý</option>
          <option value="Shipped">Đang vận chuyển</option>
          <option value="Out for Delivery">Đang giao hàng</option>
          <option value="Delivered">Đã giao hàng</option>
          <option value="Cancelled">Đã hủy</option>
        </select>
      </div>

        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Tình trạng</th>
                <th>Đơn giá</th>
                <th>Ngày đặt</th>
                <th>Tổng sau giảm</th>
                <th>Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders &&
                filteredOrders.map((item, index) => (
                  <React.Fragment key={index}>
                    <tr>
                      <td>{item?._id}</td>
                      <td>
                        <span className={getStatusStyle(item?.orderStatus)}>
                          {item?.orderStatus}
                        </span>
                      </td>
                      <td>{item?.totalPrice.toLocaleString("vi-VN")} ₫</td>
                      <td>{new Date(item?.createdAt).toLocaleString()}</td>
                      <td>
                        {item?.totalPriceAfterDiscount.toLocaleString("vi-VN")} ₫
                      </td>
                      <td>
                      <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => toggleExpandOrder(item?._id)}
                        >
                          {expandedOrders[item?._id] ? (
                            <FaMinus /> // Biểu tượng "-"
                          ) : (
                            <FaPlus /> // Biểu tượng "+"
                          )}
                        </button>
                      </td>
                    </tr>
                    {expandedOrders[item?._id] && (
                      <tr>
                        <td colSpan={6}>
                          <div className="p-3 bg-light rounded">
                            {/* Thông tin thanh toán */}
                            <h5>Thông tin thanh toán</h5>
                            <p>Hình thức: {item.paymentMethod}</p>

                            {/* Thông tin vận chuyển */}
                            <h5>Thông tin vận chuyển</h5>
                            <p>Tình trạng: {item.orderStatus}</p>
                            <p>
                              Địa chỉ: {item.shippingInfo.address}, {item.shippingInfo.city},{" "}
                              {item.shippingInfo.state}, {item.shippingInfo.country}
                            </p>

                            {/* Thông tin người nhận */}
                            <h5>Thông tin người nhận</h5>
                            <p>
                              Họ tên: {item.shippingInfo.firstname} {item.shippingInfo.lastname}
                            </p>
                            <p>Số điện thoại: {item.shippingInfo.pincode}</p>

                            {(item.orderStatus === "Ordered" || item.orderStatus === "Processed" ) && (
                              <div className="mt-3">
                                <button
                                  className="btn btn-sm btn-danger"
                                   onClick={() => handleCancelOrder(item?._id)}
                                >
                                  Hủy Đơn Hàng
                                </button>
                              </div>
                            )}

                            {/* Nếu trạng thái là "Delivered", hiển thị nút Review */}
                            {item.orderStatus === "Delivered" && (
                              <div className="mt-3">
                                <button
                                  className="btn btn-sm btn-success"
                                  onClick={() => handleReview(item?.orderItems[0]?.product?._id)}
                                  
                                >
                                 
                                  Review Sản Phẩm
                                </button>
                                
                              </div>
                              
                            )}


                            <h5>Chi Tiết Sản Phẩm</h5>
                            <div style={styles.productHeader}>
                              <div style={styles.productColumn}>
                                <h6>Tên sản phẩm</h6>
                              </div>
                              <div style={styles.productColumn}>
                                <h6>Hình ảnh</h6>
                              </div>
                              <div style={styles.productColumn}>
                                <h6>Color</h6>
                              </div>
                              <div style={styles.productColumn}>
                                <h6>Số lượng</h6>
                              </div>
                              <div style={styles.productColumn}>
                                <h6>Đơn giá</h6>
                              </div>
                              <div style={styles.productColumn}>
                                <h6>Tổng tiền</h6>
                              </div>
                            </div>

                            {/* Lặp qua danh sách orderItems */}
                            {item?.orderItems?.map((i, index) => {
                              return (
                                <div style={styles.productItem} key={index}>
                                  <div style={styles.productColumn}>
                                    <p>{i?.product?.title}</p>
                                  </div>
                                  <div style={styles.productColumn}>
                                    <img
                                      src={i?.product?.images[0]?.url}
                                      width={50}
                                      height={50}
                                      alt="product"
                                      onClick={() => handleReview(i?.product?._id)}
                                    />
                                  </div>
                                  <div style={styles.productColumn}>
                                    <ul style={styles.colors}>
                                      <li
                                        style={{
                                          ...styles.colorItem,
                                          backgroundColor: i?.color?.title,
                                        }}
                                      ></li>
                                    </ul>
                                  </div>
                                  <div style={styles.productColumn}>
                                    <p>{i?.quantity}</p>
                                  </div>
                                  <div style={styles.productColumn}>
                                    <p>{i?.price.toLocaleString("vi-VN")} ₫</p>
                                  </div>
                                  <div style={styles.productColumn}>
                                    {/* Tổng tiền tính toán: Đơn giá * Số lượng */}
                                    <p>{(i?.price * i?.quantity).toLocaleString("vi-VN")} ₫</p>
                                  </div>
                                </div>
                              );
                            })}

                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
            </tbody>
          </table>
        </div>
      </Container>
    </>
  );
};

export default Orders;
