import React, { useState } from 'react'
import ReactDOM from 'react-dom'

//Muokattavat painikkeiden tekstit ja tilastotekstit
const button1Txt = 'Good';
const button2Txt = 'Neutral';
const button3Txt = 'Bad';

//Muokattavat otsikot
const ButtomTitle = () => {
  return (
    <h1>Give feedback</h1>
  )
}
const StatisticTitle = () => {
  return (
    <h1>Statistics</h1>
  )
}

//Tialstojen palauttaja joka järjestää tekstin ja sen arvon
const StatisticLine  = ({statText, statValue}) => {
  return (
    <tr>
      <td>{statText}</td>
      <td>{statValue}</td>
    </tr>
  )
}

//Muodostetaan tilastot ja tulostetaan ne jos palautetta on 
const Statistics = ({data}) => {
  const { good, neutral, bad } = data
  const amountOfFeedback = good + neutral + bad
  const averageFeedback = ((good - bad) / amountOfFeedback)
  const positiveFeedback = (good / amountOfFeedback) * 100 + ' %'

  //Jos palautetta on annettu Tulostetaan tilastot
  if(amountOfFeedback > 0) {
    return (
      <table>
        <tbody>
          <StatisticLine  statText= {button1Txt} statValue = {good} />
          <StatisticLine  statText= {button2Txt} statValue = {neutral} />
          <StatisticLine  statText= {button3Txt} statValue = {bad} />
          <StatisticLine  statText='Combined' statValue = {amountOfFeedback} />
          <StatisticLine  statText='Average feedback' statValue = {averageFeedback} />
          <StatisticLine  statText='Positive feedback' statValue = {positiveFeedback} />      
        </tbody>
      </table>
    )
  } 

  //Jos palauttetta ei ole annettu tulostuu näyttöön seuraava teksti
  else {
    return(
      <div>
        <p>Feedback not given yet</p>
      </div>
    )
  }
}

  //Komponentti Button painikkeiden muodostamiseen. handleButtonPress 
  const Button = ({ text, handleButtonPress }) => (  
    <button onClick={handleButtonPress}>    
      {text}
    </button>
  )

const App = (props) => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  // Tallennetaan talteen hyvän, neutraalin ja pahan palautteen määrät
  const results = {
    good: good,
    neutral: neutral,
    bad: bad
  }

  //Käsitellään Positiivinen palaute
  const setGoodResult = (newValue) => {      
    setGood(newValue) 
  }
  const handleGood = () => {
    setGoodResult(good + 1);
  }

  //Käsitellään Neutraali palaute
  const setNeutralResult = (newValue) => {      
    setNeutral(newValue) 
  }
  const handleNeutral = () => {
    setNeutralResult(neutral + 1);
  }

  //Käsitellään negatiivinen palaute    
  const setBadResult = (newValue) => {      
    setBad(newValue) 
  }
  const handleBad = () => {
    setBadResult(bad + 1);
  }

  //Tulostetaan Otsikot ja Nappulat sekä Statics komponentin antamat tulosteet
  return (
    <div>
      <ButtomTitle/>
      <Button handleButtonPress={handleGood} text={button1Txt} counter={good} />       
      <Button handleButtonPress={handleNeutral} text={button2Txt} counter={neutral} /> 
      <Button handleButtonPress={handleBad} text={button3Txt} counter={bad} /> 
      <StatisticTitle/>
      <Statistics data={results}/>
    </div>
  )
}

ReactDOM.render(<App />, 
  document.getElementById('root')
)