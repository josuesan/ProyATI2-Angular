import { LabPage } from './app.po';

describe('lab App', () => {
  let page: LabPage;

  beforeEach(() => {
    page = new LabPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
