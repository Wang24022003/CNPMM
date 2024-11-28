import React, { useEffect } from "react";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import Container from "../components/Container";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist } from "../features/products/productSlilce";
import { getuserProductHistory, getuserProductWishlist } from "../features/user/userSlice";
import { useNavigate } from "react-router-dom";
const History = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    getWishlistFromDb();
  }, []);
  const getWishlistFromDb = () => {       
    const id = localStorage.getItem("customer");
    dispatch(getuserProductHistory({userId:JSON.parse(id)._id}));
  };
    


  const wishlistState = useSelector((state) => state?.auth?.history);


 
  return (
    <>
      <Meta title={"Wishlist"} />
      <BreadCrumb title="Sản phẩm đã mua" />
      <Container class1="wishlist-wrapper home-wrapper-2 py-5">
        <div className="row">
          {wishlistState && wishlistState.length === 0 && (
            <div className="text-center fs-3">No Data</div>
          )}
          {wishlistState &&
            wishlistState?.map((item, index) => {
              return (
                <div className="col-3" key={index}>
                  <div className="wishlist-card position-relative">
                    <div className="wishlist-card-image">
                    
                      <img
                        src={
                          item?.images[0].url
                            ? item?.images[0].url
                            : "images/watch.jpg"
                        }
                        onClick={() => navigate("/product/" + item?._id)}
                        className="img-fluid w-100"
                        alt="watch"
                      />
                    </div>
                    <div className="py-3 px-3">
                      <h5 className="title">{item?.title}</h5>
                      <h6 className="price">
  {item?.price ? (item.price).toLocaleString('vi-VN') : 0}₫
</h6>

                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </Container>
    </>
  );
};

export default History;
