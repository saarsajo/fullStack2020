import React, { useState } from 'react'

//Määritellään miten Blogi tulostetaan 
const Blog = ({ user, blog }) => {
  const [AllInfo, setAllInfo] = useState(false)
  const showBasicInfo = { display: AllInfo ? 'none' : '' }
  const showAllInfo = { display: AllInfo ? '' : 'none' }
  const id = blog.id

  /* OMIA TESTEJÄ
  const nimi = blog.user.name
  console.log("Blogin id on ", id)
  console.log("Blogin lisääjän nimi on ", nimi)
*/

  //Like nappulan määritteleminen
  const handleLikes = () => {
    console.log("Nappula vaatii toteutuksen")
  }

  //Näytetään ainoastaan blogin title ja author ellei blogia paineta auki, jolloin näytetään kaikki tiedot
  return (
    <div  className='blog' onClick={() => setAllInfo(!AllInfo)}>
      <div style={showBasicInfo}>
      <ul>
        <li>{blog.title} : {blog.author}</li>
        </ul>
      </div>
      <div style={showAllInfo}>
        <ul>
          <li>{blog.title} : {blog.author}</li>
          <li><a href={blog.url}>{blog.url}</a></li>
          <li>{blog.likes} Likes <button type='button' value={id} onClick={handleLikes}>Like</button></li>
          <li>{blog.user.name} </li>
        </ul>
      </div>
    </div>
  )}

export default Blog