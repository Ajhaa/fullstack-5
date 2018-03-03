import React from 'react'
import { mount } from 'enzyme'
import App from './App'
import Blog from './components/Blog'
jest.mock('./services/blogs')
import blogService from './services/blogs'

describe('<App />', () => {
  let app
  beforeAll(() => {
    app = mount(<App />)
  })

  it('doesnt show blogs before login', () => {
    app.update()
    const blogComponent = app.find('.blogs')
    expect(blogComponent.length).toEqual(0)
  })
})
