// Se han extraído LATAM_COUNTRIES, keyNodes y layerData a data.js

// Renderizar las listas dinámicamente en el panel izquierdo
function renderSidebarLists() {
    const categories = { 'caribe': 'list-caribe', 'nortecentro': 'list-nortecentro', 'sur': 'list-sur' };
    Object.keys(categories).forEach(regKey => {
        const container = document.getElementById(categories[regKey]);
        const filtered = Object.entries(LATAM_COUNTRIES).filter(c => c[1].region === regKey);
        container.innerHTML = filtered.map(([id, c]) => `
                    <div class="region-item" onmouseover="handleSidebarHover(event, ${id})" onmousemove="moveTooltip(event)" onmouseout="handleSidebarOut()">
                        <span>${c.name}</span>
                        <span style="color:var(--cyan); font-size:9px; opacity:0.6;">${c.capital}</span>
                    </div>
                `).join('');
    });
}
renderSidebarLists();

// --- LÓGICA DE SIMULACIÓN DINÁMICA ---
let totalGDP_B = 0;
let totalPop = 0;
let weightedUnempSum = 0;

Object.values(LATAM_COUNTRIES).forEach(c => {
    const gdpVal = c.gdpRaw;
    const capitaVal = c.gdpCapitaRaw;
    const unempVal = c.unempRaw;

    totalGDP_B += gdpVal;
    const pop = (gdpVal * 1e9) / capitaVal;
    totalPop += pop;
    weightedUnempSum += unempVal * pop;
});

const baseGDP = totalGDP_B / 1000; // Convertido a Trillones USD
const unionPopulation = totalPop;
const baseUnemp = weightedUnempSum / totalPop; // Promedio ponderado real
const baseInfluence = 68;

// Caché de elementos DOM para optimización de CPU
const uiEls = {
    intSlider: document.getElementById('slider-integration'),
    rdSlider: document.getElementById('slider-rd'),
    intLbl: document.getElementById('lbl-integration'),
    rdLbl: document.getElementById('lbl-rd'),
    gdpVal: document.getElementById('val-gdp'),
    pibCapitaVal: document.getElementById('val-pibcapita'),
    unempVal: document.getElementById('val-unemp'),
    infVal: document.getElementById('val-influence')
};

function updateSim() {
    const intVal = parseFloat(uiEls.intSlider.value);
    const rdVal = parseFloat(uiEls.rdSlider.value);
    uiEls.intLbl.innerText = intVal + '%';
    uiEls.rdLbl.innerText = rdVal.toFixed(1) + '%';

    const factorInt = (intVal - 50) / 50;

    let newGDP = baseGDP + (factorInt * 1.5) + ((rdVal - 5) * 0.1);
    let newUnemp = baseUnemp - (factorInt * 1.5) - ((rdVal - 5) * 0.05);
    if (newUnemp < 1.5) newUnemp = 1.5;

    let newInfluence = baseInfluence + (factorInt * 20) + ((rdVal - 5) * 2.2);
    if (newInfluence > 100) newInfluence = 100;
    if (newInfluence < 0) newInfluence = 0;

    uiEls.gdpVal.innerText = '$' + newGDP.toFixed(2) + 'T';
    let perCapita = (newGDP * 1000000000000) / unionPopulation;
    uiEls.pibCapitaVal.innerText = '$' + Math.round(perCapita).toLocaleString();
    uiEls.unempVal.innerText = newUnemp.toFixed(1) + '%';
    uiEls.infVal.innerText = Math.round(newInfluence) + '/100';
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
    tav: null,
    strategic: null,
    infra: null,
    flows: null,
    bonus: null
};

d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json").then(data => {
    const countries = topojson.feature(data, data.objects.countries);

    // Dibujar mapa base
    g.selectAll("path")
        .data(countries.features)
        .enter().append("path")
        .attr("d", path)
        .attr("class", d => latamIds.includes(Number(d.id)) ? "country latam" : "country")
        .attr("id", d => "country-" + Number(d.id));

    // 1. Dibujar Capas (Invisibles inicialmente)
    const layersGroup = g.append("g").attr("id", "dynamic-layers");

    // Población de caché para optimización
    mapCache.paths = g.selectAll("path");

    // Capa TAV (Líneas)
    layersGroup.selectAll(".layer-tav-line")
        .data(layerData.tav).enter().append("line")
        .attr("class", "layer-tav")
        .attr("x1", d => { d.p1 = projection([d[0].lon, d[0].lat]); return d.p1[0]; })
        .attr("y1", d => d.p1[1])
        .attr("x2", d => { d.p2 = projection([d[1].lon, d[1].lat]); return d.p2[0]; })
        .attr("y2", d => d.p2[1])
        .attr("stroke", "var(--accent-tav)")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "4,4");

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
        .attr("class", "layer-infra")
        .attr("x", d => { d.coords = projection([d.lon, d.lat]); return d.coords[0] - 4; })
        .attr("y", d => d.coords[1] - 4)
        .attr("width", 8).attr("height", 8)
        .attr("fill", "#aaa")
        .attr("stroke", "#000").attr("stroke-width", 1)
        .on("mouseover", (e, d) => showSimpleTooltip(e, d.name, "Infraestructura Portuaria"))
        .on("mouseout", hideTooltip);

    layersGroup.selectAll(".layer-infra-corridor")
        .data(layerData.infra.filter(d => d.type === 'corridor')).enter().append("line")
        .attr("class", "layer-infra")
        .attr("x1", d => { d.p1_proj = projection([d.p1.lon, d.p1.lat]); return d.p1_proj[0]; })
        .attr("y1", d => d.p1_proj[1])
        .attr("x2", d => { d.p2_proj = projection([d.p2.lon, d.p2.lat]); return d.p2_proj[0]; })
        .attr("y2", d => d.p2_proj[1])
        .attr("stroke", "#aaa")
        .attr("stroke-width", 3)
        .attr("stroke-dasharray", "5,5")
        .on("mouseover", (e, d) => showSimpleTooltip(e, d.name, "Corredor Bioceánico"))
        .on("mouseout", hideTooltip);

    // Capa Flujos Económicos
    layersGroup.selectAll(".layer-flows-arrow")
        .data(layerData.flows).enter().append("line")
        .attr("class", "layer-flows")
        .attr("x1", d => { d.p1_proj = projection([d.p1.lon, d.p1.lat]); return d.p1_proj[0]; })
        .attr("y1", d => d.p1_proj[1])
        .attr("x2", d => { d.p2_proj = projection([d.p2.lon, d.p2.lat]); return d.p2_proj[0]; })
        .attr("y2", d => d.p2_proj[1])
        .attr("stroke", "#ff00ff")
        .attr("stroke-width", 2)
        .attr("marker-end", "url(#arrow)")
        .on("mouseover", (e, d) => showSimpleTooltip(e, d.name, "Flujo Económico"))
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
    mapCache.bonus = layersGroup.selectAll(".layer-bonus");
}).catch(err => console.error("Error al cargar el mapa:", err));

// --- FUNCIONES INTERACTIVAS ---

let currentTooltipRect = null;

function handleSidebarHover(e, id) {
    highlightCountry(id);
    showCountryTooltip(e, LATAM_COUNTRIES[id]);
}

function handleSidebarOut() {
    resetHighlight();
    hideTooltip();
}

function showCountryTooltip(e, c) {
    tooltip.html(`
                <div class="tt-header">${c.name}</div>
                <div style="font-size:10px; color:var(--text-muted); margin-bottom:8px; border-bottom:1px solid rgba(0,229,255,0.2); padding-bottom:6px;">Capital: <span style="color:var(--cyan)">${c.capital}</span></div>
                
                <div class="tt-row"><span class="tt-label">PIB (2025):</span> <span class="tt-val" style="color:var(--cyan);">${c.gdp}</span></div>
                <div class="tt-row"><span class="tt-label">PIB Per Cápita:</span> <span class="tt-val">${c.gdpCapita}</span></div>
                <div class="tt-row"><span class="tt-label">Inflación:</span> <span class="tt-val">${c.inflation}</span></div>
                <div class="tt-row"><span class="tt-label">Desempleo:</span> <span class="tt-val">${c.unemp}</span></div>
                
                <div style="margin-top:8px; padding-top:6px; border-top:1px dashed rgba(255, 255, 255, 0.1); font-size:9px; text-transform: uppercase;">
                    <span style="color:${c.status.includes('Validado') ? '#00ffcc' : 'var(--accent-orange)'}">${c.status}</span> | <span style="color:var(--text-muted)">${c.source}</span>
                </div>
            `);
    tooltip.style("display", "block");
    currentTooltipRect = tooltip.node().getBoundingClientRect();
    moveTooltip(e);
}

function showNodeTooltip(e, d) {
    tooltip.html(`
                <div class="tt-header">${d.name}</div>
                <div class="tt-row"><span class="tt-label">Rol:</span> <span class="tt-val" style="color:var(--cyan);">${d.role}</span></div>
                <div class="tt-row"><span class="tt-label">Especialización:</span> <span class="tt-val">${d.spec}</span></div>
            `);
    tooltip.style("display", "block");
    currentTooltipRect = tooltip.node().getBoundingClientRect();
    moveTooltip(e);
}

function showSimpleTooltip(e, title, subtitle) {
    tooltip.html(`
                <div class="tt-header" style="font-size:12px; margin-bottom:5px;">${title}</div>
                <div style="color:var(--text-muted); font-size:10px;">${subtitle}</div>
            `);
    tooltip.style("display", "block");
    currentTooltipRect = tooltip.node().getBoundingClientRect();
    moveTooltip(e);
}

function moveTooltip(e) {
    if (!currentTooltipRect) return;
    let x = e.pageX + 15;
    let y = e.pageY + 15;
    if (x + currentTooltipRect.width > window.innerWidth) x = e.pageX - currentTooltipRect.width - 15;
    if (y + currentTooltipRect.height > window.innerHeight) y = e.pageY - currentTooltipRect.height - 15;
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

function toggleInequality(element) {
    element.classList.toggle('active');
    const isActive = element.classList.contains('active');

    d3.selectAll(".country").each(function (d) {
        const countryId = Number(d.id);
        if (LATAM_COUNTRIES[countryId] && isActive) {
            const devLevel = LATAM_COUNTRIES[countryId].devLevel;
            d3.select(this).classed(`dev-${devLevel}`, true);
        } else {
            d3.select(this).classed("dev-high", false).classed("dev-medium", false).classed("dev-low", false);
        }
    });
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

        // Actualizar elementos usando el caché (con null-checks)
        if (mapCache.paths) mapCache.paths.attr("d", path);

        if (mapCache.capitals) mapCache.capitals
            .attr("cx", d => projection([d[1].lon, d[1].lat])[0])
            .attr("cy", d => projection([d[1].lon, d[1].lat])[1]);

        if (mapCache.keys) mapCache.keys
            .attr("cx", d => projection([d.lon, d.lat])[0])
            .attr("cy", d => projection([d.lon, d.lat])[1]);

        if (mapCache.fdi) mapCache.fdi
            .attr("cx", d => projection([d.lon, d.lat])[0])
            .attr("cy", d => projection([d.lon, d.lat])[1]);

        if (mapCache.tech) mapCache.tech
            .attr("x", d => projection([d.lon, d.lat])[0] - 4)
            .attr("y", d => projection([d.lon, d.lat])[1] - 4);

        if (mapCache.res) mapCache.res.attr("points", d => { const [x, y] = projection([d.lon, d.lat]); return `${x},${y - 6} ${x - 5},${y + 4} ${x + 5},${y + 4}`; });
        if (mapCache.defensa) mapCache.defensa.attr("points", d => { const [x, y] = projection([d.lon, d.lat]); return `${x},${y - 5} ${x + 5},${y} ${x},${y + 5} ${x - 5},${y}`; });

        if (mapCache.tav) mapCache.tav
            .attr("x1", d => projection([d[0].lon, d[0].lat])[0])
            .attr("y1", d => projection([d[0].lon, d[0].lat])[1])
            .attr("x2", d => projection([d[1].lon, d[1].lat])[0])
            .attr("y2", d => projection([d[1].lon, d[1].lat])[1]);

        if (mapCache.strategic) mapCache.strategic
            .attr("cx", d => projection([d.lon, d.lat])[0])
            .attr("cy", d => projection([d.lon, d.lat])[1]);

        if (mapCache.infra) mapCache.infra.each(function (d) {
            const el = d3.select(this);
            if (d.type === 'port') {
                const coords = projection([d.lon, d.lat]);
                el.attr("x", coords[0] - 4).attr("y", coords[1] - 4);
            } else if (d.type === 'corridor') {
                const p1 = projection([d.p1.lon, d.p1.lat]);
                const p2 = projection([d.p2.lon, d.p2.lat]);
                el.attr("x1", p1[0]).attr("y1", p1[1])
                  .attr("x2", p2[0]).attr("y2", p2[1]);
            }
        });

        if (mapCache.flows) mapCache.flows
            .attr("x1", d => projection([d.p1.lon, d.p1.lat])[0])
            .attr("y1", d => projection([d.p1.lon, d.p1.lat])[1])
            .attr("x2", d => projection([d.p2.lon, d.p2.lat])[0])
            .attr("y2", d => projection([d.p2.lon, d.p2.lat])[1]);

        if (mapCache.bonus) mapCache.bonus
            .attr("cx", d => projection([d.lon, d.lat])[0])
            .attr("cy", d => projection([d.lon, d.lat])[1]);
    });
});

// Sincronizar UI de simulación en el primer render
updateSim();