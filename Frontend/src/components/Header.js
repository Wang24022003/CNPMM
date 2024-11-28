import React, { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { IoMdSearch } from "react-icons/io";
import { FaHeart, FaRegHeart, } from 'react-icons/fa';
import { MdOutlineShoppingCart } from "react-icons/md";
import { FiUser } from "react-icons/fi";
import compare from "../images/compare.svg";
import wishlist from "../images/wishlist.svg";
import user from "../images/user.svg";
import cart from "../images/cart.svg";
import menu from "../images/menu.svg";
import { useDispatch, useSelector } from "react-redux";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { getAProduct } from "../features/products/productSlilce";
import { getUserCart } from "../features/user/userSlice";
import logo from "../assets/Logo_Sac.png";
import './../Css/CssHeader.css';
const Header = () => {

  const [showPopup, setShowPopup] = useState(false);
  const [selected, setSelected] = useState([]);


  
  const [isHovered, setIsHovered] = useState(false);


  // Mở hoặc đóng popup khi click vào icon tìm kiếm
  const togglePopup = () => setShowPopup(!showPopup);


  const dispatch = useDispatch();
  const cartState = useSelector((state) => state?.auth?.cartProducts);
  const wishlistState = useSelector((state) => state?.auth?.wishlist?.wishlist);
  const authState = useSelector((state) => state?.auth);
  const [total, setTotal] = useState(null);
  const [paginate, setPaginate] = useState(true);
  const productState = useSelector((state) => state?.product?.product);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(null);


  const getTokenFromLocalStorage = localStorage.getItem("customer")
    ? JSON.parse(localStorage.getItem("customer"))
    : null;

  const config2 = {
    headers: {
      Authorization: `Bearer ${
        getTokenFromLocalStorage !== null ? getTokenFromLocalStorage.token : ""
      }`,
      "ngrok-skip-browser-warning": "69420"
    },
  };

  useEffect(() => {
    dispatch(getUserCart(config2));
  }, []);

  const [productOpt, setProductOpt] = useState([]);

  useEffect(() => {
    let sum = 0;
    for (let index = 0; index < cartState?.length; index++) {
      sum = sum + Number(cartState[index].quantity) * cartState[index].price;
      setTotal(sum);
    }
  }, [cartState]);




  useEffect(() => {
    let totalQuantity = 0; // Khởi tạo biến totalQuantity để tính tổng số lượng
    for (let index = 0; index < wishlistState?.length; index++) {
      totalQuantity = totalQuantity + Number(wishlistState[index].quantity); // Cộng dồn số lượng vào totalQuantity
    }
    setTotal(totalQuantity); // Cập nhật state với tổng số lượng
  }, [wishlistState]);



  

  useEffect(() => {
    let data = [];
    let category = [];
    for (let index = 0; index < productState?.length; index++) {
      const element = productState[index];
      data.push({ id: index, prod: element?._id, name: element?.title });
      category.push(element.category);
    }
    setProductOpt(data);
    setCategories(category);
  }, [productState]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  // Function to scroll to the top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // State to manage the visibility of the scroll-to-top button
  const [isVisible, setIsVisible] = useState(false);

  // Show or hide the button based on the scroll position
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };
  

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);


  
  
  return (
    <div className="header">

<>
      <header className="header-top-strip py-3">
        <div className="container-xxl">
          <div className="row">
            <div className="col-6">
              <p className="text-white mb-0">Miễn phí vận chuyển cho đơn hàng trên 10.000.000đ</p>
            </div>
            <div className="col-6">
              <p className="text-end text-white mb-0">
                Liên hệ: 
                <a className="text-white" href="tel:+84 0971035440">
                  +84 0971.035.440
                </a>
              </p>
            </div>
          </div>
        </div>
      </header>
      <header className="header-upper py-3" style={{ backgroundColor: "#fff" }}>
        <div className="container-xxl">

        <div className="col-12 d-flex justify-content-center" style={{ marginBottom: "-60px", position: "relative" }}>
          <h2>
            <Link style={{  zIndex: 999 }} className="text-white" to="/">
              <img src={logo} alt="Logo" style={{ width: "100px", height: "auto" }} />
            </Link>
          </h2>

          
        </div>


          <div className="row align-items-center">

          <div className="col-3 d-flex justify-content-start gap-4" style={{  position: "relative", zIndex: 999}}>
            <Link
                to="/contact"
                style={{
                  color: "#000",
                  textDecoration: "none",
                  transition: "color 0.3s ease",
                }}
                onMouseEnter={(e) => (e.target.style.color = "gray")}
                onMouseLeave={(e) => (e.target.style.color = "black")}
              >
                + Liên hệ
            </Link>

            <Link
                to="/blogs"
                style={{
                  color: "#000",
                  textDecoration: "none",
                  transition: "color 0.3s ease",
                }}
                onMouseEnter={(e) => (e.target.style.color = "gray")}
                onMouseLeave={(e) => (e.target.style.color = "black")}
              >
                Bài viết
            </Link>

            <Link
                to="/product"
                style={{
                  color: "#000",
                  textDecoration: "none",
                  transition: "color 0.3s ease",
                }}
                onMouseEnter={(e) => (e.target.style.color = "gray")}
                onMouseLeave={(e) => (e.target.style.color = "black")}
              >
                Cửa hàng
            </Link>
          </div>


          


            <div className="col-9">
              <div className="header-upper-links d-flex align-items-center justify-content-end gap-5" 
                style={{ display: "flex", justifyContent: "flex-end", gap: "30px" }} 
              >
              
              <div className="input-group" style={{ position: 'relative' }}>
                  {/* Nút tìm kiếm */}
                  <span 
                    className="input-group-text p-0"
                    style={{
                      backgroundColor: 'transparent', 
                      border: 'none', 
                      cursor: 'pointer',
                      position: 'absolute',
                      right: '0', 
                      bottom: '-17px',
                      color: "#000",
                      transition: "color 0.3s ease",
                    }}
                    onClick={togglePopup}
                   
                  >
                    <IoMdSearch 
                      className="fs-3" 
                      
                    />
                  </span>

                  {/* Popup tìm kiếm */}
                  {showPopup && (
                    <div
                      className="search-popup-overlay"
                      style={{
                        position: 'absolute', 
                        top: '100%', 
                        left: '0',
                        width: '100%',
                        backgroundColor: 'white',
                        padding: '30px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        zIndex: 9999,
                        borderRadius: '8px',
                        backgroundColor: 'rgba(243, 243, 243, 0.468)',
                        maxWidth: '800px', 
                        marginTop: '30px', 
                      }}
                      onClick={(e) => e.stopPropagation(false)} // Ngừng sự kiện click từ popup để không đóng nó
                    >
                      {/* Dấu X để đóng popup */}
                      <span
                        onClick={() => setShowPopup(false)} // Đóng popup khi click vào dấu X
                        style={{
                          position: 'absolute',
                          top: '-1px',
                          right: '10px',
                          fontSize: '22px',
                          cursor: 'pointer',
                          color: '#000',
                          fontWeight: 'inherit',
                          transition: 'color 0.3s ease',
                        }}
                        onMouseEnter={(e) => (e.target.style.color = 'red')}
                        onMouseLeave={(e) => (e.target.style.color = '#000')}
                      >
                        X
                      </span>

                      <Typeahead
                        id="pagination-example"
                        onPaginate={() => console.log("Results paginated")}
                        onChange={(selected) => {
                          // Khi người dùng chọn sản phẩm, điều hướng và đóng popup
                          if (selected.length > 0) {
                            navigate(`/product/${selected[0]?.prod}`);
                            setShowPopup(false); // Đóng popup
                            setSelected(selected); // Lưu sản phẩm đã chọn
                          }
                        }}
                        options={productOpt}
                        paginate={paginate}
                        labelKey={"name"}
                        placeholder="Bạn muốn tìm kiếm gì ?"
                        minLength={1}
                      />
                    </div>
                  )}
                </div>




                <div>
                  <Link
                    to="/wishlist"
                    className="d-flex align-items-center gap-10 text-white"
                    style={{ color: "#000", transition: "color 0.3s ease" }}
                    
                  >
                    <div style={{ position: "relative" }}>
                      <span
                        style={{
                          backgroundColor: "#807F7FFF",
                          color: "#fffefe",
                          borderRadius: "50%",
                          width: "24px",
                          height: "24px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "bold",
                          fontSize: "14px",
                          position: "absolute",
                          bottom: "24px",
                          right: "-23px",
                        }}
                      >
                        {wishlistState?.length ? wishlistState?.length : 0}
                      </span>
                      <FaRegHeart size={24} style={{ color: "black" }} /> {/* Sử dụng icon trái tim có viền */}
                    </div>
                  </Link>
                </div>


                <div
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  style={{ position: "relative" }} // Đảm bảo phần tử chứa có vị trí relative
                >
                  <Link
                    to={authState?.user === null ? "/login" : "/my-profile"}
                    className="d-flex align-items-center gap-10 text-white"
                    style={{
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      color: "white",
                      textDecoration: "none",
                    }}
                  >
                    <FiUser size={24} style={{ color: "black", strokeWidth: 2.5 }} />
                    <p
                      style={{
                        position: "absolute",
                        color: "black",
                        marginBottom: 0,
                        fontSize: "14px",
                        marginTop: "55px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {authState?.user === null ? "" : `Welcome ${authState?.user?.firstname}`}
                    </p>
                  </Link>

                  {isHovered && authState?.user !== null && (
                    <div
                      className="dropdown-menu"
                      style={{
                        position: "absolute",
                        top: "120%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: "#fff",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                        borderRadius: "4px",
                        minWidth: "100px",
                        padding: "10px",
                        zIndex: "1000",
                        display: "block", // Đảm bảo dropdown menu luôn hiển thị khi hover
                      }}
                    >
                    <Link to="/my-profile" className="dropdown-item"
                        style={{
                          display: "block",
                          padding: "8px 16px",
                          textDecoration: "none",
                          color: "#333",
                        }}
                      >
                        Tài khoản của tôi
                      </Link>
                      <Link to="/my-orders" className="dropdown-item"
                        style={{
                          display: "block",
                          padding: "8px 16px",
                          textDecoration: "none",
                          color: "#333",
                        }}
                      >
                        Đơn mua
                      </Link>
                      <Link to="/history" className="dropdown-item"
                        style={{
                          display: "block",
                          padding: "8px 16px",
                          textDecoration: "none",
                          color: "#333",
                        }}
                      >
                        Sản phẩm đã mua
                      </Link>
                      {authState?.user !== null && (
                        <button
                          className="dropdown-item border-0 bg-transparent"
                          style={{
                            display: "block",
                            padding: "8px 16px",
                            textDecoration: "none",
                            color: "#333",
                            backgroundColor: "transparent", 
                            cursor: "pointer", 
                            //textAlign: "center", 
                          }}
                          onClick={handleLogout} 
                        >
                          Đăng xuất
                        </button>
                      )}
                    </div>
                  )}
                </div>


                <div>
                  <Link to="/cart" className="d-flex align-items-center gap-10 text-white">
                    <MdOutlineShoppingCart  size={24} style={{ color: "black", zIndex: 2 }} /> {/* Biểu tượng giỏ hàng */}
                    <div className="d-flex flex-column gap-10">
                      <span
                        style={{
                          backgroundColor: "#807F7FFF",
                          color: "#fffefe",
                          borderRadius: "50%",
                          width: "24px",
                          height: "24px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {cartState?.length ? cartState?.length : 0}
                      </span>
                      <p
                        className="mb-0"
                        style={{
                          marginBottom: 0,
                          
                          animation: "blink 1s infinite", // Thêm hiệu ứng nháy vào style trực tiếp
                          color: "red",
                        }}
                      >
                        {!cartState?.length ? 0 : total ? total.toLocaleString('vi-VN') : 0}₫
                      </p>
                    </div>
                  </Link>

                  <style>
                    {`
                      @keyframes blink {
                        0% {
                          opacity: 1;
                        }
                        50% {
                          opacity: 0;
                        }
                        100% {
                          opacity: 1;
                        }
                      }
                    `}
                  </style>
                </div>

              </div>
            </div>

            
          </div>
        </div>
      </header>
      
      {/* Scroll to Top Button */}
      {isVisible && (
        <button
          onClick={scrollToTop}
          style={{
            position: "fixed",
            bottom: "150px",
            right: "25px",
            backgroundColor: "#ff5a5a",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: "50px",
            height: "50px",
            fontSize: "24px",
            cursor: "pointer",
            zIndex: 1000,
          }}
        >
          ↑
        </button>
      )}
    </>
    </div>
    
  );
};

export default Header;
