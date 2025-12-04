let taskInput, addBtn, incompleteTasks, completedTasks;

document.addEventListener('DOMContentLoaded', function () {

    taskInput = document.getElementById("new-task")
    addBtn = document.getElementById("add-btn")
    incompleteTasks = document.getElementById("incomplete-tasks")
    completedTasks = document.getElementById("completed-tasks")

    addBtn.addEventListener("click", addTask);

    taskInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter")
            addTask();
    });

    loadTasks();
})

function addTask() {
    text = taskInput.value.trim();

    if (text === "")
        return;

    let li = makeLI(text, false)

    incompleteTasks.insertAdjacentHTML('beforeend', li);

    let newTask = incompleteTasks.lastElementChild;

    if (newTask)
        otherEvents(newTask)

    taskInput.value = ""
    saveTasks();
}

function makeLI(text, isCompleted) {

    let checked = isCompleted ? "checked" : "";
    let completed = isCompleted ? "completed" : ""

    return `<li class="${completed}">
    <input type="checkbox" ${checked}>
    <label>${text}</label>
    <input type="text" class="edit-mode" value="${text}">
    <div class="actions">
        <button class="edit btn-action">Edit</button>
        <button class="delete btn-action">Delete</button>
    </div>
</li>`;
}

function otherEvents(li) {

    let checkBox = li.querySelector('input[type="checkbox"]');
    let editBtn = li.querySelector(".edit");
    let deleteBtn = li.querySelector(".delete");
    let editInput = li.querySelector(".edit-mode")


    checkBox.onchange = function () { toggleTask(li, checkBox); };

    editBtn.onclick = function () { editTask(li, editBtn); };

    deleteBtn.onclick = function () { deleteTask(li); };

    editInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter")
            editTask(li, editBtn);
    });

}

function toggleTask(li, checkBox) {

    if (checkBox.checked) {
        li.classList.add("completed");
        completedTasks.appendChild(li);
    }
    else {
        li.classList.remove("completed");
        incompleteTasks.appendChild(li);
    }

    saveTasks();
}

function editTask(li, editBtn) {

    let label = li.querySelector("label")
    let editInput = li.querySelector(".edit-mode")
    let isEditMode = li.classList.contains("editMode")

    if (isEditMode) {
        label.innerText = editInput.value;
        editBtn.innerText = "Edit"
        li.classList.remove("editMode")
        if (label.innerText === "")
            deleteTask(li);
        saveTasks();

    } else {
        editInput.value = label.innerText;
        editBtn.innerText = "Save"
        li.classList.add("editMode")
        editInput.focus();
    }

}

function deleteTask(li) {
    li.parentElement.removeChild(li);
    saveTasks();
}

function saveTasks() {
    let todos = [];

    [...incompleteTasks.children, ...completedTasks.children].forEach((li) => {
        let text = li.querySelector("label").innerText;
        let completed = li.classList.contains("completed")

        todos.push({
            text: text,
            completed: completed,
        });
    })

    localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTasks() {
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    incompleteTasks.innerHTML = "";
    completedTasks.innerHTML = "";

    todos.forEach((e) => {
        let li = makeLI(e.text, e.completed);
        let place = e.completed ? completedTasks : incompleteTasks;

        place.insertAdjacentHTML('beforeend', li);

        let newTask = place.lastElementChild;

        if (newTask)
            otherEvents(newTask)
    });
}