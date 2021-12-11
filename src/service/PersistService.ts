import fs from 'fs';
import { resolve } from 'path';
import { Page } from 'puppeteer';

export class PersistService {
  private cookiesPath: string = resolve(__dirname, '..', 'config', 'cookies.json');

  async saveCookies(page: Page) {
    const cookiesObject = await page.cookies();

    fs.writeFile(this.cookiesPath, JSON.stringify(cookiesObject), (err) => {
      if (err) throw new Error('deu ruim');
    });
  }

  /**
* Verify if cookies of last session exists, in case that exists, set all cookies as same
* @param {Page} - puppeteer pages from new instance
* @returns {boolean} - if exists returns true, otherwise false
* @example
* const recoverOrSave = recoverCookies(page)
* if (!recoverOrSave) saveCookies(page)
*/
  async recoverCookies(page: Page): Promise<boolean> {
    const prevSession = fs.existsSync(this.cookiesPath);

    if (prevSession) {
      const cookies = fs.readFileSync(this.cookiesPath).toString();
      const parsedCookies = JSON.parse(cookies);

      if (parsedCookies.length) {
        await parsedCookies.forEach((cookie) => page.setCookie(cookie));
      }
      return true;
    }
    return false;
  }
}
