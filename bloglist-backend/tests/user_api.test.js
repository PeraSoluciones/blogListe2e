const { test, before, after, describe } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);

const User = require('../models/user');

before(async () => {
  await User.deleteMany({});
});

describe('user creation', () => {
  test('succeed with valid data', async () => {
    const user = {
      username: 'mchan',
      name: 'Michael Chan',
      password: 'mchan@123',
    };

    await api.post('/api/users').send(user).expect(201);
  });

  test('without username fails with message `username and password are required`', async () => {
    const user = {
      name: 'John',
      password: '123',
    };
    const response = await api.post('/api/users').send(user).expect(400);

    assert(response.body.includes('username and password are required'));
  });

  test('on duplicate username fails with statuscode 400', async () => {
    const user = {
      username: 'mchan',
      name: 'Mark Chan',
      password: 'mchan@123',
    };

    const response = await api.post('/api/users').send(user).expect(400);

    assert(response.body.error.includes('expected `username` to be unique'));
  });
});

after(async () => {
  //   await User.deleteMany({});
  await mongoose.connection.close();
});
