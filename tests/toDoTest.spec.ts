import { test, expect } from '@playwright/test';
import { ToDoListPage } from '../pages/toDoListPage';
import todoCases from '../data/input_items.json';

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
test.describe('Positive tests for one item', () => {
  test('Footer added on adding a first item', async ({ page }) => {
    const task = 'Feed the cats';
    await thePage.addListItem('Feed the cats');
    await expect(thePage.toDoList).toContainText(task);
    await expect(thePage.toDoListItem).toHaveCount(1);
    await expect(thePage.toDoListFilters).toBeVisible();
    await expect(thePage.footeritemsCount).toBeVisible();
    await expect(thePage.footerClearCompleted).toBeVisible();
    await expect(thePage.footerFilterAll).toBeVisible();
    await expect(thePage.footerFilterAll).toHaveClass('selected');
    await expect(thePage.footerFilterActive).not.toHaveClass('selected');
    await expect(thePage.footerFilterCompleted).not.toHaveClass('selected');
    await expect(thePage.itemDestroyButton).not.toBeVisible();
    await expect(thePage.itemCheckBox).toBeVisible();
    await thePage.toDoListItem.hover();
    await expect(thePage.toDoListItem).toBeVisible();
  });
  test('Footer gone after deleting the last item', async () => {
    const task = 'Feed the cats';
    await thePage.addListItem('Feed the cats');
    await expect(thePage.toDoList).toContainText(task);
    await thePage.toDoListItem.hover();
    await thePage.itemDestroyButton.click();
    await expect(thePage.toDoList).toBeEmpty();
    await expect(thePage.footer).not.toBeVisible();
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
test.describe('Multiple items tests', () => {
  test.beforeEach(async ({}) => {
    await thePage.addListItem('Feed the cats');
    await thePage.addListItem('Feed the cats');
    await thePage.addListItem('Feed the cats');
    await thePage.addListItem('Clean the litter');
    await thePage.addListItem('Play with the cats');
  });
  test('Verify identical toDos count', async ({}) => {
    const sameTextItems = thePage.toDoListItem.filter({ hasText: 'Feed the cats' });
    await expect(sameTextItems).toHaveCount(3);
  });
  test('Test: UI changes upon task completion', async ({}) => {
    const sameTextItems = thePage.toDoListItem.filter({ hasText: 'Feed the cats' });
    await sameTextItems.nth(0).getByTestId('todo-item-toggle').click();
    await thePage.getToDoItemByTask('Clean the litter').getByTestId('todo-item-toggle').click();
    await expect(sameTextItems.nth(0)).toHaveClass('completed');
    await expect(thePage.getToDoItemByTask('Clean the litter')).toHaveClass('completed');
    await thePage.itemsCounter(3);
  });
  test('Apply filter: Active', async ({}) => {
    const sameTextItems = thePage.toDoListItem.filter({ hasText: 'Feed the cats' });
    await sameTextItems.nth(0).getByTestId('todo-item-toggle').click();
    await thePage.getToDoItemByTask('Clean the litter').getByTestId('todo-item-toggle').click();
    await thePage.footerFilterActive.click();
    await expect(sameTextItems).toHaveCount(2);
    await expect(thePage.toDoListItem).toHaveCount(3);
    await expect(thePage.getToDoItemByTask('Play with the cats')).toBeVisible();
    await thePage.itemsCounter(3);
  });
  test('Apply filter "Completed"', async ({}) => {
    const sameTextItems = thePage.getToDoItemByTask('Feed the cats');
    await thePage.completeToDo('Clean the litter');
    await thePage.completeToDo('Feed the cats');
    await thePage.footerFilterCompleted.click();
    await thePage.itemsCounter(3);
    await expect(thePage.toDoListItem).toHaveCount(2);
    await expect(sameTextItems.nth(0)).toHaveClass('completed');
    await expect(thePage.getToDoItemByTask('Clean the litter')).toHaveClass('completed');
  });
  test('Test the results of un-completing a task', async ({}) => {
    const sameTextItems = thePage.getToDoItemByTask('Feed the cats');
    await thePage.completeToDo('Clean the litter');
    await thePage.completeToDo('Feed the cats');
    await thePage.footerFilterCompleted.click();
    await thePage.completeToDo('Feed the cats');
    await expect(thePage.toDoListItem).toHaveCount(1);
    await expect(thePage.toDoListItem).toContainText('Clean the litter');
    await thePage.itemsCounter(4);
    await expect(thePage.getToDoItemByTask('Clean the litter')).toHaveClass('completed');
  });
  test('Test the Active filter', async ({}) => {
    const sameTextItems = thePage.getToDoItemByTask('Feed the cats');
    await thePage.completeToDo('Clean the litter');
    await thePage.completeToDo('Feed the cats');
    await thePage.footerFilterCompleted.click();
    await thePage.completeToDo('Feed the cats');
    await thePage.footerFilterActive.click();
    await thePage.itemsCounter(4);
    await expect(thePage.toDoListItem).toHaveCount(4);
    await expect(sameTextItems).toHaveCount(3);
    await expect(thePage.toDoList).toContainText('Play with the cats');
    await expect(thePage.toDoListItem.locator('li.completed')).toHaveCount(0);
  });
  test('Clicking Clear Completed removes a task from the All list', async ({}) => {
    const sameTextItems = thePage.getToDoItemByTask('Feed the cats');
    await thePage.completeToDo('Clean the litter');
    await thePage.completeToDo('Feed the cats');
    await thePage.removeCompletedTasks();

    await thePage.itemsCounter(3);
    await expect(sameTextItems).toHaveCount(2);
    await expect(thePage.toDoList).toContainText('Play with the cats');
    await expect(thePage.toDoListItem).toHaveCount(3);
  });
  test('Clicking Clear Completed removes a task from the Active list', async ({}) => {
    const sameTextItems = thePage.getToDoItemByTask('Feed the cats');
    await thePage.completeToDo('Clean the litter');
    await thePage.completeToDo('Feed the cats');
    await thePage.removeCompletedTasks();
    await thePage.footerFilterActive.click();
    await thePage.itemsCounter(3);
    await expect(sameTextItems).toHaveCount(2);
    await expect(thePage.toDoList).toContainText('Play with the cats');
    await expect(thePage.toDoListItem).toHaveCount(3);
  });
  test('Clicking Clear Completed removes a task from the Completed list', async ({}) => {
    const sameTextItems = thePage.getToDoItemByTask('Feed the cats');
    await thePage.completeToDo('Clean the litter');
    await thePage.completeToDo('Feed the cats');
    await thePage.removeCompletedTasks();
    await thePage.footerFilterCompleted.click();
    await thePage.itemsCounter(3);
    await expect(thePage.toDoListItem).toHaveCount(0);
  });
});
