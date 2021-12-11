import puppeteer, { Page } from 'puppeteer';
import { autoInjectable } from 'tsyringe';
import { PersistService } from './service/PersistService';
import { PostService } from './service/PostService';
import { UserService } from './service/UserService';

@autoInjectable()
export class Automator {
  private baseUrl: string;

  constructor(
    baseUrl: string,
    private persistance?: PersistService,
    private user?: UserService,
    private post?: PostService,
  ) {
    this.baseUrl = baseUrl;
  }

  async start() {
    (async () => {
      const browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage();
      const checkCookies = await this.persistance.recoverCookies(page);

      await page.goto(this.baseUrl);
      await page.waitForTimeout(3000);

      if (!checkCookies) await this.user.login(page);

      const postExists = await this.post.checkExists(page);
      if (postExists) await this.post.delete(page);

      await browser.close();
    })();
  }
}
