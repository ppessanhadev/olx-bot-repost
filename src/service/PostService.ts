import { resolve } from 'path';
import { Page } from 'puppeteer';

export class PostService {
  private postTitle = process.env.POST_TITLE;

  private postDescription = process.env.POST_DESCRIPTION;

  private baseUploadsDir = resolve(__dirname, '..', 'assets', 'uploads');

  public async checkExists(page: Page) {
    try {
      await page.waitForSelector("span[color='#10ce64']", { timeout: 1000 });
      return true;
    } catch (err) {
      if (err.name.toLowerCase() === 'timeouterror') return false;
      throw new Error('Internal error');
    }
  }

  public async delete(page: Page) {
    const [deletePost] = await page.$x("//button[contains(text(), 'Excluir')]");
    await deletePost.click();

    const [selectReason] = await page.$x("//span[contains(text(), 'Outro')]");
    await selectReason.click();

    const [deleteButton] = await page.$x("//div[@aria-label='Exclusão de anúncio']//button[contains(text(), 'Excluir')]");
    await deleteButton.click();

    const [confirmDelete] = await page.$x("//a[contains(text(), 'Não, obrigado.')]");
    await confirmDelete.click();
  }

  public async create(page: Page) {
    const announceButton = await page.waitForSelector('a[href="https://www2.olx.com.br/desapega"');
    await announceButton.click();

    await page.waitForTimeout(3000);

    const titleInput = await page.waitForSelector('input#input_subject');
    await titleInput.type(this.postTitle);

    const descriptionInput = await page.waitForSelector('textarea#input_body');
    await descriptionInput.type(this.postDescription);

    const eletroCategory = await page.waitForSelector('a#category_item-3000');
    await eletroCategory.click();

    const gameCategory = await page.waitForSelector('a#category_item-3020');
    await gameCategory.click();

    const typeSelector = await page.waitForSelector('select#videogame_type');
    await typeSelector.select('1');

    const modelSelector = await page.waitForSelector('select#videogame_model');
    await modelSelector.select('1');

    const inputPrice = await page.waitForSelector('input#price');
    await inputPrice.type('3000');

    const inputUpload = await page.waitForSelector('input.box__field');
    await inputUpload.uploadFile(this.baseUploadsDir.concat('/3.png'));
    await inputUpload.uploadFile(this.baseUploadsDir.concat('/japanese-wall.jpg'));

    const inputZipcode = await page.waitForSelector('input#zipcode');
    await inputZipcode.type('21073185');

    await page.$eval('input#phone_hidden', (e: HTMLInputElement) => e.click());

    await page.waitForTimeout(5000);
  }
}
