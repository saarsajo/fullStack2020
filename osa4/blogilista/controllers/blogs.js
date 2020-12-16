const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// hakee kaikki resurssit
blogsRouter.get('/', (request, response) => {
    Blog
      .find({})
      .then(blogs => {
        response.json(blogs)
        //response.json(blogs.map(blog => blog.toJSON()))
      })
  })

//luo uuden resurssin pyynnön mukana olevasta datasta
blogsRouter.post('/', (request, response) => {
  const body = request.body

  //jos title tai url on tyhjä annetaan virhekoodi 400
  if (request.body.title === undefined && request.body.url === undefined) {
    response.status(400).end()
    return
  }

  else{
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes
    })

    blog.save()
      .then(savedBlog => {
        response.json(savedBlog.toJSON())
      })
      .catch(error => next(error))

    }
})

//Poistaa blogin ja palauttaa virhekoodin 204
blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

//Muokkaa blogin sen id:n mukaan
blogsRouter.put('/:id', (request, response, next) => {
  const body = request.body
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  //Jos onnistuu muokataan id:n alaisia tietoja ja koodi 201, jos epäonnistuu annetaan virhe
  Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    .then(updatedBlog => {
      response.status(201).json(updatedBlog.toJSON())
    })
    .catch(error => next(error))
})


module.exports = blogsRouter