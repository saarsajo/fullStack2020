const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

/*
const initialBlogs = [  
    {    
        title: 'HTML is easy',
        author: 'Mario Brothers',
        url: 'mariobrothers.com',
        likes: 15
    },  
    {    
        title: 'Javascript is not easy maaan',
        author: 'Link and Zelda',
        url: 'hirule.com',
        likes: 150
    },
]*/
    
beforeEach(async () => 
{  
    await Blog.deleteMany({})
    const blogObjects = helper.initialBlogs
      .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})


describe('Tests, that initialBlogs ', () => {
    //testi importtaa tiedostoon app.js määritellyn Express-sovelluksen ja 
    //käärii sen funktion supertest avulla ns. superagent-olioksi. 
    test('are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    //Testataan että taulukon pituus on oikea
    test('include 6 blogs', async () => {
        const response = await api.get('/api/blogs')
        // tänne tullaan vasta kun edellinen komento eli HTTP-pyyntö on suoritettu
        // muuttujassa response on nyt HTTP-pyynnön tulos
        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })
    
    //Testataan että testin käyttämän tietokannan blogi taulukon kohdasta 1 sisältää oikean titlen 
    test('first blog is about React patterns', async () => {
    const response = await api.get('/api/blogs')
    const titles = response.body.map(r => r.title)

    expect(titles).toContain(
        'React patterns'  
        )
    })

    //Testi, joka varmistaa että palautettujen blogien identifioivan kentän tulee olla nimeltään id
    test('identifyingfield should be named id', async () => {
        const response = await api.get('/api/blogs')
        //console.log("response.body[0].id sisältö on ",response.body[0].id)
        expect(response.body[0].id).toBeDefined()
    })
})


//Testataan että poistaminen toimii oikealla tavalla
describe('Adding a new blog', () => {
    //Testi, joka testaa että uusia blogeja voidaan tallentaa onnistuneesti
    test('was succesfull with valid data', async () => {
        const newBlog = {
            title: 'Blogi uusista blogeista',
            author: 'Jake The Blog',
            url: 'adventureBlogs.com',
            likes: 1500
        }
      
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)
      
        const response = await api.get('/api/blogs')
      
        const titles = response.body.map(r => r.title)
      
        expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
        expect(titles).toContain(
            'Blogi uusista blogeista'
        )
    })

    //testi joka varmistaa, että jos kentälle likes ei anneta arvoa, asetetaan sen arvoksi 0
    test('puts likes at 0 if the blogpost is missing likes', async () => {
    const newBlog = {
        title: "Miten selvitä tykkäämättömyydestä?",
        author: "Finn The Unlikable Human",
        url: "www.adventureBlogs.com",
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const blogLikes = blogsAtEnd.map(blog => blog.likes)
    expect(blogLikes[blogLikes.length - 1]).toBe(0)
    })

    //jos uusi blogi ei sisällä kenttää title , pyyntöön vastataan statuskoodilla 400 Bad request
    test('sends error code if title or url is empty', async () => {
        const newBlog = {
            _id: 'fa09a873ur98sd95s9fg',
            author: 'The God of Bar',
            likes: 1500
        }
    
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)

            const blogsAtEnd = await helper.blogsInDb()        
            expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)
    })
})


//Testataan että poistaminen toimii oikealla tavalla
describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

      const titles = blogsAtEnd.map(r => r.title)
      expect(titles).not.toContain(blogToDelete.title)
    })
})


//Testataan että blogin päivittäminen onnistuu
describe('Updating a blog', () => {
    test('updating the likes to 666', async () => {
        const updatedBlog = {
            "title": "Viides",
            "author": "El Jumpero",
            "url": "www.Tieto.com",
            "likes": 666
        }
  
        const blogsAtStart = await helper.blogsInDb()
        await api
          .put(`/api/blogs/${blogsAtStart[4].id}`)
          .send(updatedBlog)
          .expect(201)
          .expect('Content-Type', /application\/json/)
  
        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)
        
        const likes = blogsAtEnd.map(n => n.likes)
        expect(likes).toContain(updatedBlog.likes)
      })

})


afterAll(() => {
    mongoose.connection.close()
})