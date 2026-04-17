// --- INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', () => {
    fetchWorldBankData().then(() => {
        // Recargar listas tras actualizar con API
        renderSidebarLists();
        updateSim();
    });
});

// --- FUNCIÓN PARA CENTRAR MAPA ---
function centerMapOn(coords, zoomScale = 600) {
    const [lon, lat] = coords;
    const width = d3.select(".col-center").node().clientWidth;
    const height = d3.select(".col-center").node().clientHeight;

    projection.center([lon, lat]).scale(zoomScale);
    
    // Actualizar todos los elementos (Reutilizando la lógica de resize)
    window.dispatchEvent(new Event('resize'));
}

// --- BÚSQUEDA INTELIGENTE REFINADA ---
function handleSearch(query) {
    if (!query || query.length < 2) {
        resetHighlight();
        hideTooltip();
        // Resetear mapa al centro original
        centerMapOn([-70, -15], 400);
        return;
    }
    const q = query.toLowerCase();
    
    const countryEntry = Object.entries(LATAM_COUNTRIES).find(([id, c]) => 
        c.name.toLowerCase().includes(q) || c.capital.toLowerCase().includes(q)
    );
    
    if (countryEntry) {
        const id = Number(countryEntry[0]);
        const c = countryEntry[1];
        highlightCountry(id);
        centerMapOn([c.lon, c.lat], 500);
        showCountryTooltip({pageX: window.innerWidth/2, pageY: window.innerHeight/2}, c);
    }

    const node = keyNodes.find(n => n.name.toLowerCase().includes(q));
    if (node) {
        centerMapOn([node.lon, node.lat], 800);
        d3.selectAll(".key-point").classed("highlight-node", false);
        d3.selectAll(".key-point")
            .filter(d => d.name === node.name)
            .classed("highlight-node", true);
    }
}

// --- LÓGICA DE COMPARACIÓN REFINADA ---
let selectedForCompare = [];

function handleCountryClick(id) {
    id = Number(id); // Asegurar que sea número
    
    if (selectedForCompare.includes(id)) {
        selectedForCompare = selectedForCompare.filter(i => i !== id);
    } else {
        if (selectedForCompare.length >= 2) selectedForCompare.shift();
        selectedForCompare.push(id);
    }

    // Resaltado visual inmediato
    d3.selectAll(".country.latam").classed("highlight-compare", false);
    selectedForCompare.forEach(sid => {
        d3.select(`#country-${sid}`).classed("highlight-compare", true);
    });

    if (selectedForCompare.length === 2) {
        showComparison();
    } else {
        closeComparison(false); // No limpiar el array si solo hay uno
    }
}

function showComparison() {
    const c1 = LATAM_COUNTRIES[selectedForCompare[0]];
    const c2 = LATAM_COUNTRIES[selectedForCompare[1]];
    
    document.getElementById('union-stats').style.display = 'none';
    document.getElementById('compare-stats').style.display = 'block';
    
    const container = document.getElementById('compare-container');
    
    // Valores simulados
    const s1 = {
        gdp: (c1.gdpRaw * currentMultipliers.gdp).toFixed(1),
        inf: (parseFloat(c1.inflation) * currentMultipliers.inflation).toFixed(1),
        unemp: (c1.unempRaw * currentMultipliers.unemp).toFixed(1)
    };
    const s2 = {
        gdp: (c2.gdpRaw * currentMultipliers.gdp).toFixed(1),
        inf: (parseFloat(c2.inflation) * currentMultipliers.inflation).toFixed(1),
        unemp: (c2.unempRaw * currentMultipliers.unemp).toFixed(1)
    };

    const gdpDiff = Math.abs((c1.gdpRaw * currentMultipliers.gdp) - (c2.gdpRaw * currentMultipliers.gdp)).toFixed(1);

    container.innerHTML = `
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; font-size:11px;">
            <div style="border-right:1px solid rgba(0,229,255,0.2); padding-right:5px;">
                <strong style="color:var(--cyan);">${c1.name.toUpperCase()}</strong><br>
                <span style="color:var(--text-muted);">PIB:</span> <span style="color:#ffcc00">$${s1.gdp}B</span><br>
                <span style="color:var(--text-muted);">INF:</span> <span style="color:#ff5555">${s1.inf}%</span><br>
                <span style="color:var(--text-muted);">DES:</span> <span style="color:#ffaa00">${s1.unemp}%</span>
            </div>
            <div>
                <strong style="color:var(--cyan);">${c2.name.toUpperCase()}</strong><br>
                <span style="color:var(--text-muted);">PIB:</span> <span style="color:#ffcc00">$${s2.gdp}B</span><br>
                <span style="color:var(--text-muted);">INF:</span> <span style="color:#ff5555">${s2.inf}%</span><br>
                <span style="color:var(--text-muted);">DES:</span> <span style="color:#ffaa00">${s2.unemp}%</span>
            </div>
        </div>
        <div style="margin-top:10px; font-size:9px; color:#aaa; font-style:italic;">* Valores proyectados por escenario.</div>
        <div style="margin-top:10px; font-size:10px; color:var(--neon-green); text-align:center; border-top:1px dashed var(--cyan); padding-top:10px;">
            DIF. PIB: $${gdpDiff}B USD
        </div>
    `;
}

function closeComparison(clearArray = true) {
    if (clearArray) selectedForCompare = [];
    document.getElementById('union-stats').style.display = 'block';
    document.getElementById('compare-stats').style.display = 'none';
    if (clearArray) d3.selectAll(".country.latam").classed("highlight-compare", false);
}




// --- INTERACTIVIDAD DE LEYENDA ---
function highlightKeyNodes() {
    d3.selectAll(".key-point")
        .transition().duration(300).attr("r", 15)
        .transition().duration(300).attr("r", d => d.tier === 1 ? 6.5 : 4.5);
}

function highlightCapitals() {
    d3.selectAll(".capital-dot")
        .transition().duration(300).attr("r", 8).style("fill", "#fff")
        .transition().duration(300).attr("r", 2.5).style("fill", "#00ffcc");
}

// --- REEMPLAZO DE LA CARGA DEL MAPA (Fragmento necesario) ---
// Nota: Para mantener el main.js limpio, inyectaré el evento click en la función d3.json existente.

// --- CÁLCULO AGREGADO DE LA UNIÓN (24 PAÍSES) ---
let totalGDP_B = 0;
let totalPop = 0;
let weightedUnempSum = 0;

// --- ESTADO GLOBAL DE SIMULACIÓN ---
let currentMultipliers = {
    gdp: 1.0,
    unemp: 1.0,
    fdi: 1.0,
    inflation: 1.0,
    gini: 0
};

// --- CÁLCULO DE ÍNDICE DE INFLUENCIA GLOBAL (0-100) ---
function calculateInfluenceIndex(c) {
    // Usar valores simulados para el índice de poder
    const simGDP = c.gdpRaw * currentMultipliers.gdp;
    const nGDP = Math.min(simGDP / 2500, 1);
    
    // 2. Población Normalizada
    const nPop = Math.min(c.population / 220, 1);
    
    // 3. Recursos Estratégicos (Litio, Petróleo, Agua, Renovables)
    // Escala: Litio (max ~21), Petróleo (max ~3), Agua (max ~12), Renew (max 10)
    const resScore = (
        (Math.min(c.lithium / 21, 1) * 0.4) + 
        (Math.min(c.oil / 3, 1) * 0.3) + 
        (Math.min(c.water / 12, 1) * 0.2) + 
        (Math.min(c.renew / 10, 1) * 0.1)
    );
    const nRes = Math.min(resScore, 1);
    
    // 4. Tecnología e Innovación (Internet + IDH + Escolaridad)
    const nTech = (
        (c.internet / 100 * 0.5) + 
        (c.hdi * 0.3) + 
        (Math.min(c.edu / 12, 1) * 0.2)
    );
    
    // 5. Infraestructura (LPI + Puerto + Energía)
    // LPI (max ~3.3), Puerto (max 10), Energía (max 170GW)
    const infraScore = (
        (Math.min(c.lpi / 3.5, 1) * 0.4) + 
        (Math.min(c.port / 10, 1) * 0.3) + 
        (Math.min(c.energy / 180, 1) * 0.3)
    );
    const nInfra = Math.min(infraScore, 1);

    // FÓRMULA FINAL MODELO DE PODER GLOBAL
    const powerScore = (
        (nGDP * 0.30) + 
        (nPop * 0.20) + 
        (nRes * 0.20) + 
        (nTech * 0.15) + 
        (nInfra * 0.15)
    );

    return Math.round(powerScore * 100);
}

// Caché de elementos DOM para las estadísticas y selectores
const uiEls = {
    gdpVal: document.getElementById('val-gdp'),
    pibCapitaVal: document.getElementById('val-pibcapita'),
    unempVal: document.getElementById('val-unemp'),
    infVal: document.getElementById('val-influence'),
    scenario: document.getElementById('sim-scenario'),
    phase: document.getElementById('sim-phase')
};

function updateRanking() {
    const container = document.getElementById('ranking-container');
    const metric = document.getElementById('rank-metric')?.value || 'gdp';
    if (!container) return;

    const countries = Object.values(LATAM_COUNTRIES).map(c => ({
        ...c,
        influence: calculateInfluenceIndex(c),
        resScore: (c.lithium*0.4 + c.oil*0.3 + c.water*0.2 + c.renew*0.1),
        simGdp: c.gdpRaw * currentMultipliers.gdp
    }));

    countries.sort((a, b) => {
        if (metric === 'gdp') return b.simGdp - a.simGdp;
        if (metric === 'influence') return b.influence - a.influence;
        if (metric === 'resources') return b.resScore - a.resScore;
        return 0;
    });

    container.innerHTML = countries.slice(0, 5).map((c, i) => {
        let val = '';
        if (metric === 'gdp') val = `$${c.simGdp.toFixed(1)}B`;
        if (metric === 'influence') val = `${c.influence}/100`;
        if (metric === 'resources') val = c.resScore > 10 ? 'CRÍTICO' : 'ALTO';
        
        return `
            <div style="display:flex; justify-content:space-between; padding:5px 0; border-bottom:1px solid rgba(0,229,255,0.1);">
                <span>${i+1}. ${c.name}</span>
                <span style="color:var(--cyan)">${val}</span>
            </div>
        `;
    }).join('');
}

function updateSim() {
    const scenario = uiEls.scenario ? uiEls.scenario.value : 'realist';
    const phase = uiEls.phase ? uiEls.phase.value : 'phase1';

    // Resetear multiplicadores
    currentMultipliers = { gdp: 1.0, unemp: 1.0, fdi: 1.0, inflation: 1.0, gini: 0 };
    let influenceBase = 68;

    // Escenarios Dinámicos
    if (scenario === 'optimist') { 
        currentMultipliers.gdp *= 1.40; 
        currentMultipliers.unemp *= 0.60; 
        currentMultipliers.fdi *= 1.80;
        currentMultipliers.inflation *= 0.85;
        currentMultipliers.gini = -0.06;
        influenceBase += 20; 
    }
    if (scenario === 'crisis') { 
        currentMultipliers.gdp *= 0.70; 
        currentMultipliers.unemp *= 1.60; 
        currentMultipliers.fdi *= 0.30;
        currentMultipliers.inflation *= 1.40;
        currentMultipliers.gini = 0.05;
        influenceBase -= 30; 
    }

    // Fases Temporales (Impacto acumulativo)
    if (phase === 'phase2') { 
        currentMultipliers.gdp *= 1.25; 
        currentMultipliers.fdi *= 1.30;
        influenceBase += 10; 
    }
    if (phase === 'phase3') { 
        currentMultipliers.gdp *= 1.60; 
        currentMultipliers.fdi *= 2.0;
        currentMultipliers.unemp *= 0.80;
        influenceBase += 35; 
    }

    let gdpTotal = 0;
    let popTotal = 0;
    let unempWeighted = 0;

    Object.values(LATAM_COUNTRIES).forEach(c => {
        const countryGDP = c.gdpRaw * currentMultipliers.gdp;
        gdpTotal += countryGDP;
        const pop = c.population * 1e6;
        popTotal += pop;
        unempWeighted += (c.unempRaw * currentMultipliers.unemp) * pop;
    });

    const gdpBillones = gdpTotal / 1000;
    const perCapita = (gdpTotal * 1e9) / (popTotal / 1e6);
    const unemp = unempWeighted / popTotal;
    
    const unionInfluence = Math.min(influenceBase + (gdpBillones * 3.0), 100);

    uiEls.gdpVal.innerText = '$' + gdpBillones.toFixed(2) + ' Billones';
    uiEls.pibCapitaVal.innerText = '$' + Math.round(perCapita).toLocaleString('es') + ' USD';
    uiEls.unempVal.innerText = Math.max(unemp, 1.1).toFixed(1) + '%';
    uiEls.infVal.innerText = Math.round(unionInfluence) + '/100';

    updateResourceBars();
    updateTimelineVisuals();
    updateRanking();
}

function updateTimelineVisuals() {
    const phase = uiEls.phase ? uiEls.phase.value : 'phase1';
    const phaseNum = parseInt(phase.replace('phase', ''));

    // 1. Filtrar Infraestructura por Fase
    d3.selectAll(".layer-infra").style("visibility", d => (d.phase && d.phase <= phaseNum) ? "visible" : "hidden");

    // 2. Escalar Peso Industrial (Simula crecimiento de polos)
    d3.selectAll(".layer-industria")
        .transition().duration(600)
        .attr("width", 10 + (phaseNum - 1) * 5)
        .attr("height", 10 + (phaseNum - 1) * 5)
        .attr("x", d => {
            const [x, y] = projection([d.lon, d.lat]);
            return x - (10 + (phaseNum - 1) * 5) / 2;
        })
        .attr("y", d => {
            const [x, y] = projection([d.lon, d.lat]);
            return y - (10 + (phaseNum - 1) * 5) / 2;
        });

    // 3. Intensidad de Comercio (Simula densidad de flujos)
    d3.selectAll(".layer-flows")
        .transition().duration(600)
        .attr("stroke-width", d => {
            const base = Math.max(2, Math.sqrt(d.volume) / 40);
            return base * (1 + (phaseNum - 1) * 0.4);
        })
        .attr("stroke-opacity", 0.4 + (phaseNum * 0.15));
}

function updateResourceBars() {
    let lithium = 0, oil = 0, water = 0, renew = 0;
    Object.values(LATAM_COUNTRIES).forEach(c => {
        lithium += (c.lithium || 0);
        oil += (c.oil || 0);
        water += (c.water || 0);
        renew += (c.renew || 0);
    });

    // Normalización para las barras de la unión (Valores máximos teóricos agregados)
    const setBar = (id, val, max, labelId, labelText) => {
        const el = document.getElementById(id);
        const lbl = document.getElementById(labelId);
        if (el) el.style.width = Math.min((val / max) * 100, 100) + '%';
        if (lbl) lbl.innerText = labelText;
    };

    setBar('bar-li', lithium, 50, 'lbl-li', lithium.toFixed(1) + ' Mt');
    setBar('bar-oil', oil, 5, 'lbl-oil', oil.toFixed(2) + ' Mbd');
    setBar('bar-water', water, 30, 'lbl-water', water.toFixed(1) + '% Global');
    setBar('bar-renew', renew, 150, 'lbl-renew', 'POTENCIAL ALTO');
}

// --- MAPA D3.JS INTERACTIVO ---
const svg = d3.select("#map-svg");
const tooltip = d3.select("#tooltip");

const projection = d3.geoMercator()
    .center([-70, -15])
    .scale(400)
    .translate([
        (svg.node().parentNode.clientWidth || 900) / 2,
        (svg.node().parentNode.clientHeight || 700) / 2
    ]);

const path = d3.geoPath().projection(projection);

// --- GESTOR DE DATOS UNIFICADOS ---
// Esta función busca todos los elementos (FDI, Industria, etc.) cerca de una coordenada
function getAllDataAt(lon, lat, radius = 0.8) {
    const data = {
        fdi: layerData.fdi.filter(d => Math.hypot(d.lon - lon, d.lat - lat) < radius),
        tech: layerData.tech.filter(d => Math.hypot(d.lon - lon, d.lat - lat) < radius),
        res: layerData.res.filter(d => Math.hypot(d.lon - lon, d.lat - lat) < radius),
        industria: layerData.industria.filter(d => Math.hypot(d.lon - lon, d.lat - lat) < radius),
        strategic: layerData.strategic.filter(d => Math.hypot(d.lon - lon, d.lat - lat) < radius),
        flows: layerData.flows.filter(d => 
            Math.hypot(d.p1.lon - lon, d.p1.lat - lat) < radius || 
            Math.hypot(d.p2.lon - lon, d.p2.lat - lat) < radius
        )
    };
    return data;
}

// Arrow marker for flows
svg.append("defs").append("marker")
    .attr("id", "arrow")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 8)
    .attr("refY", 0)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M0,-5L10,0L0,5")
    .attr("fill", "#ff00ff");

const g = svg.append("g");

const latamIds = Object.keys(LATAM_COUNTRIES).map(Number);

// Caché de elementos del mapa para redimensionamiento
let mapCache = {
    paths: null,
    capitals: null,
    keys: null,
    fdi: null,
    tech: null,
    res: null,
    defensa: null,
    strategic: null,
    infra: null,
    flows: null,
    industria: null,
    bonus: null
};

// --- RENDERIZADO DE LISTAS ---
function renderSidebarLists() {
    const categories = { 'caribe': 'list-caribe', 'nortecentro': 'list-nortecentro', 'sur': 'list-sur' };
    Object.keys(categories).forEach(regKey => {
        const container = document.getElementById(categories[regKey]);
        if (!container) return;
        const filtered = Object.entries(LATAM_COUNTRIES).filter(c => c[1].region === regKey);
        container.innerHTML = filtered.map(([id, c]) => `
                    <div class="region-item" 
                         onclick="handleCountryClick(${id})"
                         onmouseover="handleSidebarHover(event, ${id})" 
                         onmousemove="moveTooltip(event)" 
                         onmouseout="handleSidebarOut()">
                        <span>${c.name}</span>
                        <span style="color:var(--cyan); font-size:9px; opacity:0.6;">${c.capital}</span>
                    </div>
                `).join('');
    });
}

// --- RÁPIDA DEFINICIÓN DE highlight-compare en style.css si no existe ---
// (Lo haré mediante d3.select por ahora para no saturar el flujo de archivos, 
// pero lo ideal es añadirlo a style.css)

// --- REEMPLAZO DEL BLOQUE DE CARGA DEL MAPA ---
d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json").then(data => {
    const countries = topojson.feature(data, data.objects.countries);

    // Dibujar mapa base
    g.selectAll("path")
        .data(countries.features)
        .enter().append("path")
        .attr("d", path)
        .attr("class", d => latamIds.includes(Number(d.id)) ? "country latam" : "country")
        .attr("id", d => "country-" + Number(d.id))
        .on("click", (e, d) => {
            const id = Number(d.id);
            if (latamIds.includes(id)) handleCountryClick(id);
        });

    // 1. Dibujar Capas (Invisibles inicialmente)
    const layersGroup = g.append("g").attr("id", "dynamic-layers");

    // Población de caché para optimización
    mapCache.paths = g.selectAll("path");

    // Capa Inversión Extranjera (FDI)
    layersGroup.selectAll(".layer-fdi-node")
        .data(layerData.fdi).enter().append("circle")
        .attr("class", "layer-fdi")
        .attr("cx", d => { d.coords = projection([d.lon, d.lat]); return d.coords[0]; })
        .attr("cy", d => d.coords[1])
        .attr("r", 4)
        .attr("fill", "var(--accent-red)")
        .attr("stroke", "#fff").attr("stroke-width", 0.5)
        .on("mouseover", (e, d) => showSimpleTooltip(e, d.name, `Origen: <span style="color:var(--cyan)">${d.origin}</span>`))
        .on("mouseout", hideTooltip);

    // Capa Zonas Francas
    layersGroup.selectAll(".layer-tech-node")
        .data(layerData.tech).enter().append("rect")
        .attr("class", "layer-tech")
        .attr("x", d => { d.coords = projection([d.lon, d.lat]); return d.coords[0] - 4; })
        .attr("y", d => d.coords[1] - 4)
        .attr("width", 8).attr("height", 8)
        .attr("fill", "var(--accent-purple)")
        .attr("stroke", "#fff").attr("stroke-width", 0.5)
        .on("mouseover", (e, d) => showSimpleTooltip(e, d.name, "Polo Tecnológico"))
        .on("mouseout", hideTooltip);

    // Capa Recursos Estratégicos
    layersGroup.selectAll(".layer-res-node")
        .data(layerData.res).enter().append("polygon")
        .attr("class", "layer-res")
        .attr("points", d => {
            const [x, y] = projection([d.lon, d.lat]);
            return `${x},${y - 6} ${x - 5},${y + 4} ${x + 5},${y + 4}`;
        })
        .attr("fill", "var(--accent-orange)")
        .attr("stroke", "#fff").attr("stroke-width", 0.5)
        .on("mouseover", (e, d) => showSimpleTooltip(e, d.name, "Complejo Extractivo"))
        .on("mouseout", hideTooltip);

    // Capa Industria (Engranajes/Rectángulos Industriales)
    layersGroup.selectAll(".layer-industria-node")
        .data(layerData.industria).enter().append("rect")
        .attr("class", "layer-industria")
        .attr("x", d => { d.coords = projection([d.lon, d.lat]); return d.coords[0] - 5; })
        .attr("y", d => d.coords[1] - 5)
        .attr("width", 10).attr("height", 10)
        .attr("fill", "var(--accent-industry)")
        .attr("stroke", "#000").attr("stroke-width", 0.5)
        .attr("rx", 1)
        .on("mouseover", (e, d) => showSimpleTooltip(e, d.name, `Polo Industrial: <span style="color:var(--accent-industry)">${d.type}</span>`))
        .on("mouseout", hideTooltip);

    // Capa Defensa (Rombos)
    layersGroup.selectAll(".layer-defensa-node")
        .data(layerData.defensa).enter().append("polygon")
        .attr("class", "layer-defensa")
        .attr("points", d => {
            const [x, y] = projection([d.lon, d.lat]);
            return `${x},${y - 5} ${x + 5},${y} ${x},${y + 5} ${x - 5},${y}`;
        })
        .attr("fill", "var(--accent-blue)")
        .attr("stroke", "#fff").attr("stroke-width", 0.5)
        .on("mouseover", (e, d) => showSimpleTooltip(e, d.name, "Aeroespacial/Defensa"))
        .on("mouseout", hideTooltip);

    // Capa Recursos Estratégicos Globales
    layersGroup.selectAll(".layer-strategic-node")
        .data(layerData.strategic).enter().append("circle")
        .attr("class", "layer-strategic")
        .attr("cx", d => { d.coords = projection([d.lon, d.lat]); return d.coords[0]; })
        .attr("cy", d => d.coords[1])
        .attr("r", 5)
        .attr("fill", d => {
            if (d.type === 'lithium') return '#00bfff';
            if (d.type === 'oil') return '#222';
            if (d.type === 'water') return '#00ffff';
            if (d.type === 'solar') return '#ffd700';
            if (d.type === 'wind') return '#fff';
            return '#fff';
        })
        .attr("stroke", "var(--cyan)").attr("stroke-width", 1)
        .on("mouseover", (e, d) => showSimpleTooltip(e, d.name, "Recurso Estratégico"))
        .on("mouseout", hideTooltip);

    // Capa Infraestructura (Puertos y Corredores)
    layersGroup.selectAll(".layer-infra-port")
        .data(layerData.infra.filter(d => d.type === 'port')).enter().append("rect")
        .attr("class", "layer-infra layer-infra-port")
        .attr("x", d => { d.coords = projection([d.lon, d.lat]); return d.coords[0] - 4; })
        .attr("y", d => d.coords[1] - 4)
        .attr("width", 8).attr("height", 8)
        .attr("fill", "#aaa")
        .attr("stroke", "#000").attr("stroke-width", 1)
        .on("mouseover", (e, d) => showSimpleTooltip(e, d.name, "Infraestructura Portuaria"))
        .on("mouseout", hideTooltip);

    layersGroup.selectAll(".layer-infra-corridor")
        .data(layerData.infra.filter(d => d.type === 'corridor')).enter().append("line")
        .attr("class", "layer-infra layer-infra-corridor")
        .attr("x1", d => { d.p1_proj = projection([d.p1.lon, d.p1.lat]); return d.p1_proj[0]; })
        .attr("y1", d => d.p1_proj[1])
        .attr("x2", d => { d.p2_proj = projection([d.p2.lon, d.p2.lat]); return d.p2_proj[0]; })
        .attr("y2", d => d.p2_proj[1])
        .attr("stroke", d => d.phase === 3 ? "var(--cyan)" : "#aaa")
        .attr("stroke-width", d => d.phase === 3 ? 4 : 3)
        .attr("stroke-dasharray", d => d.phase === 3 ? "none" : "5,5")
        .on("mouseover", (e, d) => showSimpleTooltip(e, d.name, `Eje de Infraestructura (Fase ${d.phase})`))
        .on("mouseout", hideTooltip);

    // Capa Flujos Económicos (Comercio e Integración)
    layersGroup.selectAll(".layer-flows-arrow")
        .data(layerData.flows).enter().append("line")
        .attr("class", "layer-flows")
        .attr("x1", d => { d.p1_proj = projection([d.p1.lon, d.p1.lat]); return d.p1_proj[0]; })
        .attr("y1", d => d.p1_proj[1])
        .attr("x2", d => { d.p2_proj = projection([d.p2.lon, d.p2.lat]); return d.p2_proj[0]; })
        .attr("y2", d => d.p2_proj[1])
        .attr("stroke", d => {
            if (d.type === 'industrial') return '#00ff88';
            if (d.type === 'tech') return '#00e5ff';
            if (d.type === 'primario') return '#ffcc00';
            return '#fff';
        })
        .attr("stroke-width", d => Math.max(2, Math.sqrt(d.volume) / 40))
        .attr("stroke-opacity", 0.7)
        .attr("marker-end", "url(#arrow)")
        .on("mouseover", (e, d) => {
            const scenario = document.getElementById('sim-scenario').value;
            const multiplier = scenario === 'optimist' ? 1.6 : (scenario === 'crisis' ? 0.3 : 1);
            const vol = (d.volume * multiplier).toFixed(0);
            const impact = scenario === 'optimist' ? 
                '<span style="color:var(--neon-green)">Arancel 0%: Mercado Común Activo</span>' : 
                'Relaciones comerciales estándar';
            
            const html = `
                <div style="font-size:11px; margin-bottom:4px; color:var(--cyan)">${d.name}</div>
                <div class="tt-row"><span>Tipo:</span> <span class="tt-val">${d.type.toUpperCase()}</span></div>
                <div class="tt-row"><span>Volumen:</span> <span class="tt-val">$${vol}M USD</span></div>
                <div style="font-size:9px; margin-top:5px; border-top:1px solid rgba(255,255,255,0.1); padding-top:4px;">${impact}</div>
            `;
            showSimpleTooltip(e, "INTEGRACIÓN COMERCIAL", html);
        })
        .on("mouseout", hideTooltip);

    // Capa Zonas Especiales (Bonus)
    layersGroup.selectAll(".layer-bonus-node")
        .data(layerData.bonus).enter().append("circle")
        .attr("class", "layer-bonus")
        .attr("cx", d => { d.coords = projection([d.lon, d.lat]); return d.coords[0]; })
        .attr("cy", d => d.coords[1])
        .attr("r", 6)
        .attr("fill", "transparent")
        .attr("stroke", d => d.type === 'conflict' ? '#ff0000' : (d.type === 'protected' ? '#00ff00' : '#ffff00'))
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "2,2")
        .on("mouseover", (e, d) => showSimpleTooltip(e, d.name, d.type === 'conflict' ? "Zona de Conflicto" : (d.type === 'protected' ? "Área Protegida" : "Integración")))
        .on("mouseout", hideTooltip);

    // 2. Dibujar Capitales Regionales (24 Regiones)
    g.selectAll(".capital-dot")
        .data(Object.entries(LATAM_COUNTRIES))
        .enter().append("circle")
        .attr("class", "capital-dot")
        .attr("cx", d => { d.coords = projection([d[1].lon, d[1].lat]); return d.coords[0]; })
        .attr("cy", d => d.coords[1])
        .attr("r", 2.5)
        .on("mouseover", (e, d) => {
            highlightCountry(Number(d[0]));
            showCountryTooltip(e, d[1]);
        })
        .on("mousemove", moveTooltip)
        .on("mouseout", () => {
            resetHighlight();
            hideTooltip();
        });

    // 3. Dibujar Nodos Clave Globales (Encima de todo)
    g.selectAll(".key-point")
        .data(keyNodes)
        .enter().append("circle")
        .attr("class", "key-point")
        .attr("cx", d => projection([d.lon, d.lat])[0])
        .attr("cy", d => projection([d.lon, d.lat])[1])
        .attr("r", d => d.tier === 1 ? 6.5 : 4.5)
        .on("mouseover", showNodeTooltip)
        .on("mousemove", moveTooltip)
        .on("mouseout", hideTooltip);

    // Poblar el resto del caché
    mapCache.capitals = g.selectAll(".capital-dot");
    mapCache.keys = g.selectAll(".key-point");
    mapCache.fdi = layersGroup.selectAll(".layer-fdi");
    mapCache.tech = layersGroup.selectAll(".layer-tech");
    mapCache.res = layersGroup.selectAll(".layer-res");
    mapCache.defensa = layersGroup.selectAll(".layer-defensa");
    mapCache.tav = layersGroup.selectAll(".layer-tav");
    mapCache.strategic = layersGroup.selectAll(".layer-strategic");
    mapCache.infra = layersGroup.selectAll(".layer-infra");
    mapCache.flows = layersGroup.selectAll(".layer-flows");
    mapCache.industria = layersGroup.selectAll(".layer-industria");
    mapCache.bonus = layersGroup.selectAll(".layer-bonus");

    // Ejecutar un primer cálculo de posiciones para evitar saltos
    window.dispatchEvent(new Event('resize'));
}).catch(err => console.error("Error al cargar el mapa:", err));

// --- FUNCIONES INTERACTIVAS ---

let currentTooltipRect = null;

function getCorePeripheryLevel(c) {
    // Criterios: PIB per cápita, Coeficiente de Gini y Nivel Industrial (% Sector Secundario)
    const pc = c.gdpCapitaRaw;
    const gini = c.gini;
    const industry = c.sec ? c.sec[1] : 0;
    
    // Núcleo (Core): Alto ingreso Y (Baja desigualdad O Potencia Industrial)
    if (pc > 15000 && (gini < 0.43 || industry > 28)) return 'core'; 
    
    // Semiperiferia (Transición): Ingreso medio O desarrollo industrial moderado
    if (pc > 8500 || industry > 20 || gini < 0.45) return 'semi'; 
    
    // Periferia: Bajos ingresos y baja industrialización
    return 'periphery'; 
}

// --- TOOLTIP UNIFICADO ---
function showUniversalTooltip(e, lon, lat, fallbackTitle, fallbackSubtitle) {
    const country = Object.values(LATAM_COUNTRIES).find(c => Math.hypot(c.lon - lon, c.lat - lat) < 0.8);
    const node = keyNodes.find(n => Math.hypot(n.lon - lon, n.lat - lat) < 0.8);
    const extraData = getAllDataAt(lon, lat);
    const activeTargets = Array.from(document.querySelectorAll('.toggle-btn.active')).map(b => b.dataset.target);

    let html = '';
    
    if (country) {
        const inf = calculateInfluenceIndex(country);
        const simGDP = (country.gdpRaw * currentMultipliers.gdp).toFixed(1);
        const simPC = Math.round(country.gdpCapitaRaw * currentMultipliers.gdp);
        const simInf = (parseFloat(country.inflation) * currentMultipliers.inflation).toFixed(1);
        const simUnemp = Math.max(1.1, country.unempRaw * currentMultipliers.unemp).toFixed(1);

        html += `
            <div class="tt-header">${country.name.toUpperCase()} <span style="float:right; color:var(--accent-orange)">${inf}/100</span></div>
            <div style="font-size:9px; color:var(--text-muted); margin-bottom:8px; border-bottom:1px solid rgba(0,229,255,0.2); padding-bottom:4px;">
                Capital: <span style="color:var(--cyan)">${country.capital}</span> | Infl. Global
            </div>
            
            <div class="tt-grid">
                <div class="tt-col">
                    <div class="tt-sec-title">MACROECONOMÍA (SIM)</div>
                    <div class="tt-row"><span>PIB:</span> <span class="tt-val" style="color:var(--accent-orange)">$${simGDP}B</span></div>
                    <div class="tt-row"><span>Per Cápita:</span> <span class="tt-val">$${simPC.toLocaleString()}</span></div>
                    <div class="tt-row"><span>Inflación:</span> <span class="tt-val" style="color:#ff5555">${simInf}%</span></div>
                    <div class="tt-row"><span>Desempleo:</span> <span class="tt-val">${simUnemp}%</span></div>
                </div>
                <div class="tt-col">
                    <div class="tt-sec-title">DEMOGRAFÍA</div>
                    <div class="tt-row"><span>Población:</span> <span class="tt-val">${country.population}M</span></div>
                    <div class="tt-row"><span>Densidad:</span> <span class="tt-val">${country.density} h/km²</span></div>
                    <div class="tt-row"><span>Urbanización:</span> <span class="tt-val">${country.urban}%</span></div>
                </div>
            </div>

            <div class="tt-grid">
                <div class="tt-col">
                    <div class="tt-sec-title">DESIGUALDAD</div>
                    <div class="tt-row"><span>Gini:</span> <span class="tt-val">${country.gini}</span></div>
                    <div class="tt-row"><span>Palma:</span> <span class="tt-val">${country.palma}</span></div>
                    <div class="tt-row"><span>Pobreza:</span> <span class="tt-val" style="color:var(--accent-orange)">${country.poverty}%</span></div>
                </div>
                <div class="tt-col">
                    <div class="tt-sec-title">DESARROLLO (IDH)</div>
                    <div class="tt-row"><span>IDH:</span> <span class="tt-val">${country.hdi}</span></div>
                    <div class="tt-row"><span>Escolaridad:</span> <span class="tt-val">${country.edu} años</span></div>
                    <div class="tt-row"><span>Internet:</span> <span class="tt-val">${country.internet}%</span></div>
                </div>
            </div>

            <div class="tt-section">
                <div class="tt-sec-title">ESTRUCTURA PRODUCTIVA</div>
                <div style="font-size:9px; margin-bottom:4px;">
                    Sectores: <span style="color:#aaa">P:${country.sec[0]}% | S:${country.sec[1]}% | T:${country.sec[2]}%</span>
                </div>
                <div class="tt-row"><span>Exports:</span> <span class="tt-val" style="font-size:8.5px; color:var(--cyan)">${country.exports.join(', ')}</span></div>
                <div class="tt-row"><span>Dep. Commodities:</span> <span class="tt-val">${country.commDep}%</span></div>
            </div>

            <div class="tt-grid">
                <div class="tt-col">
                    <div class="tt-sec-title">RECURSOS</div>
                    ${country.lithium > 0 ? `<div class="tt-row"><span>Litio:</span> <span class="tt-val">${country.lithium}Mt</span></div>` : ''}
                    ${country.oil > 0 ? `<div class="tt-row"><span>Petróleo:</span> <span class="tt-val">${country.oil}Mbd</span></div>` : ''}
                    <div class="tt-row"><span>Agua:</span> <span class="tt-val">${country.water}% glob</span></div>
                </div>
                <div class="tt-col">
                    <div class="tt-sec-title">INFRAESTR.</div>
                    <div class="tt-row"><span>LPI:</span> <span class="tt-val">${country.lpi}</span></div>
                    <div class="tt-row"><span>Puerto:</span> <span class="tt-val">${country.port}/10</span></div>
                    <div class="tt-row"><span>Energía:</span> <span class="tt-val">${country.energy}GW</span></div>
                </div>
            </div>
        `;
    } else if (node) {
        html += `
            <div class="tt-header">${node.name}</div>
            <div class="tt-row"><span class="tt-label">Rol:</span> <span class="tt-val" style="color:var(--cyan);">${node.role}</span></div>
            <div class="tt-row"><span class="tt-label">Espec.:</span> <span class="tt-val">${node.spec}</span></div>
        `;
    } else {
        html += `<div class="tt-header">${fallbackTitle || 'Punto de Interés'}</div><div style="color:var(--text-muted); font-size:10px;">${fallbackSubtitle || ''}</div>`;
    }

    // Agregar Secciones de Capas
    if (activeTargets.includes('fdi') && extraData.fdi.length > 0) {
        html += `<div class="tt-section"><div class="tt-sec-title" style="color:var(--accent-red)">INVERSIONES</div>${extraData.fdi.map(d => `• ${d.name}`).join('<br>')}</div>`;
    }
    if (activeTargets.includes('industria') && extraData.industria.length > 0) {
        html += `<div class="tt-section"><div class="tt-sec-title" style="color:var(--accent-industry)">INDUSTRIA</div>${extraData.industria.map(d => `• ${d.name}`).join('<br>')}</div>`;
    }
    if (activeTargets.includes('tech') && extraData.tech.length > 0) {
        html += `<div class="tt-section"><div class="tt-sec-title" style="color:var(--accent-purple)">TECNOLOGÍA / I+D</div>${extraData.tech.map(d => `• ${d.name}`).join('<br>')}</div>`;
    }
    if (activeTargets.includes('res') && extraData.res.length > 0) {
        html += `<div class="tt-section"><div class="tt-sec-title" style="color:var(--accent-orange)">EXTRACCIÓN</div>${extraData.res.map(d => `• ${d.name}`).join('<br>')}</div>`;
    }
    if (activeTargets.includes('strategic') && extraData.strategic.length > 0) {
        html += `<div class="tt-section"><div class="tt-sec-title" style="color:var(--cyan)">ZONAS ESTRATÉGICAS</div>${extraData.strategic.map(d => `• ${d.name}`).join('<br>')}</div>`;
    }
    if (activeTargets.includes('flows') && extraData.flows.length > 0) {
        html += `<div class="tt-section"><div class="tt-sec-title" style="color:var(--neon-green)">EJES DE INTEGRACIÓN</div>${extraData.flows.map(d => `• ${d.name} (${d.type})`).join('<br>')}</div>`;
    }

    tooltip.html(html);
    tooltip.style("display", "block");
    currentTooltipRect = tooltip.node().getBoundingClientRect();
    moveTooltip(e);
}

function handleSidebarHover(e, id) {
    const c = LATAM_COUNTRIES[id];
    highlightCountry(id);
    showUniversalTooltip(e, c.lon, c.lat);
}

function handleSidebarOut() {
    resetHighlight();
    hideTooltip();
}

function showCountryTooltip(e, c) {
    showUniversalTooltip(e, c.lon, c.lat);
}

function showNodeTooltip(e, d) {
    showUniversalTooltip(e, d.lon, d.lat);
}

function showSimpleTooltip(e, title, subtitle) {
    const d = d3.select(e.target).datum();
    if (d && d.lat && d.lon) {
        showUniversalTooltip(e, d.lon, d.lat, title, subtitle);
    } else {
        tooltip.html(`
            <div class="tt-header" style="font-size:12px; margin-bottom:5px;">${title}</div>
            <div style="color:var(--text-muted); font-size:10px;">${subtitle}</div>
        `);
        tooltip.style("display", "block");
        currentTooltipRect = tooltip.node().getBoundingClientRect();
        moveTooltip(e);
    }
}

function moveTooltip(e) {
    if (!currentTooltipRect) return;
    
    const wWidth = window.innerWidth;
    const wHeight = window.innerHeight;
    const ttWidth = currentTooltipRect.width;
    const ttHeight = currentTooltipRect.height;

    // Detectar Sidebar Izquierdo (Ancho: 320px)
    const sidebarLeft = document.getElementById('col-side');
    const isLeftClosed = sidebarLeft ? sidebarLeft.classList.contains('sidebar-closed') : true;
    const leftWidth = isLeftClosed ? 0 : 320;

    // Detectar Panel Derecho (Ancho: 320px)
    const sidebarRight = document.getElementById('right-panel');
    const rightWidth = sidebarRight ? 320 : 0; // Por ahora el derecho es fijo

    // Posición ideal: a la derecha y abajo del cursor
    let x = e.pageX + 20;
    let y = e.pageY + 20;

    // Lógica de "Choque" Lateral:
    // Evitar que se salga por la derecha (contra el panel derecho)
    if (x + ttWidth > wWidth - rightWidth - 10) {
        x = wWidth - rightWidth - ttWidth - 10;
    }

    // Si al empujarlo a la izquierda choca con el cursor (mitad derecha de la pantalla libre)
    if (x < e.pageX + 10 && e.pageX > (wWidth - leftWidth - rightWidth) / 2 + leftWidth) {
        x = e.pageX - ttWidth - 20;
    }

    // Choque con borde inferior
    if (y + ttHeight > wHeight - 10) {
        y = wHeight - ttHeight - 10;
    }
    
    // Si choca con el cursor abajo
    if (y < e.pageY + 10 && e.pageY > wHeight / 2) {
        y = e.pageY - ttHeight - 20;
    }

    // Asegurar límites finales absolutos (Entre ambos paneles)
    x = Math.max(leftWidth + 10, Math.min(x, wWidth - rightWidth - ttWidth - 10));
    y = Math.max(10, Math.min(y, wHeight - ttHeight - 10));
    
    tooltip.style("left", x + "px").style("top", y + "px");
}

function hideTooltip() {
    tooltip.style("display", "none");
    currentTooltipRect = null;
}

function toggleLayer(element) {
    element.classList.toggle('active');
    const target = element.getAttribute('data-target');
    const isActive = element.classList.contains('active');
    d3.selectAll(`.layer-${target}`).classed('layer-active', isActive);
}

function highlightCountry(id) {
    d3.selectAll(".country").classed("highlight", false);
    d3.select(`#country-${id}`).classed("highlight", true);
}

function resetHighlight() {
    d3.selectAll(".country").classed("highlight", false);
}

function toggleSidebar() {
    const sidebar = document.getElementById('col-side');
    sidebar.classList.toggle('sidebar-closed');
    setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
    }, 300);
}

function changeMapMode(mode) {
    const descEl = document.getElementById('map-mode-description');
    const descriptions = {
        'normal': 'Visualización estándar: División política regional y principales nodos de integración urbana.',
        'heatmap-gdp': 'Mapa de Calor (PIB): Representa la concentración de riqueza por volumen económico absoluto en Billones USD.',
        'heatmap-inflation': 'Mapa de Riesgo (Inflación): Identifica la estabilidad de precios; tonos cálidos indican mayor riesgo monetario.',
        'inequality': 'Mapa de Desarrollo: Clasificación por IDH (Índice de Desarrollo Humano) - Verde (Alto), Amarillo (Medio), Rojo (Bajo).',
        'structural-inequality': 'Desigualdad Estructural: Clasificación en Núcleo (Verde), Semiperiferia (Amarillo) y Periferia (Rojo) según PIB pc, Gini e Industria.'
    };
    if (descEl) descEl.innerText = descriptions[mode] || '';

    // 1. Limpiar estados previos
    d3.selectAll(".country")
        .classed("dev-high", false)
        .classed("dev-medium", false)
        .classed("dev-low", false)
        .transition().duration(500)
        .style("fill", null);

    if (mode === "normal") return;

    if (mode === "inequality") {
        d3.selectAll(".country").each(function (d) {
            const countryId = Number(d.id);
            if (LATAM_COUNTRIES[countryId]) {
                const devLevel = LATAM_COUNTRIES[countryId].devLevel;
                d3.select(this).classed(`dev-${devLevel}`, true);
            }
        });
    } else if (mode === "structural-inequality") {
        d3.selectAll(".country.latam").each(function (d) {
            const countryId = Number(d.id);
            if (LATAM_COUNTRIES[countryId]) {
                const level = getCorePeripheryLevel(LATAM_COUNTRIES[countryId]);
                let color = "#ff4444"; // Periferia (Rojo)
                if (level === 'core') color = "#00ff88"; // Núcleo (Verde)
                if (level === 'semi') color = "#ffcc00"; // Semiperiferia (Amarillo)
                d3.select(this).transition().duration(500).style("fill", color);
            }
        });
    } else if (mode === "heatmap-gdp") {
        const values = Object.values(LATAM_COUNTRIES).map(c => c.gdpRaw);
        const colorScale = d3.scaleSequential(d3.interpolateBlues)
            .domain([0, d3.max(values)]);

        d3.selectAll(".country.latam").each(function (d) {
            const countryId = Number(d.id);
            if (LATAM_COUNTRIES[countryId]) {
                const val = LATAM_COUNTRIES[countryId].gdpRaw;
                d3.select(this).transition().duration(500)
                    .style("fill", colorScale(val));
            }
        });
    } else if (mode === "heatmap-inflation") {
        const values = Object.values(LATAM_COUNTRIES).map(c => parseFloat(c.inflation));
        const colorScale = d3.scaleSequential(d3.interpolateYlOrRd).domain([0, 20]);

        d3.selectAll(".country.latam").each(function (d) {
            const countryId = Number(d.id);
            if (LATAM_COUNTRIES[countryId]) {
                const val = parseFloat(LATAM_COUNTRIES[countryId].inflation);
                d3.select(this).transition().duration(500)
                    .style("fill", colorScale(val));
            }
        });
    }
}

// Ajustar mapa en redimensionamiento
let resizeFrame;
window.addEventListener('resize', () => {
    if (resizeFrame) cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => {
        const container = d3.select(".col-center").node();
        if (!container) return;

        const width = container.clientWidth;
        const height = container.clientHeight;

        projection.translate([width / 2, height / 2]);

        // Helper para snap — devuelve { pos: [x,y], snapped: boolean }
        const getSnappedPos = (lon, lat) => {
            const snapRadius = 0.8;
            const country = Object.values(LATAM_COUNTRIES).find(c => Math.hypot(c.lon - lon, c.lat - lat) < snapRadius);
            if (country) return { pos: projection([country.lon, country.lat]), snapped: true };
            const node = keyNodes.find(n => Math.hypot(n.lon - lon, n.lat - lat) < snapRadius);
            if (node) return { pos: projection([node.lon, node.lat]), snapped: true };
            return { pos: projection([lon, lat]), snapped: false };
        };

        // 1. PUNTOS FIJOS
        if (mapCache.keys) mapCache.keys.each(function(d) {
            const [x, y] = projection([d.lon, d.lat]);
            d3.select(this).attr("cx", x).attr("cy", y);
        });

        if (mapCache.capitals) mapCache.capitals.each(function(d) {
            const [x, y] = projection([d[1].lon, d[1].lat]);
            d3.select(this).attr("cx", x).attr("cy", y);
        });

        // 2. CAPAS DINÁMICAS
        if (mapCache.paths) mapCache.paths.attr("d", path);

        if (mapCache.fdi) mapCache.fdi.each(function(d) {
            const { pos: [x, y], snapped } = getSnappedPos(d.lon, d.lat);
            d3.select(this).attr("cx", x).attr("cy", y)
                .style("pointer-events", snapped ? "none" : null);
        });

        if (mapCache.tech) mapCache.tech.each(function(d) {
            const { pos: [x, y], snapped } = getSnappedPos(d.lon, d.lat);
            d3.select(this).attr("x", x - 4).attr("y", y - 4)
                .style("pointer-events", snapped ? "none" : null);
        });

        if (mapCache.res) mapCache.res.each(function(d) {
            const { pos: [x, y], snapped } = getSnappedPos(d.lon, d.lat);
            d3.select(this).attr("points", `${x},${y - 6} ${x - 5},${y + 4} ${x + 5},${y + 4}`)
                .style("pointer-events", snapped ? "none" : null);
        });

        if (mapCache.industria) mapCache.industria.each(function(d) {
            const { pos: [x, y], snapped } = getSnappedPos(d.lon, d.lat);
            d3.select(this).attr("x", x - 5).attr("y", y - 5)
                .style("pointer-events", snapped ? "none" : null);
        });

        if (mapCache.defensa) mapCache.defensa.each(function(d) {
            const { pos: [x, y], snapped } = getSnappedPos(d.lon, d.lat);
            d3.select(this).attr("points", `${x},${y - 5} ${x + 5},${y} ${x},${y + 5} ${x - 5},${y}`)
                .style("pointer-events", snapped ? "none" : null);
        });

        if (mapCache.strategic) mapCache.strategic.each(function(d) {
            const { pos: [x, y], snapped } = getSnappedPos(d.lon, d.lat);
            d3.select(this).attr("cx", x).attr("cy", y)
                .style("pointer-events", snapped ? "none" : null);
        });

        if (mapCache.infra) mapCache.infra.each(function (d) {
            const el = d3.select(this);
            if (d.type === 'port') {
                const { pos: [x, y], snapped } = getSnappedPos(d.lon, d.lat);
                el.attr("x", x - 4).attr("y", y - 4)
                  .style("pointer-events", snapped ? "none" : null);
            } else if (d.type === 'corridor') {
                const p1 = projection([d.p1.lon, d.p1.lat]);
                const p2 = projection([d.p2.lon, d.p2.lat]);
                el.attr("x1", p1[0]).attr("y1", p1[1])
                  .attr("x2", p2[0]).attr("y2", p2[1]);
            }
        });

        if (mapCache.bonus) mapCache.bonus.each(function(d) {
            const { pos: [x, y], snapped } = getSnappedPos(d.lon, d.lat);
            d3.select(this).attr("cx", x).attr("cy", y)
                .style("pointer-events", snapped ? "none" : null);
        });

        // 3. LÍNEAS (No se desplazan para mantener conectividad geográfica)
        if (mapCache.flows) mapCache.flows
            .attr("x1", d => projection([d.p1.lon, d.p1.lat])[0])
            .attr("y1", d => projection([d.p1.lon, d.p1.lat])[1])
            .attr("x2", d => projection([d.p2.lon, d.p2.lat])[0])
            .attr("y2", d => projection([d.p2.lon, d.p2.lat])[1]);
    });
});

// Sincronizar UI de simulación en el primer render
updateSim();