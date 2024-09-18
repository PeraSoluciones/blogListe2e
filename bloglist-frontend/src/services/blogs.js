import axios from 'axios';
import { sortBlogs } from '../utils/helper';
const baseUrl = '/api/blogs';

let token = null;

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return sortBlogs(response.data);
  // return request.then((response) => sortBlogs(response.data));
};

const create = async (data) => {
  const config = {
    headers: { Authorization: token },
  };
  try {
    const response = await axios.post(baseUrl, data, config);
    return response.data;
  } catch (error) {
    return error;
  }
};

const update = async (data) => {
  const config = {
    headers: { Authorization: token },
  };

  try {
    const response = await axios.put(`${baseUrl}/${data.id}`, data, config);
    return response.data;
  } catch (error) {
    return error;
  }
};

const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  };
  try {
    const response = await axios.delete(`${baseUrl}/${id}`, config);
    return response;
  } catch (error) {
    return error;
  }
};

const setToken = async (newToken) => {
  token = `Bearer ${newToken}`;
};

export default {
  getAll,
  create,
  setToken,
  update,
  remove,
};
