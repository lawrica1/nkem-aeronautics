// Nkem Aeronautics 2026 product range — the same data as the printed catalog
// (public/downloads/nkem-aeronautics-product-catalog-2026.pdf). The /products pages read from here.
// Live, purchasable items are separate: they are admin-managed in the database (see useProducts).

export const CATALOG_PDF = "/downloads/nkem-aeronautics-product-catalog-2026.pdf";

export const PRODUCT_FAMILIES = [
  {
    "id": "fixed-wing-vtol",
    "code": "01",
    "name": "Fixed-Wing & VTOL UAVs",
    "intro": "Long-range fixed-wing and vertical take-off platforms for mapping, survey, forestry and cargo missions, built in Lusaka.",
    "photo": "/images/products/family-fixed-wing.jpg",
    "compare": [
      "Wingspan",
      "Power",
      "Transmission",
      "Primary use"
    ],
    "quoteSector": "survey-mapping"
  },
  {
    "id": "multirotor",
    "code": "02",
    "name": "Multirotor UAVs",
    "intro": "Multirotor platforms for camera work, monitoring and light cargo, with vertical take-off from any clearing.",
    "photo": "/images/services/wildlife-surveillance.jpg",
    "compare": [
      "Flight time",
      "Transmission",
      "Gross weight",
      "Primary use"
    ],
    "quoteSector": "survey-mapping"
  },
  {
    "id": "spraying-equipment",
    "code": "03",
    "name": "Agricultural Spraying Equipment",
    "intro": "Remote-controlled ground sprayers for orchards and open fields, from a compact 120 L unit to a 1,000 L air-blast fog cannon.",
    "photo": "/images/services/agricultural-spraying.jpg",
    "compare": [
      "Tank",
      "Horizontal range",
      "Flow / nozzles",
      "Weight"
    ],
    "quoteSector": "agricultural"
  },
  {
    "id": "ground-robotics",
    "code": "04",
    "name": "Ground Transport Robotics",
    "intro": "Battery-electric tracked carriers that move up to 1.8 t across slopes, plantations and work sites by remote control.",
    "photo": "/images/applications/agriculture-monitoring.jpg",
    "compare": [
      "Load capacity",
      "Weight",
      "Run time",
      "Remote range"
    ],
    "quoteSector": "agricultural"
  },
  {
    "id": "partner-drones",
    "code": "05",
    "name": "Partner Agricultural Drones",
    "intro": "Third-party spraying drones supplied and supported by Nkem Aeronautics as complete, ready-to-fly field kits.",
    "photo": "/images/products/dji-t50-generator-kit.jpg",
    "compare": [
      "Batteries",
      "Tanks / charging",
      "Application",
      "Pricing"
    ],
    "quoteSector": "agricultural"
  }
];

export const PRODUCT_RANGE = [
  {
    "slug": "aw1338-levitate",
    "family": "fixed-wing-vtol",
    "model": "AW1338",
    "name": "AW1338 Levitate",
    "image": "/images/products/aw1338-levitate.jpg",
    "tagline": "Long-distance fixed-wing mapping drone with HD 4K camera and GPS.",
    "keyFigures": [
      {
        "value": "3,600 mm",
        "label": "Wingspan"
      },
      {
        "value": "2–2.5 kg",
        "label": "Payload"
      },
      {
        "value": "5,000 m",
        "label": "Practical ceiling"
      }
    ],
    "specs": [
      {
        "group": "Airframe",
        "rows": [
          [
            "Wingspan",
            "3,600 mm"
          ],
          [
            "Fuselage length",
            "1,800 mm"
          ],
          [
            "Material",
            "Carbon fibre"
          ]
        ]
      },
      {
        "group": "Performance",
        "rows": [
          [
            "Cruising speed",
            "20 m/s"
          ],
          [
            "Practical ceiling",
            "5,000 m"
          ],
          [
            "Wind resistance",
            "Level 5"
          ],
          [
            "Payload",
            "2–2.5 kg"
          ]
        ]
      },
      {
        "group": "Control",
        "rows": [
          [
            "Control type",
            "Remote control"
          ],
          [
            "Operator skill level",
            "Beginner"
          ],
          [
            "Gyro",
            "On request"
          ]
        ]
      },
      {
        "group": "Commercial",
        "rows": [
          [
            "Model",
            "AW1338"
          ],
          [
            "Place of origin",
            "Lusaka, Zambia"
          ],
          [
            "Private mould",
            "No"
          ]
        ]
      }
    ],
    "applications": [
      "Mapping"
    ],
    "compare": {
      "Wingspan": "3,600 mm",
      "Power": "—",
      "Transmission": "—",
      "Primary use": "Mapping"
    }
  },
  {
    "slug": "aw1749-levitate-vtol",
    "family": "fixed-wing-vtol",
    "model": "AW1749",
    "name": "AW1338 Levitate VTOL",
    "image": "/images/products/aw1749-levitate-vtol.jpg",
    "tagline": "Gasoline VTOL fixed-wing UAV for high-payload, long-range survey with vertical take-off.",
    "keyFigures": [
      {
        "value": "VTOL",
        "label": "Take-off"
      },
      {
        "value": "Gasoline",
        "label": "Power source"
      },
      {
        "value": "RTK",
        "label": "Positioning"
      }
    ],
    "specs": [
      {
        "group": "Capabilities",
        "rows": [
          [
            "Positioning",
            "RTK"
          ],
          [
            "Aerial photography",
            "Yes"
          ],
          [
            "Video capture",
            "Not included"
          ],
          [
            "Use",
            "Outdoor"
          ]
        ]
      },
      {
        "group": "Power & control",
        "rows": [
          [
            "Power source",
            "Gasoline"
          ],
          [
            "Controller power",
            "Battery"
          ],
          [
            "Remote distance",
            "Depends on controller"
          ],
          [
            "Operator skill level",
            "Expert"
          ]
        ]
      },
      {
        "group": "Commercial",
        "rows": [
          [
            "Model",
            "AW1749"
          ],
          [
            "Place of origin",
            "Lusaka, Zambia"
          ]
        ]
      }
    ],
    "applications": [
      "Long-range survey",
      "Aerial photography"
    ],
    "compare": {
      "Wingspan": "—",
      "Power": "Gasoline",
      "Transmission": "Controller-dependent",
      "Primary use": "Long-range survey"
    }
  },
  {
    "slug": "zam237",
    "family": "fixed-wing-vtol",
    "model": "ZAM237",
    "name": "ZAM237",
    "image": "/images/products/zam237.jpg",
    "tagline": "High-quality carbon-fibre fixed-wing drone kit, a reliable choice for long-distance missions.",
    "keyFigures": [
      {
        "value": "2 km",
        "label": "Image transmission"
      },
      {
        "value": "≤ 10 min",
        "label": "Max flight time"
      },
      {
        "value": "1 pc",
        "label": "Minimum order"
      }
    ],
    "specs": [
      {
        "group": "Airframe",
        "rows": [
          [
            "Product",
            "Drone airframe kit"
          ],
          [
            "Material",
            "Carbon fibre / polymer"
          ],
          [
            "Colour",
            "Customisable"
          ],
          [
            "Motor",
            "Brushed"
          ],
          [
            "Gyro",
            "2-axis"
          ]
        ]
      },
      {
        "group": "Performance",
        "rows": [
          [
            "Max flight time",
            "≤ 10 min"
          ],
          [
            "Image transmission",
            "2 km"
          ],
          [
            "Still image",
            "2 MP"
          ],
          [
            "Function",
            "Altitude hold"
          ],
          [
            "Take-off",
            "Sliding (runway)"
          ]
        ]
      },
      {
        "group": "Commercial",
        "rows": [
          [
            "Model",
            "ZAM237"
          ],
          [
            "Category",
            "Beginner"
          ],
          [
            "Control type",
            "Remote control"
          ],
          [
            "Private mould",
            "Yes"
          ],
          [
            "MOQ",
            "1 pc"
          ]
        ]
      }
    ],
    "applications": [
      "Cargo delivery"
    ],
    "compare": {
      "Wingspan": "—",
      "Power": "Electric (brushed)",
      "Transmission": "2 km",
      "Primary use": "Cargo delivery"
    }
  },
  {
    "slug": "zam201-vtol",
    "family": "fixed-wing-vtol",
    "model": "ZAM201",
    "name": "ZAM201 VTOL UAV",
    "image": "/images/products/zam201-vtol.jpg",
    "tagline": "General-purpose fixed-wing aircraft for robust aerial mapping, survey training and commercial work.",
    "keyFigures": [
      {
        "value": "1 km",
        "label": "Transmission"
      },
      {
        "value": "Electric",
        "label": "Power"
      },
      {
        "value": "Waterproof",
        "label": "Airframe"
      }
    ],
    "specs": [
      {
        "group": "Airframe",
        "rows": [
          [
            "Material",
            "Wood"
          ],
          [
            "Gyro",
            "Yes"
          ],
          [
            "Feature",
            "Waterproof"
          ],
          [
            "Private mould",
            "Yes"
          ]
        ]
      },
      {
        "group": "Performance",
        "rows": [
          [
            "Max flight time",
            "Customisable"
          ],
          [
            "Transmission",
            "1 km"
          ],
          [
            "Functions",
            "Altitude hold, one-key operation"
          ]
        ]
      },
      {
        "group": "Power & control",
        "rows": [
          [
            "Engine type",
            "Electric"
          ],
          [
            "Control type",
            "Remote control"
          ]
        ]
      },
      {
        "group": "Commercial",
        "rows": [
          [
            "Model",
            "ZAM201"
          ],
          [
            "Category",
            "Commercial"
          ],
          [
            "Place of origin",
            "Lusaka, Zambia"
          ],
          [
            "MOQ",
            "1 set"
          ]
        ]
      }
    ],
    "applications": [
      "Aerial mapping",
      "Survey training",
      "Commercial"
    ],
    "compare": {
      "Wingspan": "—",
      "Power": "Electric",
      "Transmission": "1 km",
      "Primary use": "Mapping & training"
    }
  },
  {
    "slug": "zam13e",
    "family": "fixed-wing-vtol",
    "model": "ZAM13E",
    "name": "ZAM13E Fixed-Wing UAV",
    "image": "/images/products/zam13e.jpg",
    "tagline": "Long-range survey platform with a 2,700 mm wingspan for professional forest surveys and aerial mapping.",
    "keyFigures": [
      {
        "value": "2,700 mm",
        "label": "Wingspan"
      },
      {
        "value": "1 km",
        "label": "Transmission"
      },
      {
        "value": "70 kg",
        "label": "Gross weight"
      }
    ],
    "specs": [
      {
        "group": "Airframe",
        "rows": [
          [
            "Wingspan",
            "2,700 mm"
          ],
          [
            "Material",
            "Wood"
          ],
          [
            "Gross weight",
            "70 kg"
          ],
          [
            "Package size",
            "120 × 45 × 50 cm"
          ],
          [
            "Gyro",
            "Yes"
          ]
        ]
      },
      {
        "group": "Performance",
        "rows": [
          [
            "Max flight time",
            "Customisable"
          ],
          [
            "Transmission",
            "1 km"
          ]
        ]
      },
      {
        "group": "Power & control",
        "rows": [
          [
            "Engine type",
            "Electric"
          ],
          [
            "Control type",
            "Remote control"
          ],
          [
            "Operator skill level",
            "Beginner"
          ]
        ]
      },
      {
        "group": "Commercial",
        "rows": [
          [
            "Model",
            "ZAM13E"
          ],
          [
            "Category",
            "Commercial"
          ],
          [
            "Place of origin",
            "Lusaka, Zambia"
          ],
          [
            "Private mould",
            "Yes"
          ]
        ]
      }
    ],
    "applications": [
      "Forest survey",
      "Aerial mapping"
    ],
    "compare": {
      "Wingspan": "2,700 mm",
      "Power": "Electric",
      "Transmission": "1 km",
      "Primary use": "Forest survey"
    }
  },
  {
    "slug": "zam2001",
    "family": "multirotor",
    "model": "ZAM2001",
    "name": "ZAM2001 Drone Camera",
    "image": "/images/products/zam2001.jpg",
    "tagline": "High-performance professional drone with advanced 8K camera capability, GPS and cargo carriage.",
    "keyFigures": [
      {
        "value": "31–40 min",
        "label": "Max flight time"
      },
      {
        "value": "1 km",
        "label": "Transmission"
      },
      {
        "value": "70 kg",
        "label": "Gross weight"
      }
    ],
    "specs": [
      {
        "group": "Platform",
        "rows": [
          [
            "Product name",
            "XH15E Cargo UAV"
          ],
          [
            "Material",
            "Wood"
          ],
          [
            "Gyro",
            "Yes"
          ],
          [
            "Gross weight",
            "70 kg"
          ],
          [
            "Package size",
            "120 × 45 × 50 cm"
          ]
        ]
      },
      {
        "group": "Performance",
        "rows": [
          [
            "Max flight time",
            "31–40 min"
          ],
          [
            "Transmission",
            "1 km"
          ],
          [
            "Engine type",
            "Electric"
          ]
        ]
      },
      {
        "group": "Commercial",
        "rows": [
          [
            "Model",
            "ZAM2001"
          ],
          [
            "Category",
            "Commercial"
          ],
          [
            "Operator level",
            "Beginner"
          ],
          [
            "Place of origin",
            "Lusaka, Zambia"
          ],
          [
            "MOQ",
            "1 set"
          ]
        ]
      }
    ],
    "applications": [
      "Aerial imaging",
      "Cargo"
    ],
    "compare": {
      "Flight time": "31–40 min",
      "Transmission": "1 km",
      "Gross weight": "70 kg",
      "Primary use": "Imaging & cargo"
    }
  },
  {
    "slug": "fog-cannon-sprayer-1000l",
    "family": "spraying-equipment",
    "model": null,
    "name": "1000 L Air-Blast Fog Cannon Sprayer",
    "image": "/images/products/fog-cannon-sprayer-1000l.jpg",
    "tagline": "Industrial tracked/wheeled air-blast sprayer engineered for large-scale crop protection, orchards and pest control.",
    "keyFigures": [
      {
        "value": "1,000 L",
        "label": "Tank capacity"
      },
      {
        "value": "16",
        "label": "Nozzles"
      },
      {
        "value": "200 m",
        "label": "Remote range"
      }
    ],
    "specs": [
      {
        "group": "Dimensions",
        "rows": [
          [
            "Machine size",
            "2,200 × 1,200 × 2,300 mm"
          ],
          [
            "Machine weight",
            "900 kg"
          ],
          [
            "Climbing ability",
            "< 40°"
          ]
        ]
      },
      {
        "group": "Spraying",
        "rows": [
          [
            "Tank capacity",
            "1,000 L"
          ],
          [
            "Spray pump",
            "3-cylinder 80, diesel"
          ],
          [
            "Nozzles",
            "16"
          ]
        ]
      },
      {
        "group": "Drive",
        "rows": [
          [
            "Engine",
            "195F"
          ],
          [
            "Travel motors",
            "2 × 2,200 W"
          ],
          [
            "Travel speed",
            "20–70 m/min"
          ]
        ]
      },
      {
        "group": "Control",
        "rows": [
          [
            "Control mode",
            "Remote control (RC)"
          ],
          [
            "Remote distance",
            "200 m"
          ]
        ]
      }
    ],
    "applications": [
      "Orchards",
      "Open fields",
      "Pest control"
    ],
    "compare": {
      "Tank": "1,000 L",
      "Horizontal range": "—",
      "Flow / nozzles": "16 nozzles",
      "Weight": "900 kg"
    }
  },
  {
    "slug": "compact-fog-sprayer-120l",
    "family": "spraying-equipment",
    "model": null,
    "name": "Compact Wheeled Fog Sprayer 120 L",
    "image": "/images/products/compact-fog-sprayer-120l.png",
    "tagline": "Agile sprayer with variable-rate output that matches spray volume to travel speed for zero crop waste.",
    "keyFigures": [
      {
        "value": "120 L",
        "label": "Tank capacity"
      },
      {
        "value": "17 m",
        "label": "Range per side"
      },
      {
        "value": "8 L/min",
        "label": "Max flow rate"
      }
    ],
    "specs": [
      {
        "group": "Spraying",
        "rows": [
          [
            "Tank capacity",
            "120 L"
          ],
          [
            "Max flow rate",
            "8 L/min"
          ],
          [
            "Droplet size",
            "60–200 µm"
          ],
          [
            "Horizontal range",
            "17 m per side"
          ],
          [
            "Rate control",
            "Variable, speed-matched"
          ]
        ]
      },
      {
        "group": "Vehicle",
        "rows": [
          [
            "Vehicle width",
            "80 cm"
          ],
          [
            "Curb weight",
            "80 kg"
          ],
          [
            "Max travel speed",
            "1.5 m/s"
          ],
          [
            "Max gradeability",
            "20% (8°)"
          ]
        ]
      }
    ],
    "applications": [
      "Orchards",
      "Row crops"
    ],
    "compare": {
      "Tank": "120 L",
      "Horizontal range": "17 m / side",
      "Flow / nozzles": "8 L/min",
      "Weight": "80 kg"
    }
  },
  {
    "slug": "advanced-fog-sprayer-140l",
    "family": "spraying-equipment",
    "model": null,
    "name": "Advanced Wheeled Fog Sprayer 140 L",
    "image": "/images/products/advanced-fog-sprayer-140l.png",
    "tagline": "Heavy-duty multi-fan sprayer delivering superior coverage with a 140 L tank and 34 m reach per side.",
    "keyFigures": [
      {
        "value": "140 L",
        "label": "Tank capacity"
      },
      {
        "value": "34 m",
        "label": "Range per side"
      },
      {
        "value": "16 L/min",
        "label": "Max flow rate"
      }
    ],
    "specs": [
      {
        "group": "Spraying",
        "rows": [
          [
            "Tank capacity",
            "140 L"
          ],
          [
            "Max flow rate",
            "16 L/min"
          ],
          [
            "Droplet size",
            "120–400 µm"
          ],
          [
            "Horizontal range",
            "34 m per side"
          ],
          [
            "Fans",
            "Multi-fan"
          ]
        ]
      },
      {
        "group": "Vehicle",
        "rows": [
          [
            "Vehicle width",
            "80 cm"
          ],
          [
            "Curb weight",
            "160 kg"
          ],
          [
            "Max travel speed",
            "3 m/s"
          ],
          [
            "Max gradeability",
            "20% (8°)"
          ]
        ]
      }
    ],
    "applications": [
      "Orchards",
      "Large fields"
    ],
    "compare": {
      "Tank": "140 L",
      "Horizontal range": "34 m / side",
      "Flow / nozzles": "16 L/min",
      "Weight": "160 kg"
    }
  },
  {
    "slug": "dumpcart",
    "family": "ground-robotics",
    "model": null,
    "name": "Dumpcart",
    "image": "/images/products/dumpcart.jpg",
    "tagline": "Remote-controlled tracked dump carrier for moving heavy loads over rough and sloped ground.",
    "keyFigures": [
      {
        "value": "1.8 t",
        "label": "Load capacity"
      },
      {
        "value": "8 h",
        "label": "Run time"
      },
      {
        "value": "< 45°",
        "label": "Climbing ability"
      }
    ],
    "specs": [
      {
        "group": "Dimensions",
        "rows": [
          [
            "Machine size",
            "1,800 × 1,200 × 1,200 mm"
          ],
          [
            "Machine weight",
            "600 kg"
          ],
          [
            "Track width",
            "180 mm"
          ],
          [
            "Load capacity",
            "1.8 t"
          ]
        ]
      },
      {
        "group": "Drive & power",
        "rows": [
          [
            "Travel motors",
            "2 × 1,500 W"
          ],
          [
            "Travel speed",
            "20–70 m/min"
          ],
          [
            "Climbing ability",
            "< 45°"
          ],
          [
            "Battery",
            "130 Ah Li-ion"
          ],
          [
            "Run time",
            "8 h"
          ]
        ]
      },
      {
        "group": "Control",
        "rows": [
          [
            "Control mode",
            "Remote control (RC)"
          ],
          [
            "Remote distance",
            "200 m"
          ]
        ]
      }
    ],
    "applications": [
      "Plantations",
      "Construction",
      "Site logistics"
    ],
    "compare": {
      "Load capacity": "1.8 t",
      "Weight": "600 kg",
      "Run time": "8 h",
      "Remote range": "200 m"
    }
  },
  {
    "slug": "crawler-transport-vehicle",
    "family": "ground-robotics",
    "model": null,
    "name": "Crawler Transport Vehicle",
    "image": "/images/products/crawler-transport-vehicle.jpg",
    "tagline": "Remote-controlled tracked transport vehicle with an open cargo bed for harvest and materials handling.",
    "keyFigures": [
      {
        "value": "1.8 t",
        "label": "Load capacity"
      },
      {
        "value": "8 h",
        "label": "Run time"
      },
      {
        "value": "200 m",
        "label": "Remote range"
      }
    ],
    "specs": [
      {
        "group": "Dimensions",
        "rows": [
          [
            "Machine size",
            "1,800 × 1,200 × 1,200 mm"
          ],
          [
            "Machine weight",
            "450 kg"
          ],
          [
            "Track width",
            "180 mm"
          ],
          [
            "Load capacity",
            "1.8 t"
          ]
        ]
      },
      {
        "group": "Drive & power",
        "rows": [
          [
            "Travel motors",
            "2 × 1,200 W"
          ],
          [
            "Travel speed",
            "20–70 m/min"
          ],
          [
            "Climbing ability",
            "< 45°"
          ],
          [
            "Battery",
            "130 Ah Li-ion"
          ],
          [
            "Run time",
            "8 h"
          ]
        ]
      },
      {
        "group": "Control",
        "rows": [
          [
            "Control mode",
            "Remote control (RC)"
          ],
          [
            "Remote distance",
            "200 m"
          ]
        ]
      }
    ],
    "applications": [
      "Harvest transport",
      "Plantations",
      "Site logistics"
    ],
    "compare": {
      "Load capacity": "1.8 t",
      "Weight": "450 kg",
      "Run time": "8 h",
      "Remote range": "200 m"
    }
  },
  {
    "slug": "dji-t100",
    "family": "partner-drones",
    "model": "T100",
    "name": "DJI T100 Agricultural Drone (2026)",
    "image": "/images/products/dji-t100.jpg",
    "tagline": "Flagship 2026 agricultural drone bundle with dedicated spraying and spreading tanks, long battery endurance and a professional remote controller.",
    "keyFigures": [
      {
        "value": "3",
        "label": "Flight batteries included"
      },
      {
        "value": "2-in-1",
        "label": "Spraying & spreading"
      },
      {
        "value": "Optional",
        "label": "Generator"
      }
    ],
    "specs": [
      {
        "group": "Bundle",
        "rows": [
          [
            "Drone",
            "DJI T100 (2026)"
          ],
          [
            "Tanks",
            "Spraying & spreading"
          ],
          [
            "Flight batteries",
            "3 included"
          ],
          [
            "Remote controller",
            "Professional RC"
          ],
          [
            "Generator",
            "Optional"
          ]
        ]
      },
      {
        "group": "Supply",
        "rows": [
          [
            "Flight support",
            "14 h endurance support"
          ],
          [
            "Stock location",
            "Lusaka, Zambia"
          ],
          [
            "Pricing",
            "Excl. VAT"
          ]
        ]
      }
    ],
    "applications": [
      "Large-acreage farming"
    ],
    "compare": {
      "Batteries": "3 included",
      "Tanks / charging": "Spray + spread; generator optional",
      "Application": "Large acreage",
      "Pricing": "Excl. VAT"
    },
    "thirdParty": true
  },
  {
    "slug": "dji-t50-generator-kit",
    "family": "partner-drones",
    "model": "T50",
    "name": "DJI T50 Agricultural Drone Generator Kit",
    "image": "/images/products/dji-t50-generator-kit.jpg",
    "tagline": "Powerful, proven and pilot-friendly: a buy-and-fly spraying kit with generator charging for nonstop operation.",
    "keyFigures": [
      {
        "value": "3",
        "label": "T50 flight batteries"
      },
      {
        "value": "Generator",
        "label": "Integrated charger"
      },
      {
        "value": "Buy & fly",
        "label": "Complete kit"
      }
    ],
    "specs": [
      {
        "group": "Kit contents",
        "rows": [
          [
            "Core unit",
            "DJI T50 drone & RC"
          ],
          [
            "Flight batteries",
            "3 × T50 flight batteries"
          ],
          [
            "Charging",
            "Generator with integrated charger"
          ],
          [
            "Support gear",
            "Cooling station"
          ]
        ]
      },
      {
        "group": "Accessories",
        "rows": [
          [
            "RC batteries",
            "2"
          ],
          [
            "Battery / remote charger",
            "100 W"
          ],
          [
            "Extras",
            "Generator cover, cords"
          ]
        ]
      }
    ],
    "applications": [
      "Crop spraying",
      "Fleet operations"
    ],
    "compare": {
      "Batteries": "3 included",
      "Tanks / charging": "Generator charging kit",
      "Application": "Crop spraying",
      "Pricing": "On request"
    },
    "description": "The DJI T50 is a dependable workhorse with intuitive flight software and built-in data tracking via app. Paired with our generator-based charging system and cooling station, the kit is built for nonstop spraying and minimal downtime. Everything needed for efficient operation is bundled from the start.",
    "thirdParty": true
  }
];

export const findProduct = (slug) => PRODUCT_RANGE.find((p) => p.slug === slug);
export const findFamily = (id) => PRODUCT_FAMILIES.find((f) => f.id === id);
export const productsInFamily = (id) => PRODUCT_RANGE.filter((p) => p.family === id);
