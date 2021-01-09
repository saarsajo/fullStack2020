import React, {useState} from 'react'

//Uuden blogin lisäämislomake
const BlogForm = ({createBlog}) => {

  //Asetetaan titlen authorin ja urlin alkutila
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  //asetetaan blogin title
  const handleTitleChange = ({ target }) => {
    setTitle(target.value)
  }

  //asetetaan blogin author
  const handleAuthorChange = ({ target }) => {
    setAuthor(target.value)
  }

  //asetetaan blogin url
  const handleUrlChange = ({ target }) => {
    setUrl(target.value)
  } 

  //Lisätään uusi blogi 
  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  //Määritellään mitä piirretään uuden blogin lisääjään
  return (
    <div>
      <h2>Create a new blog</h2>
      <form onSubmit={addBlog}>        
        <div>          
          title            
          <input            
            type="text"             
            name="title"      
            value={title}     
            onChange={handleTitleChange}          
          />        
        </div>        
        <div>          
          author            
          <input            
          type="text"                    
          name="author"     
          value={author}       
          onChange={handleAuthorChange}          
          />   
        </div>
        <div>          
          url            
          <input            
            type="text"            
            name="url"   
            value={url}         
            onChange={handleUrlChange}          
          />        
        </div>      
        <button type="submit">Create</button>      
      </form>
    </div>
  )
}

export default BlogForm