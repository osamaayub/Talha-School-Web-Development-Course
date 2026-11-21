document.querySelector('[data-action="quotes"]').addEventListener("click", () => {
  const singleQuoted = 'Hello, JavaScript!';
  const doubleQuoted = "Hello, JavaScript!";

  document.querySelector("#quotesOutput").textContent =
    `Single-quoted value: ${singleQuoted}\n` +
    `Double-quoted value: ${doubleQuoted}\n` +
    `Are the values equal? ${singleQuoted === doubleQuoted}`;
});

document.querySelector("#escapeForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const sentence = document.querySelector("#sentenceInput").value;
  const escapedSentence = sentence
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'");

  document.querySelector("#escapeOutput").textContent =
    `JavaScript literal: '${escapedSentence}'\n` +
    `Rendered string: ${sentence}`;
});

document.querySelector("#templateForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.querySelector("#nameInput").value;
  const topic = document.querySelector("#topicInput").value;
  const concatenatedMessage = "Hello, " + name + "! Today we are learning " + topic + ".";
  const templateMessage = `Hello, ${name}! Today we are learning ${topic}.`;
  const multilineMessage = `Student: ${name}\nTopic: ${topic}`;

  document.querySelector("#templateOutput").textContent =
    `Concatenation:\n${concatenatedMessage}\n\n` +
    `Template literal:\n${templateMessage}\n\n` +
    `Multiline template literal:\n${multilineMessage}`;
});

document.querySelectorAll("[data-answer]").forEach((button) => {
  button.addEventListener("click", () => {
    const result = document.querySelector("#challengeResult");
    const isCorrect = button.dataset.answer === "correct";

    result.textContent = isCorrect
      ? 'Correct! The + operator joins the two strings into "JavaScript".'
      : "Try again. The + operator joins string values without adding a space.";
    result.style.color = isCorrect ? "#15803d" : "#b91c1c";
  });
});
