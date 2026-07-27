/* =========================================================
   CATÁLOGO DE NOMAD MOTORS

   CÓMO AGREGAR O MODIFICAR UNA MOTOCICLETA:
   1. Duplica uno de los objetos completos.
   2. Cambia el id por un número que no se repita.
   3. Cambia nombre, categoría, precio y especificaciones.
   4. Sustituye la URL de image por tu fotografía.
   5. Mantén las comas entre cada objeto.

   CATEGORÍAS DISPONIBLES:
   - "Custom"
   - "Deportiva"
   - "Trial"

   Más adelante este arreglo puede sustituirse por Firebase o Supabase.
   ========================================================= */

const motorcycles = [
  {
    id: 1,
    name: "NOMAD RAVEN 900",
    category: "Custom",
    price: 289900,
    power: 92,
    engine: "895 cc",
    weight: "228 kg",
    topSpeed: "205 km/h",
    tag: "Urban Custom",
    image: "assets/img/Raven900.png",
    description:
      "Una custom oscura y refinada, concebida para recorridos largos y presencia urbana."
  },
  {
    id: 2,
    name: "NOMAD DUNE 750",
    category: "Custom",
    price: 249900,
    power: 78,
    engine: "749 cc",
    weight: "214 kg",
    topSpeed: "195 km/h",
    tag: "Long Distance",
    image: "assets/img/DUNE 750.png",
    description:
      "Postura relajada, respuesta progresiva y una silueta creada para atravesar kilómetros."
  },
  {
    id: 3,
    name: "NOMAD APEX R",
    category: "Deportiva",
    price: 439900,
    power: 198,
    engine: "998 cc",
    weight: "197 kg",
    topSpeed: "302 km/h",
    tag: "Superbike",
    image: "assets/img/APEX R.jpg",
    description:
      "La máxima expresión deportiva de NOMAD: aerodinámica, electrónica y potencia de circuito."
  },
  {
    id: 4,
    name: "NOMAD VECTOR 800",
    category: "Deportiva",
    price: 319900,
    power: 126,
    engine: "799 cc",
    weight: "188 kg",
    topSpeed: "268 km/h",
    tag: "Road Sport",
    image: "assets/img/VECTOR800.jpg",
    description:
      "Una deportiva precisa y utilizable, diseñada para enlazar curvas con control absoluto."
  },
  {
    id: 5,
    name: "NOMAD SPRINT 660",
    category: "Deportiva",
    price: 259900,
    power: 102,
    engine: "659 cc",
    weight: "181 kg",
    topSpeed: "245 km/h",
    tag: "Light Sport",
    image: "assets/img/SPRINT 660.jpg",
    description:
      "Ligera, compacta y directa. Una deportiva para quienes valoran agilidad sobre exceso."
  },
  {
    id: 6,
    name: "NOMAD RIDGE 450",
    category: "Trial",
    price: 179900,
    power: 48,
    engine: "449 cc",
    weight: "142 kg",
    topSpeed: "165 km/h",
    tag: "Trail Explorer",
    image: "assets/img/RIDGE 450.jpg",
    description:
      "Suspensión de largo recorrido, bajo peso y control para caminos de tierra y montaña."
  },
  {
    id: 7,
    name: "NOMAD TERRAIN 700",
    category: "Trial",
    price: 229900,
    power: 74,
    engine: "689 cc",
    weight: "186 kg",
    topSpeed: "190 km/h",
    tag: "Adventure Trial",
    image: "assets/img/TERRAIN 700.png",
    description:
      "Una trial de aventura con autonomía, ergonomía y capacidad para abandonar el asfalto."
  }
];
