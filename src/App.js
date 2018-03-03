import React from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import './App.css'

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

const NewBlog = ({ submit, title, author, url, handler }) => (

  <div>
    <h2>add new</h2>
    <form onSubmit={submit}>
      <div>
        title
        <input required type="text" name="blogTitle" value={title} onChange={handler} />
      </div>
      <div>
        author
        <input required type="text" name="blogAuthor" value={author} onChange={handler} />
      </div>
      <div>
        url
        <input required type="text" name="blogUrl" value={url} onChange={handler} />
      </div>
      <button type="submit">add blog</button>

    </form>
  </div>

)

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="message">
      {message}
    </div>
  )
}

const Error = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="error">
      {message}
    </div>
  )
}


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
      notificationMessage: null,
      errorMessage: null,
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
      this.setState({ username: '', password: '', user, notificationMessage: ('logged in as user ' + user.username) })
      setTimeout(() => {
        this.setState({ notificationMessage: null })
      }, 5000);
    } catch (error) {
      this.setState({ errorMessage: 'wrong username or password' })
      setTimeout(() => {
        this.setState({ errorMessage: null })
      }, 5000);
    }
  }

  logout = () => {
    window.localStorage.removeItem('loggedBlogUser')
    this.setState({ user: null, notificationMessage: 'logout succesful' })
    setTimeout(() => {
      this.setState({ notificationMessage: null })
    }, 5000);
  }

  handleTextField = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  addBlog = async (event) => {
    event.preventDefault()
    this.newBlog.toggleVisibility()
    try {
      const newBlog = {
        title: this.state.blogTitle,
        author: this.state.blogAuthor,
        url: this.state.blogUrl
      }
      const response = await blogService.create(newBlog)
      console.log(response)
      this.setState({
        blogTitle: '',
        blogAuthor: '',
        blogUrl: '',
        blogs: this.state.blogs.concat(response),
        notificationMessage: ('Created blog ' + newBlog.title)
      })
      setTimeout(() => {
        this.setState({ notificationMessage: null })
      }, 5000);
    } catch (error) {
      this.setState({ errorMessage: 'there was an error adding a blog' })
      console.log('Error:', error)
      setTimeout(() => {
        this.setState({ errorMessage: null })
      }, 5000);
    }
  }




  render() {
    const loginForm = () => {
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

    const blogDiv = () => (
      <div>
        {userInfo()}
        {newBlog()}
        <h2>blogs</h2>
        {this.state.blogs.map(blog =>
          <Blog key={blog._id} blog={blog} />
        )}
      </div>
    )
    const newBlog = () => (
      <Togglable buttonLabel="new blog" ref={component => this.newBlog = component}>
        <NewBlog
          submit={this.addBlog}
          title={this.state.blogTitle}
          author={this.state.blogAuthor}
          url={this.state.blogUrl}
          handler={this.handleTextField}
        />
      </Togglable>
    )
    const userInfo = () => (
      <div>
        logged in as user {this.state.user === null ?
          'error' : this.state.user.username}
        <button type="button" onClick={this.logout}>logout</button>
      </div>
    )

    return (
      <div>
        <Notification message={this.state.notificationMessage} />
        <Error message={this.state.errorMessage} />
        {this.state.user === null ?
          loginForm() : blogDiv()}
      </div>
    );
  }
}

export default App;
