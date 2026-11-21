const output = document.querySelector("#output");

function print(...values) {
  output.textContent = values
    .map((value) => (typeof value === "object" ? JSON.stringify(value, null, 2) : String(value)))
    .join("\n");
}

const examples = {
  variables() {
    let score = 10;
    const name = "Talha";
    score = 15;
    print(`${name}'s score is ${score}`);
  },

  types() {
    print(
      "string:", "Hello",
      "\nnumber:", 42,
      "\nboolean:", true,
      "\narray:", [1, 2, 3],
      "\nobject:", { course: "JavaScript" }
    );
  },

  operators() {
    print(
      "5 + 2 =", 5 + 2,
      "\n5 - 2 =", 5 - 2,
      "\n\"5\" - 2 =", "5" - 2,
      "\n5 === \"5\" =", 5 === "5"
    );
  },

  conditions() {
    const age = 18;

    if (age >= 18) {
      print("You are an adult.");
    } else {
      print("You are a minor.");
    }
  },

  loops() {
    const numbers = [];

    for (let number = 1; number <= 5; number++) {
      numbers.push(number);
    }

    print(numbers.join(", "));
  },

  functions() {
    function add(firstNumber, secondNumber) {
      return firstNumber + secondNumber;
    }

    print("2 + 3 =", add(2, 3));
  },

  arrays() {
    const fruits = ["Apple", "Banana", "Mango"];
    fruits.push("Orange");

    print(fruits);
  },

  objects() {
    const student = {
      name: "Talha",
      age: 16,
      course: "Web Development"
    };

    print(student);
  }
};

document.querySelectorAll("[data-example]").forEach((button) => {
  button.addEventListener("click", () => {
    examples[button.dataset.example]();
  });
});

document.querySelector("#clearOutput").addEventListener("click", () => {
  output.textContent = "Output cleared.";
});

document.querySelector("#colorButton").addEventListener("click", (event) => {
  const card = event.target.closest(".lesson");
  card.classList.toggle("changed");
  print(card.classList.contains("changed")
    ? "The card is green now."
    : "The card color was reset.");
});

document.querySelectorAll("[data-answer]").forEach((button) => {
  button.addEventListener("click", () => {
    const result = document.querySelector("#quizResult");

    if (button.dataset.answer === "correct") {
      result.textContent = "Correct! The string \"5\" is converted to a number, so 5 - 2 is 3.";
      result.style.color = "#15803d";
    } else {
      result.textContent = "Not quite. Try again.";
      result.style.color = "#b91c1c";
    }
  });
});
