document
  .querySelector("#calculatorExercise")
  .addEventListener("submit", (event) => {
    event.preventDefault();

    const firstNumber = Number(document.querySelector("#firstNumber").value);
    const secondNumber = Number(document.querySelector("#secondNumber").value);
    const exerciseOutput = document.querySelector("#exerciseOutput");

    if (secondNumber === 0) {
      exerciseOutput.textContent =
        "The second number cannot be 0 when calculating division and remainder.";
      return;
    }

    exerciseOutput.textContent =
      `Sum: ${firstNumber + secondNumber}\n` +
      `Difference: ${firstNumber - secondNumber}\n` +
      `Product: ${firstNumber * secondNumber}\n` +
      `Quotient: ${firstNumber / secondNumber}\n` +
      `Remainder: ${firstNumber % secondNumber}\n` +
      `Are the numbers equal: ${firstNumber === secondNumber}`;
  });
