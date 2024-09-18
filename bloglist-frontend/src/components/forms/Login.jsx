import PropTypes from 'prop-types';
import { useState } from 'react';
import loginService from '../../services/login';
import blogService from '../../services/blogs';
import Notification from '../Notification';

const Login = ({ setUser, message, setMessage }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem(
        'loggedBloglistappUser',
        JSON.stringify(user)
      );

      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
      setMessage({ type: 'success', text: `Wellcome ${user.name}` });
    } catch (error) {
      setMessage({ type: 'error', text: 'wrong username or password' });
    }
  };

  return (
    <div data-testid='login'>
      <h2>Log in to application</h2>
      <Notification message={message} setMessage={setMessage} />
      <form onSubmit={handleLogin}>
        <div>
          username:
          <input
            type='text'
            data-testid='username'
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password:
          <input
            type='password'
            data-testid='password'
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  );
};

Login.propTypes = {
  setUser: PropTypes.func.isRequired,
};

export default Login;
