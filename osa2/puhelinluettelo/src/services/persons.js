import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'

//Moduuli palauttaa olion, jonka kenttinä (getAll, create, update ja deletePerson) 
//on tiedon lisäämistä, päivittämista ja poistamista käsittelyä hoitava funktio. 
const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = personObject => {
  const request = axios.post(baseUrl, personObject)
  return request.then(response => response.data)
}

const update = (id, personObject) => {
  const request = axios.put(`${baseUrl}/${id}`, personObject)
  return request.then(response => response.data)
}

const deletePerson = (id) => {
    const request = axios.delete(`${baseUrl}/${id}`)
    return request.then(response => response.data)
}

export default { 
  getAll: getAll, 
  create: create, 
  update: update, 
  deletePerson: deletePerson
}