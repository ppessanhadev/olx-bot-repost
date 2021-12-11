import { Page } from 'puppeteer';

export class PostService {
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
}
