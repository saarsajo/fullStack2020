import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
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
    //console.log("Uutta blogia lisätessä uuden blogin sisältö on: ",blogObject)
    //Uudella blogilla tulee olla title, author ja url
    if (blogObject.title && blogObject.author && blogObject.url){
      blogFormRef.current.toggleVisibility()
      blogService
        .create(blogObject)
        .then(returnedBlog => {     
          setBlogs(blogs.concat(returnedBlog))
        })
      }
    //Lyödään erroria jos yksikin tarvittava kenttä puuttuu
    else {
      setNotificationType('error')
      notificationContent('Blog not added. Need more information')
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


  //Like nappulan määritteleminen
  const handleLikes = async (id) => {
    const blog = blogs.find(blg => blg.id === id)
    //console.log("blog on ", blog)
    const updatedBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user.id || blog.user }
    //console.log("updatedBlog on ", updatedBlog)
    try {
      blogService
      .update(id, updatedBlog)
      .then(returnedBlog => {
        setBlogs(blogs.map(blog => blog.id !== id ? blog: returnedBlog))
        console.log("returnedBlog on ", returnedBlog)
        setNotificationType('confirmation')
        notificationContent(`Added a like to:  ${returnedBlog.title} by ${returnedBlog.author}`)
      })
    }
    catch(error) {
      setNotificationType('error')
      notificationContent('Was not able to add like')
    }   
  }

  //Delete nappulan määritteleminen
  const handleDelete = (event) => {
    event.preventDefault()
    const id = event.target.value
    const blog = blogs.find(n => n.id === id)
    //console.log("blog on ", blog)
    if (window.confirm(`Do you want to delete ${blog.title} by ${blog.author}`)) {  
        //console.log("Härre Gyd blog on ", blog)
        blogService.remove(blog.id)
          .catch(error => {
          setBlogs(blogs)
          setNotificationType('error')
          notificationContent('You were not able to delete the Blog, you may not have rights to the blog')
        })
        setBlogs(blogs.filter(blg => blg.id !== blog.id))
        setNotificationType('confirmation')
        notificationContent(`You have deleted: ${blog.title} by ${blog.author}`)
      }
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
    {user.name} logged in with a username: {user.username}
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


  //Näytetään blogit tykkäysten mukaisessa järjestyksessä (sort)
  const showBlogs = () => blogs.sort((a, b) => b.likes - a.likes).map(filteredBlog =>
    <Blog
      key={filteredBlog.id}
      blog={filteredBlog}
      user={user}
      handleLikes={() => handleLikes(filteredBlog.id)}
      handleDelete={handleDelete}
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