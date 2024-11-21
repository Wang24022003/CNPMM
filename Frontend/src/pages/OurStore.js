import React, { useEffect, useState } from "react";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import ReactStars from "react-rating-stars-component";
import ProductCard from "../components/ProductCard";
import Color from "../components/Color";
import Container from "../components/Container";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts, clearCompareList } from "../features/products/productSlilce";
import { Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import './../Css/CssOurStore.css';

const OurStore = () => {
  const [grid, setGrid] = useState(4);
  const productState = useSelector((state) => state?.product?.product);
  const compareList = useSelector((state) => state?.product?.compareList);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [tag, setTag] = useState(null);
  const [category, setCategory] = useState(null);
  const [brand, setBrand] = useState(null);
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  const [sort, setSort] = useState(null);
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    let newBrands = [];
    let category = [];
    let newtags = [];
    console.log("check",productState)

    for (let index = 0; index < productState?.length; index++) {
      const element = productState[index];
      newBrands.push(element.brand);
      category.push(element.category);
      newtags.push(element.tags);
    }
    setBrands(newBrands);
    setCategories(category);
    setTags(newtags);
  }, [productState]);

  const dispatch = useDispatch();
  useEffect(() => {
    getProducts();
  }, [sort, tag, brand, category, minPrice, maxPrice]);
  const getProducts = () => {
    dispatch(
      getAllProducts({ sort, tag, brand, category, minPrice, maxPrice })
    );
  };
  const handleShowModal = () => setShowModal(true); // Mở modal
  const handleCloseModal = () => setShowModal(false); // Đóng modal

  
  return (
    <>
      <Meta title={"Our Store"} />
      <BreadCrumb title="Our Store" />
      <Container class1="store-wrapper home-wrapper-2 py-5">
        <div className="row">
          <div className="col-3">
            <div className="filter-card mb-3">
              <h3 className="filter-title">Danh mục</h3>
              <div>
                <ul className="ps-0">
                  <a
                    className="ps-0"
                    href="/product"
                    style={{ color: "var(--color-777777)" }}
                  >
                    All
                  </a>

                  {categories &&
                    [...new Set(categories)].map((item, index) => {
                      return (
                        <li key={index} onClick={() => setCategory(item)}>
                          {item}
                        </li>
                      );
                    })}
                </ul>
              </div>
            </div>
            <div className="filter-card mb-3">
              <h3 className="filter-title">Khoảng giá</h3>
              <div>
                <h5 className="sub-title">Price</h5>
                <div className="d-flex align-items-center gap-10">
                  <div className="form-floating">
                    <input
                      type="number"
                      className="form-control"
                      id="floatingInput"
                      placeholder="From"
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                    <label htmlFor="floatingInput">Từ</label>
                  </div>
                  <div className="form-floating">
                    <input
                      type="number"
                      className="form-control"
                      id="floatingInput1"
                      placeholder="To"
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                    <label htmlFor="floatingInput1">Đến</label>
                  </div>
                </div>
                {/* <h5 className="sub-title">Colors</h5>
                <div>
                  <Color />
                </div> */}
              </div>
              <div className="mt-4 mb-3">
                <h3 className="sub-title">Nhãn sản phẩm</h3>
                <div>
                  <div className="product-tags d-flex flex-wrap align-items-center gap-10">
                    {tags &&
                      [...new Set(tags)].map((item, index) => {
                        return (
                          <span
                            key={index}
                            onClick={() => setTag(item)}
                            className="text-capitalize badge bg-light text-secondary rounded-3 py-2 px-3"
                          >
                            {item}
                          </span>
                        );
                      })}
                  </div>
                </div>
              </div>
              <div className="mt-4 mb-3">
                <h3 className="sub-title">Thương hiệu</h3>
                <div>
                  <div className="product-tags d-flex flex-wrap align-items-center gap-10">
                    {brands &&
                      [...new Set(brands)].map((item, index) => {
                        return (
                          <span
                            key={index}
                            onClick={() => setBrand(item)}
                            className="text-capitalize badge bg-light text-secondary rounded-3 py-2 px-3"
                          >
                            {item}
                          </span>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-9">
            <div className="filter-sort-grid mb-4">
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-10">
                  <p className="mb-0 d-block" style={{ width: "100px" }}>
                    Sắp xếp theo:
                  </p>
                  <select
                    name=""
                    defaultValue={"manula"}
                    className="form-control form-select"
                    id=""
                    onChange={(e) => setSort(e.target.value)}
                  >
                    <option value="title">A-Z</option>
                    <option value="-title">Z-A</option>
                    <option value="price">Giá Thấp - Cao</option>
                    <option value="-price">Giá Cao - Thấp</option>
                    <option value="createdAt">Ngày Cũ - Mới</option>
                    <option value="-createdAt">Ngày Mới - Cũ</option>
                  </select>
                </div>
                <div className="d-flex align-items-center gap-10">
                  <p className="totalproducts mb-0">
                    {productState?.length} Sản phẩm
                  </p>
                  <div className="d-flex gap-10 align-items-center grid">
                    <img
                      onClick={() => {
                        setGrid(3);
                      }}
                      src="images/gr4.svg"
                      className="d-block img-fluid"
                      alt="grid"
                    />
                    <img
                      onClick={() => {
                        setGrid(4);
                      }}
                      src="images/gr3.svg"
                      className="d-block img-fluid"
                      alt="grid"
                    />
                    <img
                      src="images/gr2.svg"
                      className="d-block img-fluid"
                      alt="grid"
                      onClick={() => {
                        setGrid(6);
                      }}
                    />

                    <img
                      onClick={() => {
                        setGrid(12);
                      }}
                      src="images/gr.svg"
                      className="d-block img-fluid"
                      alt="grid"
                    />
                  </div>
                </div>
              </div>
            </div>

            {compareList.length > 0 && (
              <div className="compare-section mb-4 d-flex justify-content-end">
                {/* Nút so sánh sản phẩm căn lề phải với màu xám nền và chữ đỏ nháy */}
                <Button 
                  variant="primary" 
                  onClick={handleShowModal} 
                  className="blink-effect"
                >
                  So sánh sản phẩm
                </Button>
                <Modal show={showModal} onHide={handleCloseModal}>
                  <Modal.Header closeButton>
                    <Modal.Title>So sánh sản phẩm</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div className="d-flex gap-3 overflow-auto">
                      {compareList.map((item) => (
                        <div key={item._id} className="card" style={{ width: "18rem" }}>
                          <img src={item.images[0]?.url} className="card-img-top" alt={item.title} />
                          <div className="card-body">
                            <h5 className="card-title">{item.title}</h5>
                            <p className="card-text">{item.price.toLocaleString('vi-VN')}đ</p>
                            {/* <button
                              onClick={() => dispatch(clearCompareList(item._id))} 
                              className="btn-close position-absolute top-0 end-0"
                              aria-label="Close"
                            ></button> */}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <Link to="/compare" className="btn btn-primary">So sánh ngay</Link>
                    <button
                      onClick={() => dispatch(clearCompareList())}
                      className="btn btn-secondary ms-2"
                    >
                      Xóa tất cả sản phẩm
                    </button>
                  </Modal.Footer>
                </Modal>
              </div>
            )}



            <div className="products-list pb-5">
              <div className="d-flex gap-10 flex-wrap">
                <ProductCard
                  data={productState ? productState : []}
                  grid={grid}
                />
              </div>
            </div>
            
          </div>
        </div>
      </Container>
    </>
  );
};

export default OurStore;
