import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Footer from './components/Footer'
import blogService from './services/blogs'
import loginService from "./services/login"

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification ] = useState(null)
  const [notificationType, setNotificationType ] = useState(null)

  const [username, setUsername] = useState('')   
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)



  //Pitääkö muokata???
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    blogService
      .getAll()
      .then(initialBlogs  =>
      setBlogs( initialBlogs  )
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
    event.preventDefault()
    if (title !== '' && author !== '' && url !== ''){
      try{
      const blogObject = {
        title: title,
        author: author,
        url: url
      }

      blogService
        .create(blogObject)
        .then(returnedBlog => {
          setBlogs(blogs.concat(returnedBlog))
          setTitle('')
          setAuthor('')
          setUrl('')
        })

      setNotificationType('confirmation')
      notificationContent( `${title} by ${author} was added to the Blogs`)
      } catch (exception) {
        setNotificationType('error')
        notificationContent('Blog could not be added')
      }
    }

    else {
      setNotificationType('error')
      notificationContent('Missing information of Title, author or url')
    }
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
      setNotificationType('error')
      notificationContent('wrong credentials')
    }
  }

  //Hoidetaan uloskirjautuminen
  const handleLogOut = async (event) => {    
    window.localStorage.clear()
    blogService.setToken(null)
    setUser(null)
  }


  //Määritetään sivulle kirjoitettavat sisäänkirjautumispalkit
  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <h2>Log in to application</h2>
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
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>      
  )

  //Määritetään sivulle kirjoitettavat uloskirjautumispalkit
  const logoutForm = () => (
    <form onSubmit={handleLogOut}>        
    <button type="submit">Logout</button>      
  </form>
  )

  //Kirjoitetaan sivulle uusien blogien lisäyspalkit
  const blogForm = () => (
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

//Määritellään kuinka kauan ilmoitusta näytetään
  const notificationContent = (notification) => {
    setNotification(notification)
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  //Näytetään blogit
  const showBlogs = () => blogs.map(blog =>
    <Blog
      key={blog.id}
      blog={blog}
    />
  )

  //Jos ei olla kirjauduttu sisään näytetään sisäänkirjautumis-sivu
  if (user === null) {
    return (
      <div>
        <Notification notification={notification} notificationType={notificationType} />
        {loginForm()}
      </div>
    )
  }

  //Mikäli kirjauduttu sisään tulee näyttää käyttäjän blogit ja nappula, jolla voi kirjautua ulos
  else{
    return (
      <div>
        <h1>Blogs</h1>         
          <p>{user.name} logged in with a username: {user.username}</p>
          {logoutForm()}

        <h2>Create new</h2>
          <Notification notification={notification} notificationType={notificationType} />
          {blogForm()}
          {showBlogs()}

        <Footer />
      </div>
    )
  }
}

export default App