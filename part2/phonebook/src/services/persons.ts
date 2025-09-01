import axios from 'axios'
const baseUrl = 'https://fullstackopen-rs3u.onrender.com/api/persons'

const getAll = () => axios.get(baseUrl)

const create = newObject => axios.post(baseUrl, newObject)

const update = (id, newObject) => axios.put(`${baseUrl}/${id}`, newObject)

const deleteNumber = (id) => axios.delete(`${baseUrl}/${id}`)

export default {
  getAll: getAll,
  create: create,
  update: update,
  deleteNumber: deleteNumber
}