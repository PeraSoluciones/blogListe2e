const { test, before, beforeEach, after, describe } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);

const helper = require('../utils/list_helper');

const Blog = require('../models/blog');
const User = require('../models/user');
let token = undefined;

describe('when there is initially some blogs saved', () => {
  before(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(helper.blogs);

    await User.deleteMany({});
    await User.insertMany(await helper.initUsersWithPasswordHash());

    const user = helper.users[2];

    const authorizedUser = await api.post('/api/login').send({
      username: user.username,
      password: user.password,
    });
    token = authorizedUser.body.token;
  });

  test('blogs are returned as JSON', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    assert.strictEqual(response.body.length, helper.blogs.length);
  });

  test('each blog has a property called id', async () => {
    const blogs = await helper.blogsInDb();

    assert(helper.eachBlogHasId(blogs));
  });

  describe('addition of a new blog', () => {
    test('a valid blog can be added', async () => {
      const newBlog = {
        title: 'React 19: A Game-Changer for Modern Web Development',
        author: 'Vishal Yadav',
        url: 'https://dev.to/vyan/react-19-a-game-changer-for-modern-web-development-1bih',
        likes: 471,
      };

      await api
        .post('/api/blogs', newBlog)
        .set('Authorization', 'Bearer ' + token)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, helper.blogs.length + 1);

      const contents = blogsAtEnd.map((blog) => blog.title);
      assert(
        contents.includes('React 19: A Game-Changer for Modern Web Development')
      );
    });

    test('zero value is created on likes property', async () => {
      const newBlog = {
        title:
          '💾 React Form Handling & Validation Best Practices: STOP Using `useState`',
        author: 'Muhammad Syakirurohman',
        url: 'https://dev.to/syakirurahman/react-form-handling-validation-best-practices-stop-using-usestate-12kn',
      };

      const response = await api
        .post('/api/blogs', newBlog)
        .set('Authorization', 'Bearer ' + token)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      assert.strictEqual(response.body.likes, 0);
    });

    test('fails on missing title or url', async () => {
      const newBlog = {
        title: 'How to Scrape Data From a Page With Infinite Scroll! ♾️',
        author: 'Karan Rathod',
        likes: 11,
      };

      await api
        .post('/api/blogs', newBlog)
        .set('Authorization', 'Bearer ' + token)
        .send(newBlog)
        .expect(400);
    });

    test('fails with statuscode 401 on missing token', async () => {
      const newBlog = {
        title:
          'Async Made Easy: A Deep Dive into JavaScript Callbacks, Promises, and Async/Await',
        author: 'Raju Dandigam',
        url: 'https://dev.to/raju_dandigam/async-made-easy-a-deep-dive-into-javascript-callbacks-promises-and-asyncawait-52g9',
        likes: 0,
      };

      const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/);

      assert(response.body.error.includes('Unauthorized'));
    });
  });

  describe('update of a blog', () => {
    test('succeed with status 201', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogAtStart = blogsAtStart[0];
      const blogUpdate = { likes: 25 };

      const response = await api
        .put(`/api/blogs/${blogAtStart.id}`, blogUpdate)
        .send(blogUpdate)
        .expect(201);

      assert.strictEqual(response.body.likes, blogUpdate.likes);
    });
  });
});

describe('deletion of a blog', () => {
  test('succeed with status 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[blogsAtStart.length - 1];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', 'Bearer ' + token)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    const titles = blogsAtEnd.map((blog) => blog.title);

    assert(!titles.includes(blogToDelete.title));

    assert.strictEqual(blogsAtEnd.length, helper.blogs.length + 1);
  });
});

after(async () => {
  await mongoose.connection.close();
});
