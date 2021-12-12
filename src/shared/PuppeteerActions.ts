import { Page } from 'puppeteer';

export class PuppeteerActions {
  public async selectAndClick(page: Page, selector: string) {
    const selection = await page.waitForSelector(selector);
    await selection.click();
  }

  public async selectAndType(page: Page, selector: string, type: string) {
    const selection = await page.waitForSelector(selector);
    await selection.type(type);
  }

  public async evalAndClick(page: Page, selector: string) {
    const [selection] = await page.$x(selector);
    await selection.click();
  }

  public async evalAndType(page: Page, selector: string, type: string) {
    const [selection] = await page.$x(selector);
    await selection.type(type);
  }
}
