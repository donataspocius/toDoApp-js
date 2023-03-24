// CONSTANTS
const LOCAL_SESSION_KEY = "toDoList";

// setting date input minimum value
let currentDate = new Date().toISOString().slice(0, -8);
document.querySelector("#deadline").min = currentDate;

// selecting elements
const output = document.querySelector(".outputContainer");

// declaring toDoList
let toDoList = [];

window.addEventListener("DOMContentLoaded", () => {
  const prefillData = [
    {
      description: "Go for a walk",
      deadline: "2023-03-27T20:02",
      completed: false,
    },
    {
      description: "Buy milk",
      deadline: "2023-03-31T20:03",
      completed: false,
    },
    {
      description: "Read a book",
      deadline: "2023-03-29T20:07",
      completed: false,
    },
  ];
  const storageData = window.sessionStorage.getItem(LOCAL_SESSION_KEY);

  toDoList = storageData ? JSON.parse(storageData) : prefillData;

  renderToDoList();
});

document.querySelector(".inputData").addEventListener("submit", (e) => {
  e.preventDefault();

  //   get new task data
  const formData = new FormData(e.target);
  let newTaskData = Object.fromEntries(formData);
  newTaskData.completed = false;
  //   update toDoList and sessionStorage
  toDoList.unshift(newTaskData);
  updateSessionStorage(toDoList);

  //   clear input fields
  e.target.reset();
  renderToDoList();
});

const renderToDoList = () => {
  // checking if toDoListContainer already exists
  if (document.body.querySelector(".toDoListContainer")) {
    document.body.querySelector(".toDoListContainer").remove();
  }

  // create container for task items
  let toDoListContainer = document.createElement("ul");
  output.append(toDoListContainer);
  toDoListContainer.className = "toDoListContainer";

  // create task card for each task in a list
  toDoList.forEach((task, index) => {
    // creating task container
    const taskEl = document.createElement("li");

    const taskDescriptionEl = document.createElement("p");
    taskDescriptionEl.textContent = task.description;

    const taskDeadlineEl = document.createElement("p");
    taskDeadlineEl.textContent = timeLeft(task.deadline);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete Task";

    const labelForCheckbox = document.createElement("label");
    labelForCheckbox.htmlFor = "completed";
    toDoList[index].completed
      ? (labelForCheckbox.textContent = "Task COMPLETED")
      : (labelForCheckbox.textContent = "Completed?");

    const checkboxEl = document.createElement("input");
    checkboxEl.name = "completed";
    checkboxEl.type = "checkbox";
    checkboxEl.className = "checkbox";
    toDoList[index].completed
      ? (checkboxEl.disabled = true)
      : (checkboxEl.disabled = false);

    taskEl.append(
      taskDescriptionEl,
      taskDeadlineEl,
      deleteBtn,
      labelForCheckbox,
      checkboxEl
    );
    toDoListContainer.append(taskEl);

    deleteBtn.addEventListener("click", (e) => {
      e.preventDefault();
      deleteTask(index);
      updateSessionStorage();
      renderToDoList();
    });

    checkboxEl.addEventListener("change", (e) => {
      checkboxEl.classList.add("completed");
      checkboxEl.disabled = true;
      toDoList[index].completed = true;
      toDoList.push(toDoList.splice(index, 1)[0]);
      updateSessionStorage();
      renderToDoList();
    });
  });
};

const timeLeft = (deadline) => {
  // get time left in miliseconds
  if (!deadline) return `No deadline set`;

  let timeLeftTimestamp = new Date(deadline) - new Date();

  if (timeLeftTimestamp > 0) {
    const days = Math.floor(timeLeftTimestamp / (24 * 60 * 60 * 1000));
    const hours = Math.floor((timeLeftTimestamp / (60 * 60 * 1000)) % 24);
    const minutes = Math.floor((timeLeftTimestamp / (60 * 1000)) % 60);

    return `Time left: ${days} days, ${hours} hours and ${minutes} minutes`;
  } else {
    return `Failed to complete the task on time`;
  }
};

const deleteTask = (index) => {
  const modalBackground = document.createElement("div");
  modalBackground.className = "modalBackground";

  const centerModal = document.createElement("div");
  centerModal.className = "center";

  const modal = document.createElement("div");
  modal.className = "modal";

  const confirmMsgH3 = document.createElement("h3");
  confirmMsgH3.textContent = "Delete task?";

  const cancelBtn = document.createElement("button");
  cancelBtn.name = "cancel";
  cancelBtn.type = "button";
  cancelBtn.textContent = "Cancel";
  cancelBtn.className = "modalBtn";

  const confirmBtn = document.createElement("button");
  confirmBtn.name = "delete";
  confirmBtn.type = "button";
  confirmBtn.textContent = "Delete";
  confirmBtn.className = "modalBtn";

  modal.append(confirmMsgH3, cancelBtn, confirmBtn);
  modalBackground.append(centerModal, modal);
  document.body.append(modalBackground);

  const modalBtns = document.querySelectorAll(".modalBtn");
  modalBtns.forEach((btn) =>
    btn.addEventListener("click", (e) => {
      switch (e.target.name) {
        case "cancel": {
          document.querySelector(".modalBackground").remove();
          break;
        }
        case "delete": {
          toDoList.splice(index, 1);
          document.querySelector(".modalBackground").remove();
          updateSessionStorage();
          renderToDoList();
          break;
        }
        default:
          break;
      }
    })
  );
};

const updateSessionStorage = () => {
  window.sessionStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(toDoList));
};
