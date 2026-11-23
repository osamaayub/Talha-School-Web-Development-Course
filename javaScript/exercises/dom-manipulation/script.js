const greeting = document.createElement("p");
greeting.id = "greeting";
greeting.textContent = "Hello, learner!";
greeting.style.display = "none";
document.querySelector("#selectForm").before(greeting);

document.querySelector("#selectForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const selector = document.querySelector("#selectInput").value;
  const element = document.querySelector(`#${CSS.escape(selector)}`);

  if (!element) {
    document.querySelector("#selectOutput").textContent =
      `No element found with id "${selector}".`;
    return;
  }

  element.style.display = "block";
  document.querySelector("#selectOutput").textContent =
    `Found <${element.tagName.toLowerCase()}> with id "${element.id}":\n` +
    `textContent = "${element.textContent}"`;
});

const banner = document.querySelector("#banner");

document.querySelector("#changeForm").addEventListener("submit", (event) => {
  event.preventDefault();

  banner.textContent = document.querySelector("#changeInput").value;
  banner.style.color = "#b91c1c";
  banner.classList.add("highlight");
});

document.querySelector("#resetBanner").addEventListener("click", () => {
  banner.textContent = "Original banner text";
  banner.style.color = "";
  banner.classList.remove("highlight");
});

document.querySelector("#listForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const item = document.createElement("li");
  item.textContent = document.querySelector("#listInput").value;
  document.querySelector("#todoList").append(item);
});

const card = document.querySelector("#card");

function toggleCard() {
  card.classList.toggle("dark");
}

card.addEventListener("click", toggleCard);
document.querySelector("#toggleCard").addEventListener("click", toggleCard);

let clicks = 0;
const clickOutput = document.querySelector("#clickOutput");

document.querySelector("#clickButton").addEventListener("click", () => {
  clicks += 1;
  clickOutput.textContent = `Clicked ${clicks} times`;
});

document.querySelector("#resetClicks").addEventListener("click", () => {
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
  document.querySelector("#challengeList").append(li);
}

document.querySelector("#challengeForm").addEventListener("submit", (event) => {
  event.preventDefault();
  addItem(document.querySelector("#challengeInput").value);
  document.querySelector("#challengeInput").value = "";
});

document.querySelectorAll("[data-answer]").forEach((button) => {
  button.addEventListener("click", () => {
    const result = document.querySelector("#quizResult");
    const isCorrect = button.dataset.answer === "correct";

    result.textContent = isCorrect
      ? "Correct! innerHTML parses HTML tags, so it renders bold text. textContent would show the tags literally."
      : "Try again. innerHTML treats the string as HTML, while textContent treats it as plain text.";
    result.style.color = isCorrect ? "#15803d" : "#b91c1c";
  });
});
