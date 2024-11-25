import axios from 'axios';

export function getAuthHeaders() {
  const token = localStorage.getItem('jwtToken');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

export function fetchData() {
  return axios.get('/api/data', getAuthHeaders());
}