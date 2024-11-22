import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import Container from "../components/Container";
import CustomInput from "../components/CustomInput";
import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { active_account, check_active_account, loginUser } from "../features/user/userSlice";
import logo from "../assets/Remove-bg.ai_1720413887960.png"; // Adjust the path according to your project structure
import './../Css/CssLogin.css';
import { toast } from "react-toastify";

let loginSchema = yup.object({
  email: yup
    .string()
    .required("Email is Required")
    .email("Email Should be valid"),

  password: yup.string().required("Password is Required"),
});

const OTPVerification = () => {
const { id } = useParams();








  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
     dispatch(active_account({email:id}))
   }, []);
  const navigate = useNavigate();
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [timer, setTimer] = useState(300);
  useEffect(() => {
     // Đếm ngược thời gian mỗi giây
     const countdown = setInterval(() => {
         setTimer(prev => prev > 0 ? prev - 1 : 0);
     }, 1000);

     // Xóa bộ đếm ngược khi component bị hủy
     return () => clearInterval(countdown);
 }, []);

  const handleOtpChange = (e, index) => {
     const value = e.target.value;
     if (/^[0-9]?$/.test(value)) { // Chỉ cho phép nhập số từ 0 đến 9
         const newOtp = [...otp];
         newOtp[index] = value;
         setOtp(newOtp);

         // Tự động chuyển sang ô tiếp theo nếu đã nhập đủ 1 ký tự
         if (value && index < 5) {
             document.getElementById(`otp-input-${index + 1}`).focus();
         }
     }
 };

 const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');

    try {
        // Gửi yêu cầu kiểm tra OTP
        await dispatch(check_active_account({ email: id, otp: otpCode })).unwrap();

        // Nếu OTP đúng, điều hướng hoặc thực hiện hành động tiếp theo
        //toast.success("Mã OTP hợp lệ!");
    } catch (error) {
        // Nếu OTP sai, thông báo lỗi và xóa hết các số trong ô nhập
        //toast.error("Mã OTP không hợp lệ. Vui lòng thử lại!");
        setOtp(new Array(6).fill('')); // Reset lại các ô nhập OTP
    }
};


  useEffect(() => {
     if (authState.user !== null && authState.isError === false) {
          // window.location.href = "/";
        }
    if(!authState.isBlocked) {
     dispatch(loginUser({email:id, password:localStorage.getItem('password')}))
     navigate('/')
     // window.location.href = "/";

    }
    
  }, [authState]);


  const handleCancel = () => {
     navigate(-1); // Quay lại trang trước
 };

  // Chuyển đổi thời gian đếm ngược sang định dạng mm:ss
  const formatTime = (seconds) => {
     const minutes = Math.floor(seconds / 60);
     const remainingSeconds = seconds % 60;
     return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
 };



 const handleResendOtp = (e) => {
     e.preventDefault();
     dispatch(active_account({email: id })) // Gọi API gửi lại mã OTP
         .then(() => {
             toast.success('Mã OTP đã được gửi lại vào email của bạn.');
         })
         .catch((error) => {
             //toast.error(error.message || 'Có lỗi xảy ra khi gửi lại mã OTP.');
         });
     //     setIsNavigate(false)
 };
  return (
     <div>
        
         <div style={styles.container}>
             <h2 style={styles.title}>Nhập mã OTP</h2>
             <div style={styles.separator}></div>
             <p style={styles.description}>
                 Vui lòng kiểm tra email của bạn để nhận tin nhắn chứa mã. Mã của bạn gồm 6 chữ số.
             </p>
             <form onSubmit={handleOtpSubmit} style={styles.form}>
                 <div style={styles.otpContainer}>
                     {otp.map((_, index) => (
                         <input
                             key={index}
                             type="text"
                             id={`otp-input-${index}`}
                             value={otp[index]}
                             onChange={(e) => handleOtpChange(e, index)}
                             maxLength="1"
                             style={styles.otpInput}
                         />
                     ))}
                 </div>
                 <div style={styles.timer}>
                     {timer > 0 ? (
                         <span>Thời gian còn lại: <span style={{ color: 'red' }}>{formatTime(timer)}</span></span>
                     ) : (
                         <span style={{ color: 'red' }}>Mã đã hết hạn</span>
                     )}
                 </div>
                 <p style={styles.emailInfo}>Chúng tôi đã gửi mã của bạn đến: <strong>{id}</strong></p>
                 <div style={styles.separator}></div>
                 <div style={styles.actions}>
                     <button type="button" style={styles.link} onClick={handleResendOtp} disabled={timer > 0}>Chưa nhận được mã?</button>
                     <button type="button" onClick={handleCancel} style={styles.cancelButton}>Hủy</button>
                     <button 
                         type="submit" 
                         style={{
                             ...styles.submitButton,
                             backgroundColor: timer > 0 ? '#3b82f6' : '#e5e7eb', 
                             cursor: timer > 0 ? 'pointer' : 'not-allowed', 
                         }} 
                         disabled={timer > 0 ? false : true} 
                     >
                         Xác nhận
                     </button>

                 </div>
             </form>
         </div>
         
     </div>
 );
};


const styles = {
     container: {
         maxWidth: '40%',
         margin: '50px auto',
         padding: '20px',
         borderRadius: '10px',
         backgroundColor: '#ffffff',
         boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
         textAlign: 'center',
         display: 'flex',
         flexDirection: 'column',
         alignItems: 'center',
     },
     title: {
         fontSize: '1.5rem',
         fontWeight: 'bold',
         color: '#1f2937',
         marginBottom: '10px',
     },
     separator: {
         width: '100%',
         height: '1px',
         backgroundColor: '#e5e7eb',
         margin: '10px 0',
     },
     description: {
         fontSize: '1rem',
         color: '#6b7280',
         marginBottom: '20px',
         textAlign: 'center',
     },
     form: {
         display: 'flex',
         flexDirection: 'column',
         alignItems: 'center',
         width: '100%',
     },
     otpContainer: {
         display: 'flex',
         justifyContent: 'space-evenly',
         width: '100%',
         marginBottom: '10px',
         flexWrap: 'wrap',
         gap: '8px',
     },
     otpInput: {
         flex: '1 1 45px',
         maxWidth: '45px',
         height: '45px',
         fontSize: '1.25rem',
         textAlign: 'center',
         border: '1px solid #d1d5db',
         borderRadius: '8px',
         color: '#4b5563',
     },
     timer: {
         fontSize: '0.9rem',
         color: '#6b7280',
         marginBottom: '20px',
         textAlign: 'center',
     },
     emailInfo: {
         fontSize: '0.85rem',
         color: '#6b7280',
         textAlign: 'center',
         marginTop: '10px',
     },
     actions: {
         display: 'flex',
         justifyContent: 'space-between',
         alignItems: 'center',
         width: '100%',
         marginTop: '10px',
         gap: '10px', // Thêm khoảng cách giữa các nút
     },
     link: {
         fontSize: '0.85rem',
         color: '#3b82f6',
         textDecoration: 'underline',
         cursor: 'pointer',
         flex: '1',
         textAlign: 'center',
     },
     cancelButton: {
         padding: '8px 16px',
         backgroundColor: '#e5e7eb',
         color: '#1f2937',
         border: 'none',
         borderRadius: '8px',
         fontSize: '1rem',
         fontWeight: '500',
         cursor: 'pointer',
         flex: '1',
         maxWidth: '100px',
         marginRight: '10px', // Tạo khoảng cách bên phải
     },
     submitButton: {
         padding: '8px 16px',
         backgroundColor: '#3b82f6',
         color: '#ffffff',
         border: 'none',
         borderRadius: '8px',
         fontSize: '1rem',
         fontWeight: '500',
         cursor: 'pointer',
         flex: '1',
         maxWidth: '100px',
         marginLeft: '10px', // Tạo khoảng cách bên trái
     },
 };
export default OTPVerification;
