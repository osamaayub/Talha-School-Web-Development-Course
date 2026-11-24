const ageForm = document.querySelector("#ageForm");
const dateOfBirthInput = document.querySelector("#dateOfBirth");
const dateError = document.querySelector("#dateError");
const emptyState = document.querySelector("#emptyState");
const results = document.querySelector("#results");
const resultSummary = document.querySelector("#resultSummary");
const birthdayValue = document.querySelector("#birthdayValue");

const today = getTodayParts();
dateOfBirthInput.max = formatDateInput(today);

function getTodayParts() {
  const date = new Date();

  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate()
  };
}

function formatDateInput({ year, month, day }) {
  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function parseDateInput(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    return null;
  }

  const parts = {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3])
  };

  return isValidDate(parts) ? parts : null;
}

function isValidDate({ year, month, day }) {
  if (year < 1 || month < 1 || month > 12 || day < 1) {
    return false;
  }

  return day <= getDaysInMonth(year, month);
}

function getDaysInMonth(year, month) {
  const date = createUtcDate(year, month + 1, 0);
  return date.getUTCDate();
}

function createUtcDate(year, month, day) {
  const date = new Date(0);
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCFullYear(year, month - 1, day);
  return date;
}

function getDayNumber(parts) {
  return createUtcDate(parts.year, parts.month, parts.day).getTime() / 86400000;
}

function compareDates(first, second) {
  return getDayNumber(first) - getDayNumber(second);
}

function birthdayInYear(birthDate, year) {
  return {
    year,
    month: birthDate.month,
    day: Math.min(birthDate.day, getDaysInMonth(year, birthDate.month))
  };
}

function addMonths(date, amount) {
  const monthIndex = date.month - 1 + amount;
  const year = date.year + Math.floor(monthIndex / 12);
  const month = (monthIndex % 12) + 1;

  return {
    year,
    month,
    day: Math.min(date.day, getDaysInMonth(year, month))
  };
}

function calculateAge(birthDate, todayDate) {
  let years = todayDate.year - birthDate.year;

  if (compareDates(todayDate, birthdayInYear(birthDate, todayDate.year)) < 0) {
    years -= 1;
  }

  const anniversary = birthdayInYear(birthDate, birthDate.year + years);
  let months = 0;

  while (months < 11) {
    const nextMonth = addMonths(anniversary, months + 1);

    if (compareDates(nextMonth, todayDate) > 0) {
      break;
    }

    months += 1;
  }

  return {
    years,
    months,
    days: compareDates(todayDate, addMonths(anniversary, months))
  };
}

function getNextBirthday(birthDate, todayDate) {
  let nextBirthday = birthdayInYear(birthDate, todayDate.year);

  if (compareDates(nextBirthday, todayDate) < 0) {
    nextBirthday = birthdayInYear(birthDate, todayDate.year + 1);
  }

  return nextBirthday;
}

function formatLongDate(parts) {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC"
  }).format(createUtcDate(parts.year, parts.month, parts.day));
}

function showError(message) {
  dateError.textContent = message;
  dateError.hidden = false;
  dateOfBirthInput.setAttribute("aria-invalid", "true");
  dateOfBirthInput.focus();
}

function clearError() {
  dateError.textContent = "";
  dateError.hidden = true;
  dateOfBirthInput.removeAttribute("aria-invalid");
}

function renderAge(birthDate) {
  const age = calculateAge(birthDate, today);
  const nextBirthday = getNextBirthday(birthDate, today);
  const daysUntilBirthday = compareDates(nextBirthday, today);

  document.querySelector("#yearsValue").textContent = age.years;
  document.querySelector("#monthsValue").textContent = age.months;
  document.querySelector("#daysValue").textContent = age.days;
  resultSummary.textContent =
    `Born ${formatLongDate(birthDate)} · calculated as of ${formatLongDate(today)}`;
  birthdayValue.textContent = daysUntilBirthday === 0
    ? "Today! Happy birthday."
    : `${daysUntilBirthday} ${daysUntilBirthday === 1 ? "day" : "days"} · ${formatLongDate(nextBirthday)}`;

  emptyState.hidden = true;
  results.hidden = false;
}

ageForm.addEventListener("submit", (event) => {
  event.preventDefault();
  clearError();

  const birthDate = parseDateInput(dateOfBirthInput.value);

  if (!birthDate) {
    showError("Enter a valid date of birth to calculate your age.");
    return;
  }

  if (compareDates(birthDate, today) > 0) {
    showError("Your date of birth can’t be in the future.");
    return;
  }

  renderAge(birthDate);
});

dateOfBirthInput.addEventListener("input", () => {
  clearError();
  emptyState.hidden = false;
  results.hidden = true;
});

ageForm.addEventListener("reset", () => {
  clearError();
  emptyState.hidden = false;
  results.hidden = true;
});
