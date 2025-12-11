// src/services/api.js
import axios from 'axios';

const API_BASE = 'http://localhost:8000';

export function setAuthToken(token) {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
}

export default axios;
