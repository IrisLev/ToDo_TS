import { test, expect } from '@playwright/test';
import { ToDoListPage } from '../pages/toDoListPage';
import todoCases from '../data/input_items.json';

type ToDoCase = {
  text: string;
};

let thePage: ToDoListPage;

test.beforeEach(async ({ page }) => {
  thePage = new ToDoListPage(page);
  await page.goto('https://todomvc.com/examples/react/dist/#');
});

test('Empty state', async () => {
  await expect(thePage.toDoListTextField).toBeVisible();
  await expect(thePage.listTitle).toContainText('todos');
  await expect(thePage.howToAddItem).toBeVisible();
  await expect(thePage.toDoListFilters).not.toBeVisible();
});
test.describe('Positive tests for adding an item', () => {
  test('Add item to an empty list', async ({ page }) => {
    const task = 'Feed the cats';
    await thePage.addListItem('Feed the cats');
    await expect(thePage.toDoList).toContainText(task);
    await expect(thePage.toDoListFilters).toBeVisible();
    await expect(thePage.footeritemsCount).toBeVisible();
    await expect(thePage.footerClearCompleted).toBeVisible();
    await expect(thePage.footerFilterAll).toBeVisible();
    await expect(thePage.footerFilterAll).toHaveClass('selected');
    await expect(thePage.footerFilterActive).not.toHaveClass('selected');
    await expect(thePage.footerFilterCompleted).not.toHaveClass('selected');
  });
  test('Bunch of valid inputs', async ({ page }) => {
    for (const task of todoCases.valid) {
      await thePage.addListItem(task);
      await expect(thePage.toDoList).toContainText(task);
    }
  });
});
test.describe('Negative tests for adding an item', () => {
  for (const [name, task] of Object.entries(todoCases.invalid)) {
    test(`Negative test with: ${name}`, async ({}) => {
      await thePage.addListItem(task);
      await expect(thePage.toDoList).toBeEmpty();
    });
  }
});
