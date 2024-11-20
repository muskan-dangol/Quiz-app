const { test, expect } = require("@playwright/test");

test("Main page has expected title.", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("Topics!");
  await expect(page.locator("h3")).toHaveText(
    "Multi-choice question application"
  );
  await expect(page.getByRole("link", { name: "registering" })).toHaveText(
    "registering"
  );
  await expect(page.getByRole("link", { name: "log in" })).toHaveText("log in");
  await expect(
    page.getByRole("link", { name: "Web Software Development Course" })
  ).toHaveText("Web Software Development Course");
  await expect(page.getByRole("link", { name: "Aalto University" })).toHaveText(
    "Aalto University"
  );
});

test("Server responds with the text 'Login form'", async ({ page }) => {
  await page.goto("/auth/login");
  await expect(page.locator("h3")).toHaveText("Login form");
  await expect(
    page.getByRole("link", { name: "Not yet registered? Register here." })
  ).toHaveText("Not yet registered? Register here.");
  await page.locator("input[type=submit][value='Login']").click();
});

test("Server responds with the text 'Registration form'", async ({ page }) => {
  await page.goto("/auth/register");
  await expect(page.locator("h3")).toHaveText("Registration form");
  await expect(
    page.getByRole("link", { name: "Already registered? Login here." })
  ).toHaveText("Already registered? Login here.");
  await page.locator("input[type=submit][value='Register']").click();
});

test.beforeEach(async ({ page }) => {
  const response = await page.request.post("http://localhost:7777/auth/login", {
    form: {
      email: "muskan.dangol@edu.omnia.fi",
      password: "muskan",
    },
  });

  expect(response.status()).toBe(200);

  await page.goto("/topics");
});

test("Listing topics as a non-admin user.", async ({ page }) => {
  await page.goto("/quiz");
  await expect(page.locator("h3")).toHaveText("Available topics");
  const topics = page.locator("ul li a");
  // await expect(topics).toHaveCount(1);
});

test("random Quiz as a non-admin user.", async ({ page }) => {
  await page.goto("/quiz/1/questions/1");
  await expect(page.locator("h3")).toHaveText("Quiz: AI");
  await expect(page.locator("h4")).toHaveText("Question:");
  const quiz = page.locator("label form");
  await expect(quiz).toHaveCount(2);
});

test("correct Quiz answer as a non-admin user.", async ({ page }) => {
  await page.goto("/quiz/1/questions/1/correct");
  await expect(page.locator("h3")).toHaveText("Correct!");
  await expect(page.getByRole("link", { name: "Next question" })).toHaveText(
    "Next question"
  );
  
});

test("Incorrect Quiz answer as a non-admin user.", async ({ page }) => {
  await page.goto("/quiz/1/questions/1/incorrect");
  await expect(page.locator("h3")).toHaveText("Incorrect!");
  await expect(page.locator("p")).toHaveText("The correct option was: Artificial Intelligence");
  await expect(page.getByRole("link", { name: "Next question" })).toHaveText(
    "Next question"
  );
  
});


test("Adding and listing topics as an admin.", async ({ page }) => {
  await page.goto("/topics");

  await expect(page.locator("h4")).toHaveText("Add topics");

  const topicName = `Open AI ${Math.floor(Math.random() * 10000)}`;
  await page.locator("input[type=text][name=name]").type(topicName);
  await page.locator("input[type=submit][value=Add]").click();
  await expect(page.locator(`a >> text='${topicName}'`)).toHaveText(topicName);
  await expect(
    page.locator(`a >> text='${topicName}'`).locator("..").locator("form input[type=submit][value=Delete]")
  ).toBeVisible();
});

test("deleting topic lists.", async ({ page }) => {
  await page.goto("/topics");
  const deleteTopicName = `Delete: ${Math.random()}`;
  await page.locator("input[type=text]").type(deleteTopicName);
  await page.locator("input[type=submit][value=Add]").click();

  const listItem = page.locator("li", { hasText: deleteTopicName });
  await expect(listItem.locator(page.locator(`a >> text='${deleteTopicName}'`))).toHaveText(deleteTopicName);

  await listItem
    .locator("input[type=submit][value='Delete']")
    .click();

  await expect(page.locator("li a").last()).not.toHaveText(deleteTopicName);
});

test("Adding and listing questions as an admin.", async ({ page }) => {
  await page.goto("/topics/2");

  await expect(page.locator("a h5")).toHaveText("Back");

  const question = `What is Open AI ${Math.floor(Math.random() * 10000)}`;
  await page.locator("textarea[name='question_text']").type(question);
  await page.locator("input[type='submit'][value='Add Question']").click();
  await expect(page.locator(`a >> text='${question}'`)).toHaveText(question);
});

test("Deleting question as an admin.", async ({ page }) => {
  await page.goto("/topics/2/questions/10");

  await expect(page.locator("a h5")).toHaveText("Back");
  const questionHeader = page.locator("h4", { hasText: "What is Open AI 74" });
  await expect(questionHeader).toBeVisible();

  const deleteForm = page.locator("form[action='/topics/2/questions/10/delete']");
  await expect(deleteForm).toBeVisible();

  await deleteForm.locator("input[type='submit']").click();

  await expect(page).toHaveURL("/topics/2");
  const deletedQuestion = page.locator(`a:has-text('What is Open AI 74')`);
  await expect(deletedQuestion).not.toBeVisible();

});

test("Adding and listing question-answer options as an admin.", async ({ page }) => {
  await page.goto("/topics/2/questions/7");

  await expect(page.locator("a h5")).toHaveText("Back");
  const answerOption = `Open AI is ${Math.floor(Math.random() * 10000)}`;
  await page.locator("textarea[name='option_text']").type(answerOption);
  await page.locator("input[type='submit'][value='Add Option']").click();

  await expect(page.locator(`li:has-text('${answerOption}')`)).toContainText(answerOption);
});


test("Deleting question-answer as an admin.", async ({ page }) => {
  await page.goto("/topics/2/questions/7");

  await expect(page.locator("a h5")).toHaveText("Back");

  const optionsHeader = page.locator("h3", { hasText: "Answer Options" });
  await expect(optionsHeader).toBeVisible();

  const optionText = "Open AI is 3280";
  const deleteForm = page.locator(
    `li:has-text('${optionText}') form[action='/topics/2/questions/7/options/5/delete']`
  );
  await expect(deleteForm).toBeVisible();

  await deleteForm.locator("input[type='submit']").click();

  await expect(page).toHaveURL("/topics/2/questions/7");

  const deletedOption = page.locator(`li:has-text('${optionText}')`);
  await expect(deletedOption).not.toBeVisible();
});