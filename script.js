const SECRET_WORD = "bardal";

const board = document.getElementById("board");
const keyboard = document.getElementById("keyboard");
const message = document.getElementById("message");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalText = document.getElementById("modal-text");
const modalButton = document.getElementById("modal-button");

let currentGuess = "";
let attempts = 0;
const maxAttempts = 6;

// ===== Plansza =====
for (let i = 0; i < maxAttempts; i++) {
  const row = document.createElement("div");
  row.className = "row";

  for (let j = 0; j < 6; j++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    row.appendChild(cell);
  }

  board.appendChild(row);
}

// ===== Klawiatura =====
const layout = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "⌫"],
];

layout.forEach((rowLetters) => {
  const row = document.createElement("div");
  row.className = "key-row";

  rowLetters.forEach((letter) => {
    const key = document.createElement("button");
    key.className = "key";
    key.textContent = letter;
    key.dataset.key = letter;

    key.addEventListener("click", () => handleKey(letter));
    row.appendChild(key);
  });

  keyboard.appendChild(row);
});

// ===== Obsługa klawiszy =====
function handleKey(key) {
  if (attempts >= maxAttempts) return;

  if (key === "ENTER") {
    submitGuess();
    return;
  }

  if (key === "⌫") {
    currentGuess = currentGuess.slice(0, -1);
    updateRow();
    return;
  }

  if (currentGuess.length < 6 && /^[A-Z]$/.test(key)) {
    currentGuess += key.toLowerCase();
    updateRow();
  }
}

function updateRow() {
  const row = board.children[attempts];
  [...row.children].forEach((cell, i) => {
    cell.textContent = currentGuess[i]?.toUpperCase() || "";
  });
}

function submitGuess() {
  if (currentGuess.length !== 6) {
    message.textContent = "Za krótkie hasło!";
    return;
  }

  const row = board.children[attempts];

  for (let i = 0; i < 6; i++) {
    const letter = currentGuess[i];
    const cell = row.children[i];
    const keyBtn = [...document.querySelectorAll(".key")].find(
      (k) => k.dataset.key === letter.toUpperCase()
    );

    if (letter === SECRET_WORD[i]) {
      cell.classList.add("correct");
      keyBtn?.classList.add("correct");
    } else if (SECRET_WORD.includes(letter)) {
      cell.classList.add("present");
      keyBtn?.classList.add("present");
    } else {
      cell.classList.add("absent");
      keyBtn?.classList.add("absent");
    }
  }

  if (currentGuess === SECRET_WORD) {
    showModal(true);
    attempts = maxAttempts;
    return;
  }

  attempts++;
  currentGuess = "";

  if (attempts === maxAttempts) {
    showModal(false);
  }
}
modalButton.addEventListener("click", () => {
  location.reload();
});

// ===== Klawiatura fizyczna =====
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleKey("ENTER");
  else if (e.key === "Backspace") handleKey("⌫");
  else if (/^[a-zA-Z]$/.test(e.key)) handleKey(e.key.toUpperCase());
});

function showModal(win) {
  modal.classList.remove("hidden");

  if (win) {
    modalTitle.textContent = "🎉 Wygrałeś!";
    modalText.textContent = `Odgadłeś hasło: ${SECRET_WORD.toUpperCase()}`;
  } else {
    modalTitle.textContent = "😢 Porażka";
    modalText.textContent = `Hasło to: ${SECRET_WORD.toUpperCase()}`;
  }
}
