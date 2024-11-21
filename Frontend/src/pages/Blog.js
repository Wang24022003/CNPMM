import React, { useEffect, useState } from "react";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import BlogCard from "../components/BlogCard";
import Container from "../components/Container";
import { useDispatch, useSelector } from "react-redux";
import { getAllBlogs as fetchAllBlogs, getBlogCategories } from "../features/blogs/blogSlice";
import moment from "moment";

const Blog = () => {
  const dispatch = useDispatch();
  const blogState = useSelector((state) => state?.blog?.blog || []);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (Array.isArray(blogState)) {
      let categoryList = blogState.map((element) => element.category);
      setCategories(categoryList);
    }
  }, [blogState]);

  useEffect(() => {
    dispatch(fetchAllBlogs({ category: selectedCategory }));
  }, [selectedCategory, dispatch]);

  const filteredBlogs = selectedCategory
    ? blogState.filter((blog) => blog.category === selectedCategory)
    : blogState;

  return (
    <>
      <Meta title={"Blogs"} />
      <BreadCrumb title="Blogs" />
      <Container class1="blog-wrapper home-wrapper-2 py-5">
        <div className="row">
          <div className="col-3">
            <div className="filter-card mb-3">
              <h3 className="filter-title">Tìm theo danh mục</h3>
              <div>
                <ul className="ps-0">
                  <li
                    className="ps-0"
                    style={{ color: "var(--color-777777)" }}
                    onClick={() => setSelectedCategory(null)}
                  >
                    All
                  </li>

                  {categories &&
                    [...new Set(categories)].map((item, index) => (
                      <li key={index} onClick={() => setSelectedCategory(item)}>
                        {item}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="col-9">
            <div className="row">
              {filteredBlogs &&
                filteredBlogs.map((item, index) => (
                  <div className="col-6 mb-3" key={index}>
                    <BlogCard
                      id={item?._id}
                      title={item?.title}
                      description={item?.description}
                      image={item?.images[0]?.url}
                      date={moment(item?.createdAt).format("MMMM Do YYYY, h:mm a")}
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Blog;
