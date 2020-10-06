import React from 'react';
import ReactDOM from 'react-dom';
import Course from './components/Course'

//Määritellään Kurssit ja 
//id ei saa olla sama partsin sisällä tai muuten tulee virhe
const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10,
          id: 1
        },
        {
          name: 'State of a component',
          exercises: 15,
          id: 2
        },      
        {
          name: 'State of coding in America in the 21st century',
          exercises: 5,
          id: 3
        },
        {
          name: 'State of a react',
          exercises: 4,
          id: 4
        },
        {
          name: 'Sundamentals of a component',
          exercises: 1,
          id: 5
        },
        {
          name: 'React of a component',
          exercises: 10,
          id: 6
        }
      ]
    }
    ,
    {
      name: 'The fundamentals of popculture references',
      id: 2,
      parts: [
        {
          name: 'You ever had a Big Kahuna burger vol. 1 ',
          exercises: 15,
          id: 1
        },
        {
          name: 'What is in thine box',
          exercises: 1,
          id: 2
        },
        {
          name: 'Endgame',
          exercises: 20,
          id: 3
        }
      ]
    }
    ,
    {
      name: 'Wizarding courses for wizard lizards',
      id: 3,
      parts: [
        {
          name: 'How to turn your vegetables to life',
          exercises: 11,
          id: 1
        },
        {
          name: 'How to capture running vegetables',
          exercises: 34,
          id: 2
        },
        {
          name: 'Magical vegetablestew, the brutal but tasty vol. 1 ',
          exercises: 69,
          id: 3
        }
      ]
    }
  ]

  //Haetaan kaikki tiedot kaikista kursseista ja niiden osista, avaimena toimii kurssin id,
  //joka ei saa olla sama muiden kurssien id:n kanssa
  const coursesList = courses.map((course) => {
    return (
      <
        Course key = {course.id} 
        course = {course} 
      />
    )
  }
  )

  //Palautetaan tulostettavaksi otsikko ja 
  return (
    <div>
      <h1>Marvelous courses of the Univercity of Magic land</h1>
      {coursesList}
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))