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
    if (!(day > 4 || period == 0)){
        document.getElementById(`${dayName}${period}`).style.backgroundColor = "#0346ff";
    }
}

let block2 = document.getElementById('block 2');

let removedCells = []
let lectureTimes = []

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
}


fetchJSONData()
    .then((object) => {
        localStorage.setItem('jsonFile', JSON.stringify(object))
    })
    .catch((error) => {
        console.error("Unable to fetch data:", error);
    });
localStorage.clear
let parsedJson = JSON.parse(localStorage.getItem('jsonFile'));

let nextLec;

for (let i = 0; i < parsedJson.schedule.length; i++) {
    const element = parsedJson.schedule[i];
    let hoursToLecture = hoursUntilTarget(element.dayNum, element.Time);
    if (hoursToLecture < minHours){
        minHours = hoursToLecture
        nextLec = element.ar;
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

debugger;
markCell()
