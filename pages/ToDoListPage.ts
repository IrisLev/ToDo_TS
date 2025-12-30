import { Page, Locator } from '@playwright/test';

export class ToDoListPage {
  readonly page: Page;
  readonly toDoList: Locator;
  readonly toDoListTextField: Locator;
  readonly toDoListItem: Locator;
  readonly toDoListFilters: Locator;
  readonly listTitle: Locator;
  readonly howToAddItem: Locator;
  readonly footeritemsCount: Locator;
  readonly footerFilterAll: Locator;
  readonly footerFilterActive: Locator;
  readonly footerFilterCompleted: Locator;
  readonly footerClearCompleted: Locator;

  constructor(page: Page) {
    this.page = page;
    this.toDoList = this.page.locator('ul.todo-list');
    this.toDoListTextField = this.page.getByPlaceholder('What needs to be done?');
    this.toDoListItem = this.page.getByTestId('todo-item-toggle');
    this.toDoListFilters = this.page.getByTestId('footer');
    this.listTitle = this.page.getByTestId('header');
    this.howToAddItem = this.page.locator('.info', { hasText: 'Double-click to edit a todo' });
    this.footeritemsCount = this.page.getByTestId('footer').locator('.todo-count');
    this.footerClearCompleted = this.toDoListFilters.getByRole('button', {
      name: 'Clear completed',
    });
    this.footerFilterActive = this.toDoListFilters.getByRole('link', { name: 'Active' });
    this.footerFilterCompleted = this.toDoListFilters.getByRole('link', { name: 'Completed' });
    this.footerFilterAll = this.toDoListFilters.getByRole('link', { name: 'All' });
  }

  async navigate() {
    await this.page.goto('https://todomvc.com/examples/react/dist/#');
  }
  async addListItem(task: string) {
    await this.toDoListTextField.fill(task);
    await this.toDoListTextField.press('Enter');
  }
}
