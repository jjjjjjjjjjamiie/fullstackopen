import axios from 'axios'
const baseUrl = '/api/blogs'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = (newObject, user) => {
  return axios.post(
    baseUrl,
    newObject,
    {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    }
  );
}

export default { getAll, create }