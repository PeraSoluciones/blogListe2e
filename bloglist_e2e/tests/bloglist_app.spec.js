const { test, expect, beforeEach, describe } = require('@playwright/test');
const { loginWith, createBlog, networkWait, updateLikes } = require('./helper');

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset');
    await request.post('/api/users', {
      data: {
        name: 'Robert C. Martin',
        username: 'rmartin',
        password: 'rmartin@789',
      },
    });
    await request.post('/api/users', {
      data: {
        name: 'Michael Chan',
        username: 'mchan',
        password: 'mchan@123',
      },
    });
    await request.post('/api/users', {
      data: {
        username: 'edijkstra',
        name: 'Edsger W. Dijkstra',
        password: 'edijkstra@345',
      },
    });
    await page.goto('/');
    page.on('console', (msg) => {
      if (msg.type() === 'log') console.log(msg.text());
    });
    // page.on('request', (request) =>
    //   console.log('>>', request.method(), request.url(), request.postDataJSON())
    // );
    // page.on('response', async (response) => {
    //   if (response.request().method() === 'GET')
    //     console.log('<<', response.request().method(), await response.json());
    // });
  });

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByTestId('login')).toBeVisible();
  });

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'rmartin', 'rmartin@789');
      await expect(page.getByText('Wellcome Robert C. Martin')).toBeVisible();
    });
    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'rmartin', 'aasfad');
      await expect(page.getByText('wrong username or password')).toBeVisible();
    });
  });

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'rmartin', 'rmartin@789');
      await createBlog(
        page,
        'first blog',
        'Jhon Doe',
        'https://mockblogs.com/fakeblog1.html'
      );
    });

    test('a new blog can be created', async ({ page }) => {
      await createBlog(
        page,
        'second blog',
        'Jhon Doe',
        'https://mockblogs.com/fakeblog2.html'
      );

      expect(
        (await page.locator('.blog').filter({ hasText: 'second' }).innerText())
          .split(' view')
          .filter((element) => element !== '')
          .toString()
      ).toBe('second blog');
    });

    test('a blog can be edited', async ({ page }) => {
      await page.getByRole('button', { name: 'view' }).click();
      const responsePromise = networkWait(page, {
        url: '/api/blogs',
        status: 201,
        method: 'PUT',
      });
      await page.getByRole('button', { name: 'like' }).click();
      const response = await responsePromise;

      expect(
        parseInt(
          await page.getByTestId('blog-likes').locator('span').textContent()
        )
      ).toBe(1);
    });

    test('a blog can be removed', async ({ page }) => {
      await page.getByRole('button', { name: 'view' }).click();
      page.on('dialog', (dialog) => dialog.accept());
      const responsePromise = networkWait(page, {
        url: '/api/blogs',
        status: 204,
        method: 'DELETE',
      });
      await page.getByRole('button', { name: 'remove' }).click();
      const response = await responsePromise;

      expect(response._initializer.status).toEqual(204);
    });

    test('remove button only can be seen by creator', async ({ page }) => {
      await page.getByRole('button', { name: 'view' }).click();
      await page.getByRole('button', { name: 'logout' }).click();
      await loginWith(page, 'mchan', 'mchan@123');
      await page.getByRole('button', { name: 'view' }).click();
      expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible();
    });
  });

  test('blogs order by likes', async ({ page }) => {
    test.slow();
    await loginWith(page, 'rmartin', 'rmartin@789');
    const likesOrdered = [4, 3, 2, 1];
    await createBlog(
      page,
      'first blog',
      'Jhon Doe',
      'https://mockblogs.com/fakeblog1.html'
    );
    await createBlog(
      page,
      'second blog',
      'Michael Jackson',
      'https://mockblogs.com/fakeblog2.html'
    );
    await createBlog(
      page,
      'third blog',
      'Donald Trump',
      'https://mockblogs.com/fakeblog3.html'
    );
    await createBlog(
      page,
      'fourth blog',
      'Billy Jean',
      'https://mockblogs.com/fakeblog4.html'
    );

    const divBlog4 = page.locator('.blog').filter({ hasText: 'fourth' });
    const viewB4 = divBlog4.getByRole('button', { name: 'view' });
    await viewB4.click();
    const likeB4 = divBlog4.getByRole('button', { name: 'like' });
    await updateLikes(page, likeB4);
    await updateLikes(page, likeB4);
    await updateLikes(page, likeB4);
    await updateLikes(page, likeB4);

    const divBlog3 = page.locator('.blog').filter({ hasText: 'third' });
    const viewB3 = divBlog3.getByRole('button', { name: 'view' });
    await viewB3.click();
    const likeB3 = divBlog3.getByRole('button', { name: 'like' });
    await updateLikes(page, likeB3);
    await updateLikes(page, likeB3);
    await updateLikes(page, likeB3);

    const divBlog2 = page.locator('.blog').filter({ hasText: 'second' });
    const viewB2 = divBlog2.getByRole('button', { name: 'view' });
    await viewB2.click();
    const likeB2 = divBlog2.getByRole('button', { name: 'like' });
    await updateLikes(page, likeB2);
    await updateLikes(page, likeB2);

    const divBlog1 = page.locator('.blog').filter({ hasText: 'first' });
    const viewB1 = divBlog1.getByRole('button', { name: 'view' });
    await viewB1.click();
    const likeB1 = divBlog1.getByRole('button', { name: 'like' });
    await updateLikes(page, likeB1);

    expect(
      await Promise.all(
        (
          await page.locator('.blog').locator('span').all()
        ).map(async (locator) => Number(await locator.innerText()))
      )
    ).toStrictEqual(likesOrdered);
  });
});
