let object = new Object();
object.subjects = [];
object.schedule = [];
object.assignments = [];
object.version = 0;
let tdId = "id";
function setId(id){
    tdId = id;
}
//
function getDayNumber(dayName) {
    const days = {
        'sun': 0,
        'mon': 1,
        'tue': 2,
        'wed': 3,
        'thu': 4,
        'fri': 5,
        'sat': 6
    };
    return days[dayName.toLowerCase()];
}
let start;
//[8,9,10,11,13,14,16,17,18,19,20,21]
function getTime(id){
    let arr = [8, 9, 10, 11, 13, 14, 16, 17, 18, 19, 20, 21];
    return arr[id]
}
function setCell(){
    if (dual.checked) {
        tdId.setAttribute('rowspan', 2);
        let next;
        if (tdId.id.length == 4) {
            next = Number(tdId.id[3]) + 1;
        }
        else {
            next = Number(tdId.id.slice(-2)) + 1
        }
        const element = document.getElementById(tdId.id.slice(0, 3) + next);
        element.remove();
    }
    start = tdId.id.slice(3, 5)
    tdId.classList.add('bg-info');
    tdId.classList.add('text-white');
    tdId.innerHTML = document.getElementById('lecName').value;
    let lecture = {
        ar : document.getElementById('lecName').value,
        day : tdId.id.slice(0,3),
        location: document.getElementById('lecLocation').value,
        dayNum: getDayNumber(tdId.id.slice(0, 3)),
        Start : start,
        Time : getTime(start - 1),
        isCanceled : false,
        single : document.getElementById('single').checked
    }
    object.schedule.push(lecture);
};
document.getElementById('lectureForm').addEventListener('submit', function (event) {
    event.preventDefault();
});
document.getElementById('homeworkForm').addEventListener('submit', function (event) {
    event.preventDefault();
});
document.getElementById('subjectForm').addEventListener('submit', function (event) {
    event.preventDefault();
});
document.addEventListener('input', function () {
    document.getElementById('lecModalButton').disabled = !document.getElementById('lectureForm').checkValidity();
    document.getElementById('homeworkModalButton').disabled = !document.getElementById('homeworkForm').checkValidity();
    document.getElementById('subjectModalButton').disabled = !document.getElementById('subjectForm').checkValidity();
});

function addHomework(subject,content,duration,mark){
    debugger;
    let table = document.getElementById('homeworksTable');
    let row = table.insertRow(1);
    let cell1 = row.insertCell(0);
    cell1.innerHTML = subject;
    let cell2 = row.insertCell(1);
    cell2.innerHTML = content;
    let cell3 = row.insertCell(2);
    cell3.innerHTML = duration;
    let cell4 = row.insertCell(3);
    if (mark == ""){
        mark = 0;
    }
    cell4.innerHTML = mark;
}

function addSubject() {
    debugger;
    let inputs = document.querySelectorAll('.subject');
    let subject = new Object();
    subject.name = inputs[0].value;
    subject.hasPractical = inputs[1].checked;
    subject.theoreticalPart = new Object();
    subject.theoreticalPart.name = inputs[2].value;
    subject.theoreticalPart.email = inputs[3].value;
    subject.theoreticalPart.qeemId = inputs[4].value;
    if (inputs[5].checked) {
        subject.practicalPart = '#';
    }
    else {
        subject.practicalPart = new Object();
        subject.practicalPart.name = inputs[6].value;
        subject.practicalPart.email = inputs[7].value;
        subject.practicalPart.qeemId = inputs[8].value;
    }
    object.subjects.push(subject);
    let newButton = document.createElement('button');
    newButton.className = 'btn btn-block rounded-pill btn-outline-light';
    newButton.innerHTML = inputs[0].value;
    newButton.onclick = function () {
        location.href = 'subject.html';
    };
    let div = document.getElementById('devSubjects');
    div.insertBefore(newButton, div.children[0]);
    localStorage.setItem('devSubjects', JSON.stringify(object.subjects[object.subjects.length - 1]));
}

function pracModal(bool){
    let inputs = document.querySelectorAll('.prac');
    for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i];
        input.required = bool;
    }
    document.getElementById('pracModal').hidden = !bool;
}

const tdElements = document.querySelectorAll('td');
tdElements.forEach((td) => {
    if (td.id.length == 4 || td.id.length == 5){
        td.innerHTML += '<button onclick="setId(' + td.id +')" type="button" data-bs-toggle="modal" data-bs-target="#scheduleModal" class="btn btn-outline-primary">إضافة محاضرة</button>';
    }
});