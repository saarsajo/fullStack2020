import React from 'react';

//The Header of the course
const Header = ({ course }) => {
    return (
      <h2>{course}</h2>
    )
  }

//Koostuu kurssin osan nimestä ja tehtävien määrästä
  const Part = ({ part }) => {
    console.log("Tämä on {part} sisältö: ", { part })
    
    return (
      <p>
        {part.name} {part.exercises}
      </p>    
    )
  }
  
  //Koostuu kurssin osan ID:sta, nimesta ja tehtävien määrästä
  const Content = ({ parts }) => {
    //console.log("Tämä on {parts} sisältö: ", { parts })
    
    return (
      <div>
        {parts.map(part => 
            <Part 
                key = {part.id} 
                part = {part} 
            />
        )}
      </div>
    )
  }

  //Palautetaan kurssien osien sisältämien tehtävien yhteismäärä, ottamalla syötetystä
  //taulusta ylimääräiset tiedot pois ja syöttämällä vain oleellisen exerciseAmounttiin
  const Total = ({ total }) => {
    console.log("Tämä on {total} sisältö: ", { total })
    
    const exerciseAmount = total.reduce((accumulator, currentValue) => {
        console.log("Tämä on {accumulator} ja {currentValue} sisältö: ", { accumulator }, " ja ", { currentValue } )
        
        return accumulator + currentValue.exercises
    }, 0)
    console.log("Tämä on {exerciseAmount}:n arvo: ", { exerciseAmount } )
    return(
        <h3>
            Number of exercises {exerciseAmount}
        </h3>
    ) 
  }

//Kurssi koostuu edellä määrätyistä komponenteista
const Course = ({ course }) => (
    <div>
        <Header course={course.name} />
        <Content parts={course.parts} />
        <Total total={course.parts} />
    </div>
)

export default Course