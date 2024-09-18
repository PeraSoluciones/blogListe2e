import { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import Login from './components/forms/Login';
import NewBlog from './components/forms/NewBlog';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import { sortBlogs } from './utils/helper';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState({});

  useEffect(() => {
    blogService.getAll().then((data) => setBlogs(data));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistappUser');
    setUser(null);
  };

  const addBlog = async (blog) => {
    const response = await blogService.create(blog);

    if (response?.response?.status >= 400)
      setMessage({ type: 'error', text: response.response.data });
    else {
      // setBlogs(sortBlogs(blogs.concat(response)));
      setBlogs(await blogService.getAll());
      newBlogFormRef.current.setAuthor('');
      newBlogFormRef.current.setTitle('');
      newBlogFormRef.current.setUrl('');
      toggable.current.toggleVisibility();
      setMessage({
        type: 'success',
        text: `a new blog ${response.title} by ${response.author} added`,
      });
    }
  };

  const udpateBlogLikes = async (data) => {
    const response = await blogService.update(data);
    if (response?.response?.status >= 400)
      setMessage({ type: 'error', text: response.response.data });
    else {
      const updatedBlogs = blogs.map((blog) =>
        blog.id === response.id ? { ...blog, likes: response.likes } : blog
      );

      setBlogs(sortBlogs(updatedBlogs));
      setMessage({
        type: 'success',
        text: `blog ${response.title} by ${response.author} updated`,
      });
    }
  };

  const deleteBlog = async (blog) => {
    const response = await blogService.remove(blog.id);

    if (response?.response?.status >= 400)
      setMessage({ type: 'error', text: response.response.data });
    else {
      setMessage({
        type: 'success',
        text: `Blog ${blog.title} by ${blog.author} removed`,
      });
      const blogsAtEnd = blogs.filter((b) => b.id !== blog.id);
      setBlogs(blogsAtEnd);
    }
  };

  const toggable = useRef();
  const newBlogFormRef = useRef();

  return (
    <div data-testid='root'>
      {user === null ? (
        <Login setUser={setUser} message={message} setMessage={setMessage} />
      ) : (
        <div data-testid='blogs'>
          <h2>blogs</h2>
          <Notification message={message} setMessage={setMessage} />
          <p>
            {user.name} logged in <button onClick={handleLogout}>logout</button>
          </p>
          <Togglable buttonLabel='new blog' ref={toggable}>
            <NewBlog createBlog={addBlog} ref={newBlogFormRef} />
          </Togglable>
          {blogs.map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              user={user}
              updateLikes={udpateBlogLikes}
              removeBlog={deleteBlog}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
