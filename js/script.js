function addNote() {
  const title = document.getElementById("noteTitle").value;
  const content = document.getElementById("noteContent").value;

  if (title === "" || content === "") {
    alert("Please fill all fields");
    return;
  }

  const noteCard = document.createElement("div");

  noteCard.classList.add("note-card");

  noteCard.innerHTML = `
        <h3>${title}</h3>
        <p>${content}</p>
    `;

  document.getElementById("notesList").appendChild(noteCard);

  document.getElementById("noteTitle").value = "";
  document.getElementById("noteContent").value = "";
}

function addResource() {
  const title = document.getElementById("resourceTitle").value;

  const subject = document.getElementById("resourceSubject").value;

  const file = document.getElementById("resourceFile").files[0];

  if (title === "" || subject === "" || !file) {
    alert("Please fill all fields and select a PDF.");
    return;
  }

  const resourceCard = document.createElement("div");

  resourceCard.classList.add("resource-card");

  resourceCard.innerHTML = `
        <h3>📄 ${title}</h3>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>File:</strong> ${file.name}</p>
    `;

  document.getElementById("resourceList").appendChild(resourceCard);

  document.getElementById("resourceTitle").value = "";
  document.getElementById("resourceSubject").value = "";
  document.getElementById("resourceFile").value = "";
}

function addGoal() {
  const goalText = document.getElementById("goalInput").value;

  if (goalText === "") {
    alert("Please enter a goal.");
    return;
  }

  const goalCard = document.createElement("div");

  goalCard.classList.add("goal-card");

  goalCard.innerHTML = `
        <span>${goalText}</span>
        <button class="complete-btn">
            Complete
        </button>
    `;

  const completeButton = goalCard.querySelector(".complete-btn");

  completeButton.addEventListener("click", function () {
    goalCard.querySelector("span").classList.toggle("completed");
  });

  document.getElementById("goalList").appendChild(goalCard);

  document.getElementById("goalInput").value = "";
}

let seconds = 0;
let timerInterval = null;
let sessionsCompleted = 0;

function updateTimer() {
  let hrs = Math.floor(seconds / 3600);

  let mins = Math.floor((seconds % 3600) / 60);

  let secs = seconds % 60;

  document.getElementById("timerDisplay").textContent =
    `${String(hrs).padStart(2, "0")}:` +
    `${String(mins).padStart(2, "0")}:` +
    `${String(secs).padStart(2, "0")}`;
}

function startTimer() {
  if (timerInterval !== null) {
    return;
  }

  timerInterval = setInterval(() => {
    seconds++;
    updateTimer();
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;

    sessionsCompleted++;

    document.getElementById("sessionCount").textContent = sessionsCompleted;
  }
}

function resetTimer() {
  clearInterval(timerInterval);

  timerInterval = null;

  seconds = 0;

  updateTimer();
}

updateTimer();
