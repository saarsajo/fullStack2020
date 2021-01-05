import React from 'react'

//Määritellään mitä Blogi
const Blog = ({ blog, user }) => {
  return (
    <li className='blog'>
      {blog.title} : {blog.author}
    </li>
  )
}

export default Blog