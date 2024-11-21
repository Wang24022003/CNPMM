import React, { useCallback, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authService } from "../features/user/userService";
import { useDispatch } from "react-redux";
import { deleteUserCart, resetState } from "../features/user/userSlice";
import { config } from "../utils/axiosConfig";
import { toast } from "react-toastify";

const VNPayReturn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const checkPaymentStatus = useCallback(
    async (params) => {
      try {
        const res = await authService.paymentVerification(params);
        toast.success(res?.message);
        dispatch(deleteUserCart(config)); // Xóa giỏ hàng ngay lập tức
        dispatch(resetState()); // Reset trạng thái giỏ hàng
        navigate("/my-orders");
      } catch (error) {
        console.log(error);
      }
    },
    [dispatch, navigate]
  );

  useEffect(() => {
    checkPaymentStatus(Object.fromEntries([...searchParams]));
  }, [searchParams, checkPaymentStatus]);

  return <p>Loading...</p>;
};

export default VNPayReturn;
