import PropTypes from 'prop-types';
import { useState } from 'react';

const Blog = ({ blog, user, updateLikes, removeBlog }) => {
  const [visible, setVisible] = useState(false);

  const toggleDetails = () => {
    setVisible(!visible);
  };

  const handleLike = (blog) => {
    updateLikes({ ...blog, likes: blog.likes + 1 });
  };

  const handleRemove = (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`))
      removeBlog(blog);
  };

  const buttonText = visible ? 'hide' : 'view';
  const visibility = { display: visible ? '' : 'none' };

  return (
    <div className='blog'>
      <div data-testid='blog-title'>
        {blog.title + ' '}
        <button onClick={toggleDetails} data-testid='button-blog-details'>
          {buttonText}
        </button>
      </div>
      <div style={visibility}>
        <div data-testid='blog-url' style={visibility}>
          {blog.url}
        </div>
        <div data-testid='blog-likes' style={visibility}>
          <span>{blog.likes + ' '} </span>
          <button data-testid='button-likes' onClick={() => handleLike(blog)}>
            like
          </button>
        </div>

        <div data-testid='blog-author'>{blog.author}</div>

        <button
          onClick={() => handleRemove(blog)}
          style={{
            display: user.username === blog.user.username ? true : 'none',
          }}
        >
          remove
        </button>
      </div>
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  updateLikes: PropTypes.func.isRequired,
  removeBlog: PropTypes.func.isRequired,
};

export default Blog;
