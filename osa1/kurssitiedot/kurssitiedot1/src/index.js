import React from 'react'
import ReactDOM from 'react-dom'

// Uusi Header komponentti joka kuljettaa propsin avulla otsikon alhaalla olevan returnin 
//Header courseen
const Header = (props) => {
  return (
    <h1>
      {props.course.name}
    </h1>
  );
}

//Kurssin osion nimi ja tehtävien lukumäärä, jotka kuljettaa propsin avulla 
//alhaalla olevan Contentin käyttöön
const Part = (props) => {
  return(
      <div>
        <p>
          {props.name} {props.exercises}
        </p>
      </div>
  );
}

//Tuodaan yhteen kurssit ja niiden tehtävien määrät, jotka kuljettaa propsin 
//avulla olevan returnin Header courseen
const Content = (props) => {
  return (
    <div>
        <Part name={props.parts[0].name} exercises={props.parts[0].exercises} />
        <Part name={props.parts[1].name} exercises={props.parts[1].exercises} />
        <Part name={props.parts[2].name} exercises={props.parts[2].exercises} />
    </div>
  );
}

//Täällä lasketaan yhteen kuinka paljon kurssitehtäviä on
const Total = (props) => {
  return(
    <p>
      Number of exercises {props.parts[0].exercises + props.parts[1].exercises + props.parts[2].exercises}</p>
  );
}

//Määritellään otsikko ja kurssien nimet sekä tehtävien määrät, tehdään lista kurssin osioista
const App = () => {
  const course = {
      name: 'Half Stack application development',
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10
        },
        {
          name: 'Using props to pass data',
          exercises: 7
        },
        {
          name: 'State of a component',
          exercises: 14
        }
      ]
    }

  return (
    <div>
      <Header course={course}/>
      <Content parts={course.parts}/>
      <Total parts={course.parts} />
    </div>
  )
}

//Näytetään kaikki ruudulla
ReactDOM.render(<App />, document.getElementById('root'));