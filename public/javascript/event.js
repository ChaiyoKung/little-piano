const PITCH_KEYS = [
    "-109", "-110", "-111", "-112",
    "001", "002", "003", "004", "005", "006", "007", "008", "009", "010", "011", "012",
    "101", "102", "103", "104", "105", "106", "107", "108", "109", "110", "111", "112",
    "201", "202", "203", "204", "205", "206", "207", "208", "209", "210", "211", "212",
    "301", "302", "303", "304", "305", "306", "307", "308", "309", "310", "311", "312",
    "401", "402", "403", "404", "405", "406", "407", "408", "409", "410", "411", "412",
    "501", "502", "503", "504", "505", "506", "507", "508", "509", "510", "511", "512",
    "601", "602", "603", "604", "605", "606", "607", "608", "609", "610", "611", "612",
    "701", "702"
];
const btnMM = document.getElementById("mm");
const btnM = document.getElementById("m");
const transposeScreen = document.querySelector("#transpose #screen");
const btnP = document.getElementById("p");
const btnPP = document.getElementById("pp");
const audioNames = document.querySelectorAll(".audioName");

const soundList = document.getElementById("sound_list");

const sustainKey = document.getElementById("sustain");
let sustain = true;

const BLACK_KEYS = ["a", "s", "f", "g", "j", "k", "l", "'"];
const WHITE_KEYS = ["z", "x", "c", "v", "b", "n", "m", ",", ".", "/"];
const keys = document.querySelectorAll(".key");
const whiteKeys = document.querySelectorAll(".key.white");
const blackKeys = document.querySelectorAll(".key.black");

function changePitch(index) {
    if (index < 0) {
        for (let i = 0; i < keys.length; i++) {
            let src = audioNames[i].getAttribute("src");
            let srcs = src.split("/");
            let fullFileName = srcs[2];
            let fileName = fullFileName.split(".");
            if (fileName[0] == PITCH_KEYS[0]) {
                break;
            }
            let pitchIndex = PITCH_KEYS.indexOf(fileName[0]) + index;
            let newFileName = PITCH_KEYS[pitchIndex]
            let newSrc = srcs[0] + "/" + srcs[1] + "/" + newFileName + "." + fileName[1];
            audioNames[i].setAttribute("src", newSrc);
        }
    }
    else {
        for (let i = (keys.length - 1); i >= 0; i--) {
            let src = audioNames[i].getAttribute("src");
            let srcs = src.split("/");
            let fullFileName = srcs[2];
            let fileName = fullFileName.split(".");
            if (fileName[0] == PITCH_KEYS[PITCH_KEYS.length - 1]) {
                break;
            }
            let pitchIndex = PITCH_KEYS.indexOf(fileName[0]) + index;
            let newFileName = PITCH_KEYS[pitchIndex]
            let newSrc = srcs[0] + "/" + srcs[1] + "/" + newFileName + "." + fileName[1];
            audioNames[i].setAttribute("src", newSrc);
        }
    }
}

function transpose(num) {
    let screenValueInt = parseInt(transposeScreen.innerHTML);
    if (num == -12 && (num + screenValueInt) < -36) {
        num = -36 - screenValueInt;
    }
    else if (num == -1 && screenValueInt <= -36) {
        num = 0;
    }
    else if (num == 1 && screenValueInt >= 36) {
        num = 0;
    }
    else if (num == 12 && (num + screenValueInt) > 36) {
        num = 36 - screenValueInt;
    }

    if (num != 0) {
        changePitch(num);
    }

    transposeScreen.innerHTML = screenValueInt + num;
}

function playNote(key) {
    key.classList.add("active");
    const noteAudio = document.getElementById(key.dataset.note);
    noteAudio.currentTime = 0;
    noteAudio.play();
}

function pauseNote(key) {
    key.classList.remove("active");
    if (!sustain) {
        const noteAudio = document.getElementById(key.dataset.note);
        noteAudio.pause();
        noteAudio.currentTime = 0;
    }
}




btnMM.addEventListener("click", () => transpose(-12));
btnM.addEventListener("click", () => transpose(-1));
btnP.addEventListener("click", () => transpose(1));
btnPP.addEventListener("click", () => transpose(12));

sustainKey.addEventListener("click", () => {
    if (sustain) {
        sustain = false;
        sustainKey.classList.remove("active");
    }
    else {
        sustain = true;
        sustainKey.classList.add("active");
    }
})

soundList.addEventListener("change", () => {
    audioNames.forEach(audioName => {
        let src = audioName.getAttribute("src");
        let srcs = src.split("/");
        let newSrc = srcs[0] + "/" + soundList.value + "/" + srcs[2];
        audioName.setAttribute("src", newSrc);
    });
});

if (screen.width <= 1024) {
    keys.forEach(key => {
        key.addEventListener("click", () => {
            playNote(key);
            setTimeout(() => {
                key.classList.remove("active");
            }, 100);
        });
    });
}

document.addEventListener("keydown", e => {
    if (e.repeat) return;
    const key = e.key
    const whiteKeyIndex = WHITE_KEYS.indexOf(key);
    const blackKeyIndex = BLACK_KEYS.indexOf(key);

    if (whiteKeyIndex >= 0) playNote(whiteKeys[whiteKeyIndex]);
    if (blackKeyIndex >= 0) playNote(blackKeys[blackKeyIndex]);
});

document.addEventListener("keyup", e => {
    if (e.repeat) return;
    const key = e.key
    const whiteKeyIndex = WHITE_KEYS.indexOf(key);
    const blackKeyIndex = BLACK_KEYS.indexOf(key);

    if (whiteKeyIndex >= 0) pauseNote(whiteKeys[whiteKeyIndex]);
    if (blackKeyIndex >= 0) pauseNote(blackKeys[blackKeyIndex]);
});