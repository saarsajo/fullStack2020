import React from 'react'

//Palautetaan henkilön nimi ja puhelinnumero
const Person = ({ name, number }) => {
  return (
    <li>
        {name} {number}
    </li>
  )
}

export default Person