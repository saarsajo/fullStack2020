import React from "react";

//Tämä on filtteri, jonka avulla käyttäjä voi syötteen avulla vähentää näytettäviä nimiä ja puhelinnumeroja
const Filter = ({ value, onChange }) => {
    return (
      <div>
        Filter 
        <input
            value={value}
            onChange={onChange}
        />
      </div>
    )
  }
export default Filter;