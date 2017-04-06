import { TreeStoriesWebFEPage } from './app.po';

describe('tree-stories-web-fe App', () => {
  let page: TreeStoriesWebFEPage;

  beforeEach(() => {
    page = new TreeStoriesWebFEPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
