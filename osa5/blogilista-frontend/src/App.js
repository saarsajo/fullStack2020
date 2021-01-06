import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
//import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Footer from './components/Footer'
import blogService from './services/blogs'
import loginService from "./services/login"
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification ] = useState(null)
  const [notificationType, setNotificationType ] = useState(null)

  const [username, setUsername] = useState('')   
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)



  const blogFormRef = React.createRef()

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
      //console.log("Jumatsuika mikä username: ", user.username)
      //console.log("Jumatsuika mikä user ", user)
      //console.log("Jumatsuika mikä user.id ", user.id)

      blogService.setToken(user.token)
    }
  }, [])

  //Lisätään uusi blogi
 const addBlog = (blogObject) => {
  blogFormRef.current.toggleVisibility()
  blogService
    .create(blogObject)
    .then(returnedBlog => {     
      setBlogs(blogs.concat(returnedBlog))
    })
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


  //Määritetään sivulle kirjoitettavat sisäänkirjautumispalkit Togglablen sisällä, jotta ne näkyvät vasta kun painetaan loginista
  const loginForm = () => (
    <Togglable buttonLabel='login'>
      <LoginForm
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleSubmit={handleLogin}
      />
    </Togglable>
  )

  //Määritetään sivulle kirjoitettavat uloskirjautumispalkit
  const logoutForm = () => (
    <form onSubmit={handleLogOut}>        
    <button type="submit">Logout</button>      
  </form>
  )

  //Kirjoitetaan sivulle uusien blogien lisäyspalkit Togglablen sisällä, jotta ne näkyvät vasta kun painetaan New blog:sta
  const blogForm = () => (
    <Togglable buttonLabel='New blog' ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )


//Määritellään kuinka kauan ilmoitusta näytetään
  const notificationContent = (notification) => {
    setNotification(notification)
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }


  //Näytetään blogit TÄÄLLÄ FILTTERÖINTI PITÄISI SAADA KUNTOON TÄLLÄ HETKELLÄ DIIPADAAPAA
  const showBlogs = () => blogs.filter(user => username === username).map(filteredBlog =>
    <Blog
      key={filteredBlog.id}
      blog={filteredBlog}
      user={user}
    />
  )
  

/*console.log("HEIHEI MITA user on syönyt sisäänsä showBlogsissa: ", user)
  console.log("HEIHEI TAALLA POHJAN TÄHDEN ALLA showBlogsin blogissa on: ", blogs)*/
  //Jos ei olla kirjauduttu sisään näytetään sisäänkirjautumis-sivu
  if (user === null) {
    return (
      <div>
        <h1>Blogs</h1>
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

          <Notification notification={notification} notificationType={notificationType} /> 
          {blogForm()}
          {showBlogs()}
        <Footer />
      </div>
    )
  }
}

export default App