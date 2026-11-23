const selectForm = document.querySelector("#selectForm");
const selectInput = document.querySelector("#selectInput");
const selectOutput = document.querySelector("#selectOutput");
const changeForm = document.querySelector("#changeForm");
const changeInput = document.querySelector("#changeInput");
const resetBanner = document.querySelector("#resetBanner");
const banner = document.querySelector("#banner");
const listForm = document.querySelector("#listForm");
const listInput = document.querySelector("#listInput");
const todoList = document.querySelector("#todoList");
const card = document.querySelector("#card");
const toggleCardButton = document.querySelector("#toggleCard");
const clickButton = document.querySelector("#clickButton");
const resetClicks = document.querySelector("#resetClicks");
const clickOutput = document.querySelector("#clickOutput");
const challengeForm = document.querySelector("#challengeForm");
const challengeInput = document.querySelector("#challengeInput");
const challengeList = document.querySelector("#challengeList");
const quizResult = document.querySelector("#quizResult");
const answerButtons = document.querySelectorAll("[data-answer]");

const greeting = document.createElement("p");
greeting.id = "greeting";
greeting.textContent = "Hello, learner!";
greeting.style.display = "none";
selectForm.before(greeting);

selectForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const selector = selectInput.value;
  const element = document.querySelector(`#${CSS.escape(selector)}`);

  if (!element) {
    selectOutput.textContent = `No element found with id "${selector}".`;
    return;
  }

  element.style.display = "block";
  selectOutput.textContent =
    `Found <${element.tagName.toLowerCase()}> with id "${element.id}":\n` +
    `textContent = "${element.textContent}"`;
});

changeForm.addEventListener("submit", (event) => {
  event.preventDefault();

  banner.textContent = changeInput.value;
  banner.style.color = "#b91c1c";
  banner.classList.add("highlight");
});

resetBanner.addEventListener("click", () => {
  banner.textContent = "Original banner text";
  banner.style.color = "";
  banner.classList.remove("highlight");
});

listForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const item = document.createElement("li");
  item.textContent = listInput.value;
  todoList.append(item);
});

function toggleCard() {
  card.classList.toggle("dark");
}

card.addEventListener("click", toggleCard);
toggleCardButton.addEventListener("click", toggleCard);

let clicks = 0;

clickButton.addEventListener("click", () => {
  clicks += 1;
  clickOutput.textContent = `Clicked ${clicks} times`;
});

resetClicks.addEventListener("click", () => {
  clicks = 0;
  clickOutput.textContent = "Clicked 0 times";
});

function addItem(text) {
  const li = document.createElement("li");
  li.textContent = text;

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-button";
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => li.remove());

  li.append(deleteButton);
  challengeList.append(li);
}

challengeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addItem(challengeInput.value);
  challengeInput.value = "";
});

answerButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const isCorrect = button.dataset.answer === "correct";

    quizResult.textContent = isCorrect
      ? "Correct! innerHTML parses HTML tags, so it renders bold text. textContent would show the tags literally."
      : "Try again. innerHTML treats the string as HTML, while textContent treats it as plain text.";
    quizResult.style.color = isCorrect ? "#15803d" : "#b91c1c";
  });
});
