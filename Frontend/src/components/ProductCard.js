import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist, toggleCompare } from "../features/products/productSlilce";
import { AiFillHeart, AiOutlineHeart, AiOutlinePlusCircle } from "react-icons/ai";
import ReactStars from "react-rating-stars-component";

const ProductCard = (props) => {
  const navigate = useNavigate();
  const { grid, data } = props;
  const dispatch = useDispatch();
  const location = useLocation();

  const wishlistState = useSelector((state) => state?.auth?.wishlist?.wishlist);
  const compareState = useSelector((state) => state?.product?.compareList || []);

  const [wishlist, setWishlist] = useState(wishlistState || []);
  const [compareList, setCompareList] = useState(compareState);

  useEffect(() => {
    setWishlist(wishlistState || []);
  }, [wishlistState]);

  useEffect(() => {
    setCompareList(compareState);
  }, [compareState]);

  const isProductInWishlist = (productId) => wishlist.some((item) => item._id === productId);
  const isProductInCompareList = (productId) => compareList.some((item) => item._id === productId);

  const handleWishlistToggle = (productId) => {
    dispatch(addToWishlist(productId));
  };

  const addToCompare = (productId) => {
    dispatch(toggleCompare(productId));
  };

  return (
    <>
      {data?.map((item, index) => {
        const isWishlist = isProductInWishlist(item._id);
        const isCompare = isProductInCompareList(item._id);

        return (
          <div key={index} className={` ${location.pathname === "/product" ? `gr-${grid}` : "col-3"} `}>
            <div className="product-card position-relative">
              <div className="wishlist-icon position-absolute">
                <button
                  className="border-0 bg-transparent"
                  onClick={() => handleWishlistToggle(item?._id)}
                >
                  {isWishlist ? <AiFillHeart className="fs-5 me-1" /> : <AiOutlineHeart className="fs-5 me-1" />}
                </button>
              </div>

              <div className="product-image">
                <img
                  src={item?.images[0]?.url}
                  alt="product"
                  height={"250px"}
                  width={"100%"}
                  onClick={() => navigate("/product/" + item?._id)}
                />
                <img
                  src={item?.images[0]?.url}
                  alt="product"
                  height={"250px"}
                  width={"100%"}
                  onClick={() => navigate("/product/" + item?._id)}
                />
              </div>

              <div className="product-details">
                <h6 className="brand">{item?.brand}</h6>
                <h5 className="product-title">{grid === 12 || grid === 6 ? item?.title : item?.title?.substr(0, 80) + "..."}</h5>
                <ReactStars count={5} size={24} value={item?.totalrating} edit={false} activeColor="#ffd700" />
                <p className="price">{item?.price && `${item.price.toLocaleString('vi-VN')}đ`}</p>
              </div>
              <div className="action-bar position-absolute">
                <div className="d-flex flex-column gap-15">
                  <button className="border-0 bg-transparent" onClick={() => addToCompare(item?._id)}>
                    <AiOutlinePlusCircle className={`fs-5 ${isCompare ? 'text-danger' : 'text-dark'}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default ProductCard;
