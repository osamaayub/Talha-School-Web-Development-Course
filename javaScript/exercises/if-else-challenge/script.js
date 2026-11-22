function getTicketPrice(age, isStudent, day) {
  let price;

  if (age < 5) {
    price = 0;
  } else if (age <= 12) {
    price = 8;
  } else if (age >= 65) {
    price = 7;
  } else {
    price = isStudent ? 9 : 12;
  }

  if (day === "Tuesday" && price > 0) {
    price = Math.max(price - 2, 0);
  }

  return price;
}

function describeBranch(age, isStudent) {
  if (age < 5) {
    return "if (age < 5): free ticket";
  } else if (age <= 12) {
    return "else if (age <= 12): child price $8";
  } else if (age >= 65) {
    return "else if (age >= 65): senior price $7";
  } else if (isStudent) {
    return "else (student): $12 - $3 = $9";
  } else {
    return "else: regular price $12";
  }
}

document.querySelector("#ticketForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const age = Number(document.querySelector("#ageInput").value);
  const isStudent = document.querySelector("#studentInput").checked;
  const day = document.querySelector("#dayInput").value;
  const price = getTicketPrice(age, isStudent, day);
  const tuesdayNote =
    day === "Tuesday" && price > 0 ? "Tuesday discount applied: -$2" : "No Tuesday discount";

  document.querySelector("#ticketOutput").textContent =
    `Branch that ran: ${describeBranch(age, isStudent)}\n` +
    `${tuesdayNote}\n` +
    `Final price: $${price}`;
});

document.querySelector('[data-action="tests"]').addEventListener("click", () => {
  const tests = [
    [3, false, "Monday", 0],
    [10, false, "Friday", 8],
    [70, false, "Tuesday", 5],
    [20, true, "Sunday", 9],
    [20, true, "Tuesday", 7],
    [35, false, "Tuesday", 10],
  ];

  const lines = tests.map(([age, isStudent, day, expected]) => {
    const actual = getTicketPrice(age, isStudent, day);
    const status = actual === expected ? "PASS" : "FAIL";
    return `${status}  getTicketPrice(${age}, ${isStudent}, "${day}") = ${actual} (expected ${expected})`;
  });

  document.querySelector("#testsOutput").textContent = lines.join("\n");
});

document.querySelectorAll("[data-answer]").forEach((button) => {
  button.addEventListener("click", () => {
    const result = document.querySelector("#challengeResult");
    const isCorrect = button.dataset.answer === "correct";

    result.textContent = isCorrect
      ? "Correct! 12 is not less than 5, but it is <= 12, so the else if branch runs."
      : "Try again. Check each condition from the top and stop at the first one that is true.";
    result.style.color = isCorrect ? "#15803d" : "#b91c1c";
  });
});
