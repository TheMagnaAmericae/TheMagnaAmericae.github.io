// --- BASE DE DATOS DE LAS 24 REGIONES (EX-PAÍSES) ---
const LATAM_COUNTRIES = {

    192: { name: 'Cuba', region: 'caribe', capital: 'La Habana', lat: 23.13, lon: -82.38, gdp: '75B USD', gdpRaw: 75, gdpCapita: '7700 USD', gdpCapitaRaw: 7700, inflation: '12.5%', unemp: '1.8%', unempRaw: 1.8, status: 'Proyectado', source: 'CEPAL/FMI', devLevel: 'medium', population: 11, gini: 0.38, palma: 1.4, hdi: 0.764, poverty: 10 },
    214: { name: 'Rep. Dominicana', region: 'caribe', capital: 'Santo Domingo', lat: 18.48, lon: -69.90, gdp: '128B USD', gdpRaw: 128, gdpCapita: '11100 USD', gdpCapitaRaw: 11100, inflation: '4.0%', unemp: '6.0%', unempRaw: 6.0, status: 'Validado', source: 'BCRD', devLevel: 'medium', population: 11, gini: 0.39, palma: 1.6, hdi: 0.767, poverty: 23 },
    630: { name: 'Puerto Rico', region: 'caribe', capital: 'San Juan', lat: 18.47, lon: -66.11, gdp: '122B USD', gdpRaw: 122, gdpCapita: '38100 USD', gdpCapitaRaw: 38100, inflation: '2.3%', unemp: '5.2%', unempRaw: 5.2, status: 'Validado', source: 'BEA', devLevel: 'high', population: 3.2, gini: 0.41, palma: 1.7, hdi: 0.845, poverty: 18 },
    388: { name: 'Jamaica', region: 'caribe', capital: 'Kingston', lat: 17.99, lon: -76.79, gdp: '22.5B USD', gdpRaw: 22.5, gdpCapita: '8200 USD', gdpCapitaRaw: 8200, inflation: '4.2%', unemp: '3.2%', unempRaw: 3.2, status: 'Validado', source: 'Bank of Jamaica', devLevel: 'medium', population: 2.8, gini: 0.45, palma: 2.1, hdi: 0.709, poverty: 19 },
    332: { name: 'Haití', region: 'caribe', capital: 'Puerto Príncipe', lat: 18.54, lon: -72.34, gdp: '27B USD', gdpRaw: 27, gdpCapita: '1250 USD', gdpCapitaRaw: 1250, inflation: '20.5%', unemp: '14.5%', unempRaw: 14.5, status: 'Proyectado', source: 'Banco Mundial', devLevel: 'low', population: 11.5, gini: 0.61, palma: 3.5, hdi: 0.535, poverty: 70 },
    28: { name: 'Antigua y Barbuda', region: 'caribe', capital: "Saint John's", lat: 17.12, lon: -61.85, gdp: '2.4B USD', gdpRaw: 2.4, gdpCapita: '22600 USD', gdpCapitaRaw: 22600, inflation: '2.0%', unemp: '4.3%', unempRaw: 4.3, status: 'Validado', source: 'ECCB', devLevel: 'high', population: 0.1, gini: 0.42, palma: 1.8, hdi: 0.778, poverty: 15 },
    484: { name: 'México', region: 'nortecentro', capital: 'Ciudad de México', lat: 19.43, lon: -99.13, gdp: '1920B USD', gdpRaw: 1920, gdpCapita: '10500 USD', gdpCapitaRaw: 10500, inflation: '3.69%', unemp: '2.4%', unempRaw: 2.4, status: 'Validado', source: 'INEGI', devLevel: 'medium', population: 129, gini: 0.435, palma: 2.1, hdi: 0.779, poverty: 35 },
    320: { name: 'Guatemala', region: 'nortecentro', capital: 'Ciudad de Guatemala', lat: 14.64, lon: -90.51, gdp: '108B USD', gdpRaw: 108, gdpCapita: '5700 USD', gdpCapitaRaw: 5700, inflation: '3.2%', unemp: '2.7%', unempRaw: 2.7, status: 'Validado', source: 'BANGUAT', devLevel: 'low', population: 18, gini: 0.48, palma: 2.3, hdi: 0.663, poverty: 50 },
    84: { name: 'Belice', region: 'nortecentro', capital: 'Belmopán', lat: 17.25, lon: -88.77, gdp: '3.4B USD', gdpRaw: 3.4, gdpCapita: '7900 USD', gdpCapitaRaw: 7900, inflation: '3.5%', unemp: '3.8%', unempRaw: 3.8, status: 'Validado', source: 'Central Bank', devLevel: 'medium', population: 0.4, gini: 0.53, palma: 2.7, hdi: 0.706, poverty: 41 },
    340: { name: 'Honduras', region: 'nortecentro', capital: 'Tegucigalpa', lat: 14.10, lon: -87.21, gdp: '33.5B USD', gdpRaw: 33.5, gdpCapita: '3020 USD', gdpCapitaRaw: 3020, inflation: '4.8%', unemp: '6.3%', unempRaw: 6.3, status: 'Validado', source: 'BCH', devLevel: 'low', population: 10, gini: 0.457, palma: 2.2, hdi: 0.634, poverty: 52 },
    222: { name: 'El Salvador', region: 'nortecentro', capital: 'San Salvador', lat: 13.69, lon: -89.22, gdp: '37.8B USD', gdpRaw: 37.8, gdpCapita: '5900 USD', gdpCapitaRaw: 5900, inflation: '1.5%', unemp: '5.5%', unempRaw: 5.5, status: 'Validado', source: 'BCR', devLevel: 'medium', population: 6.5, gini: 0.388, palma: 1.6, hdi: 0.675, poverty: 26 },
    558: { name: 'Nicaragua', region: 'nortecentro', capital: 'Managua', lat: 12.13, lon: -86.29, gdp: '17.2B USD', gdpRaw: 17.2, gdpCapita: '2420 USD', gdpCapitaRaw: 2420, inflation: '4.5%', unemp: '4.0%', unempRaw: 4.0, status: 'Proyectado', source: 'BCN', devLevel: 'low', population: 6.8, gini: 0.462, palma: 2.2, hdi: 0.660, poverty: 45 },
    188: { name: 'Costa Rica', region: 'nortecentro', capital: 'San José', lat: 9.93, lon: -84.08, gdp: '96B USD', gdpRaw: 96, gdpCapita: '18050 USD', gdpCapitaRaw: 18050, inflation: '1.8%', unemp: '9.8%', unempRaw: 9.8, status: 'Validado', source: 'BCCR', devLevel: 'high', population: 5.2, gini: 0.458, palma: 2.2, hdi: 0.810, poverty: 21 },
    591: { name: 'Panamá', region: 'nortecentro', capital: 'Ciudad de Panamá', lat: 8.99, lon: -79.52, gdp: '88B USD', gdpRaw: 88, gdpCapita: '19100 USD', gdpCapitaRaw: 19100, inflation: '1.0%', unemp: '6.8%', unempRaw: 6.8, status: 'Validado', source: 'SBP', devLevel: 'high', population: 4.5, gini: 0.497, palma: 2.4, hdi: 0.815, poverty: 18 },
    170: { name: 'Colombia', region: 'sur', capital: 'Bogotá', lat: 4.71, lon: -74.07, gdp: '385B USD', gdpRaw: 385, gdpCapita: '7160 USD', gdpCapitaRaw: 7160, inflation: '6.5%', unemp: '10.0%', unempRaw: 10.0, status: 'Validado', source: 'DANE', devLevel: 'medium', population: 52, gini: 0.539, palma: 2.8, hdi: 0.752, poverty: 36 },
    862: { name: 'Venezuela', region: 'sur', capital: 'Caracas', lat: 10.48, lon: -66.88, gdp: '110B USD', gdpRaw: 110, gdpCapita: '3850 USD', gdpCapitaRaw: 3850, inflation: '35%', unemp: '7.0%', unempRaw: 7.0, status: 'Estimado', source: 'FMI', devLevel: 'low', population: 28, gini: 0.50, palma: 2.5, hdi: 0.711, poverty: 65 },
    218: { name: 'Ecuador', region: 'sur', capital: 'Quito', lat: -0.22, lon: -78.51, gdp: '125B USD', gdpRaw: 125, gdpCapita: '6800 USD', gdpCapitaRaw: 6800, inflation: '2.0%', unemp: '4.0%', unempRaw: 4.0, status: 'Validado', source: 'BCE', devLevel: 'medium', population: 18, gini: 0.452, palma: 2.1, hdi: 0.759, poverty: 32 },
    604: { name: 'Perú', region: 'sur', capital: 'Lima', lat: -12.05, lon: -77.04, gdp: '285B USD', gdpRaw: 285, gdpCapita: '8380 USD', gdpCapitaRaw: 8380, inflation: '2.7%', unemp: '6.5%', unempRaw: 6.5, status: 'Validado', source: 'BCRP', devLevel: 'medium', population: 34, gini: 0.401, palma: 1.7, hdi: 0.770, poverty: 29 },
    68: { name: 'Bolivia', region: 'sur', capital: 'Sucre', lat: -19.04, lon: -65.26, gdp: '51B USD', gdpRaw: 51, gdpCapita: '4520 USD', gdpCapitaRaw: 4520, inflation: '3.5%', unemp: '4.0%', unempRaw: 4.0, status: 'Validado', source: 'BCB', devLevel: 'low', population: 12, gini: 0.421, palma: 1.8, hdi: 0.718, poverty: 39 },
    76: { name: 'Brasil', region: 'sur', capital: 'Brasilia', lat: -15.78, lon: -47.93, gdp: '2450B USD', gdpRaw: 2450, gdpCapita: '11500 USD', gdpCapitaRaw: 11500, inflation: '4.8%', unemp: '6.5%', unempRaw: 6.5, status: 'Validado', source: 'IBGE', devLevel: 'medium', population: 214, gini: 0.506, palma: 2.6, hdi: 0.760, poverty: 27 },
    600: { name: 'Paraguay', region: 'sur', capital: 'Asunción', lat: -25.29, lon: -57.65, gdp: '48.5B USD', gdpRaw: 48.5, gdpCapita: '6830 USD', gdpCapitaRaw: 6830, inflation: '3.5%', unemp: '5.5%', unempRaw: 5.5, status: 'Validado', source: 'BCP', devLevel: 'medium', population: 7.5, gini: 0.442, palma: 2.0, hdi: 0.728, poverty: 24 },
    152: { name: 'Chile', region: 'sur', capital: 'Santiago', lat: -33.45, lon: -70.67, gdp: '355B USD', gdpRaw: 355, gdpCapita: '17750 USD', gdpCapitaRaw: 17750, inflation: '4.0%', unemp: '8.2%', unempRaw: 8.2, status: 'Validado', source: 'INE', devLevel: 'high', population: 19.6, gini: 0.43, palma: 1.9, hdi: 0.855, poverty: 10 },
    32: { name: 'Argentina', region: 'sur', capital: 'Buenos Aires', lat: -34.61, lon: -58.38, gdp: '680B USD', gdpRaw: 680, gdpCapita: '14780 USD', gdpCapitaRaw: 14780, inflation: '90%', unemp: '7.0%', unempRaw: 7.0, status: 'Validado', source: 'INDEC', devLevel: 'high', population: 46, gini: 0.424, palma: 1.8, hdi: 0.849, poverty: 38 },
    858: { name: 'Uruguay', region: 'sur', capital: 'Montevideo', lat: -34.90, lon: -56.19, gdp: '89B USD', gdpRaw: 89, gdpCapita: '25430 USD', gdpCapitaRaw: 25430, inflation: '5.5%', unemp: '7.8%', unempRaw: 7.8, status: 'Validado', source: 'BCU', devLevel: 'high', population: 3.5, gini: 0.40, palma: 1.5, hdi: 0.830, poverty: 8 }
};

// --- DATOS EXTENDIDOS: demografía, sectores, recursos, infraestructura ---
// growth=crecimiento%PIB | tradeBal=balanza comercial %PIB | urban=% urbanización
// density=hab/km² | sec=[%primario,%secundario,%terciario] | exports=top 3
// commDep=dependencia commodities% | edu=años escolaridad | internet=%acceso
// lpi=LogisticsPerformanceIndex | port=conectividad portuaria(0-10) | energy=GW
// lithium=Mt reservas | oil=Mbd producción | water=%agua dulce global | renew=potencial renovable(0-10)
const LATAM_EXTENDED = {
  192:{growth:1.8,tradeBal:-2.1,urban:77,density:102,sec:[17,22,61],exports:['Níquel','Tabaco','Ron'],commDep:35,edu:9.9,internet:64,lpi:2.1,port:3,energy:6.5,lithium:0,oil:0.05,water:0.2,renew:5},
  214:{growth:5.3,tradeBal:-3.2,urban:84,density:225,sec:[5,30,65],exports:['Oro','Tabaco','Cacao'],commDep:40,edu:8.1,internet:78,lpi:2.6,port:5,energy:4.5,lithium:0,oil:0,water:0.1,renew:6},
  630:{growth:0.5,tradeBal:-9.8,urban:94,density:353,sec:[1,45,54],exports:['Farmacéuticos','Equipos médicos','Ron'],commDep:10,edu:12.1,internet:89,lpi:2.9,port:6,energy:5.9,lithium:0,oil:0,water:0.05,renew:5},
  388:{growth:1.7,tradeBal:-6.3,urban:57,density:254,sec:[8,18,74],exports:['Aluminio','Turismo','Bauxita'],commDep:30,edu:9.6,internet:64,lpi:2.4,port:7,energy:0.6,lithium:0,oil:0,water:0.1,renew:4},
  332:{growth:-2.1,tradeBal:-21.0,urban:59,density:414,sec:[26,20,54],exports:['Cacao','Mango','Artesanías'],commDep:60,edu:5.8,internet:38,lpi:1.8,port:3,energy:0.4,lithium:0,oil:0,water:0.3,renew:6},
   28:{growth:4.8,tradeBal:-2.5,urban:24,density:222,sec:[2,10,88],exports:['Turismo','Ron','Petróleo reexport.'],commDep:8,edu:9.4,internet:82,lpi:2.0,port:4,energy:0.3,lithium:0,oil:0,water:0.02,renew:6},
  484:{growth:2.1,tradeBal:0.4,urban:81,density:66,sec:[4,34,62],exports:['Automóviles','Electrónica','Petróleo'],commDep:28,edu:9.1,internet:72,lpi:3.0,port:7,energy:92,lithium:0,oil:0.58,water:1.1,renew:7},
  320:{growth:3.5,tradeBal:-3.8,urban:53,density:166,sec:[11,24,65],exports:['Café','Banano','Azúcar'],commDep:55,edu:6.4,internet:53,lpi:2.4,port:4,energy:4.2,lithium:0,oil:0,water:0.5,renew:6},
   84:{growth:4.2,tradeBal:-6.1,urban:46,density:17,sec:[12,18,70],exports:['Azúcar','Banano','Cítricos'],commDep:50,edu:10.5,internet:61,lpi:2.2,port:3,energy:0.2,lithium:0,oil:0,water:0.2,renew:5},
  340:{growth:3.4,tradeBal:-4.9,urban:59,density:89,sec:[13,24,63],exports:['Café','Banano','Aceite palma'],commDep:52,edu:6.2,internet:46,lpi:2.3,port:3,energy:2.8,lithium:0,oil:0,water:0.4,renew:5},
  222:{growth:2.8,tradeBal:-6.3,urban:74,density:309,sec:[10,26,64],exports:['Café','Textiles','Azúcar'],commDep:38,edu:7.5,internet:55,lpi:2.5,port:3,energy:1.7,lithium:0,oil:0,water:0.1,renew:5},
  558:{growth:4.0,tradeBal:-3.4,urban:59,density:52,sec:[16,22,62],exports:['Café','Carne','Azúcar'],commDep:50,edu:6.5,internet:51,lpi:2.1,port:2,energy:1.5,lithium:0,oil:0,water:0.4,renew:6},
  188:{growth:4.5,tradeBal:-2.6,urban:82,density:102,sec:[4,17,79],exports:['Equipo médico','Piña','Café'],commDep:18,edu:11.3,internet:83,lpi:2.9,port:5,energy:3.5,lithium:0,oil:0,water:0.8,renew:8},
  591:{growth:7.2,tradeBal:5.8,urban:69,density:59,sec:[3,18,79],exports:['Oro','Banano','Camarones'],commDep:22,edu:10.2,internet:70,lpi:3.0,port:8,energy:3.8,lithium:0,oil:0,water:0.5,renew:6},
  170:{growth:1.6,tradeBal:-0.8,urban:82,density:46,sec:[7,30,63],exports:['Petróleo','Café','Carbón'],commDep:48,edu:8.4,internet:73,lpi:2.8,port:7,energy:18,lithium:0,oil:0.74,water:2.0,renew:7},
  862:{growth:-3.0,tradeBal:8.2,urban:89,density:33,sec:[4,35,61],exports:['Petróleo','Aluminio','Acero'],commDep:80,edu:8.6,internet:36,lpi:1.9,port:4,energy:34,lithium:0,oil:0.70,water:3.5,renew:5},
  218:{growth:2.4,tradeBal:-1.4,urban:64,density:70,sec:[8,30,62],exports:['Petróleo','Banano','Camarones'],commDep:45,edu:9.8,internet:65,lpi:2.5,port:5,energy:8.2,lithium:0,oil:0.48,water:1.8,renew:6},
  604:{growth:3.1,tradeBal:0.6,urban:79,density:27,sec:[8,33,59],exports:['Cobre','Oro','Zinc'],commDep:52,edu:9.7,internet:67,lpi:2.7,port:6,energy:13,lithium:0,oil:0.10,water:1.9,renew:6},
   68:{growth:2.9,tradeBal:3.2,urban:70,density:11,sec:[12,30,58],exports:['Gas natural','Zinc','Soja'],commDep:62,edu:9.0,internet:44,lpi:2.2,port:2,energy:2.8,lithium:21,oil:0.04,water:1.2,renew:7},
   76:{growth:2.9,tradeBal:1.8,urban:88,density:25,sec:[6,20,74],exports:['Soja','Petróleo','Hierro'],commDep:38,edu:8.6,internet:81,lpi:3.1,port:8,energy:170,lithium:0,oil:3.0,water:12.0,renew:8},
  600:{growth:4.2,tradeBal:2.1,urban:63,density:19,sec:[18,26,56],exports:['Soja','Electricidad','Carne'],commDep:55,edu:8.3,internet:62,lpi:2.5,port:3,energy:8.8,lithium:0,oil:0,water:2.8,renew:7},
  152:{growth:2.6,tradeBal:1.4,urban:88,density:26,sec:[5,32,63],exports:['Cobre','Litio','Celulosa'],commDep:50,edu:10.6,internet:88,lpi:3.3,port:7,energy:28,lithium:9.3,oil:0.01,water:0.6,renew:8},
   32:{growth:-1.7,tradeBal:0.9,urban:93,density:17,sec:[7,28,65],exports:['Soja','Automóviles','Trigo'],commDep:42,edu:11.0,internet:86,lpi:2.8,port:6,energy:44,lithium:19,oil:0.34,water:3.0,renew:7},
  858:{growth:3.2,tradeBal:0.3,urban:96,density:20,sec:[7,23,70],exports:['Carne','Soja','Madera'],commDep:40,edu:11.5,internet:89,lpi:3.0,port:5,energy:4.5,lithium:0,oil:0,water:1.8,renew:7}
};
// Fusionar en LATAM_COUNTRIES
Object.keys(LATAM_EXTENDED).forEach(id => {
    if (LATAM_COUNTRIES[id]) Object.assign(LATAM_COUNTRIES[id], LATAM_EXTENDED[id]);
});

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
        { type: 'port', lat: -23.96, lon: -46.33, name: "Puerto de Santos (Principal)", phase: 1 },
        { type: 'port', lat: -12.05, lon: -77.15, name: "Puerto del Callao", phase: 1 },
        { type: 'port', lat: -34.60, lon: -58.35, name: "Puerto de Buenos Aires", phase: 1 },
        { type: 'port', lat: 19.17, lon: -96.13, name: "Puerto de Veracruz", phase: 1 },
        { type: 'port', lat: 9.35, lon: -79.90, name: "Hub Colón (Panamá)", phase: 1 },
        
        // Corredores Fase 2
        { type: 'corridor', p1: { lat: -23.96, lon: -46.33 }, p2: { lat: -18.47, lon: -70.31 }, name: "Corredor Bioceánico Atlántico-Pacífico", phase: 2 },
        { type: 'corridor', p1: { lat: 10.48, lon: -66.88 }, p2: { lat: -15.78, lon: -47.93 }, name: "Gaseoducto Sur: Orinoco-Brasilia", phase: 2 },
        
        // Redes Fase 3
        { type: 'corridor', p1: { lat: 19.43, lon: -99.13 }, p2: { lat: -34.60, lon: -58.38 }, name: "Red de Fibra Óptica Continental (Backbone)", phase: 3 }
    ],
    flows: [
        { p1: { lat: -23.55, lon: -46.63 }, p2: { lat: -34.60, lon: -58.38 }, name: "Eje Mercosur: São Paulo - BA", type: 'industrial', volume: 45000, desc: "Manufacturas y automotriz" },
        { p1: { lat: 19.43, lon: -99.13 }, p2: { lat: 8.98, lon: -79.51 }, name: "Eje Mesoamericano: CDMX - Panamá", type: 'tech', volume: 28000, desc: "Servicios financieros y software" },
        { p1: { lat: -33.45, lon: -70.67 }, p2: { lat: -12.05, lon: -77.04 }, name: "Eje Andino: Santiago - Lima", type: 'primario', volume: 32000, desc: "Minería y agroindustria" },
        { p1: { lat: 4.71, lon: -74.07 }, p2: { lat: -0.22, lon: -78.51 }, name: "Conexión Norte: Bogotá - Quito", type: 'industrial', volume: 15000, desc: "Bienes de consumo" },
        { p1: { lat: -15.78, lon: -47.93 }, p2: { lat: -19.04, lon: -65.26 }, name: "Corredor Energético: Brasil - Bolivia", type: 'primario', volume: 12000, desc: "Gas natural y energía" },
        { p1: { lat: 10.48, lon: -66.88 }, p2: { lat: 18.48, lon: -69.90 }, name: "Eje Caribe: Caracas - Santo Domingo", type: 'primario', volume: 8000, desc: "Petróleo y derivados" }
    ],
    industria: [
        { lat: 25.68, lon: -100.31, name: "Polo Industrial Monterrey (Nuevo León)", type: "Automotriz/Aeroespacial" },
        { lat: -23.55, lon: -46.63, name: "Cinturón Industrial São Paulo", type: "Manufactura Diversa" },
        { lat: 20.58, lon: -100.39, name: "Hub Aeroespacial Querétaro", type: "Aeroespacial" },
        { lat: -32.94, lon: -60.63, name: "Polo Agroindustrial Rosario", type: "Procesamiento Alimentos" },
        { lat: -3.10, lon: -60.02, name: "Zona Franca Industrial Manaos", type: "Electrónica" },
        { lat: -36.67, lon: -73.05, name: "Parque Industrial Concepción", type: "Madera/Papel" },
        { lat: 19.04, lon: -98.20, name: "Clúster Automotriz Puebla", type: "Automotriz" }
    ],
    bonus: [
        { type: 'conflict', lat: -5.0, lon: -65.0, name: "Tensiones por Explotación Maderera" },
        { type: 'conflict', lat: -40.0, lon: -71.0, name: "Conflicto por Tierras / Recursos" },
        { type: 'protected', lat: -0.5, lon: -76.0, name: "Reserva Yasuní" },
        { type: 'integration', lat: -25.5, lon: -54.6, name: "Mercado Integrado (Triple Frontera)" }
    ]
};

// --- MAPEO DE IDs (Numeric) A ISO-3 ---
const ISO_MAPPING = {
    192: 'CUB', 214: 'DOM', 630: 'PRI', 388: 'JAM', 332: 'HTI', 28: 'ATG',
    484: 'MEX', 320: 'GTM', 84: 'BLZ', 340: 'HND', 222: 'SLV', 558: 'NIC', 188: 'CRI', 591: 'PAN',
    170: 'COL', 862: 'VEN', 218: 'ECU', 604: 'PER', 68: 'BOL', 76: 'BRA', 600: 'PRY', 152: 'CHL', 32: 'ARG', 858: 'URY'
};

async function fetchWorldBankData() {
    console.log("Iniciando sincronización con Banco Mundial...");
    const indicators = {
        gdp: 'NY.GDP.MKTP.CD', // GDP current USD
        inflation: 'FP.CPI.TOTL.ZG' // Inflation, consumer prices (annual %)
    };

    const countries = Object.values(ISO_MAPPING).join(';');

    try {
        // Fetch GDP (most recent value)
        const gdpRes = await fetch(`https://api.worldbank.org/v2/country/${countries}/indicator/${indicators.gdp}?format=json&per_page=100&date=2023:2024`);
        const gdpData = await gdpRes.json();

        // Fetch Inflation
        const infRes = await fetch(`https://api.worldbank.org/v2/country/${countries}/indicator/${indicators.inflation}?format=json&per_page=100&date=2023:2024`);
        const infData = await infRes.json();

        if (gdpData[1]) {
            gdpData[1].forEach(entry => {
                const numericId = Object.keys(ISO_MAPPING).find(key => ISO_MAPPING[key] === entry.countryiso3code);
                if (numericId && entry.value && !LATAM_COUNTRIES[numericId].apiUpdated) {
                    LATAM_COUNTRIES[numericId].gdpRaw = entry.value / 1e9; // Convert to Billions
                    LATAM_COUNTRIES[numericId].gdp = (entry.value / 1e9).toFixed(1) + 'B USD';
                    LATAM_COUNTRIES[numericId].status = 'API: Validado';
                    LATAM_COUNTRIES[numericId].apiUpdated = true;
                }
            });
        }

        if (infData[1]) {
            infData[1].forEach(entry => {
                const numericId = Object.keys(ISO_MAPPING).find(key => ISO_MAPPING[key] === entry.countryiso3code);
                if (numericId && entry.value) {
                    LATAM_COUNTRIES[numericId].inflation = entry.value.toFixed(2) + '%';
                }
            });
        }
        console.log("Sincronización API completada.");
    } catch (error) {
        console.warn("Error al conectar con Banco Mundial, usando datos locales:", error);
    }
}
