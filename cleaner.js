// Constantes para estados y acciones
const ESTADOS = {
    SUCIO: 'DIRTY',
    LIMPIO: 'CLEAN',
    UBICACION_A: 'A',
    UBICACION_B: 'B'
};

const ACCIONES = {
    LIMPIAR: 'CLEAN',
    IZQUIERDA: 'LEFT',
    DERECHA: 'RIGHT'
};

const PROBABILIDAD = {
    AMBOS_LIMPIOS: 0.3, // Reducida para evitar ciclos infinitos
    GENERAL: 0.1
};

// Configuración global
const CONFIG = {
    ITERACIONES_MAX: 50,
    INTERVALO: 1000,
    MAX_ITERACIONES_LIMPIAS: 5 // Iteraciones consecutivas limpias para terminar
};

// Variables de estado
let iteracionesLimpias = 0;
let contadorIteraciones = 0;

// Utilidades
function registrarMensaje(mensaje) {
    const logDiv = document.getElementById("log");
    logDiv.innerHTML += `${logDiv.innerHTML ? '<br>' : ''}${mensaje}`;
    logDiv.scrollTop = logDiv.scrollHeight;
}

// Lógica del agente
function agenteReflexivo(ubicacion, estadoActual) {
    return estadoActual === ESTADOS.SUCIO ? ACCIONES.LIMPIAR :
           ubicacion === ESTADOS.UBICACION_A ? ACCIONES.DERECHA : ACCIONES.IZQUIERDA;
}

// Ensucia aleatoriamente una habitación con menor probabilidad
function ensuciarAleatorio(estado) {
    if (Math.random() < (estado[1] === ESTADOS.LIMPIO && estado[2] === ESTADOS.LIMPIO ? PROBABILIDAD.AMBOS_LIMPIOS : PROBABILIDAD.GENERAL)) {
        const habitacion = Math.random() < 0.5 ? 1 : 2;
        estado[habitacion] = ESTADOS.SUCIO;
        registrarMensaje(`<b>¡HABITACIÓN ENSUCIADA! ${habitacion === 1 ? 'A' : 'B'}</b>`);
    }
}

// Simulación principal
function simular(estado) {
    if (contadorIteraciones >= CONFIG.ITERACIONES_MAX) {
        registrarMensaje("<b>Límite de iteraciones alcanzado</b>");
        return;
    }
    contadorIteraciones++;
    
    const [ubicacion, estadoA, estadoB] = estado;
    const estadoActual = ubicacion === ESTADOS.UBICACION_A ? estadoA : estadoB;
    const accion = agenteReflexivo(ubicacion, estadoActual);

    registrarMensaje(`Iteración: ${contadorIteraciones} | Ubicación: ${ubicacion} | 🛠 Acción: ${accion} | Estado A: ${estadoA} | Estado B: ${estadoB}`);

    switch (accion) {
        case ACCIONES.LIMPIAR:
            estado[ubicacion === ESTADOS.UBICACION_A ? 1 : 2] = ESTADOS.LIMPIO;
            iteracionesLimpias = 0;
            break;
        case ACCIONES.DERECHA:
            estado[0] = ESTADOS.UBICACION_B;
            break;
        case ACCIONES.IZQUIERDA:
            estado[0] = ESTADOS.UBICACION_A;
            break;
    }

    if ([ACCIONES.DERECHA, ACCIONES.IZQUIERDA].includes(accion)) {
        ensuciarAleatorio(estado);
    }

    if (estado[1] === ESTADOS.LIMPIO && estado[2] === ESTADOS.LIMPIO) {
        iteracionesLimpias++;
        if (iteracionesLimpias >= CONFIG.MAX_ITERACIONES_LIMPIAS) {
            registrarMensaje("<b>¡Limpieza estable alcanzada! Terminando simulación.</b>");
            return;
        }
    } else {
        iteracionesLimpias = 0;
    }

    setTimeout(simular, CONFIG.INTERVALO, estado);
}

// Iniciar simulación
simular([ESTADOS.UBICACION_A, ESTADOS.SUCIO, ESTADOS.SUCIO]);
