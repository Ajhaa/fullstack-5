let token = null

const blogs = [
  {
    title: 'b1',
    author: 'a1',
    likes:0
  },
  {
    title: 'b2',
    author: 'a2',
    likes:0
  },
  {
    title: 'b3',
    author: 'a3',
    likes:0
  }
]

const getAll = () => {
  return Promise.resolve(blogs)
}

export default {getAll, blogs}
