import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import Blog from './Blog'

//Testejä blogille
test('renders content', () => {
  const blog = {
    title: 'Transformers',
    author: 'Robots in disguise',
    likes: 1986
  }

  //Konfiguroinnin jälkeen testi renderöi komponentin metodin react-testing-library-kirjaston
  //tarjoaman render avulla:
  const component = render(
    <Blog blog={blog} />
  )

  //Varmistetaan, että komponenttiin on renderöitynyt oikea title:
  expect(component.title).toHaveTextContent(
    'Transformers'
  )
})