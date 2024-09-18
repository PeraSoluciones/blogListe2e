import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NewBlog from './NewBlog';

describe('<NewBlog />', () => {
  test('createBlog handler with proper data', async () => {
    const mockCreateBlog = vi.fn();

    render(<NewBlog createBlog={mockCreateBlog} />);

    const title = screen.getByTestId('input-title');
    const author = screen.getByTestId('input-author');
    const url = screen.getByTestId('input-url');
    const submit = screen.getByTestId('submit');
    const user = userEvent.setup();

    await user.type(title, 'React patterns');
    await user.type(author, 'Michael Chan');
    await user.type(url, 'https://reactpatterns.com/');
    await user.click(submit);

    expect(mockCreateBlog.mock.calls[0][0]).toStrictEqual({
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
    });
  });
});
