const crypto = require("crypto");
const querystring = require("qs");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const {
  vnp_TmnCode,
  vnp_HashSecret,
  vnp_Url,
  vnp_ReturnUrl,
} = require("../config/vnpayConfig");
const dateFormat = require("dayjs");

const checkout = async (req, res) => {
  const {
    amount,
    orderInfo,
    paymentMethod,
    shippingInfo,
    orderItems,
    totalPrice,
    totalPriceAfterDiscount,
  } = req.body;
  const ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  try {
    // console.log('Checkout data:', {
    //   user: req.user,
    //   shippingInfo,
    //   paymentMethod,
    //   orderItems,
    //   totalPrice,
    //   totalPriceAfterDiscount,
    // });

    if (!req.user || !req.user._id) {
      throw new Error("User not authenticated");
    }

    // Log từng phần tử của orderItems để kiểm tra
    orderItems.forEach((item, index) => {
      // console.log(`Order item ${index}:`, item);
      if (!item.product) {
        throw new Error(`Product is required for order item ${index}`);
      }
    });

    const newOrder = new Order({
      user: req.user._id,
      shippingInfo,
      paymentMethod,
      orderItems,
      totalPrice,
      totalPriceAfterDiscount,
      orderStatus: paymentMethod === "COD" ? "Ordered" : "Pending",
    });

    const savedOrder = await newOrder.save();
    // console.log("Order saved:", savedOrder);
    // Update product quantities and sold count
    for (let item of orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.quantity -= item.quantity;
        product.sold = (product.sold || 0) + item.quantity;
        if (product.quantity <= 0) {
          await Product.findByIdAndDelete(product._id);
        } else {
          await product.save();
        }
      }
    }

    if (paymentMethod === "COD") {
      res.json({
        success: true,
        message: "Order placed successfully with Cash on Delivery",
      });
    } else {
      // Handling VNPay payment
      const tmnCode = vnp_TmnCode;
      const secretKey = vnp_HashSecret;
      let vnpUrl = vnp_Url;
      const returnUrl = `${vnp_ReturnUrl}?orderId=${savedOrder._id}`;

      const date = new Date();
      const createDate = dateFormat(date).format("YYYYMMDDHHmmss");
      const orderId = dateFormat(date, "HHmmss");
      const amountInVND = amount * 100;
      const bankCode = "";

      let vnp_Params = {
        vnp_Version: "2.1.0",
        vnp_Command: "pay",
        vnp_TmnCode: tmnCode,
        vnp_Locale: "vn",
        vnp_CurrCode: "VND",
        vnp_TxnRef: savedOrder._id,
        vnp_OrderInfo: orderInfo,
        vnp_OrderType: "billpayment",
        vnp_Amount: amountInVND,
        vnp_ReturnUrl: returnUrl,
        vnp_IpAddr: ipAddr,
        vnp_CreateDate: createDate,
      };

      if (bankCode) {
        vnp_Params["vnp_BankCode"] = bankCode;
      }

      vnp_Params = Object.entries(vnp_Params)
        .sort(([key1], [key2]) =>
          key1.toString().localeCompare(key2.toString())
        )
        .reduce((result, item) => {
          result = {
            ...result,
            [item[0]]: encodeURIComponent(
              item[1].toString().replace(/ /g, "+")
            ),
          };

          return result;
        }, {});

      const signData = querystring.stringify(vnp_Params, { encode: false });
      const hmac = crypto.createHmac("sha512", secretKey);
      const signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
      vnp_Params["vnp_SecureHash"] = signed;
      vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });
      console.log("VNPay URL:", vnpUrl);
      res.json({
        success: true,
        vnpUrl,
      });
    }
  } catch (error) {
    console.error("Error during checkout:", error);
    res.status(500).json({
      success: false,
      message: `Failed to place ${paymentMethod} order`,
      error: error.message, // Send detailed error message to the client
    });
  }
};

const paymentVerification = async (req, res) => {
  let vnp_Params = req.query;
  const secureHash = vnp_Params["vnp_SecureHash"];
  const orderId = vnp_Params["orderId"];

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];
  delete vnp_Params["orderId"];

  vnp_Params = Object.entries(vnp_Params)
    .sort(([key1], [key2]) => key1.toString().localeCompare(key2.toString()))
    .reduce((result, item) => {
      result = {
        ...result,
        [item[0]]: encodeURIComponent(item[1].toString().replace(/ /g, "+")),
      };

      return result;
    }, {});
  const secretKey = vnp_HashSecret;
  const signData = querystring.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac("sha512", secretKey);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  if (secureHash === signed) {
    try {
      await Order.findByIdAndUpdate(orderId, { orderStatus: "Paid" });

      res.json({
        success: true,
        message: "Payment verified successfully",
        data: vnp_Params,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to update order status",
      });
    }
  } else {
    res.json({
      success: false,
      message: "Payment verification failed",
    });
  }
};

// function sortObject(obj) {
//   const sorted = {};
//   const keys = Object.keys(obj).sort();
//   keys.forEach((key) => {
//     sorted[key] = obj[key];
//   });
//   return sorted;
// }

// function dateFormat(date, format) {
//   const map = {
//     mm: ("0" + (date.getMonth() + 1)).slice(-2),
//     dd: ("0" + date.getDate()).slice(-2),
//     HH: ("0" + date.getHours()).slice(-2),
//     MM: ("0" + date.getMinutes()).slice(-2),
//     ss: ("0" + date.getSeconds()).slice(-2),
//     yyyy: date.getFullYear(),
//   };
//   return format.replace(/mm|dd|HH|MM|ss|yyyy/gi, (matched) => map[matched]);
// }

module.exports = {
  checkout,
  paymentVerification,
};
