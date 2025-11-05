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
  )
}

const updateLikes = async (newObject, user, blogId) => {
  if (blogId) {
    const response = await axios.put(
      `${baseUrl}/${blogId}`,
      newObject,
      {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
    )
    return response.data
  }
}

export default { getAll, create, updateLikes }