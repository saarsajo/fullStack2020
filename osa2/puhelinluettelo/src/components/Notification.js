import React from 'react'

//Ilmoitukset, joita ohjelma tulostaa näytölle käyttäjän painamien painikkeiden perusteella
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