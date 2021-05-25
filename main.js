const newNote = document.querySelector('.input-note');
const newNoteAddBtn = document.querySelector('.note-btn-add');
const toDoNoteList = document.querySelector('.section-todo');
const workingNoteList = document.querySelector('.section-working');
const doneNoteList = document.querySelector('.section-done');

newNoteAddBtn.addEventListener('click', noteAdd);
toDoNoteList.addEventListener('click', startOrDeleteOnToDo);
workingNoteList.addEventListener('click', confirmOnWorking);
doneNoteList.addEventListener('click', dellOnDone);
document.addEventListener('DOMContentLoaded', readFromLocalStorage);

// Note add event function
function noteAdd(e) {
    e.preventDefault();
    createNote(newNote.value, 'toDoArr');
    addToLocalStorage(newNote.value, 'toDoArr');
    newNote.value = '';
}

function startOrDeleteOnToDo(e) {
    const clickedBtn = e.target;
    const clickedBtnText = clickedBtn.parentElement.children[0].textContent;
    if (clickedBtn.classList.contains('note-btn-start')) {
        let d = new Date();
        let startTime = d.toLocaleTimeString();
        createNote(clickedBtnText, 'workingArr', startTime);
        addToLocalStorage(clickedBtnText + startTime, 'workingArr');
        dellFromLocalStorage(clickedBtnText, 'toDoArr');
        clickedBtn.parentElement.remove();
    }
    if (clickedBtn.classList.contains('note-btn-delete')) {
        dellFromLocalStorage(clickedBtnText, 'toDoArr');
        clickedBtn.parentElement.remove();
    }
}

function confirmOnWorking(e) {
    const clickedBtn = e.target;
    const clickedBtnText = clickedBtn.parentElement.children[0].textContent;
    const clickedBtnTextForTimer = clickedBtn.parentElement.children[1].children[0].textContent.slice(clickedBtn.parentElement.children[1].children[0].textContent.length - 8, clickedBtn.parentElement.children[1].children[0].textContent.length);
    if (clickedBtn.classList.contains('note-btn-confirm')) {
        let d = new Date();
        let spentTime = diff(clickedBtnTextForTimer, d.toLocaleTimeString());
        createNote(clickedBtnText, 'doneArr', clickedBtnTextForTimer, spentTime);
        addToLocalStorage(clickedBtnText + clickedBtnTextForTimer + " " + spentTime, 'doneArr');
        dellFromLocalStorage(clickedBtnText + clickedBtnTextForTimer, 'workingArr');
        clickedBtn.parentElement.remove();
    }
}

function dellOnDone(e) {
    const clickedBtn = e.target;
    const clickedBtnText = clickedBtn.parentElement.children[0].textContent;
    const clickedBtnTextForTimer = clickedBtn.parentElement.children[1].children[0].textContent.slice(clickedBtn.parentElement.children[1].children[0].textContent.length - 8, clickedBtn.parentElement.children[1].children[0].textContent.length);
    const clickedBtnTextForTimerSpent = clickedBtn.parentElement.children[1].children[1].textContent.slice(clickedBtn.parentElement.children[1].children[1].textContent.length - 8, clickedBtn.parentElement.children[1].children[1].textContent.length);
    if (clickedBtn.classList.contains('note-btn-delete')) {
        dellFromLocalStorage(clickedBtnText + clickedBtnTextForTimer + " " + clickedBtnTextForTimerSpent, 'doneArr');
        clickedBtn.parentElement.remove();
    }
}

function createNote(value, listType, time, spent) {
    // create div
    const noteDiv = document.createElement('div');
    noteDiv.className = 'note-item';

    // create li
    const noteLi = document.createElement('li');
    noteLi.className = 'note-content';
    noteLi.textContent = value;

    // append li to in div
    noteDiv.appendChild(noteLi);

    if (listType === 'toDoArr') {
        // confirm btn
        const noteConfirmBtn = document.createElement('button');
        noteConfirmBtn.className = 'note-btn note-btn-start';
        noteConfirmBtn.innerHTML = '<i class="far fa-play-circle"></i>';
        noteDiv.appendChild(noteConfirmBtn)

        // delete btn
        const noteDeleteBtn = document.createElement('button');
        noteDeleteBtn.className = 'note-btn note-btn-delete';
        noteDeleteBtn.innerHTML = '<i class="far fa-trash-alt"></i>';
        noteDiv.appendChild(noteDeleteBtn);

        // append all structs to toDoNoteList
        toDoNoteList.appendChild(noteDiv);

    } else if (listType === 'workingArr') {
        // create timer ul
        const timerUl = document.createElement('ul');
        timerUl.className = 'timer timer-list';

        // create timer li
        const timerStartLi = document.createElement('li');
        timerStartLi.textContent = 'Start Time: ' + time;
        timerUl.appendChild(timerStartLi);
        noteDiv.appendChild(timerUl);

        // confirm btn
        const noteConfirmBtn = document.createElement('button');
        noteConfirmBtn.className = 'note-btn note-btn-confirm';
        noteConfirmBtn.innerHTML = '<i class="far fa-check-square"></i>';
        noteDiv.appendChild(noteConfirmBtn)

        // append all structs to workingNoteList
        workingNoteList.appendChild(noteDiv);

    } else {
        // create timer ul
        const timerUl = document.createElement('ul');
        timerUl.className = 'timer timer-list';

        // create start timer li
        const timerStartLi = document.createElement('li');
        timerStartLi.textContent = 'Start Time: ' + time;

        // create spent timer li
        const timerSpentLi = document.createElement('li');
        timerSpentLi.textContent = 'Time Spent: ' + spent;

        // append li to ul and than add all to noteDiv
        timerUl.appendChild(timerStartLi);
        timerUl.appendChild(timerSpentLi);
        noteDiv.appendChild(timerUl);

        // override className for text-decoration (note-confirmed)
        noteLi.className = 'note-content note-confirmed';

        // delete btn
        const noteDeleteBtn = document.createElement('button');
        noteDeleteBtn.className = 'note-btn note-btn-delete note-confirmed';
        noteDeleteBtn.innerHTML = '<i class="far fa-trash-alt"></i>';
        noteDiv.appendChild(noteDeleteBtn);

        // append all structs to doneNoteList
        doneNoteList.appendChild(noteDiv);
    }
}

// LocalStorage Side - Start
function readFromLocalStorage() {
    const localStorageListNames = ['toDoArr', 'workingArr', 'doneArr'];
    localStorageListNames.forEach(function (item) {
        let noteArr;
        if (localStorage.getItem(item) === null) {
            noteArr = [];
        } else {
            noteArr = JSON.parse(localStorage.getItem(item));
        }
        noteArr.forEach(function (value) {
            if (item === 'workingArr') {
                startTime = value.slice(value.length - 8, value.length)
                createNote(value.slice(0, value.length - 8), item, startTime);
            } else if (item === 'doneArr') {
                endTime = value.slice(value.length - 8, value.length)
                startTime = value.slice(value.length - 17, value.length - 9)
                createNote(value.slice(0, value.length - 17), item, startTime, endTime);
            } else {
                createNote(value, item);
            }
        });
    });
}

function addToLocalStorage(value, arr) {
    let noteArr;
    if (localStorage.getItem(arr) === null) {
        noteArr = [];
    } else {
        noteArr = JSON.parse(localStorage.getItem(arr));
    }
    noteArr.push(value);
    localStorage.setItem(arr, JSON.stringify(noteArr));
}

function dellFromLocalStorage(value, arr) {
    let noteArr;
    if (localStorage.getItem(arr) === null) {
        noteArr = [];
    } else {
        noteArr = JSON.parse(localStorage.getItem(arr));
    }
    noteArr.splice(noteArr.indexOf(value), 1);
    localStorage.setItem(arr, JSON.stringify(noteArr))
}
// LocalStorage Side - End

// Src for time difference func: https://stackoverflow.com/questions/10804042/calculate-time-difference-with-javascript/27484203 @Jeffrey & @user8584085
function diff(start, end) {
    start = start.split(":");
    end = end.split(":");
    var startDate = new Date(0, 0, 0, start[0], start[1], start[2], 0);
    var endDate = new Date(0, 0, 0, end[0], end[1], end[2], 0);
    var diff = endDate.getTime() - startDate.getTime();
    var hours = Math.floor(diff / 1000 / 60 / 60);
    diff -= hours * 1000 * 60 * 60;
    var minutes = Math.floor(diff / 1000 / 60);
    var seconds = Math.floor(diff / 1000);  // I changed this part.
    if(seconds>60){
        seconds = seconds % 60;
    }
    // If using time pickers with 24 hours format, add the below line get exact hours
    if (hours < 0)
        hours = hours + 24;
    return (hours <= 9 ? "0" : "") + hours + ":" + (minutes <= 9 ? "0" : "") + minutes + ":" + (seconds <= 9 ? "0" : "") + seconds;
}