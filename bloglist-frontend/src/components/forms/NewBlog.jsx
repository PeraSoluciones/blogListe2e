import PropTypes from 'prop-types';
import { forwardRef, useImperativeHandle, useState } from 'react';

const NewBlog = forwardRef(({ createBlog }, ref) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const addBlog = (event) => {
    event.preventDefault();
    createBlog({ title, author, url });
  };

  useImperativeHandle(ref, () => {
    return {
      setAuthor,
      setTitle,
      setUrl,
    };
  });

  return (
    <div>
      <h2>Create new</h2>
      <form onSubmit={addBlog}>
        <div>
          Title:
          <input
            data-testid='input-title'
            type='text'
            name='Title'
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          Author:
          <input
            data-testid='input-author'
            type='text'
            name='Author'
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url:
          <input
            data-testid='input-url'
            type='text'
            name='Url'
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type='submit' data-testid='submit'>
          Create
        </button>
      </form>
    </div>
  );
});

NewBlog.displayName = 'NewBlog';

NewBlog.propTypes = {
  createBlog: PropTypes.func.isRequired,
};

export default NewBlog;
