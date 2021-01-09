import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

//Asetetaan uusi tokenin arvo moduulin exporttaamalla funktiolla setToken
const setToken = newToken => {  
  token = `bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

//asettaa moduulin tallessa pitämän tokenin Authorization-headeriin
const create = newObject => {
  const config = {
    headers: { Authorization: token },
  }
  
  const request = axios.post(baseUrl, newObject, config)
  return request.then(response => response.data)
}

//Päivitetään blogi
const update = (id, newObject) => {
  const request = axios.put(`${ baseUrl }/${id}`, newObject)
  return request.then(response => response.data)
}

//Haetaan käyttäjät
const getAllUsers = () => {
  const request = axios.get('/api/users')
  return request.then(response => response.data)
}

//Poistetaan blogi
const remove = (id) => {
  const config = {
    headers: { Authorization: token },
  }
  const request = axios.delete(`${baseUrl}/${id}`, config)
  return request.then(response => response.data)
}

export default { getAll, create, setToken, update, getAllUsers, remove }