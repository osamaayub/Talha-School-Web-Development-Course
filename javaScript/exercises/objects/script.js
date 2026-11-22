function describeUser(user) {
  return `${user.name} is ${user.age} years old and lives in ${user.city}.`;
}

function describeUserLong(user) {
  return (
    user.name +
    " is " +
    user.age +
    " years old and lives in " +
    user.city +
    "."
  );
}

document.querySelector("#accessForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const user = {
    name: "Ada",
    age: 36,
    city: "London",
  };

  const key = document.querySelector("#propertySelect").value;

  document.querySelector("#accessOutput").textContent =
    `Object: ${JSON.stringify(user)}\n` +
    `user.${key} = ${user[key]}`;
});

document.querySelector("#nestedForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.querySelector("#nestedInput").value;
  const profile = {
    name,
    nickname: "Amazing Grace",
    address: {
      city: "New York",
      zip: "10001",
    },
  };

  document.querySelector("#nestedOutput").textContent =
    `Profile: ${JSON.stringify(profile)}\n` +
    `Nested city: ${profile.address.city}\n` +
    `Nested zip: ${profile.address.zip}`;
});

document.querySelector("#methodsForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const times = Math.min(Math.max(Number(document.querySelector("#methodsInput").value), 1), 10);
  const counter = {
    count: 0,
    increment() {
      this.count++;
    },
  };

  for (let i = 0; i < times; i++) {
    counter.increment();
  }

  document.querySelector("#methodsOutput").textContent =
    `Incremented ${times} time(s)\n` +
    `counter.count = ${counter.count}\n` +
    `Object.keys: ${JSON.stringify(Object.keys(counter))}`;
});

document.querySelector("#challengeForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const user = {
    name: document.querySelector("#nameInput").value,
    age: Number(document.querySelector("#ageInput").value),
    city: document.querySelector("#cityInput").value,
  };

  document.querySelector("#challengeOutput").textContent = describeUser(user);
});

document.querySelector('[data-action="tests"]').addEventListener("click", () => {
  const tests = [
    [
      'describeUser({name:"Ada",age:36,city:"London"})',
      describeUser({ name: "Ada", age: 36, city: "London" }),
      "Ada is 36 years old and lives in London.",
    ],
    [
      'describeUserLong({name:"Alan",age:41,city:"Manchester"})',
      describeUserLong({ name: "Alan", age: 41, city: "Manchester" }),
      "Alan is 41 years old and lives in Manchester.",
    ],
    [
      'describeUser({name:"X",age:1,city:"Y"})',
      describeUser({ name: "X", age: 1, city: "Y" }),
      "X is 1 years old and lives in Y.",
    ],
  ];

  const lines = tests.map(([label, actual, expected]) => {
    const status = actual === expected ? "PASS" : "FAIL";
    return `${status}  ${label} = "${actual}" (expected "${expected}")`;
  });

  document.querySelector("#testsOutput").textContent = lines.join("\n");
});

document.querySelectorAll("[data-answer]").forEach((button) => {
  button.addEventListener("click", () => {
    const result = document.querySelector("#quizResult");
    const isCorrect = button.dataset.answer === "correct";

    result.textContent = isCorrect
      ? "Correct! dog.age was updated to 5, so the new value is logged."
      : "Try again. dog.age = 5 updates the existing property before console.log runs.";
    result.style.color = isCorrect ? "#15803d" : "#b91c1c";
  });
});
