const quotes = [
  {
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain",
    category: "Getting started"
  },
  {
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
    category: "Confidence"
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    category: "Resilience"
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    category: "Purpose"
  },
  {
    text: "It always seems impossible until it's done.",
    author: "Nelson Mandela",
    category: "Perseverance"
  },
  {
    text: "You do not find the happy life. You make it.",
    author: "Camilla Eyring Kimball",
    category: "Joy"
  },
  {
    text: "What you do today can improve all your tomorrows.",
    author: "Ralph Marston",
    category: "Action"
  },
  {
    text: "Every moment is a fresh beginning.",
    author: "T. S. Eliot",
    category: "New beginnings"
  }
];

const quoteText = document.querySelector("#quoteText");
const quoteAuthor = document.querySelector("#quoteAuthor");
const newQuoteButton = document.querySelector("#newQuoteButton");
const copyButton = document.querySelector("#copyButton");
const statusMessage = document.querySelector("#statusMessage");
const quoteCard = document.querySelector(".quote-card");
const quoteCategory = document.querySelector("#quoteCategory");
const quoteCount = document.querySelector("#quoteCount");

let currentIndex = 0;

function showRandomQuote() {
  let nextIndex;

  do {
    nextIndex = Math.floor(Math.random() * quotes.length);
  } while (nextIndex === currentIndex);

  currentIndex = nextIndex;
  const quote = quotes[currentIndex];

  quoteCard.classList.add("is-changing");

  window.setTimeout(() => {
    quoteText.textContent = quote.text;
    quoteAuthor.textContent = quote.author;
    quoteCategory.textContent = quote.category;
    quoteCount.textContent =
      `Quote ${String(currentIndex + 1).padStart(2, "0")} of ${String(quotes.length).padStart(2, "0")}`;
    quoteCard.classList.remove("is-changing");
  }, 120);

  statusMessage.textContent = "";
}

async function copyQuote() {
  const quote = `"${quoteText.textContent}" - ${quoteAuthor.textContent}`;

  try {
    await navigator.clipboard.writeText(quote);
    statusMessage.textContent = "Quote copied!";
  } catch (error) {
    const textArea = document.createElement("textarea");
    textArea.value = quote;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.append(textArea);
    textArea.select();

    const copied = document.execCommand("copy");
    textArea.remove();
    statusMessage.textContent = copied ? "Quote copied!" : "Unable to copy the quote.";
  }
}

newQuoteButton.addEventListener("click", showRandomQuote);
copyButton.addEventListener("click", copyQuote);

document.addEventListener("keydown", (event) => {
  if (event.key.toLowerCase() === "n" && event.target.tagName !== "INPUT") {
    showRandomQuote();
  }
});
