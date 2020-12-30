const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')


//Eristää tokenin headerista authorization
const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}


// hakee kaikki resurssit
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs.map(blog => blog.toJSON()))
})

//luo uuden resurssin pyynnön mukana olevasta datasta
blogsRouter.post('/', async (request, response, next) => {
  const body = request.body
  const token = getTokenFrom(request)  

  //Jos title tai url on tyhjä annetaan virheilmoitus
  if (request.body.title === undefined && request.body.url === undefined) {
    response.status(400).end()
    return
  }
  
  try {
    const decodedToken = jwt.verify(token, process.env.SECRET)  
    if (!token || !decodedToken.id) {    
      return response.status(401).json({ 
        error: 'token missing or invalid' 
      })  
    }  
    const user = await User.findById(decodedToken.id)
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user._id
    })
    const savedBlog = await blog.save()
    response.status(201).json(savedBlog.toJSON())
  } catch (exception) {
    next(exception)
  }
})


//Poistaa blogin ja palauttaa virhekoodin 204
blogsRouter.delete('/:id', async (request, response, next) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

//Muokkaa blogin sen id:n mukaan
blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: body.user
  }
  
  //Jos onnistuu muokataan id:n alaisia tietoja ja koodi 201, jos epäonnistuu annetaan virhe
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.status(201).json(updatedBlog.toJSON())
  } catch (exception) {
    next(exception)
  }
})

module.exports = blogsRouter