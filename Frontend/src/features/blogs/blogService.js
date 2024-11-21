import axios from "axios";
import { base_url, config } from "../../utils/axiosConfig";

const getBlogs = async () => {
  const response = await axios.get(`${base_url}blog`, {
    headers: {
      "ngrok-skip-browser-warning": "69420"
    }
  });
  if (response.data) {
    return response.data;
  }
};

const getBlog = async (id) => {
  const response = await axios.get(`${base_url}blog/${id}`, {
    headers: {
      "ngrok-skip-browser-warning": "69420"
    }
  });
  if (response.data) {
    return response.data;
  }
};

export const blogService = {
  getBlogs,
  getBlog,
};
