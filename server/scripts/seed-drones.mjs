import { prisma, disconnectDb } from "../src/config/prisma.js";

// Source: client-supplied "EVTOL & Large UAV Series" spec document.
// Prices weren't included in that document — every platform stays "Enquire to purchase"
// until real pricing is provided.
const DRONES = [
  {
    slug: "kem-15",
    name: "KEM-15 VTOL Fixed-Wing UAV",
    type: "VTOL Fixed-Wing",
    model: "KEM-15",
    description:
      "It features excellent flight performance, long endurance, high payload adaptability, and efficient operational capability. It can flexibly integrate various payloads for mapping, inspection, and environmental monitoring, meeting data acquisition needs across different mission scenarios. With stable and reliable performance and a high degree of customization, it provides efficient and accurate data acquisition solutions for multiple industries.",
    specs: {
      "Fuselage Length": "1.45 m",
      "Wingspan": "3.2 m",
      "Maximum Take-off Weight": "15 kg",
      "Maximum Payload": "3 kg",
      "Maximum Endurance": "3 h",
      "Maximum Speed": "120 km/h",
      "Service Ceiling": "4000 m",
      "Wind Resistance": "12 m/s",
      "Operating Environment": "-20°C to +45°C",
    },
    featureBadges: ["Modular Design", "High-Precision Positioning", "High-Altitude Adaptability", "Payload Adaptability"],
    images: ["/images/drones/kem-15.jpg"],
    applications: ["reconnaissance", "surveying_mapping", "agriculture_monitoring", "smart_city"],
  },
  {
    slug: "cmr-23e",
    name: "CMR-23E Tilt-Rotor Multirotor UAV",
    type: "Tilt-Rotor Multirotor",
    model: "CMR-23E",
    description:
      "Featuring an innovative tilt-rotor design, the CMR-23E enables seamless transition between multirotor vertical takeoff and landing and fixed-wing long-endurance cruise flight. Its intelligent eight-power-system configuration includes four inner rotors capable of 90° tilting, reducing dependence on takeoff and landing sites while combining the flexibility of multirotors with the efficiency of fixed-wing aircraft.",
    specs: {
      "Fuselage Length": "2.45 m",
      "Wingspan": "3.9 m",
      "Maximum Take-off Weight": "40 kg",
      "Maximum Payload": "5 kg",
      "Maximum Endurance": "2 h",
      "Maximum Speed": "150 km/h",
      "Service Ceiling": "4000 m",
      "Wind Resistance": "12 m/s",
      "Operating Environment": "-20°C to +45°C",
    },
    featureBadges: [],
    images: ["/images/drones/cmr-23e.jpg"],
    applications: [],
  },
  {
    slug: "cmr-23v",
    name: "CMR-23V VTOL Fixed-Wing UAV",
    type: "VTOL Fixed-Wing",
    model: "CMR-23V",
    description:
      "Designed for inspection and surveying, emergency response, aerial photography, and other operational scenarios, the CMR-23V is capable of performing missions in complex terrains such as mountains, hills, forests, and densely built urban areas. Its flexible deployment capability significantly expands UAV application possibilities, making it an ideal choice for industrial-grade operations.",
    specs: {
      "Wingspan": "4.5 m",
      "Endurance": "≥ 6 h",
      "Flight Range": "≥ 400 km",
      "Cruising Speed": "70–130 km/h",
      "Take-off Weight": "40 kg",
      "Power System": "Electric + Fuel",
      "Service Ceiling": "5000 m",
      "Mission Payload": "2–10 kg",
      "Take-off and Landing Mode": "Vertical takeoff and landing",
      "Data Link Range": "15–50 km",
    },
    featureBadges: ["Outstanding Performance", "Versatile Applications", "Intelligent Flight Control", "Heavy Payload Capacity"],
    images: ["/images/drones/cmr-23v.jpg"],
    applications: ["reconnaissance", "surveying_mapping", "emergency_response", "agriculture_monitoring", "smart_city"],
  },
  {
    slug: "zam-26a",
    name: "ZAM-26A VTOL Fixed-Wing UAV",
    type: "VTOL Fixed-Wing",
    model: "ZAM-26A",
    description:
      "Featuring an innovative hybrid configuration that combines fixed-wing aircraft with rotor systems, the ZAM-26A integrates the flexible vertical takeoff and landing capability of multirotors with the long-endurance advantages of fixed-wing platforms. It supports a wide range of mission payloads, including airborne satellite communication equipment, EO/IR gimbals, oblique photography cameras, PDT base stations, and broadband mesh communication systems. Designed for diverse operational scenarios, it is well suited for regional logistics, emergency communication, and mapping missions.",
    specs: {
      "Fuselage Length": "3.17 m",
      "Wingspan": "6.4 m",
      "Maximum Take-off Weight": "100 kg",
      "Maximum Payload": "≥ 40 kg",
      "Maximum Endurance": "≥ 6 h",
      "Power System": "Electric + Fuel",
      "Service Ceiling": "5000 m",
      "Cruising Speed": "90–150 km/h",
      "Wind Resistance": "12 m/s",
      "Operating Environment": "-20°C to +45°C",
    },
    featureBadges: ["Hybrid Power", "Heavy Payload Capacity", "Long Endurance", "Vertical Takeoff & Landing"],
    // No photo supplied yet for this platform.
    images: [],
    applications: ["reconnaissance", "surveying_mapping", "emergency_response", "agriculture_monitoring", "smart_city"],
  },
  {
    slug: "large-fixed-wing-uav",
    name: "Large Fixed-Wing UAV",
    type: "Fixed-Wing Cargo",
    model: null,
    description:
      "A large-capacity fixed-wing platform built for cargo transportation and aerial logistics. Distinct from the four smaller VTOL/fixed-wing models above, which are sized for inspection, surveying, and monitoring payloads rather than freight.",
    specs: {
      "Maximum Take-off Weight": "650 kg",
      "Maximum Payload": "Up to 200 kg",
      "Flight Range": "Approximately 1,500 km",
    },
    featureBadges: ["Ultra-Long Endurance", "Hybrid Power", "Long-Range Data Link", "Ultra-Heavy Payload Capacity"],
    // No photo supplied yet for this platform.
    images: [],
    applications: ["logistics"],
  },
];

for (const drone of DRONES) {
  const { slug, ...data } = drone;
  await prisma.product.upsert({
    where: { slug },
    create: { slug, sector: "evtol", availability: "Enquire to purchase", ...data },
    update: { sector: "evtol", availability: "Enquire to purchase", ...data },
  });
  console.log(`Seeded: ${drone.name}`);
}

await disconnectDb();
