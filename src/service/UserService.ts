import { Page } from 'puppeteer';
import { autoInjectable } from 'tsyringe';
import { PersistService } from './PersistService';

@autoInjectable()
export class UserService {
  private userEmail = process.env.USER_EMAIL;

  private userPassword = process.env.USER_PASSWORD;

  constructor(private persistance?: PersistService) {}

  public async login(page: Page) {
    const [acceptCookiesButton] = await page.$x("//button[contains(text(), 'Entendi')]");
    await acceptCookiesButton.click();

    const emailSelector = await page.waitForSelector('input[type="email"]');
    await emailSelector.type(this.userEmail);

    const passwordSelector = await page.waitForSelector('input[type="password"]');
    await passwordSelector.type(this.userPassword);

    const [loginButton] = await page.$x("//button[contains(text(), 'Entrar')]");
    await loginButton.click();

    await page.waitForTimeout(5000);
    await this.persistance.saveCookies(page);
  }
}
