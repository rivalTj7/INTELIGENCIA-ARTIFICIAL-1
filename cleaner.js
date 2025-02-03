
function getStateString(states) {
    return `${states[0]},${states[1]},${states[2]}`;
}

let visitedStates = new Set();
const TOTAL_STATES = 8;
let iterationCount = 0;
const MAX_ITERATIONS = 50;

function logMessage(message) {
    const logDiv = document.getElementById("log");
    logDiv.innerHTML += `<br>${message}`;
    logDiv.scrollTop = logDiv.scrollHeight;
}

function reflex_agent(location, state) {
    if (state === "DIRTY") return "CLEAN";
    else if (location === "A") return "RIGHT";
    else if (location === "B") return "LEFT";
}

function randomlyDirty(states) {
    const bothClean = states[1] === "CLEAN" && states[2] === "CLEAN";
    const probability = bothClean ? 0.7 : 0.2;

    if (Math.random() < probability) {
        const room = Math.random() < 0.5 ? 1 : 2;
        if (states[room] === "CLEAN") {
            states[room] = "DIRTY";
            logMessage(`<b> A ROOM HAS BEEN DIRTIED! ${room === 1 ? "A" : "B"}!</b>`);
        }
    }
}

function test(states) {
    if (iterationCount >= MAX_ITERATIONS) {
        logMessage("<b>Max iterations reached. Stopping...</b>");
        return;
    }

    iterationCount++;
    let currentSize = visitedStates.size;
    const currentState = getStateString(states);
    visitedStates.add(currentState);
    
    if (visitedStates.size > currentSize) {
        logMessage(`<b> New visited state: ${currentState} (${visitedStates.size})</b>`);
    }

    var location = states[0];
    var state = location === "A" ? states[1] : states[2];
    var action_result = reflex_agent(location, state);

    logMessage(`Location: ${location} | 🛠 Action: ${action_result} | Other room: ${location === "A" ? states[2] : states[1]}`);

    if (action_result === "CLEAN") {
        if (location === "A") states[1] = "CLEAN";
        else if (location === "B") states[2] = "CLEAN";
    } else if (action_result === "RIGHT") {
        states[0] = "B";
    } else if (action_result === "LEFT") {
        states[0] = "A";
    }

    if (action_result === "RIGHT" || action_result === "LEFT") {
        randomlyDirty(states);
    }

    if (visitedStates.size === TOTAL_STATES) {
        logMessage("<b> Every possible state has been visited!</b>");
        if (states[1] === "DIRTY" || states[2] === "DIRTY") {
            setTimeout(() => test(states), 2000);
        } else {
            logMessage("<b> Cleaning completed!</b>");
            return;
        }
    } else {
        setTimeout(() => test(states), 2000);
    }
}

var states = ["A", "DIRTY", "DIRTY"];
test(states);

/* Estados totales
    TOTAL STATES IN THIS CASE ARE 8
    A,DIRTY,DIRTY
    A,DIRTY,CLEAN
    A,CLEAN,DIRTY
    A,CLEAN,CLEAN
    B,DIRTY,DIRTY
    B,DIRTY,CLEAN
    B,CLEAN,DIRTY
    B,CLEAN,CLEAN
*/
