
const sensor = {
    clima: "normal",
    fluxo: 0,
    falhaSensor: false,
    servidorOnline: true,
    historico_fluxo: []
};


function lerSensor() {
    return {
        clima: sensor.clima,
        fluxo: sensor.fluxo,
        falhaSensor: sensor.falhaSensor,
        servidorOnline: sensor.servidorOnline
    };
}


function lerFluxo(fluxo) {
    if (fluxo >= 15) {
        return "alto";
    } else if (fluxo >= 8) {
        return "normal";
    }
    return "baixo";
}


function lerClima(clima) {
    if (clima === "chuva forte") {
        return "chuva_forte";
    } else if (clima === "nublado") {
        return "nublado";
    }
    return "normal";
}


function statusSensor(falhaSensor) {
    return falhaSensor ? "alerta" : "normal";
}

function statusServidor(servidorOnline) {
    return servidorOnline ? "online" : "local";
}


function registrarFluxo(fluxo) {
    const data = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const datastr = `${pad(data.getHours())}:${pad(data.getMinutes())}:${pad(data.getSeconds())}`;
    sensor.historico_fluxo.push({ ts: datastr, value: Number(fluxo) });
    if (sensor.historico_fluxo.length > 60) {
        sensor.historico_fluxo.shift();
    }
}


function calcularFluxoMedio() {
    if (sensor.historico_fluxo.length === 0) return 0;
    const soma = sensor.historico_fluxo.reduce((acc, item) => acc + (Number(item.value) || 0), 0);
    return Math.round(soma / sensor.historico_fluxo.length);
}