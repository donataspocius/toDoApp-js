// CONSTANTS & VARIABLES
const output = document.querySelector(".outputContainer");
const LOCAL_SESSION_KEY = "toDoList";
const prefillData = [
  {
    description:
      "Bonbon chocolate cake gingerbread marshmallow chocolate jelly cupcake biscuit lemon drops. Apple pie sugar plum gummi bears gummies jelly-o",
    deadline: "2023-03-31T20:03",
    timeAdded: "2023-03-23T17:11",
    completed: false,
  },
  {
    description:
      "Macaroon shortbread jelly-o cake gingerbread. Danish cupcake cotton candy sweet roll jelly-o candy soufflé. Lollipop jelly-o wafer dragée biscuit. ",
    deadline: "2023-04-11T20:07",
    timeAdded: "2023-03-22T12:17",
    completed: false,
  },
  {
    description:
      "Sweet roll ice cream tiramisu ice cream liquorice bear claw. Chocolate cake oat cake cheesecake marzipan gummies cotton candy bear claw cookie lemon drops. Cara",
    deadline: "2023-04-30T20:02",
    timeAdded: "2023-03-20T20:21",
    completed: false,
  },
  {
    description:
      "Sesame snaps marshmallow marzipan bonbon halvah candy pudding dessert tiramisu.",
    deadline: "2023-03-30T20:07",
    timeAdded: "2023-03-15T12:17",
    completed: false,
  },
  {
    description:
      "Lollipop ice cream wafer donut gummi bears. Macaroon shortbread chocolate cheesecake chocolate bar muffin powder dessert. Tart tart halvah cheesecake jujubes ch",
    deadline: "2023-04-01T20:07",
    timeAdded: "2023-03-11T12:17",
    completed: false,
  },
];
const storageData = window.sessionStorage.getItem(LOCAL_SESSION_KEY);

// declaring toDoList
let toDoList = storageData ? JSON.parse(storageData) : prefillData;

// setting date input minimum value
let currentDate = new Date().toISOString().slice(0, -8);
document.querySelector("#deadline").min = currentDate;

window.addEventListener("DOMContentLoaded", () => {
  renderToDoList();
});

// managing user input data
document.querySelector(".inputData").addEventListener("submit", (e) => {
  e.preventDefault();
  //   get form data
  const formData = new FormData(e.target);
  let newTaskData = Object.fromEntries(formData);
  newTaskData.completed = false;
  newTaskData.timeAdded = new Date().toISOString().slice(0, -8);

  //   update toDoList and sessionStorage
  toDoList.unshift(newTaskData);
  updateSessionStorage();
  renderToDoList();
  //   clear input fields
  e.target.reset();
});

document.querySelector("#sort").addEventListener("change", (e) => {
  switch (e.target.value) {
    case "byRecentlyAdded":
      toDoList.sort((a, z) => {
        return z.timeAdded.localeCompare(a.timeAdded);
      });
      break;
    case "byDeadline":
      toDoList.sort(customSort("deadline", true));
      break;
    case "byRecentlyCompleted":
      toDoList.sort(customSort("timeCompleted"));
      break;
    default:
      break;
  }
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
    taskEl.className = toDoList[index].completed
      ? "taskCard completed"
      : "taskCard";

    const contentDiv = document.createElement("div");

    const taskDescriptionEl = document.createElement("p");
    taskDescriptionEl.textContent = task.description;

    const taskDeadlineEl = document.createElement("p");
    taskDeadlineEl.textContent = timeLeft(task.deadline);

    contentDiv.append(taskDescriptionEl, taskDeadlineEl);

    const cardContorls = document.createElement("div");
    cardContorls.className = "cardControls";

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete Task";
    deleteBtn.className = "btn btn--red";

    const inputDiv = document.createElement("div");
    inputDiv.className = "inputDiv";

    const labelForCheckbox = document.createElement("label");
    labelForCheckbox.htmlFor = "completed";
    labelForCheckbox.textContent = toDoList[index].completed
      ? "COMPLETED!"
      : "Completed?";

    const checkboxEl = document.createElement("input");
    checkboxEl.name = "completed";
    checkboxEl.type = "checkbox";
    checkboxEl.className = "checkbox";
    checkboxEl.checked = toDoList[index].completed ? true : false;
    checkboxEl.className = toDoList[index].completed
      ? "checkbox completed"
      : "checkbox";

    inputDiv.append(labelForCheckbox, checkboxEl);
    cardContorls.append(deleteBtn, inputDiv);

    taskEl.append(contentDiv, cardContorls);
    toDoListContainer.append(taskEl);

    deleteBtn.addEventListener("click", (e) => {
      if (window.confirm("DELETE TASK?")) {
        toDoList.splice(index, 1);
        updateSessionStorage();
        renderToDoList();
      }
    });

    checkboxEl.addEventListener("change", (e) => {
      let dateNow = new Date().toISOString().slice(0, -8);
      toDoList[index].completed = checkboxEl.checked;
      toDoList[index].timeCompleted = checkboxEl.checked ? dateNow : "";
      toDoList[index].deadline = null;
      toDoList.push(toDoList.splice(index, 1)[0]);
      updateSessionStorage();
      renderToDoList();
    });
  });
};

// UTILITY FUNCTIONS

const updateSessionStorage = () => {
  window.sessionStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(toDoList));
};

const timeLeft = (deadline) => {
  if (!deadline) return `No deadline set`;

  // calculate time diffrence in ms
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

let customSort = (byParam, ascending) => {
  return function (a, b) {
    // equal items sort equally
    if (a[byParam] === b[byParam]) {
      return 0;
    }
    // null data sort after anything else
    if (!a[byParam]) {
      return 1;
    }
    if (!b[byParam]) {
      return -1;
    }
    // if ascending return this
    if (ascending) {
      return a[byParam] < b[byParam] ? -1 : 1;
    }
    // if descending return this
    return a[byParam] < b[byParam] ? 1 : -1;
  };
};
