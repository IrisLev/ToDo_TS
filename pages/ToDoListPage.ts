import { Page, Locator, expect } from '@playwright/test';

export class ToDoListPage {
  readonly page: Page;
  readonly toDoList: Locator;
  readonly toDoListTextField: Locator;
  readonly toDoListItem: Locator;
  readonly toDoListFilters: Locator;
  readonly listTitle: Locator;
  readonly howToAddItem: Locator;
  readonly footer: Locator;
  readonly footeritemsCount: Locator;
  readonly footerFilterAll: Locator;
  readonly footerFilterActive: Locator;
  readonly footerFilterCompleted: Locator;
  readonly footerClearCompleted: Locator;
  readonly itemDestroyButton: Locator;
  readonly itemCheckBox: Locator;

  constructor(page: Page) {
    this.page = page;
    this.toDoList = this.page.locator('ul.todo-list');
    this.toDoListTextField = this.page.getByPlaceholder('What needs to be done?');
    this.toDoListItem = this.toDoList.getByTestId('todo-item');
    this.toDoListFilters = this.page.getByTestId('footer');
    this.listTitle = this.page.getByTestId('header');
    this.howToAddItem = this.page.locator('.info', { hasText: 'Double-click to edit a todo' });
    this.footeritemsCount = this.page.getByTestId('footer').locator('.todo-count'); /////////
    this.footerClearCompleted = this.toDoListFilters.getByRole('button', {
      name: 'Clear completed',
    });
    this.footerFilterActive = this.toDoListFilters.getByRole('link', { name: 'Active' });
    this.footerFilterCompleted = this.toDoListFilters.getByRole('link', { name: 'Completed' });
    this.footerFilterAll = this.toDoListFilters.getByRole('link', { name: 'All' });
    this.itemDestroyButton = this.toDoListItem.getByTestId('todo-item-button');
    this.itemCheckBox = this.toDoListItem.getByTestId('todo-item-toggle');
    this.footer = this.page.getByTestId('footer');
  }

  async navigate() {
    await this.page.goto('https://todomvc.com/examples/react/dist/#');
  }
  async addListItem(task: string) {
    await this.toDoListTextField.fill(task);
    await this.toDoListTextField.press('Enter');
  }
  getToDoItemByTask(task: string) {
    return this.toDoListItem.filter({ hasText: task });
  }
  async completeToDo(task: string, index = 0) {
    await this.getToDoItemByTask(task).nth(index).getByTestId('todo-item-toggle').click();
  }
  async itemsCounter(count: number) {
    await expect(this.page.getByTestId('footer').locator('.todo-count')).toHaveText(
      `${count} items left!`,
    );
  }
}
