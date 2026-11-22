function totalPrice(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}

function totalPriceWithLoop(items) {
  let total = 0;

  for (const item of items) {
    total += item.price;
  }

  return total;
}

const sampleItems = [
  { name: "Book", price: 15 },
  { name: "Mug", price: 8 },
  { name: "Pen", price: 2 },
];

document.querySelector("#accessForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const colors = ["red", "green", "blue", "yellow", "purple"];
  const index = Number(document.querySelector("#accessInput").value);

  document.querySelector("#accessOutput").textContent =
    `Array: ${JSON.stringify(colors)}\n` +
    `colors[${index}] = ${colors[index]}`;
});

document.querySelector("#mutateForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.querySelector("#mutateInput").value;
  const queue = ["Ada", "Grace", "Alan"];
  queue.push(name);

  document.querySelector("#mutateOutput").textContent =
    `Array: ${JSON.stringify(queue)}\n` +
    `Length: ${queue.length}\n` +
    `Last item: ${queue.at(-1)}`;
});

document.querySelector("#transformForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const numbers = document
    .querySelector("#transformInput")
    .value.split(",")
    .map((value) => Number(value.trim()))
    .filter((value) => !Number.isNaN(value));

  const doubled = numbers.map((price) => price * 2);
  const bigOnes = numbers.filter((price) => price >= 40);

  document.querySelector("#transformOutput").textContent =
    `Input: [${numbers.join(", ")}]\n` +
    `Doubled: [${doubled.join(", ")}]\n` +
    `40 or more: [${bigOnes.join(", ")}]`;
});

document.querySelector("#challengeForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const prices = document
    .querySelector("#challengeInput")
    .value.split(",")
    .map((value) => Number(value.trim()))
    .filter((value) => !Number.isNaN(value));

  const items = prices.map((price) => ({ name: `Item ${price}`, price }));
  document.querySelector("#challengeOutput").textContent =
    `Cart: ${JSON.stringify(items)}\n` +
    `Total price: ${totalPrice(items)}`;
});

document.querySelector('[data-action="tests"]').addEventListener("click", () => {
  const tests = [
    ["totalPrice([])", totalPrice([]), 0],
    ["totalPrice(sample)", totalPrice(sampleItems), 25],
    ["totalPriceWithLoop(sample)", totalPriceWithLoop(sampleItems), 25],
    ["totalPrice([{price: 10}, {price: 5}])", totalPrice([{ price: 10 }, { price: 5 }]), 15],
  ];

  const lines = tests.map(([label, actual, expected]) => {
    const status = actual === expected ? "PASS" : "FAIL";
    return `${status}  ${label} = ${actual} (expected ${expected})`;
  });

  document.querySelector("#testsOutput").textContent = lines.join("\n");
});

document.querySelectorAll("[data-answer]").forEach((button) => {
  button.addEventListener("click", () => {
    const result = document.querySelector("#quizResult");
    const isCorrect = button.dataset.answer === "correct";

    result.textContent = isCorrect
      ? "Correct! push() adds one item to the end, so nums now has 4 items."
      : "Try again. push() adds an item at the end of the array, so the length grows by one.";
    result.style.color = isCorrect ? "#15803d" : "#b91c1c";
  });
});
