import puppeteer, { Page } from 'puppeteer';
import { autoInjectable } from 'tsyringe';
import { PersistService } from './service/PersistService';

@autoInjectable()
export class Automator {
  private baseUrl: string;

  constructor(
    baseUrl: string,
    private persistenceService?: PersistService,
  ) {
    this.baseUrl = baseUrl;
  }

  async start() {
    (async () => {
      const browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage();

      const checkCookies = await this.persistenceService.recoverCookies(page);

      await page.goto(this.baseUrl);

      if (!checkCookies) await this.login(page);

      setTimeout(async () => {
        await this.persistenceService.saveCookies(page);
        await browser.close();
      }, 10000);
    })();
  }

  async login(page: Page) {
    const [acceptCookiesButton] = await page.$x("//button[contains(text(), 'Entendi')]");
    await acceptCookiesButton.click();

    const emailSelector = await page.waitForSelector('input[type="email"]');
    await emailSelector.type(process.env.USER_EMAIL);

    const passwordSelector = await page.waitForSelector('input[type="password"]');
    await passwordSelector.type(process.env.USER_PASSWORD);

    const [loginButton] = await page.$x("//button[contains(text(), 'Entrar')]");
    await loginButton.click();
  }
}
