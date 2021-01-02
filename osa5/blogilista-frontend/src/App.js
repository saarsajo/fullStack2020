import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from "./services/login"

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')   
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  //Pitääkö muokata???
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  //
  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])


  //Localstoragen useEffect hoitaa kirjautuneen käyttäjän ensimmäinen sivun latauksen
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogUser")
    if (loggedUserJSON){
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])


  //Lisätään uusi blogi
  const addBlog = (event) => {
    console.log('TÄNNE PITÄÄ TOTEUTTAA UUDEN BLOGIN LUONTI')  
    event.preventDefault()

    //Alla oleva ei jostain syystä toimi
    /*
    const blogObject = {
      title: title.value,
      author: author.value,
      url: url.value,
    }
  
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
      })


    setTitle('')
    setAuthor('')
    setUrl('')*/
  }

  //Hoidetaan sisäänkirjautuminen
  const handleLogin = async (event) => {    
    event.preventDefault()    
    console.log('logging in with', username, password)  
  
    //Kokeillaan kirjautua sisään, jos ei onnistu annetaan virhe
    try {      
      const user = await loginService.login({        
        username, password,      
      })

      //Asetetaan kirjautumistiedot localstorageen
      //Tämän avulla kirjautumistiedot pysyvät tallessa
      window.localStorage.setItem(        
        'loggedBlogUser', JSON.stringify(user)      
      )

      blogService.setToken(user.token)      
      setUser(user)      
      setUsername('')      
      setPassword('')    
    } catch (exception) {      
      setErrorMessage('wrong credentials')      
      setTimeout(() => {        
        setErrorMessage(null)      
      }, 5000)    
    }
  }

  //Hoidetaan uloskirjautuminen
  const handleLogOut = async (event) => {    
    window.localStorage.clear()
    blogService.setToken(null)
    setUser(null)
  }



  
  //Jos ei olla kirjauduttu sisään näytetään sisäänkirjautumis-sivu
  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>        
          <div>          
            username            
            <input            
              type="text"            
              value={username}            
              name="Username"            
              onChange={({ target }) => setUsername(target.value)}          
            />        
          </div>        
          <div>          
            password            
            <input            
              type="password"            
              value={password}            
              name="password"            
              onChange={({ target }) => setPassword(target.value)}          
            />        
          </div>        
          <button type="submit">Login</button>      
        </form>
      </div>
    )
  }

  //Mikäli kirjauduttu sisään tulee näyttää käyttäjän blogit ja nappula, jolla voi kirjautua ulos
  else{
    return (
      <div>
        <h2>Blogs</h2>      
        {user.username} logged in
        <form onSubmit={handleLogOut}>        
          <button type="submit">Logout</button>      
        </form>




        <h2>Create new</h2>
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





        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
    )
  }

}

export default App