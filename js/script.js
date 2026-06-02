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
