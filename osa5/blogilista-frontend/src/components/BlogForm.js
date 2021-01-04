import React from 'react'

const BlogForm = ({
  addBlog,
  title,
  author,
  url,
}) => {

  return (
    <form onSubmit={addBlog}>        
      <div>          
        title            
        <input            
          type="text"            
          value={title}            
          name="title"            
          onChange={({ target }) => setTitle(target.value)}          
        />        
      </div>        
      <div>          
        author            
        <input            
          type="text"            
          value={author}            
          name="author"            
          onChange={({ target }) => setAuthor(target.value)}          
        />        
      </div>
      <div>          
        url            
        <input            
          type="text"            
          value={url}            
          name="url"            
          onChange={({ target }) => setUrl(target.value)}          
        />        
      </div>              
      <button type="submit">Create</button>      
    </form>
  )
}

export default BlogForm