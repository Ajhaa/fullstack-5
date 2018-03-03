import React from 'react'
import { shallow } from 'enzyme'
import SimpleBlog from './SimpleBlog';

describe('Simple blog', () => {
  const blog = {
    title: "React",
    author: "Face Book",
    likes: 999
  }

  it('shows title correctly', () => {
    const blogComponent = shallow(<SimpleBlog blog={blog} onClick={null}/>)

    const titleDiv = blogComponent.find('.title')
    expect(titleDiv.text()).toContain(blog.title)
  })

  it('shows author correctly', () => {
    const blogComponent = shallow(<SimpleBlog blog={blog} onClick={null}/>)

    const titleDiv = blogComponent.find('.title')
    expect(titleDiv.text()).toContain(blog.author)
  })

  it('shows likes correctly', () => {
    const blogComponent = shallow(<SimpleBlog blog={blog} onClick={null}/>)

    const contentDiv = blogComponent.find('.content')
    expect(contentDiv.text()).toContain(blog.likes)
  })

  it('clicking like twice calls handler twice', () => {
    const mockHandler = jest.fn()

    const blogComponent = shallow(
      <SimpleBlog blog={blog} onClick={mockHandler}/>
    )

    const button = blogComponent.find('button')

    button.simulate('click')
    button.simulate('click')

    expect(mockHandler.mock.calls.length).toBe(2)

  })
})
