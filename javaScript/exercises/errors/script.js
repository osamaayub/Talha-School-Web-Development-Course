function withdraw(balance, amount) {
  if (typeof amount !== "number" || Number.isNaN(amount)) {
    throw new TypeError("Amount must be a number");
  }

  if (amount <= 0) {
    throw new RangeError("Amount must be greater than 0");
  }

  if (amount > balance) {
    throw new Error("Insufficient funds");
  }

  return balance - amount;
}

const brokenExamples = {
  reference: {
    code: "console.log(userName);",
    run: () => console.log(userName), // eslint-disable-line no-undef
  },
  type: {
    code: "const age = 25;\nage.toUpperCase();",
    run: () => {
      const age = 25;
      age.toUpperCase();
    },
  },
  undefined: {
    code: "const user = undefined;\nuser.name;",
    run: () => {
      const user = undefined;
      return user.name;
    },
  },
  range: {
    code: "const list = new Array(-1);",
    run: () => new Array(-1),
  },
};

document.querySelectorAll("[data-error]").forEach((button) => {
  button.addEventListener("click", () => {
    const example = brokenExamples[button.dataset.error];
    const output = document.querySelector("#typesOutput");

    try {
      example.run();
      output.textContent = "No error happened.";
    } catch (error) {
      output.textContent =
        `Code:\n${example.code}\n\n` +
        `error.name:    ${error.name}\n` +
        `error.message: ${error.message}`;
    }
  });
});

document.querySelector("#jsonForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const text = document.querySelector("#jsonInput").value;
  const lines = [];

  try {
    const data = JSON.parse(text);
    lines.push("try: parsed successfully!");
    lines.push(`Parsed value: ${JSON.stringify(data)}`);
  } catch (error) {
    lines.push("catch: the JSON is not valid.");
    lines.push(`${error.name}: ${error.message}`);
  } finally {
    lines.push("finally: this always runs.");
  }

  document.querySelector("#jsonOutput").textContent = lines.join("\n");
});

document.querySelector("#withdrawForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const balance = Number(document.querySelector("#balanceInput").value);
  const rawAmount = document.querySelector("#amountInput").value.trim();
  const amount = rawAmount === "" || Number.isNaN(Number(rawAmount)) ? rawAmount : Number(rawAmount);
  const output = document.querySelector("#withdrawOutput");

  try {
    const newBalance = withdraw(balance, amount);
    output.textContent = `Success! New balance: $${newBalance}`;
  } catch (error) {
    output.textContent = `Caught ${error.name}: ${error.message}`;
  }
});

document.querySelector('[data-action="tests"]').addEventListener("click", () => {
  const tests = [
    ["withdraw(100, 30)", 100, 30, "70"],
    ["withdraw(100, 100)", 100, 100, "0"],
    ["withdraw(100, 500)", 100, 500, "Error: Insufficient funds"],
    ["withdraw(100, 0)", 100, 0, "RangeError: Amount must be greater than 0"],
    ["withdraw(100, -5)", 100, -5, "RangeError: Amount must be greater than 0"],
    ['withdraw(100, "abc")', 100, "abc", "TypeError: Amount must be a number"],
  ];

  const lines = tests.map(([label, balance, amount, expected]) => {
    let actual;

    try {
      actual = String(withdraw(balance, amount));
    } catch (error) {
      actual = `${error.name}: ${error.message}`;
    }

    const status = actual === expected ? "PASS" : "FAIL";
    return `${status}  ${label} -> ${actual}`;
  });

  document.querySelector("#testsOutput").textContent = lines.join("\n");
});

function setupQuiz(selector, resultId, rightText, wrongText) {
  document.querySelectorAll(selector).forEach((button) => {
    button.addEventListener("click", () => {
      const result = document.querySelector(resultId);
      const key = Object.keys(button.dataset)[0];
      const isCorrect = button.dataset[key] === "correct";

      result.textContent = isCorrect ? rightText : wrongText;
      result.style.color = isCorrect ? "#15803d" : "#b91c1c";
    });
  });
}

setupQuiz(
  "[data-fix]",
  "#fixResult",
  "Correct! The array has indexes 0, 1 and 2. With <= the loop also tries students[3], which is undefined.",
  "Try again. Count the indexes: the last one is students.length - 1, so what happens when i equals students.length?",
);

setupQuiz(
  "[data-answer]",
  "#challengeResult",
  'Correct! "B" never runs because throw jumps straight to catch, and finally always runs at the end.',
  "Try again. Code after throw inside try is skipped, and finally runs whether there was an error or not.",
);
