import React from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const LoginForm = (props) => (
  <form onSubmit={props.submit}>
    <div>
      käyttäjätunnus
      <input
        type="text"
        name="username"
        value={props.username}
        onChange={props.handleuser}
      />
    </div>
    <div>
      salasana
      <input
        type="text"
        name="password"
        value={props.password}
        onChange={props.handlepass}
      />
    </div>
    <button type="submit">kirjaudu</button>
  </form>
)


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

  login = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        user: this.state.username,
        password: this.state.password
      })
      this.setState({ username: '', password: '', user })
    } catch (error) {
      console.log("Invalid username or password")
    }
  }

  handleTextField = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  loginForm = () => {
    return (
      <LoginForm
        submit={this.login}
        username={this.state.username}
        password={this.state.password}
        handleuser={this.handleTextField}
        handlepass={this.handleTextField}
      />
    )
  }

  blogDiv = () => (
    <div>
      <h2>blogs</h2>
        {this.state.blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
    </div>
  )

  render() {
    return (
      <div>
        {this.state.user === null ?
          this.loginForm() : this.blogDiv()}
      </div>
    );
  }
}

export default App;
