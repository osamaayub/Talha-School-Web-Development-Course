function discountPrice(price, percentOff) {
  const discount = price * (percentOff / 100);
  return Math.round((price - discount) * 100) / 100;
}

function greet(name) {
  return `Hello, ${name}! Welcome back.`;
}

function triangleArea(base, height) {
  return (base * height) / 2;
}

function double(number) {
  return number * 2;
}

function square(number) {
  return number * number;
}

document.querySelector("#greetForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.querySelector("#greetInput").value;
  document.querySelector("#greetOutput").textContent = greet(name);
});

document.querySelector("#areaForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const base = Number(document.querySelector("#baseInput").value);
  const height = Number(document.querySelector("#heightInput").value);
  document.querySelector("#areaOutput").textContent =
    `Triangle area = ${triangleArea(base, height)} square units`;
});

document.querySelector("#calcForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const number = Number(document.querySelector("#calcInput").value);
  const result = square(double(number));

  document.querySelector("#calcOutput").textContent =
    `double(${number}) = ${double(number)}\n` +
    `square(${double(number)}) = ${result}`;
});

document.querySelector("#discountForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const price = Number(document.querySelector("#priceInput").value);
  const percentOff = Number(document.querySelector("#discountInput").value);
  document.querySelector("#discountOutput").textContent =
    `Original price: ${price}\n` +
    `Discounted price: ${discountPrice(price, percentOff)}`;
});

document.querySelector('[data-action="tests"]').addEventListener("click", () => {
  const tests = [
    ["discountPrice(80, 25)", discountPrice(80, 25), 60],
    ["discountPrice(100, 10)", discountPrice(100, 10), 90],
    ["discountPrice(10.5, 20)", discountPrice(10.5, 20), 8.4],
    ["discountPrice(200, 37.5)", discountPrice(200, 37.5), 125],
    ["discountPrice(50, 100)", discountPrice(50, 100), 0],
    ["discountPrice(33.33, 15)", discountPrice(33.33, 15), 28.33],
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
      ? "Correct! add() has no return statement, so it gives back undefined. The total is calculated but never handed back."
      : "Try again. What happens when a function finishes without a return statement?";
    result.style.color = isCorrect ? "#15803d" : "#b91c1c";
  });
});
