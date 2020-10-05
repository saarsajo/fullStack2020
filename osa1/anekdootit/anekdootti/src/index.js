import React, { useState } from 'react'
import ReactDOM from 'react-dom'

//Muokattavat painikkeiden tekstit
const button1Txt = 'Generate new anecdote';
const button2Txt = 'Vote';

//Muokattavat otsikot
const Title1 = () => {
  return (
    <h1>Anecdote of the day</h1>
  )
}
const Title2 = () => {
  return (
    <h1>Anecdote with the most votes</h1>
  )
}

//Komponentti Button painikkeiden muodostamiseen. handleButtonPress 
const Button = ({ text, handleButtonPress }) => (  
  <button onClick={handleButtonPress}>    
    {text}
  </button>
)

const App = (props) => {
  const [selected, setSelected] = useState(0)
  //Nollilla täytetty taulu, joka on yhtä pitkä kuin anecdotes taulu
  const [votes,setVotes] = useState(new Array(props.anecdotes.length).fill(0));


  //Tarkastaa millä anekdootilla on isoin äänimäärä
  const maxVoteCount = Math.max(Math.max(...votes))

  //Maksimi äänimäärä tallennetaan mostVotesiin
  const mostVotes = votes.indexOf(maxVoteCount);
  //console.log("Eniten ääniä on ", mostVotes)

  //Arvotaan seuraava tarkasteltava anekdootti
  const handleSelect = () =>{
    //console.log(anecdotes.length)
    setSelected(Math.floor(Math.random() * anecdotes.length))
  }

  //Kasvatetaan anekdootin äänimäärää yhdellä
  const handleVote = () => {
    const copy = [...votes];
    copy[selected]++;
    setVotes(copy);
    //console.log(votes[selected])
  }

  //Tulostetaan ja haetaan kaikki tarvittava tulostettava
  return (
    <div>
      <Title1/>
      <Button handleButtonPress={handleSelect} text={button1Txt}/>
      <Button handleButtonPress={handleVote} text={button2Txt}/>
      <p />
      {props.anecdotes[selected] }
      <p/>
      Votes: {votes[selected]}
      <Title2/>

      {props.anecdotes[mostVotes]}
      <p>Anecdote has {maxVoteCount} votes</p>
    </div>
  )
}

//Käytettävät anekdootit
const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
)