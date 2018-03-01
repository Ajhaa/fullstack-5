import React from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'

const loginForm = (props) => {
  <form onSubmit={props.submit}> 
    <div> 
      käyttäjätunnus
      <input
        type="text"
        value={props.username}
        onChange={props.handleUser}
        />
    </div>
    <div> 
      salasana
      <input
        type="text"
        value={props.password}
        onChange={props.handlePass}
        />
    </div>
    <button type="submit">kirjaudu</button>  
  </form>
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      blogs: [],
      username: '',
      password: '',
      user: null
    }
  }

  componentDidMount() {
    blogService.getAll().then(blogs =>
      this.setState({ blogs })
    )
  }
  
  login = (event) => {
    event.preventDefault()
    console.log('login with', this.state.username, this.state.password)
  }

  render() {
    return (
      <div>
        <h2>blogs</h2>
        {this.state.blogs.map(blog => 
          <Blog key={blog._id} blog={blog}/>
        )}
      </div>
    );
  }
}

export default App;