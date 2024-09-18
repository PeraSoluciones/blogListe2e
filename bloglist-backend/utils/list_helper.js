const _ = require('lodash');
const Blog = require('../models/blog');
const User = require('../models/user');
const bcrypt = require('bcrypt');

const blog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
    __v: 0,
  },
];

const blogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0,
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0,
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0,
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0,
  },
];

const users = [
  {
    username: 'mchan',
    name: 'Michael Chan',
    password: 'mchan@123',
  },
  {
    username: 'edijkstra',
    name: 'Edsger W. Dijkstra',
    password: 'edijkstra@345',
  },
  {
    username: 'rmartin',
    name: 'Robert C. Martin',
    password: 'rmartin@789',
  },
];

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes;
  };
  return blogs.length === 0 ? 0 : blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return 0;

  const favorite = blogs.sort((a, b) => b.likes - a.likes);

  return {
    title: favorite[0].title,
    author: favorite[0].author,
    likes: favorite[0].likes,
  };
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return 0;

  const reducer = (result, blog) => {
    if (!_.has(result, blog.author))
      result[blog.author] = { author: '', blogs: 0 };
    result[blog.author]['author'] = blog.author;
    result[blog.author]['blogs']++;
    return result;
  };

  const result = _.orderBy(_.reduce(blogs, reducer, {}), ['blogs'], ['desc']);
  //   console.log(result);
  return result[0];
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) return 0;

  const reducer = (result, blog) => {
    if (!_.has(result, blog.author))
      result[blog.author] = { author: '', likes: 0 };
    result[blog.author]['author'] = blog.author;
    result[blog.author]['likes'] += blog.likes;
    return result;
  };

  const result = _.orderBy(_.reduce(blogs, reducer, {}), ['likes'], ['desc']);
  //   console.log(result);
  return result[0];
};

const eachBlogHasId = (blogs) => {
  return !_.includes(
    blogs.map((blog) => _.has(blog, 'id')),
    false
  );
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

const initUsersWithPasswordHash = async () => {
  const saltRounds = 10;
  return await Promise.all(
    users.map(async (user) => {
      const passwordHash = await bcrypt.hash(user.password, saltRounds);
      return {
        username: user.username,
        name: user.name,
        passwordHash,
      };
    })
  );
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
  blog,
  blogs,
  users,
  blogsInDb,
  eachBlogHasId,
  usersInDb,
  initUsersWithPasswordHash,
};
