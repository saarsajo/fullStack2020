const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

const User = require('../models/user')

describe('When there is initially some blogs saved', () => {

    beforeEach(async () => 
    {  
        await Blog.deleteMany({})
        const blogObjects = helper.initialBlogs
        .map(blog => new Blog(blog))
        const promiseArray = blogObjects.map(blog => blog.save())
        await Promise.all(promiseArray)
    })

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


    //Käyttäjätunnuksen testausta
    describe('when there is initially one user at db', () => {
        beforeEach(async () => {
            await User.deleteMany({})
            const user = new User({ username: 'root', password: 'sekret' })
            await user.save()
        })
      
        test('creation succeeds with a fresh username', async () => {
            const usersAtStart = await helper.usersInDb()
    
            const newUser = {
            username: 'BeerBelly',
            name: 'Stout Mc Yeast',
            password: 'salainen'
        }
    
        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)
    
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd.length).toBe(usersAtStart.length + 1)
    
        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
        })


        //testi, jolla varmistetaan, että samalla käyttäjätunnuksella ei voi luoda uutta käyttäjää
        test('creation fails with proper statuscode and message if username already taken', async () => {
            const usersAtStart = await helper.usersInDb()
            const newUser = {
                username: 'root',
                name: 'Superuser',
                password: 'salainen'
            }

            const result = await api
                .post('/api/users')
                .send(newUser)
                .expect(400)
                .expect('Content-Type', /application\/json/)
    
            expect(result.body.error).toContain('`username` to be unique')
    
            const usersAtEnd = await helper.usersInDb()
            expect(usersAtEnd.length).toBe(usersAtStart.length)
        })  
        

        //testi, jolla varmistetaan, että käyttäjätunnus on vähintään 3 merkkiä pitkä
        test('creation fails with proper statuscode and message if username length is smaller than 3', async () => {
            const usersAtStart = await helper.usersInDb()
            const newUser = {
                username: 'pe',
                name: 'Pertti-Inkeri',
                password: '1234'
            }

            const result = await api
                .post('/api/users')
                .send(newUser)
                .expect(400)
                .expect('Content-Type', /application\/json/)

            expect(result.body.error).toContain('is shorter than the minimum allowed length (3)')

            const usersAtEnd = await helper.usersInDb()
            expect(usersAtEnd.length).toBe(usersAtStart.length)
        })  

        //testi, jolla varmistetaan, että salasana on vähintään 3 merkkiä pitkä
        test('creation fails with proper statuscode and message if password length is smaller than 3', async () => {
            const usersAtStart = await helper.usersInDb()
            const newUser = {
                username: 'pertti69',
                name: 'Pertti-Inkeri',
                password: '12'
            }

            const result = await api
                .post('/api/users')
                .send(newUser)
                .expect(400)

            const usersAtEnd = await helper.usersInDb()
            expect(usersAtEnd.length).toBe(usersAtStart.length)
        })  

    })
})

afterAll(() => {
    mongoose.connection.close()
})