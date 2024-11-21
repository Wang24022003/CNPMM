const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shippingInfo: {
      firstname: {
        type: String,
        required: true,
      },
      lastname: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      other: {
        type: String,
      },
      pincode: {
        type: Number,
        required: true,
      },
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["VNPay", "COD"], // Add other payment methods if needed
    },
    paymentInfo: {
      vnpayOrderId: {
        type: String,
        // required: function() {
        //   return this.paymentMethod === "VNPay";
        // },
      },
      vnpayPaymentId: {
        type: String,
        // required: function() {
        //   return this.paymentMethod === "VNPay";
        // },
      },
    },
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        color: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Color",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    paidAt: {
      type: Date,
      default: Date.now,
    },
    month: {
      type: Number,
      default: new Date().getMonth() + 1, // Adjusted to get the correct month (January is 0)
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    totalPriceAfterDiscount: {
      type: Number,
      required: true,
    },
    orderStatus: {
      type: String,
      default: "Ordered",
    },
  },
  {
    timestamps: true,
  }
);

// Export the model
module.exports = mongoose.model("Order", orderSchema);
