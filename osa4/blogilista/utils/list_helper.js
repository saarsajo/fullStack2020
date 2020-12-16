//Määritellään dummy joka palauttaa aina ykkösen kun saa blogi-listan
const dummy = (blogs) => {
  return 1
}

//Saa parametrikseen taulukollisen blogeja. Funktio palauttaa blogien yhteenlaskettujen tykkäysten määrän.
//Jos blogeja ei ole palauttaa nollan
const totalLikes = (blogs) => {
  return blogs.reduce((sum, { likes }) => sum + likes, 0) || 0
}  

//favoriteBlog saa parametrikseen taulukollisen blogeja. Funktio selvittää millä blogilla on eniten tykkäyksiä. 
const favoriteBlog = (blogs) => {
  //Vertailee blogien tykkäysten määrää toisiinsa, Reducer vähentää kaikista blogeista vain tykätyimmän jäljelle ja asettaa topBlockiksi
  const topBlog = blogs.reduce((accumulator, currentValue) => currentValue.likes > accumulator.likes ? currentValue : accumulator)
  //Jätetään blogista pois _id, url and __v ja jätetään sisälle topBlogReduced title, author ja likes
  const { _id, url, __v, ...topBlogReduced } = topBlog
  //console.log(" topBlogReduced sisältää ", topBlogReduced)
  //console.log(" topBlog sisältää ", topBlog)
  return topBlogReduced
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}