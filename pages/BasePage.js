export class BasePage {
  constructor(page) {
    this.page = page;
  }

  async goto(url) {
    await this.page.goto(url);
    await this.page.waitForLoadState('networkidle');
  }

  async waitForElement(selector, timeout = 10000) {
    await this.page.waitForSelector(selector, { timeout });
  }

  async clickElement(selector) {
    await this.page.locator(selector).click();
  }

  async fillInput(selector, text) {
    await this.page.locator(selector).fill(text);
  }

  async takeScreenshot(path, fullPage = true) {
    await this.page.screenshot({ path, fullPage });
  }

  async wait(ms) {
    await this.page.waitForTimeout(ms);
  }

  async maximizeWindow() {
    await this.page.setViewportSize({ width: 1920, height: 1080 });
  }
}
