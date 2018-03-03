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
      user: null,
      blogTitle: '',
      blogAuthor: '',
      blogUrl: '',
    }
  }

  componentDidMount() {
    blogService.getAll().then(blogs =>
      this.setState({ blogs })
    )

    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      this.setState({ user })
    }
  }

  login = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username: this.state.username,
        password: this.state.password
      })

      window.localStorage.setItem('loggedBlogUser', JSON.stringify(user))
      blogService.setToken(user.token)
      this.setState({ username: '', password: '', user })
    } catch (error) {
      console.log("Invalid username or password")
    }
  }

  logout = () => {
    window.localStorage.removeItem('loggedBlogUser')
    this.setState({ user: null })
  }

  handleTextField = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  addBlog = async (event) => {
    event.preventDefault()
    try {
      const newBlog = {
        title: this.state.blogTitle,
        author: this.state.blogAuthor,
        url: this.state.blogUrl
      }
      const response = await blogService.create(newBlog)

      this.setState({
        blogTitle: '',
        blogAuthor: '',
        blogUrl: '',
        blogs: this.state.blogs.concat(response)
      })
    } catch (error) {
      console.log('Error:', error)
    }
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
      {this.userInfo()}
      {this.newBlog()}
      <h2>blogs</h2>
      {this.state.blogs.map(blog =>
        <Blog key={blog._id} blog={blog} />
      )}
    </div>
  )
  newBlog = () => (
    <div>
      <h2>add new</h2>
      <form onSubmit={this.addBlog}>
        <div>
          title
        <input type="text" name="blogTitle" value={this.state.blogTitle} onChange={this.handleTextField} />
        </div>
        <div>
          author
        <input type="text" name="blogAuthor" value={this.state.blogAuthor} onChange={this.handleTextField} />
        </div>
        <div>
          url
        <input type="text" name="blogUrl" value={this.state.blogUrl} onChange={this.handleTextField} />
        </div>
        <button type="submit">add blog</button>

      </form>
    </div>
  )
  userInfo = () => (
    <div>
      logged in as user {this.state.user === null ?
        'error' : this.state.user.username}
      <button type="button" onClick={this.logout}>logout</button>
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
