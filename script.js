function fetchJSONData() {
    return new Promise((resolve, reject) => {
        fetch("file.json")
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                resolve(data); // Resolve the promise with the fetched data
            })
            .catch((error) => {
                reject(error); // Reject the promise if there's an error
            });
    });
}

function choice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
let dua = [
    'سبحان الله وبحمده, سبحان العظيم',
    'اللهم صل وسلم على سيدنا محمد',
    'لا تنسى ذكر الله',
    'لا إله إلا الله',
    'لا حول ولا قوة إلا بالله',
    'استغفر الله العلي العظيم من كل ذنب عظيم',
    'لا اله إلا انت سبحانك اني كنت من الظالمين'
]

const now = new Date();
const day = now.getDay();
const hours = now.getHours();

function getDayName(dayNumber) {
    const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    return days[dayNumber];
}

function nextLecture() {
    const current = `${getDayName(day)}${hours}`;
    if (lectureTimes.includes(current)){
        console.log('a lecture at the momemnt')
    }

}
function hoursUntilTarget(dayNumber, targetHour) {
    // Get the current date and time
    const now = new Date();
    const currentDay = now.getDay(); // 0 (Sunday) - 6 (Saturday)
    const currentHour = now.getHours(); // 0 - 23

    // Calculate the difference in days
    let dayDifference = dayNumber - currentDay;
    if (dayDifference < 0) {
        dayDifference += 7; // Wrap around to next week
    }

    // Calculate the difference in hours
    let hourDifference = targetHour - currentHour;

    // If the target hour is before the current hour on the same day, move to the next week
    if (dayDifference === 0 && hourDifference <= 0) {
        dayDifference = 7;
    }

    // Total hours left
    const totalHoursLeft = (dayDifference * 24) + hourDifference;

    return totalHoursLeft;
}

function getPeriod() {
    switch (hours) {
        case 8:
            period = 1;
            break;
        case 9:
            period = 2;
            break;
        case 10:
            period = 3;
            break;
        case 11:
            period = 4;
            break;
        case 13:
            period = 5;
            break;
        case 14:
            period = 6;
            break;
        case 16:
            period = 7;
            break;
        case 17:
            period = 8;
            break;
        case 18:
            period = 9;
            break;
        case 19:
            period = 10;
            break;
        case 20:
            period = 11;
            break;
        case 21:
            period = 12;
            break;
        default:
            period = 0;
            break;
    }
    return period;
}

function markCell(){
    let period = getPeriod();

    const dayName = getDayName(day);
    while (removedCells.includes(`${dayName}${period}`)){
        period--;
    }
    for (let i = 0; i < canceledLectures.length; i++) {
        const element = canceledLectures[i];
        document.getElementById(element).classList.add("bg-danger");
    }
    if (!(day > 4 || period == 0)){
        console.log(canceledLectures)
        console.log(`${dayName}${period}`)
        if (canceledLectures.includes(`${dayName}${period}`)) {
            document.getElementById(`${dayName}${period}`).classList.add("bg-warning");
        }
        else document.getElementById(`${dayName}${period}`).classList.add("bg-success");
    }
}

let block2 = document.getElementById('block 2');

let removedCells = []
let lectureTimes = []
let canceledLectures = []

function reload(){
    localStorage.clear();
    location.reload();
}

let minHours = 7 * 24;

function lecture(subject){
    lecID = subject.Day + subject.Start;
    if (!subject.Single){
        document.getElementById(lecID).setAttribute('rowspan', 2);
        const element = document.getElementById(subject.Day + (subject.Start + 1));
        removedCells.push(subject.Day + (subject.Start + 1));
        element.remove();
    }
    document.getElementById(lecID).textContent = subject.ar;
    document.getElementById(lecID).classList.add('bg-info');
    document.getElementById(lecID).classList.add('text-white');
}

let version = localStorage.getItem('version');
if (version == null){
fetchJSONData()
    .then((object) => {
        localStorage.setItem('jsonFile', JSON.stringify(object))
        localStorage.setItem('version', object.version);
        snackbar('أعد تحميل هذه الصفحة');
    })
    .catch((error) => {
        console.error("Unable to fetch data:", error);
    });
}
else {
    snackbar(choice(dua));
}
fetchJSONData()
    .then((object) => {
        if (version != object.version){
            localStorage.setItem('jsonFile', JSON.stringify(object))
            localStorage.setItem('version',object.version)
            snackbar('أعد تحميل الصفحة');
        }
    })
    .catch((error) => {
        console.error("Unable to fetch data:", error);
    });
let parsedJson = JSON.parse(localStorage.getItem('jsonFile'));

let nextLec;
let lecLocation;

for (let i = 0; i < parsedJson.schedule.length; i++) {
    const element = parsedJson.schedule[i];
    let hoursToLecture = hoursUntilTarget(element.dayNum, element.Time);
    if (element.isCanceled){
        canceledLectures.push(`${element.Day}${element.Start}`)
        lecture(element)
        continue;
    }
    if (hoursToLecture < minHours){
        minHours = hoursToLecture
        nextLec = element.ar;
        lecLocation = element.location;
    }
    lecture(element)
}
// Set the date we're counting down to
// Number of hours to add

// Get the current date and time
const currentDate = new Date();

// Calculate the future date by adding hoursToAdd
const futureDate = new Date(currentDate.getTime() + minHours * 60 * 60 * 1000);

// Format the date string for countdown
const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const month = monthNames[futureDate.getMonth()];
const day_ = futureDate.getDate();
const year = futureDate.getFullYear();
const hours_ = futureDate.getHours();

// Set the countdown target
const countDownDate = new Date(`${month} ${day_}, ${year} ${hours_}:00:00`).getTime();

// Update the count down every 1 second
var x = setInterval(function () {

    // Get today's date and time
    var now = new Date().getTime();

    // Find the distance between now and the count down date
    var distance = countDownDate - now;

    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Output the result in an element with id="demo"
    document.getElementById("timeToNextLec").innerHTML = "الوقت المتبقي للمحاضرة القادمة : " + (days + "d " + hours + "h "
        + minutes + "m " + seconds + "s ");

    // If the count down is over, write some text 
    if (distance < 0) {
        clearInterval(x);
        document.getElementById("timeToNextLec").innerHTML = "EXPIRED";
    }
}, 1000);

document.getElementById('nextLec').textContent = "المحاضرة القادمة : " + nextLec;
document.getElementById('homeworks').textContent = "الواجبات والمشاريع : " + "لا يوجد";
document.getElementById('lecLocation').textContent = "قاعة المحاضرة القادمة: " + lecLocation;

function snackbar(text) {
    var x = document.getElementById("snackbar")
    x.textContent = text;
    // Add the "show" class to DIV
    x.className = "show";

    // After 3 seconds, remove the show class from DIV
    setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
}

markCell()

function goToPage(index) {
    localStorage.setItem('subjects', JSON.stringify(parsedJson.subjects[index]));
    location.href = 'subject.html'
}
for (let i = 0; i < parsedJson.subjects.length; i++) {
    const element = parsedJson.subjects[i];
    let id = 'subjects';
    if (i > 2) {
        id = 'subjects2'
    }
    document.getElementById(id).innerHTML += `<h4><button class="btn btn-outline-light" onclick="goToPage(${i})">${element.name}</button></h4>`;
}
if (parsedJson.assignments.length == 0){
    document.getElementById('homeworksDiv').remove();
}
/* 
{
    "subject" : "واجب تجريبي",
    "content" : "<a herf="www.youtube.com">واجب حرييييييقة من الفرن</a>",
    "date" : 18/8/2024,
    "mark" : 69
}
 */
else for (let i = 0; i < parsedJson.assignments.length; i++) {
    const element = parsedJson.assignments[i];
    let table = document.getElementById('homeworksTable');
    let row = table.insertRow();
    let cell1 = row.insertCell();
    cell1.innerHTML = element.subject;
    
    let cell2 = row.insertCell();
    cell2.innerHTML = element.content;
    
    let cell3 = row.insertCell();
    cell3.innerHTML = element.date;

    let cell4 = row.insertCell();
    cell4.innerHTML = element.mark;
}
console.log(parsedJson.assignments);