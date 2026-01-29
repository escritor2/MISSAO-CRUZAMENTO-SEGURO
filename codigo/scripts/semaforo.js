
const historico = document.getElementById("log");

const serverVal = document.getElementById("status_servidor");
const fluxoVal = document.getElementById("nivel_fluxo");
const fluxoCarros = document.getElementById("fluxo_val");
const climaVal = document.getElementById("clima");
const sensorVal = document.getElementById("status_sensor");
const luzAtualEl = document.getElementById("luz_atual");
const tempoRestEl = document.getElementById("tempo_restante");

let statusAtual = "verde";
let tempoAtual = 0;

let tempoLuzes = {
    "verde": 10,
    "amarelo": 5,
    "vermelho": 8
};


let tempoAjustado = { ...tempoLuzes };

let logSistema = [];


function simularSensores() {
    sensor.clima = Math.ceil(Math.random() * 100) < 30 ? "chuva forte" : "normal";
    sensor.fluxo = Math.ceil(Math.random() * 20);
    sensor.falhaSensor = Math.ceil(Math.random() * 100) < 10;
    sensor.servidorOnline = Math.ceil(Math.random() * 100) > 20;
    fluxoCarros.innerHTML = sensor.fluxo;
    registrarFluxo(sensor.fluxo);
}

function calcularTemposLuzes() {
    tempoAjustado = { ...tempoLuzes };
    
    let motivos = [];
    let redFat = .7;
    let incFat = 1.3;
    let nivelFluxo = lerFluxo(sensor.fluxo);
    fluxoVal.innerHTML = nivelFluxo;
    if (nivelFluxo === "alto") {
        tempoAjustado.verde = Math.round(tempoLuzes.verde * incFat);
        motivos.push("Fluxo alto detectado - Verde aumentado em 30%");
    } else if (nivelFluxo === "baixo") {
        tempoAjustado.verde = Math.round(tempoLuzes.verde - tempoLuzes.verde * redFat);
        motivos.push("Fluxo baixo - Verde reduzido em 30%");
    }
    
    if (lerClima(sensor.clima) === "chuva_forte") {
        tempoAjustado.amarelo = Math.round(tempoLuzes.amarelo * incFat);
        tempoAjustado.verde = Math.round(tempoAjustado.verde * redFat);
        climaVal.innerHTML = "Chuva forte";
        motivos.push("Chuva forte - Amarelo aumentado 30%, Verde reduzido 30%");
    }else{
        climaVal.innerHTML = "Normal";
    }
    
    if (sensor.falhaSensor) {
        sensorVal.innerHTML = "Falha";
        return {
            status: "falha_sensor",
            modo: "segurança",
            tempo: 3, 
            motivos: ["ALERTA: Sensor com falha - Modo segurança (pisca amarelo)"]
        };
    }
    else{
        sensorVal.innerHTML = "Normal"
    }
    
    let modo = statusServidor(sensor.servidorOnline) === "local" ? "local" : "online";
    serverVal.innerHTML =  modo;
    if (modo === "local") {
        motivos.push("Servidor offline - Executando em modo LOCAL");
    }
    
    return {
        status: "normal",
        modo: modo,
        tempos: tempoAjustado,
        motivos: motivos
    };
}


function atualizarSemaforo() {
    let resultado = calcularTemposLuzes();
    
    if (resultado.status === "falha_sensor") {
        atualizarLEDs("pisca_amarelo", resultado.motivos);
        return;
    }
    
    let tempoAtualizado = resultado.tempos[statusAtual];
    tempoAtual++;
    if (tempoAtual >= tempoAtualizado) {
        if (statusAtual === "verde") {
            statusAtual = "amarelo";
        } else if (statusAtual === "amarelo") {
            statusAtual = "vermelho";
        } else {
            statusAtual = "verde";
        }
        tempoAtual = 0;
    }
    const restante = Math.max(0, tempoAtualizado - tempoAtual);
    if (luzAtualEl) luzAtualEl.innerText = statusAtual;
    if (tempoRestEl) tempoRestEl.innerText = `${restante}s`;
    atualizarLEDs(statusAtual, resultado.motivos);
}

function atualizarLEDs(cor, motivos = []) {
    const elemento = document.querySelector(".semaforo");
    if (!elemento) return;
    
    elemento.classList.remove("verde", "amarelo", "vermelho", "pisca_amarelo");
    elemento.classList.add(cor);
    if (motivos && motivos.length) {
        const now = new Date();
        const pad = (n) => String(n).padStart(2, '0');
        const ts = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
        motivos.forEach(m => logSistema.push(`${ts} - ${m}`));
        if (logSistema.length > 200) logSistema.shift();
    }

}
function atualizarHistorico(){
    if (!historico) return;
    const sistema = logSistema.slice(-50); 
    const sistemaLinhas = sistema.map(l => l);
    const fluxoLinhas = sensor.historico_fluxo.map(f => `${f.ts}: ${f.value}`);
    const todas = [];
    if (sistemaLinhas.length) {
        todas.push('=== Sistema ===');
        todas.push(...sistemaLinhas);
        todas.push('');
    }
    todas.push('=== Fluxo (últimos) ===');
    todas.push(...fluxoLinhas);
    historico.value = todas.join('\n');
}




setInterval(() => {
    simularSensores();
}, 5000);

setInterval(() => {
    atualizarHistorico();
    atualizarSemaforo();
}, 1000);
