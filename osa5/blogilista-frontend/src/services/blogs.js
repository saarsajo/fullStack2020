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
const create = async newObject => {
  const config = {    
    headers: { Authorization: token }  
  }
  const response = await axios.post(baseUrl, newObject, config)  
  return response.then(response => response.data)
}

const update = (id, newObject) => {
  const request = axios.put(`${ baseUrl } /${id}`, newObject)
  return request.then(response => response.data)
}

export default { getAll, create, update, setToken }