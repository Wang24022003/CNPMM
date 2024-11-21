const User = require("../models/userModel");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const Coupon = require("../models/couponModel");
const Order = require("../models/orderModel");
const uniqid = require("uniqid");

const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");
const validateMongoDbId = require("../utils/validateMongodbId");
const { generateRefreshToken } = require("../config/refreshtoken");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const sendEmail = require("./emailCtrl");
const { createPasswordResetToken } = require("../models/userModel");

// Create a User ----------------------------------------------

const createUser = asyncHandler(async (req, res) => {
  /**
   * TODO:Get the email from req.body
   */
  const email = req.body.email;
  /**
   * TODO:With the help of email find the user exists or not
   */
  const findUser = await User.findOne({ email: email });

  if (!findUser) {
    /**
     * TODO:if user not found user create a new user
     */
    const { firstname, lastname, email, mobile, password } = req.body;
    const user = { firstname, lastname, email, mobile, password };
    const newUser = await User.create(user);
    res.json(newUser);
  } else {
    /**
     * TODO:if user found then thow an error: User already exists
     */
    throw new Error("User Already Exists");
  }
});

// Active Account user
const activeUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email: email });
  if (findUser) {
    const otp = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, "0");
    const resetURL = `Chào bạn, vui lòng nhập OTP sau ${otp} để kích hoạt tài khoản của bạn.Mã OTP này có hiệu lực trong vòng 10 phút kể từ bây giờ.`;
    findUser.codeId = otp;
    findUser.save();
    const data = {
      to: email,
      text: "Hey User",
      subject: "Active Account",
      htm: resetURL,
    };
    sendEmail(data);
    res.json("oki");
  } else {
    throw new Error("Invalid Credentials");
  }
});
//Check active code
const checkActiveCode = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const findUser = await User.findOne({ email: email });
  if (findUser) {
    const { codeId } = findUser;
    if (otp === codeId) {
      findUser.isBlocked = false;
      findUser.save();
      res.json("oki");
    } else {
      throw new Error("Invalid OTP code");
    }
  }
});
// Login a user
const loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // check if user exists or not
  const findUser = await User.findOne({ email });
  if (!findUser.isBlocked) {
    if (findUser && (await findUser.isPasswordMatched(password))) {
      const refreshToken = await generateRefreshToken(findUser?._id);
      const updateuser = await User.findByIdAndUpdate(
        findUser.id,
        {
          refreshToken: refreshToken,
        },
        { new: true }
      );
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000,
      });
      res.json({
        _id: findUser?._id,
        firstname: findUser?.firstname,
        lastname: findUser?.lastname,
        email: findUser?.email,
        mobile: findUser?.mobile,
        token: generateToken(findUser?._id),
      });
    } else {
      throw new Error("Invalid Credentials");
    }
  } else {
    throw new Error("User Account isn't Active");
  }
});

// admin login

// const loginAdmin = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;
//   // check if user exists or not
//   const findAdmin = await User.findOne({ email });
//   if (findAdmin.role !== "admin") throw new Error("Not Authorised");
//   if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
//     const refreshToken = await generateRefreshToken(findAdmin?._id);
//     const updateuser = await User.findByIdAndUpdate(
//       findAdmin.id,
//       {
//         refreshToken: refreshToken,
//       },
//       { new: true }
//     );
//     res.cookie("refreshToken", refreshToken, {
//       httpOnly: true,
//       maxAge: 72 * 60 * 60 * 1000,
//     });
//     res.json({
//       _id: findAdmin?._id,
//       firstname: findAdmin?.firstname,
//       lastname: findAdmin?.lastname,
//       email: findAdmin?.email,
//       mobile: findAdmin?.mobile,
//       token: generateToken(findAdmin?._id),
//     });
//   } else {
//     throw new Error("Invalid Credentials");
//   }
// });
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Kiểm tra xem người dùng có tồn tại không
  const findAdmin = await User.findOne({ email });
  if (!findAdmin) {
    return res.status(401).json({ message: "Invalid Credentials" });
  }

  // Kiểm tra mật khẩu
  const isPasswordMatched = await findAdmin.isPasswordMatched(password);
  if (!isPasswordMatched) {
    return res.status(401).json({ message: "Invalid Credentials" });
  }

  // Kiểm tra vai trò admin
  if (findAdmin.role !== "admin") {
    return res.status(401).json({ message: "You are not Admin" });
  }

  // Tạo refresh token và cập nhật người dùng
  const refreshToken = await generateRefreshToken(findAdmin?.id);
  const updateAdmin = await User.findByIdAndUpdate(
    findAdmin.id,
    {
      refreshToken: refreshToken,
    },
    {
      new: true,
    }
  );

  // Thiết lập cookie refresh token
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 72 * 60 * 60 * 1000,
  });

  // Trả về thông tin người dùng và token
  res.json({
    _id: findAdmin?._id,
    firstname: findAdmin?.firstname,
    lastname: findAdmin?.lastname,
    email: findAdmin?.email,
    mobile: findAdmin?.mobile,
    token: generateToken(findAdmin?._id),
    role: findAdmin?.role,
  });
});

// handle refresh token

const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.refreshToken) {
    return res.status(401).json({ message: "No Refresh Token in Cookies" });
  }
  const refreshToken = cookies.refreshToken;
  const user = await User.findOne({ refreshToken });

  if (!user) {
    return res
      .status(403)
      .json({ message: "Refresh Token not found, please login again" });
  }

  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      return res
        .status(403)
        .json({ message: "Refresh Token is invalid, please login again" });
    }
    const accessToken = generateToken(user._id);
    res.json({ accessToken });
  });
});

// logout functionality

const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204); // forbidden
  }
  await User.findOneAndUpdate(refreshToken, {
    refreshToken: "",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204); // forbidden
});

// Update a user

const updatedUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log("data" + id);
  validateMongoDbId(id);

  try {
    const { email } = req.body;

    // Kiểm tra xem có cập nhật email và email mới không trùng với bất kỳ người dùng nào khác
    if (email && (await User.exists({ email: email, _id: { $ne: id } }))) {
      return res.status(400).json({ message: "Email is already in use" });
    }

    const updatedFields = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      mobile: req.body.mobile,
      role: req.body.role,
    };

    // Nếu email không được cập nhật, hoặc được cập nhật nhưng không trùng với bản ghi khác, ta tiến hành cập nhật
    const updatedUser = await User.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });

    res.json(updatedUser);
  } catch (error) {
    console.error("Failed to update user:", error);
    res.status(500).json({ message: "Failed to update user" });
  }
});
// save user Address

const saveAddress = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  validateMongoDbId(_id);

  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        address: req?.body?.address,
      },
      {
        new: true,
      }
    );
    res.json(updatedUser);
  } catch (error) {
    throw new Error(error);
  }
});

// Get all users

const getallUser = asyncHandler(async (req, res) => {
  try {
    const getUsers = await User.find().populate("wishlist");
    res.json(getUsers);
  } catch (error) {
    throw new Error(error);
  }
});

// Get a single user

const getaUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const getaUser = await User.findById(id);
    res.json({
      getaUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Get a single user

const deleteaUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const deleteaUser = await User.findByIdAndDelete(id);
    res.json({
      deleteaUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const blockusr = await User.findByIdAndUpdate(
      id,
      { isBlocked: true },
      { new: true }
    );
    if (!blockusr) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(blockusr);
  } catch (error) {
    console.error("Error blocking user:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const unblock = await User.findByIdAndUpdate(
      id,
      { isBlocked: false },
      { new: true }
    );
    if (!unblock) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ unblock, message: "User UnBlocked" });
  } catch (error) {
    console.error("Error unblocking user:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;
  validateMongoDbId(_id);
  const user = await User.findById(_id);
  if (password) {
    user.password = password;
    const updatedPassword = await user.save();
    res.json(updatedPassword);
  } else {
    res.json(user);
  }
});

const forgotPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found with this email");
  try {
    const token = await user.createPasswordResetToken();

    await user.save();
    console.log(token);
    const resetURL = `Chào bạn, vui lòng truy cập vào liên kết này để đặt lại mật khẩu của bạn. Liên kết này có hiệu lực trong vòng 10 phút kể từ bây giờ. <a href='http://localhost:3000/reset-password/${token}'>Click Here</>`;

    const data = {
      to: email,
      text: "Hey User",
      subject: "Forgot Password Link",
      htm: resetURL,
    };
    sendEmail(data);
    res.json(token);
  } catch (error) {
    throw new Error(error);
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error(" Token Expired, Please try again later");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.json(user);
});

const getWishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const findUser = await User.findById(_id).populate("wishlist");
    res.json(findUser);
  } catch (error) {
    throw new Error(error);
  }
});

const userCart = asyncHandler(async (req, res) => {
  const { productId, color, quantity, price } = req.body;

  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    let newCart = await new Cart({
      userId: _id,
      productId,
      color,
      price,
      quantity,
    }).save();
    res.json(newCart);
  } catch (error) {
    throw new Error(error);
  }
});

const getUserCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const cart = await Cart.find({ userId: _id })
      .populate("productId")
      .populate("color");
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});

const removeProductFromCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { cartItemId } = req.params;
  validateMongoDbId(_id);
  try {
    const deleteProductFromcart = await Cart.deleteOne({
      userId: _id,
      _id: cartItemId,
    });

    res.json(deleteProductFromcart);
  } catch (error) {
    throw new Error(error);
  }
});

const emptyCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const deleteCart = await Cart.deleteMany({
      userId: _id,
    });

    res.json(deleteCart);
  } catch (error) {
    throw new Error(error);
  }
});

const updateProductQuantityFromCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { cartItemId, newQuantity } = req.params;
  validateMongoDbId(_id);
  try {
    const cartItem = await Cart.findOne({
      userId: _id,
      _id: cartItemId,
    });
    cartItem.quantity = newQuantity;
    cartItem.save();
    res.json(cartItem);
  } catch (error) {
    throw new Error(error);
  }
});

const createOrder = asyncHandler(async (req, res) => {
  const {
    shippingInfo,
    orderItems,
    totalPrice,
    totalPriceAfterDiscount,
    paymentInfo,
  } = req.body;
  const { _id } = req.user;

  try {
    const order = await Order.create({
      shippingInfo,
      orderItems,
      totalPrice,
      totalPriceAfterDiscount,
      paymentInfo,
      user: _id,
    });
    res.json({
      order,
      success: true,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    throw new Error(error);
  }
});

const getMyOrders = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const orders = await Order.find({ user: _id })
      .populate("user")
      .populate("orderItems.product")
      .populate("orderItems.color");
    res.json({
      orders,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getAllOrders = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const orders = await Order.find().populate("user");
    // .populate("orderItems.product")
    // .populate("orderItems.color");
    res.json({
      orders,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getsingleOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const orders = await Order.findOne({ _id: id })
      .populate("user")
      .populate("orderItems.product")
      .populate("orderItems.color");
    res.json({
      orders,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const updateOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const orders = await Order.findById(id);
    orders.orderStatus = req.body.status;
    await orders.save();
    res.json({
      orders,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getMonthWiseOrderIncome = asyncHandler(async (req, res) => {
  let monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let d = new Date();
  let endDate = "";
  d.setDate(1);
  for (let index = 0; index < 11; index++) {
    d.setMonth(d.getMonth() - 1);
    endDate = monthNames[d.getMonth()] + " " + d.getFullYear();
  }
  const data = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $lte: new Date(),
          $gte: new Date(endDate),
        },
      },
    },
    {
      $group: {
        _id: {
          month: "$month",
        },
        amount: { $sum: "$totalPriceAfterDiscount" },
        count: { $sum: 1 },
      },
    },
  ]);
  res.json(data);
});

const getYearlyTotalOrder = asyncHandler(async (req, res) => {
  let monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let d = new Date();
  let endDate = "";
  d.setDate(1);
  for (let index = 0; index < 11; index++) {
    d.setMonth(d.getMonth() - 1);
    endDate = monthNames[d.getMonth()] + " " + d.getFullYear();
  }
  const data = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $lte: new Date(),
          $gte: new Date(endDate),
        },
      },
    },
    {
      $group: {
        _id: null,
        amount: { $sum: 1 },
        amount: { $sum: "$totalPriceAfterDiscount" },
        count: { $sum: 1 },
      },
    },
  ]);
  res.json(data);
});

module.exports = {
  createUser,
  loginUserCtrl,
  getallUser,
  getaUser,
  deleteaUser,
  updatedUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  loginAdmin,
  getWishlist,
  saveAddress,
  userCart,
  getUserCart,
  createOrder,
  getMyOrders,
  emptyCart,
  getMonthWiseOrderIncome,
  getAllOrders,
  getsingleOrder,
  updateOrder,
  getYearlyTotalOrder,

  removeProductFromCart,
  updateProductQuantityFromCart,

  activeUser,
  checkActiveCode,
};
