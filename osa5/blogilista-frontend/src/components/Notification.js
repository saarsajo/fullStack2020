import React from 'react'

//Määritellään miten notificaatiot toimivat luokan nimen mukaan
const Notification = ({ notification, notificationType }) => {
  if (notification === null) {
    return null
  }

  return (
    <div className={notificationType}>
      {notification}
    </div>
  )
}

export default Notification