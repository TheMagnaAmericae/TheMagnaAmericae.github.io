// --- BASE DE DATOS DE LAS 24 REGIONES (EX-PAÍSES) ---
const LATAM_COUNTRIES = {
    192: { name: 'Cuba', region: 'caribe', capital: 'La Habana', lat: 23.13, lon: -82.38, gdp: '75B USD', gdpRaw: 75, gdpCapita: '7,700 USD', gdpCapitaRaw: 7700, inflation: '12.5%', unemp: '1.8%', unempRaw: 1.8, status: 'Proyectado', source: 'CEPAL/FMI', devLevel: 'low' },
    214: { name: 'Rep. Dominicana', region: 'caribe', capital: 'Santo Domingo', lat: 18.48, lon: -69.90, gdp: '128B USD', gdpRaw: 128, gdpCapita: '11,100 USD', gdpCapitaRaw: 11100, inflation: '4.0%', unemp: '6.0%', unempRaw: 6.0, status: 'Validado', source: 'BCRD', devLevel: 'medium' },
    630: { name: 'Puerto Rico', region: 'caribe', capital: 'San Juan', lat: 18.47, lon: -66.11, gdp: '122B USD', gdpRaw: 122, gdpCapita: '38,100 USD', gdpCapitaRaw: 38100, inflation: '2.3%', unemp: '5.2%', unempRaw: 5.2, status: 'Validado', source: 'BEA', devLevel: 'high' },
    388: { name: 'Jamaica', region: 'caribe', capital: 'Kingston', lat: 17.99, lon: -76.79, gdp: '22.5B USD', gdpRaw: 22.5, gdpCapita: '8,200 USD', gdpCapitaRaw: 8200, inflation: '4.2%', unemp: '3.2%', unempRaw: 3.2, status: 'Validado', source: 'Bank of Jamaica', devLevel: 'low' },
    332: { name: 'Haití', region: 'caribe', capital: 'Puerto Príncipe', lat: 18.54, lon: -72.34, gdp: '27B USD', gdpRaw: 27, gdpCapita: '1,250 USD', gdpCapitaRaw: 1250, inflation: '20.5%', unemp: '14.5%', unempRaw: 14.5, status: 'Proyectado', source: 'Banco Mundial', devLevel: 'low' },
    28: { name: 'Antigua y Barbuda', region: 'caribe', capital: "Saint John's", lat: 17.12, lon: -61.85, gdp: '2.4B USD', gdpRaw: 2.4, gdpCapita: '22,600 USD', gdpCapitaRaw: 22600, inflation: '2.0%', unemp: '4.3%', unempRaw: 4.3, status: 'Validado', source: 'Eastern Caribbean Central Bank', devLevel: 'high' },

    484: { name: 'México', region: 'nortecentro', capital: 'Ciudad de México', lat: 19.43, lon: -99.13, gdp: '1,920B USD', gdpRaw: 1920, gdpCapita: '10,500 USD', gdpCapitaRaw: 10500, inflation: '3.69%', unemp: '2.4%', unempRaw: 2.4, status: 'Validado', source: 'INEGI oficial infobae+2', devLevel: 'medium' },
    320: { name: 'Guatemala', region: 'nortecentro', capital: 'Ciudad de Guatemala', lat: 14.64, lon: -90.51, gdp: '108B USD', gdpRaw: 108, gdpCapita: '5,700 USD', gdpCapitaRaw: 5700, inflation: '3.2%', unemp: '2.7%', unempRaw: 2.7, status: 'Validado', source: 'BANGUAT', devLevel: 'medium' },
    84: { name: 'Belice', region: 'nortecentro', capital: 'Belmopán', lat: 17.25, lon: -88.77, gdp: '3.4B USD', gdpRaw: 3.4, gdpCapita: '7,900 USD', gdpCapitaRaw: 7900, inflation: '3.5%', unemp: '3.8%', unempRaw: 3.8, status: 'Validado', source: 'Central Bank of Belize', devLevel: 'medium' },
    340: { name: 'Honduras', region: 'nortecentro', capital: 'Tegucigalpa', lat: 14.10, lon: -87.21, gdp: '33.5B USD', gdpRaw: 33.5, gdpCapita: '3,020 USD', gdpCapitaRaw: 3020, inflation: '4.8%', unemp: '6.3%', unempRaw: 6.3, status: 'Validado', source: 'BCH', devLevel: 'low' },
    222: { name: 'El Salvador', region: 'nortecentro', capital: 'San Salvador', lat: 13.69, lon: -89.22, gdp: '37.8B USD', gdpRaw: 37.8, gdpCapita: '5,900 USD', gdpCapitaRaw: 5900, inflation: '1.5%', unemp: '5.5%', unempRaw: 5.5, status: 'Validado', source: 'BCR', devLevel: 'medium' },
    558: { name: 'Nicaragua', region: 'nortecentro', capital: 'Managua', lat: 12.13, lon: -86.29, gdp: '17.2B USD', gdpRaw: 17.2, gdpCapita: '2,420 USD', gdpCapitaRaw: 2420, inflation: '4.5%', unemp: '4.0%', unempRaw: 4.0, status: 'Proyectado', source: 'BCN', devLevel: 'low' },
    188: { name: 'Costa Rica', region: 'nortecentro', capital: 'San José', lat: 9.93, lon: -84.08, gdp: '96B USD', gdpRaw: 96, gdpCapita: '18,050 USD', gdpCapitaRaw: 18050, inflation: '1.8%', unemp: '9.8%', unempRaw: 9.8, status: 'Validado', source: 'BCCR', devLevel: 'high' },
    591: { name: 'Panamá', region: 'nortecentro', capital: 'Ciudad de Panamá', lat: 8.99, lon: -79.52, gdp: '88B USD', gdpRaw: 88, gdpCapita: '19,100 USD', gdpCapitaRaw: 19100, inflation: '1.0%', unemp: '6.8%', unempRaw: 6.8, status: 'Validado', source: 'Superintendencia de Bancos', devLevel: 'high' },

    170: { name: 'Colombia', region: 'sur', capital: 'Bogotá', lat: 4.71, lon: -74.07, gdp: '385B USD', gdpRaw: 385, gdpCapita: '7,160 USD', gdpCapitaRaw: 7160, inflation: '6.5%', unemp: '10.0%', unempRaw: 10.0, status: 'Validado', source: 'DANE/Banrep', devLevel: 'medium' },
    862: { name: 'Venezuela', region: 'sur', capital: 'Caracas', lat: 10.48, lon: -66.88, gdp: '110B USD', gdpRaw: 110, gdpCapita: '3,850 USD', gdpCapitaRaw: 3850, inflation: '35%', unemp: '7.0%', unempRaw: 7.0, status: 'Estimado', source: 'FMI (datos limitados)', devLevel: 'low' },
    218: { name: 'Ecuador', region: 'sur', capital: 'Quito', lat: -0.22, lon: -78.51, gdp: '125B USD', gdpRaw: 125, gdpCapita: '6,800 USD', gdpCapitaRaw: 6800, inflation: '2.0%', unemp: '4.0%', unempRaw: 4.0, status: 'Validado', source: 'BCE', devLevel: 'medium' },
    604: { name: 'Perú', region: 'sur', capital: 'Lima', lat: -12.05, lon: -77.04, gdp: '285B USD', gdpRaw: 285, gdpCapita: '8,380 USD', gdpCapitaRaw: 8380, inflation: '2.7%', unemp: '6.5%', unempRaw: 6.5, status: 'Validado', source: 'BCRP/INEI', devLevel: 'medium' },
    68: { name: 'Bolivia', region: 'sur', capital: 'Sucre', lat: -19.04, lon: -65.26, gdp: '51B USD', gdpRaw: 51, gdpCapita: '4,520 USD', gdpCapitaRaw: 4520, inflation: '3.5%', unemp: '4.0%', unempRaw: 4.0, status: 'Validado', source: 'INE/BCB', devLevel: 'low' },
    76: { name: 'Brasil', region: 'sur', capital: 'Brasilia', lat: -15.78, lon: -47.93, gdp: '2,450B USD', gdpRaw: 2450, gdpCapita: '11,500 USD', gdpCapitaRaw: 11500, inflation: '4.8%', unemp: '6.5%', unempRaw: 6.5, status: 'Validado', source: 'IBGE/BCB', devLevel: 'medium' },
    600: { name: 'Paraguay', region: 'sur', capital: 'Asunción', lat: -25.29, lon: -57.65, gdp: '48.5B USD', gdpRaw: 48.5, gdpCapita: '6,830 USD', gdpCapitaRaw: 6830, inflation: '3.5%', unemp: '5.5%', unempRaw: 5.5, status: 'Validado', source: 'BCP', devLevel: 'medium' },
    152: { name: 'Chile', region: 'sur', capital: 'Santiago', lat: -33.45, lon: -70.67, gdp: '355B USD', gdpRaw: 355, gdpCapita: '17,750 USD', gdpCapitaRaw: 17750, inflation: '4.0%', unemp: '8.2%', unempRaw: 8.2, status: 'Validado', source: 'INE/CBC', devLevel: 'high' },
    32: { name: 'Argentina', region: 'sur', capital: 'Buenos Aires', lat: -34.61, lon: -58.38, gdp: '680B USD', gdpRaw: 680, gdpCapita: '14,780 USD', gdpCapitaRaw: 14780, inflation: '90%', unemp: '7.0%', unempRaw: 7.0, status: 'Validado', source: 'INDEC/BCRA', devLevel: 'high' },
    858: { name: 'Uruguay', region: 'sur', capital: 'Montevideo', lat: -34.90, lon: -56.19, gdp: '89B USD', gdpRaw: 89, gdpCapita: '25,430 USD', gdpCapitaRaw: 25430, inflation: '5.5%', unemp: '7.8%', unempRaw: 7.8, status: 'Validado', source: 'BCU/INE', devLevel: 'high' }
};

// --- Nodos Clave y Capas de Información Detallada ---
const keyNodes = [
    { id: 'saopaulo', name: 'São Paulo', role: 'Nodo Financiero/Industrial', spec: 'Motor de Sudamérica', lat: -23.55, lon: -46.63, tier: 1 },
    { id: 'buenosaires', name: 'Buenos Aires', role: 'Servicios/Comercio', spec: 'Agroindustria, Software', lat: -34.60, lon: -58.38, tier: 1 },
    { id: 'santiago', name: 'Santiago', role: 'Hub Andino', spec: 'Finanzas, Minería', lat: -33.45, lon: -70.67, tier: 2 },
    { id: 'lima', name: 'Lima', role: 'Conexión Pacífico', spec: 'Logística, Minería', lat: -12.05, lon: -77.04, tier: 2 },
    { id: 'bogota', name: 'Bogotá', role: 'Nodo Norte', spec: 'Servicios, Tecnología', lat: 4.71, lon: -74.07, tier: 2 },
    { id: 'panama', name: 'Panamá', role: 'Nodo Administrativo Global', spec: 'Canal, Sede B.C.U.', lat: 8.98, lon: -79.51, tier: 2 },
    { id: 'cdmx', name: 'Ciudad de México', role: 'Hub Tecnológico Norte', spec: 'I+D, Consorcios', lat: 19.43, lon: -99.13, tier: 1 }
];

const layerData = {
    fdi: [
        { lat: -11.56, lon: -77.26, name: "Mega-Puerto Chancay (Perú)", origin: "China" },
        { lat: -25.50, lon: -48.51, name: "Terminal Portuaria Paranaguá (Brasil)", origin: "China" },
        { lat: 25.68, lon: -100.31, name: "Gigafactory Monterrey (México)", origin: "Estados Unidos" },
        { lat: -38.23, lon: -68.22, name: "Megaproyecto Vaca Muerta (Argentina)", origin: "EE.UU. / Malasia" },
        { lat: 4.71, lon: -74.07, name: "Metro de Bogotá (Colombia)", origin: "China" },
        { lat: -23.96, lon: -46.33, name: "Puerto de Santos - Expansión (Brasil)", origin: "Emiratos Árabes (EAU)" },
        { lat: 17.92, lon: -76.79, name: "Puerto Kingston (Jamaica)", origin: "China" }
    ],
    tech: [
        { lat: 25.68, lon: -100.31, name: "Polo Tecnológico Monterrey" },
        { lat: 20.65, lon: -103.34, name: "Silicon Valley Sur (Guadalajara)" },
        { lat: 9.92, lon: -84.09, name: "Hub Dispositivos Médicos (San José)" },
        { lat: -34.60, lon: -58.38, name: "Software & Biotech Hub (BA)" }
    ],
    res: [
        // Recursos Estratégicos antiguos
        { lat: -23.00, lon: -67.50, name: "Complejo Litio (Uyuni/Atacama)" },
        { lat: 8.50, lon: -63.00, name: "Complejo Petroquímico Orinoco" },
        { lat: -24.18, lon: -46.78, name: "Plataforma Pre-Sal Santos" },
        { lat: -22.45, lon: -68.92, name: "Mina Chuquicamata (Cobre)" }
    ],
    defensa: [
        { lat: -2.38, lon: -44.36, name: "Centro de Lanzamiento Alcântara" },
        { lat: -38.95, lon: -62.06, name: "Polo Naval Puerto Belgrano" }
    ],
    tav: [
        [{ lat: 19.43, lon: -99.13 }, { lat: 14.64, lon: -90.51 }],
        [{ lat: 14.64, lon: -90.51 }, { lat: 8.99, lon: -79.52 }],
        [{ lat: 8.99, lon: -79.52 }, { lat: 4.71, lon: -74.07 }],
        [{ lat: 4.71, lon: -74.07 }, { lat: -12.05, lon: -77.04 }],
        [{ lat: -12.05, lon: -77.04 }, { lat: -33.45, lon: -70.67 }],
        [{ lat: -33.45, lon: -70.67 }, { lat: -34.61, lon: -58.38 }],
        [{ lat: -34.61, lon: -58.38 }, { lat: -23.55, lon: -46.63 }]
    ],
    strategic: [
        { type: 'lithium', lat: -23.5, lon: -68.5, name: "Litio (Chile)" },
        { type: 'lithium', lat: -20.5, lon: -67.0, name: "Litio (Bolivia)" },
        { type: 'lithium', lat: -24.0, lon: -66.5, name: "Litio (Argentina)" },
        { type: 'oil', lat: 9.5, lon: -63.5, name: "Petróleo (Venezuela - Faja Orinoco)" },
        { type: 'oil', lat: -24.0, lon: -45.0, name: "Petróleo (Brasil - Pre-Sal)" },
        { type: 'water', lat: -3.0, lon: -60.0, name: "Agua (Amazonas)" },
        { type: 'water', lat: -26.0, lon: -56.0, name: "Agua (Acuífero Guaraní)" },
        { type: 'solar', lat: -24.5, lon: -69.5, name: "Energía Solar (Atacama)" },
        { type: 'wind', lat: -45.0, lon: -68.0, name: "Energía Eólica (Patagonia)" }
    ],
    infra: [
        { type: 'port', lat: -23.96, lon: -46.33, name: "Puerto de Santos (Principal)" },
        { type: 'port', lat: -12.05, lon: -77.15, name: "Puerto del Callao" },
        { type: 'port', lat: -34.60, lon: -58.35, name: "Puerto de Buenos Aires" },
        // Corredor bioceánico hipotético (línea de tren/carretera)
        { type: 'corridor', p1: {lat: -23.96, lon: -46.33}, p2: {lat: -18.47, lon: -70.31}, name: "Corredor Bioceánico Santos-Arica" }
    ],
    flows: [
        { p1: {lat: -15.0, lon: -55.0}, p2: {lat: 10.0, lon: -10.0}, name: "Exportación de Soja a China" },
        { p1: {lat: -22.0, lon: -69.0}, p2: {lat: 15.0, lon: -120.0}, name: "Exportación Minerales al Mundo" },
        { p1: {lat: -3.0, lon: -60.0}, p2: {lat: -23.96, lon: -46.33}, name: "Flujos Internos (Amazonía → Puertos)" },
        { p1: {lat: -18.0, lon: -68.0}, p2: {lat: -12.05, lon: -77.15}, name: "Flujos Internos (Andes → Callao)" }
    ],
    bonus: [
        { type: 'conflict', lat: -5.0, lon: -65.0, name: "Tensiones por Explotación Maderera" },
        { type: 'conflict', lat: -40.0, lon: -71.0, name: "Conflicto por Tierras / Recursos" },
        { type: 'protected', lat: -0.5, lon: -76.0, name: "Reserva Yasuní" },
        { type: 'integration', lat: -25.5, lon: -54.6, name: "Mercado Integrado (Triple Frontera)" }
    ]
};
