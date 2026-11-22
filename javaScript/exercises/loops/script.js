function fizzBuzz(n) {
  const result = [];

  for (let i = 1; i <= n; i++) {
    if (i % 3 === 0 && i % 5 === 0) {
      result.push("FizzBuzz");
    } else if (i % 3 === 0) {
      result.push("Fizz");
    } else if (i % 5 === 0) {
      result.push("Buzz");
    } else {
      result.push(i);
    }
  }

  return result;
}

document.querySelector("#tableForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const number = Number(document.querySelector("#tableInput").value);
  const lines = [];

  for (let i = 1; i <= 10; i++) {
    lines.push(`${number} x ${i} = ${number * i}`);
  }

  document.querySelector("#tableOutput").textContent = lines.join("\n");
});

document.querySelector("#countdownForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const start = Math.min(Math.max(Number(document.querySelector("#countdownInput").value), 1), 20);
  const lines = [];
  let count = start;

  while (count > 0) {
    lines.push(count);
    count--;
  }

  lines.push("Liftoff!");
  document.querySelector("#countdownOutput").textContent = lines.join("\n");
});

document.querySelector("#vowelsForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const word = document.querySelector("#vowelsInput").value;
  let vowels = 0;

  for (const letter of word.toLowerCase()) {
    if ("aeiou".includes(letter)) {
      vowels++;
    }
  }

  document.querySelector("#vowelsOutput").textContent =
    `Text: ${word}\n` +
    `Letters checked: ${word.length}\n` +
    `Vowels found: ${vowels}`;
});

document.querySelector("#fizzForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const n = Math.min(Math.max(Number(document.querySelector("#fizzInput").value), 1), 100);
  document.querySelector("#fizzOutput").textContent = fizzBuzz(n).join(", ");
});

document.querySelector('[data-action="tests"]').addEventListener("click", () => {
  const tests = [
    ["fizzBuzz(5)", JSON.stringify(fizzBuzz(5)), JSON.stringify([1, 2, "Fizz", 4, "Buzz"])],
    ["fizzBuzz(15).at(-1)", fizzBuzz(15).at(-1), "FizzBuzz"],
    ["fizzBuzz(9)[8]", fizzBuzz(9)[8], "Fizz"],
    ["fizzBuzz(10)[9]", fizzBuzz(10)[9], "Buzz"],
    ["fizzBuzz(30).length", fizzBuzz(30).length, 30],
  ];

  const lines = tests.map(([label, actual, expected]) => {
    const status = actual === expected ? "PASS" : "FAIL";
    return `${status}  ${label} = ${actual} (expected ${expected})`;
  });

  document.querySelector("#testsOutput").textContent = lines.join("\n");
});

document.querySelectorAll("[data-answer]").forEach((button) => {
  button.addEventListener("click", () => {
    const result = document.querySelector("#challengeResult");
    const isCorrect = button.dataset.answer === "correct";

    result.textContent = isCorrect
      ? "Correct! i takes the values 0, 1 and 2. When i becomes 3, the condition i < 3 is false and the loop stops."
      : "Try again. Write down each value of i, starting at 0, and stop when i < 3 is false.";
    result.style.color = isCorrect ? "#15803d" : "#b91c1c";
  });
});
