const loginWith = async (page, username, password) => {
  await page.getByTestId('username').fill(username);
  await page.getByTestId('password').fill(password);
  await page.getByRole('button', { name: 'login' }).click();
};

const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'new blog' }).click();
  await page.getByTestId('input-title').fill(title);
  await page.getByTestId('input-author').fill(author);
  await page.getByTestId('input-url').fill(url);
  await page.getByRole('button', { name: 'Create' }).click();
};

const networkWait = (page, data) => {
  return page.waitForResponse(
    (response) =>
      response.url().includes(data.url) &&
      response.status() === data.status &&
      response.request().method() === data.method,
    { timeout: 0 }
  );
};

const updateLikes = async (page, button) => {
  const responsePromise = networkWait(page, {
    url: '/api/blogs',
    status: 201,
    method: 'PUT',
  });
  await button.click();
  const response = await responsePromise;
};

export { loginWith, createBlog, networkWait, updateLikes };
