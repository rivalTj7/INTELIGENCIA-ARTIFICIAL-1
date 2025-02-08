function getStateString(states) {
    return states.join(",");
}
let statesVisited = new Set();
const TOTAL_STATE_COUNT = 8;

function reflex_agent(location, state) {
    switch(state) {
        case "DIRTY":
            return "CLEAN";
        default:
            return location === "A" ? "RIGHT" : "LEFT";
    }
}

function randomlyDirty(states) {
    const bothClean = states.slice(1).every(state => state === "CLEAN");
    const probability = bothClean ? 0.7 : 0.3;
  
    if (Math.random() < probability) {
        const roomIndex = Math.random() < 0.5 ? 1 : 2;
        if (states[roomIndex] === "CLEAN") {
            states[roomIndex] = "DIRTY";
            const roomLabel = roomIndex === 1 ? 'A' : 'B';
            document.getElementById("log").innerHTML += `<br><b>Room ${roomLabel} got dirty!</b>`;
        }
    }
}

function test(states) {
    const currentState = getStateString(states);
    const wasVisited = statesVisited.has(currentState);
    statesVisited.add(currentState);

    if (!wasVisited) {
        document.getElementById("log").innerHTML += `<br><b><i>Estado:(${statesVisited.size})</i></b>`;
    }

    const [location, stateA, stateB] = states;
    const state = location === "A" ? stateA : stateB;
    const action = reflex_agent(location, state);

    document.getElementById("log").innerHTML += `<br>Location: ${location} | Action: ${action} | Other room state: ${location === "A" ? stateB : stateA}`;

    if (action === "CLEAN") {
        const index = location === "A" ? 1 : 2;
        states[index] = "CLEAN";
        document.getElementById("log").innerHTML += `<br>Room ${location} has been cleaned.`;
    } else {
        states[0] = action === "RIGHT" ? "B" : "A";
        document.getElementById("log").innerHTML += `<br>The cleaner moved to room ${states[0]}.`;
    }

    if (action === "RIGHT" || action === "LEFT") {
        randomlyDirty(states);
    }

    if (statesVisited.size === TOTAL_STATE_COUNT) {
        document.getElementById("log").innerHTML += `<br><b><i>All possible states have been visited!</i></b>`;
        if (states[1] === "DIRTY" || states[2] === "DIRTY") {
            setTimeout(() => test(states), 2000);
        } else {
            document.getElementById("log").innerHTML += `<br><b><i>Limpieza completa!</i></b>`;
            return;
        }
    } else {
        setTimeout(() => test(states), 2000);
    }
}

// VERY FIRST CALL TO THE FUNCTION WITH THE STATE: A,DIRTY,DIRTY
var states = ["A", "DIRTY", "DIRTY"];
test(states);
