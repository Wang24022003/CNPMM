import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import Container from "../components/Container";
import CustomInput from "../components/CustomInput";
import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/user/userSlice";
import logo from "../assets/Remove-bg.ai_1720413887960.png"; // Adjust the path according to your project structure
import './../Css/CssLogin.css';

let loginSchema = yup.object({
  email: yup
    .string()
    .required("Email is Required")
    .email("Email Should be valid"),

  password: yup.string().required("Password is Required"),
});

const Login = () => {
  const authState = useSelector((state) => state.auth);
  // const isBlocked = useSelector((state) => state.auth.isBlocked);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: (values) => {
      dispatch(loginUser(values));
      localStorage.setItem('password', formik.values.password);
    },
  });

  useEffect(() => {
    if (authState.user !== null && authState.isError === false) {
      window.location.href = "/";
    }
    if (authState.isError === true ) {

      if(authState.isBlocked === true){
        window.location.href = `/otp/${formik.values.email}`;
      }
    }
  }, [authState]);

  return (
    <>
      <Meta title={"Login"} />
      <BreadCrumb title="Login" />

      <Container class1="login-wrapper py-5 home-wrapper-2">
        <div className="auth-cards d-flex">
          {/* Bên trái - Ảnh */}
          <div className="login-image d-flex justify-content-center align-items-center">
            <img
              src="images/Home1.jpg"
              alt="Login Illustration"
              className="img-fluid"
            />
          </div>

          {/* Bên phải - Form */}
          <div className="login-form">
          <h3 className="text-center mb-3">
            Đăng nhập vào <span className="stylish-text">Sắc</span>
          </h3>

            <p className="text-left mb-3">Nhập thông tin của bạn bên dưới</p>
            <form
              onSubmit={formik.handleSubmit}
              className="d-flex flex-column gap-15"
            >
            <label htmlFor="email" className="form-labels">
              Email <span className="required">*</span>
            </label>
              <CustomInput
                type="email"
                name="email"
                placeholder="Nhập Gmail"
                value={formik.values.email}
                onChange={formik.handleChange("email")}
                onBlur={formik.handleBlur("email")}
              />
              <div className="error">
                {formik.touched.email && formik.errors.email}
              </div>
              <label htmlFor="password" className="form-labels">
                Mật khẩu <span className="required">*</span>
              </label>
              <CustomInput
                type="password"
                name="password"
                placeholder="Nhập mật khẩu"
                value={formik.values.password}
                onChange={formik.handleChange("password")}
                onBlur={formik.handleBlur("password")}
              />
              <div className="error">
                {formik.touched.password && formik.errors.password}
              </div>

              <div className="d-flex justify-content-between align-items-center mb-1">
                <button className="buttons border-0 button" type="submit">
                  Đăng nhập
                </button>
                <Link to="/forgot-password">Quên mật khẩu?</Link>
                
              </div>

              <div>
  
              <span>
                Bạn chưa có tài khoản? <Link to="/signup" className="signup-link">Đăng ký</Link>
              </span>
              </div>
            </form>
          </div>
        </div>

      </Container>
    </>
  );
};

export default Login;
