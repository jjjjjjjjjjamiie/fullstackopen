import axios from 'axios'
const baseUrl = '/api/blogs'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = (newObject, user) => {
  if (user) {
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
}

const updateLikes = async (newObject, user, blogId) => {
  if (user && blogId) {
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

const remove = async (user, blogId) => {
  if (user && blogId) {
    const response = await axios.delete(
      `${baseUrl}/${blogId}`,
      {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
    )
    return response.data
  }
}

export default { getAll, create, updateLikes, remove }