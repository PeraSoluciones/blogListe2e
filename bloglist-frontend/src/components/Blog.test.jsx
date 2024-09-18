import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';

describe('<Blog />', () => {
  test('has author and title displayed and url not diplayed', async () => {
    const blog = {
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7,
    };

    const mockUpdateLikes = vi.fn();
    const mockRemoveBlog = vi.fn();

    render(
      <Blog
        blog={blog}
        updateLikes={mockUpdateLikes}
        removeBlog={mockRemoveBlog}
      />
    );

    const title = screen.getByTestId('blog-title');
    const author = screen.getByTestId('blog-author');
    const url = screen.getByTestId('blog-url');

    expect(title).toHaveTextContent('React patterns');
    expect(author).toHaveTextContent('Michael Chan');
    expect(url).toHaveStyle('display: none');
  });

  test('display url and likes on click view details', async () => {
    const blog = {
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7,
    };

    const mockUpdateLikes = vi.fn();
    const mockRemoveBlog = vi.fn();

    render(
      <Blog
        blog={blog}
        updateLikes={mockUpdateLikes}
        removeBlog={mockRemoveBlog}
      />
    );

    const user = userEvent.setup();
    const button = screen.getByTestId('button-blog-details');
    const url = screen.getByTestId('blog-url');
    const likes = screen.getByTestId('blog-likes');

    await user.click(button);

    expect(url).not.toHaveStyle('display: none');
    expect(likes).not.toHaveStyle('display: none');
  });

  test('clicking the like button event handler twice', async () => {
    const blog = {
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7,
    };

    const mockUpdateLikes = vi.fn();
    const mockRemoveBlog = vi.fn();

    render(
      <Blog
        blog={blog}
        updateLikes={mockUpdateLikes}
        removeBlog={mockRemoveBlog}
      />
    );

    const user = userEvent.setup();
    const button = screen.getByTestId('button-likes');

    await user.click(button);
    await user.click(button);

    expect(mockUpdateLikes.mock.calls).toHaveLength(2);
  });
});
