import axios from "axios";
import { base_url } from "../../utils/baseUrl";

const getUsers = async () => {
  try {
    const response = await axios.get(`${base_url}user/all-users`, {
      headers: {
        "ngrok-skip-browser-warning": "69420"
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

const blockUser = async (Id, token) => {
  try {
    const response = await axios.put(`${base_url}user/block-user/${Id}`, "",{
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "69420"
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error in blockUser:", error.response || error.message);
    throw new Error(error.response?.data?.message || error.message);
  }
};

const unblockUser = async (Id, token) => {
  try {
    const response = await axios.put(`${base_url}user/unblock-user/${Id}`, "", {
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "69420"
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error in unblockUser:", error.response || error.message);
    throw new Error(error.response?.data?.message || error.message);
  }
};

const updateUser = async (data, token) => {
  try {
    const response = await axios.put(
      `${base_url}user/edit-user/${data.key}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Ensure the headers are included
          "ngrok-skip-browser-warning": "69420"
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error in updateUser:", error.response || error.message);
    throw new Error(error.response?.data?.message || error.message);
  }
};

const customerService = {
  getUsers,
  blockUser,
  unblockUser,
  updateUser,
};

export default customerService;
