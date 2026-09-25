import {
  Sprout, Binoculars, Pickaxe, Ruler, Workflow, Zap,
  Boxes, ClipboardList, Files, MessagesSquare, Map as MapIcon, Pentagon,
  Scan, SquareDashed, LocateFixed, ListChecks, TrendingUp, Folder, ArrowRight, NotebookPen, Database,
} from "lucide-react";

// Single source for the service list: home grid, /services grid, navbar dropdown
// and the /services/[slug] detail pages all read from here.
export const SERVICES = [
  {
    slug: "agricultural",
    icon: Sprout,
    title: "Agricultural Drone Services",
    description:
      "Precision UAV operations for farmers and agricultural firms — from crop spraying to health assessments and farm mapping.",
    image: "/images/services/agricultural-spraying.jpg",
    features: [
      "Crop spraying & pesticide application",
      "Farm monitoring & surveillance",
      "Crop health & yield assessment",
      "Farm mapping & boundary survey",
    ],
    cta: "Register as a Farmer",
    ctaHref: "/signup",
  },
  {
    slug: "wildlife",
    icon: Binoculars,
    title: "Wildlife & Surveillance",
    description:
      "Autonomous aerial surveillance for conservation, anti-poaching, and area monitoring — capturing high-resolution footage across large landscapes.",
    image: "/images/services/wildlife-surveillance.jpg",
    features: [
      "Wildlife monitoring & tracking",
      "Anti-poaching patrol operations",
      "GPS tracking & geo-fencing",
      "High-resolution photo & video capture",
    ],
    cta: "Get in Touch",
    ctaHref: "/contact",
  },
  {
    slug: "mining",
    icon: Pickaxe,
    title: "Mining Operations",
    description:
      "Autonomous drone operations for mine sites — surveys, blast monitoring, stockpile measurement, and round-the-clock site visibility.",
    image: "/images/hero/mining-homepage.jpg",
    features: [
      "Site survey & stockpile measurement",
      "Blast & active pit monitoring",
      "Haul road & infrastructure inspection",
      "Thermal & night-time operations",
    ],
    cta: "Get in Touch",
    ctaHref: "/contact",
  },
  {
    slug: "pipeline",
    icon: Workflow,
    title: "Pipeline & Infrastructure Inspection",
    description:
      "Rapid, cost-effective drone inspections of oil, gas, and water pipelines — reducing downtime and manual risk for operators.",
    image: "/images/services/pipeline-infrastructure.jpg",
    // Optional overrides for the /services/[slug] hero; the card keeps title/description/image.
    hero: {
      image: "/images/hero/pipeline-homepage.jpg",
      title: "A Global Leader in Complete Pipeline Solutions",
      description:
        "Nkem Aeronautics delivers pipeline inspection, integrity assessment, Survey solutions for operators worldwide.",
    },
    // Detail-page sections, rendered in order under the hero (see services/[slug]/page.jsx).
    // type: "banner" = full-width image with overlaid text, "feature" = image beside text, "text" = eyebrow + paragraphs (optional side image),
    // "showcase" = centred heading + wide image + caption, "threats" = intro + threat cards, "benefits" = heading + icon/title/text grid.
    // Optional id + nav add the section to the sticky jump bar under the hero; optional points[] adds a tick list to feature/text.
    sections: [
      {
        type: "feature",
        id: "oil-gas",
        nav: "Oil & Gas",
        label: "Oil & Gas",
        image: "/images/hero/pipeline-integrity.jpg",
        title: "Oil & Gas Pipeline Integrity Solutions",
        text: "Nkem supports oil and gas operators with Drone inspection, integrity assessment, and surveillance designed to detect threats, reduce risk, and support safe pipeline operation.",
      },
      {
        type: "text",
        label: "The Challenge",
        heading: "Operating oil and gas pipelines requires continuous integrity control",
        paragraphs: [
          "Oil and gas pipelines operate under demanding conditions: pressure cycling, corrosion, mechanical damage, aging infrastructure, and strict regulatory expectations. Even minor defects can develop into leaks, shutdowns, environmental impact, or costly repairs.",
          "Nkem Aeronautics helps operators identify, size, and prioritize threats using inspection technologies, data analysis, and integrity services designed for safe and reliable operation.",
        ],
      },
      {
        type: "showcase",
        id: "solutions",
        nav: "Solutions",
        heading: "Complete Pipeline Solutions for Every Integrity Challenge",
        subtitle:
          "From inspection to reporting, Nkem Aeronautics supports operators across the full pipeline integrity lifecycle.",
        image: "/images/hero/pipeline-manufacturing.jpg",
        caption: {
          title: "Manufacturing & R&D",
          text: "Nkem Aeronautics designs, manufactures, and develops inspection technologies in-house to support complex pipeline conditions and evolving integrity needs.",
        },
      },
      {
        type: "threats",
        id: "threats",
        nav: "Threats We Detect",
        label: "Threats We Detect",
        heading: "Identifying what threatens your pipeline",
        text: "Every pipeline faces unique operating challenges. Our technologies are designed to accurately identify, size, and track integrity threats — enabling proactive maintenance and risk management.",
        items: [
          { title: "Corrosion", text: "External, and pitting metal loss", image: "/images/pipeline/corrosion.jpg" },
          { title: "Deformation", text: "Dents, ovalities, wrinkles, or buckles", image: "/images/pipeline/deformation.jpg" },
          { title: "Cracking", text: "SCC, fatigue, or weld-related defects", image: "/images/pipeline/cracking.jpg" },
          {
            title: "Wall Thinning",
            text: "Gradual wall-thickness reduction from erosion-corrosion or uniform internal attack — often missed without direct UT measurement.",
            image: "/images/pipeline/wall-thinning.jpg",
          },
          {
            title: "Pinholes",
            text: "Through-wall perforations from advanced pitting or microbial corrosion. Active leak points if untreated.",
            image: "/images/pipeline/pinholes.jpg",
          },
        ],
      },
      {
        type: "banner",
        id: "water",
        nav: "Water Pipelines",
        label: "Water",
        image: "/images/pipeline/water-pipelines.jpg",
        title: "Water Pipelines",
        text: "We deliver innovative inspection and integrity solutions for water pipelines, helping utilities maintain system safety, reduce leaks, and optimize performance. Our technologies ensure reliable water delivery and long-term infrastructure resilience.",
      },
      {
        type: "feature",
        topic: "Water Pipeline",
        image: "/images/pipeline/water-integrity.jpg",
        title: "Integrity Solutions",
        text: "Comprehensive inspection and integrity solutions for transmission and distribution water pipeline networks, helping operators maintain uninterrupted delivery of clean water, reduce losses, and extend infrastructure lifespan.",
        reverse: true,
      },
      {
        type: "text",
        label: "Introduction",
        image: "/images/pipeline/water-introduction.jpg",
        paragraphs: [
          "Modern water supply systems face aging infrastructure, increasing demand, and challenging operating environments. Even a small underground defect can lead to leaks, service disruptions, high operating costs, or public health risks.",
          "We support clients throughout the entire pipeline lifecycle: from condition assessment and maintenance planning to long-term asset integrity strategies.",
        ],
      },
      {
        type: "threats",
        label: "Threats We Detect",
        heading: "Identifying what threatens your pipeline",
        text: "Every pipeline faces unique operating challenges. Our technologies are designed to accurately identify, size, and track integrity threats — enabling proactive maintenance and risk management.",
        image: "/images/pipeline/water-threats.jpg",
        items: [
          { title: "Corrosion", text: "External, and pitting metal loss", image: "/images/pipeline/water-corrosion.jpg" },
          { title: "Cracking", text: "SCC, fatigue, or weld-related defects", image: "/images/pipeline/water-cracking.jpg" },
        ],
      },
    ],
    features: [
      "Pipeline leak detection",
      "Infrastructure condition assessment",
      "Remote site inspection",
      "Detailed inspection reporting",
    ],
    cta: "Get in Touch",
    ctaHref: "/contact",
  },
  {
    slug: "survey-mapping",
    icon: Ruler,
    title: "Aerial & Survey Mapping",
    description:
      "High-accuracy topographic surveys, volumetric measurements, and digital elevation models for engineering and government projects.",
    image: "/images/services/survey-mapping.jpg",
    hero: {
      image: "/images/hero/survey-homepage.jpg",
      title: "Turn raw drone data into survey-grade maps with Nkem Aeronautics drone mapping",
      description:
        "PPK, or post-processing kinematic, is a high-precision workflow that ensures your drone imagery is accurately geolocated. Using AeroPoints and high-accuracy drones, processing with Nkem Aeronautics PPK makes survey-grade mapping reliable, repeatable, and simple.",
    },
    sections: [
      {
        type: "benefits",
        items: [
          { icon: Scan, title: "Easy", text: "Capture geolocated imagery with minimal setup using our PPK workflow." },
          {
            icon: SquareDashed,
            title: "Scalable",
            text: "Survey small or large sites at any frequency while collecting consistent geospatial data.",
          },
          {
            icon: LocateFixed,
            title: "Accurate",
            text: "Achieve consistent survey-grade accuracy with post-processing kinematic techniques.",
          },
          { icon: ListChecks, title: "Insightful", text: "Validate your data with clear reports and expert review." },
        ],
      },
      {
        type: "text",
        id: "challenge",
        label: "The Challenge",
        heading: "Why unreliable survey data is costing you more than just time",
        image: "/images/survey/challenge.jpg",
        paragraphs: [
          "If your team is relying on a constant RTK and GPS rover signal in remote or complex terrain, you're betting your margins on a connection that can drop at any moment. A single data gap leads to unreliable surveys, which means:",
        ],
        points: [
          "Rework risk: grading to the wrong elevation because of vertical drift",
          "Wasted labour: sending crews back out to place more ground control points (GCPs)",
          "Communication breakdowns: disputes between the field and office over which numbers are right",
        ],
      },
      {
        type: "feature",
        id: "why-it-matters",
        label: "Why it matters",
        image: "/images/survey/why-surveillance-matters.jpeg",
        title: "Why Drone Surveillance matters",
        points: [
          "Remove reliance on real-time GNSS connections that can drift or fail",
          "Achieve consistent survey-grade accuracy across multiple flights and large sites",
          "Reduce errors and rework by validating imagery against precise ground control",
          "Make confident, data-driven decisions for planning and reporting",
          "Scale easily across projects while maintaining repeatable results",
        ],
      },
      {
        type: "feature",
        id: "how-it-works",
        label: "Step 1",
        image: "/images/survey/step-aeropoints.jpg",
        title: "Lay your AeroPoints",
        text: "Place AeroPoints on-site to record precise ground positions.",
      },
      {
        type: "feature",
        label: "Step 2",
        image: "/images/survey/step-drone-data.jpg",
        title: "Gather drone data",
        text: "Fly RTK-enabled drones along an automated flight path, then process with PPK.",
        reverse: true,
      },
      {
        type: "feature",
        label: "Step 3",
        image: "/images/survey/step-1-capture.jpg",
        title: "Hardware agnostic, accuracy obsessed",
        text: "Upload surface data from the capture or survey tool that best matches your accuracy needs — drone mapping, GNSS rover, total station, or other conventional methods. Nkem Aeronautics brings it all together into one unified map, stored in your Logbook. Our high-precision processing ensures every data point aligns reliably, no matter how it was captured, so your team can trust the map and make confident, accurate decisions across the site.",
      },
      {
        type: "feature",
        label: "Step 4",
        image: "/images/survey/step-2-verify.jpg",
        title: "Verify your data",
        text: "Along with your processed dataset, you'll receive a summary report, linked to your Logbook, detailing:",
        points: ["GNSS corrections applied to each photo", "Ground control accuracy", "Overall survey precision"],
        reverse: true,
      },
      {
        type: "feature",
        label: "Step 5",
        image: "/images/survey/step-3-upload.jpg",
        title: "Upload your data",
        text: "Transfer the collected data to your Logbook in Nkem Aeronautics for processing.",
      },
      {
        type: "feature",
        label: "Step 6",
        image: "/images/survey/step-4-processed.jpg",
        title: "Receive processed data",
        text: "Get a high-resolution 3D map, point cloud, and orthophoto.",
        reverse: true,
      },
      {
        type: "feature",
        label: "Step 7",
        image: "/images/survey/step-5-progress.jpg",
        title: "Run leaner, smarter, and with less guesswork",
      },
      {
        type: "feature",
        image: "/images/survey/daily-reporting.jpg",
        title: "Create daily reporting routines that drive data-driven quarry decisions",
        text: "Gain instant visibility into haul route performance and operator patterns to eliminate bottlenecks before they cost hours of wait time.",
        reverse: true,
      },
      {
        type: "feature",
        id: "stockpiles",
        image: "/images/survey/stockpiles.jpg",
        title: "Real-time insights for your construction aggregates and stockpiles",
        text: "From pit to stockpile, your team gets a single source of truth for decision-making. Track construction aggregate volumes, monitor production, see which trucks are on standby, idle, or running, and plan ahead with the latest site data at your fingertips.",
      },
      {
        type: "feature",
        image: "/images/survey/telematics.jpg",
        title: "Real-time machine telematics",
        text: "Take Nkem Aeronautics drone surveillance and mapping to the next level by bringing live machine data right onto your site map. See where your machines are, track cycle times, and monitor utilisation in real time. This seamless integration helps you cut downtime, boost operator efficiency, and keep every team member working from the same updated view.",
        reverse: true,
      },
      {
        type: "feature",
        image: "/images/survey/cad-workflows.jpg",
        title: "Lightweight CAD workflows",
        text: "Bring your designs to life. Whether they come from CAD, drone surveys, or site layouts, you can overlay design files directly onto your Logbook. Your team can annotate, mark up, and add context from the field so everyone in the office and on site can make confident decisions and collaborate seamlessly.",
      },
      {
        type: "benefits",
        heading: "Gain efficiency and stay ahead with real-time site data",
        items: [
          {
            icon: Boxes,
            title: "Optimized material management",
            text: "Get fast, accurate stockpile volumes and construction aggregates measurement that remove guesswork from material tracking. This precision drives operator efficiency, minimizes waste, and improves overall production monitoring.",
          },
          {
            icon: ClipboardList,
            title: "Streamlined site checks",
            text: "Keep a close eye on quality and operational standards with rapid, on-site inspections. Nkem Aeronautics' intuitive tools for site monitoring and digital twin visualization help teams catch issues early, reducing downtime and ensuring compliance.",
          },
          {
            icon: Files,
            title: "Enhanced daily reporting",
            text: "Access real-time insights that keep operations running smoothly. With Nkem Aeronautics' daily reporting, decision-makers can quickly address bottlenecks and align efforts across the site for smarter quarry management.",
          },
          {
            icon: MessagesSquare,
            title: "Collaborative field communication",
            text: "In an environment where roles often overlap, staying connected is crucial. Nkem Aeronautics' field collaboration tools foster better communication and alignment among all on-site teams while keeping construction aggregates operations organized.",
          },
          {
            icon: TrendingUp,
            title: "Track operator efficiency",
            text: "Monitor your machines live from the map to reduce idle time, identify issues, and create accountability across your field team.",
          },
          {
            icon: Folder,
            title: "Organize site docs",
            text: "Keep projects tidy, permissions secure, and data easy to access when and where you need it. Access all of your documentation from one central hub.",
          },
          {
            icon: ArrowRight,
            title: "Plan your next move",
            text: "Stay ahead of site challenges with predictive modeling and overlay designs on your reality to close the gap between current and future state.",
          },
        ],
      },
      {
        type: "benefits",
        label: "Solutions",
        heading: "How you can boost productivity with Nkem Aeronautics",
        image: "/images/survey/daily-reporting-email.jpg",
        items: [
          {
            icon: MapIcon,
            title: "Capture your reality",
            text: "Connect surveys from different sources on one map. Upload raw inputs for processing or pre-processed surfaces to analyze immediately.",
          },
          {
            icon: Pentagon,
            title: "Measure daily production",
            text: "Get precise measurements across your site. From distances and volumes to heights and grades, measure exactly what matters.",
          },
          {
            icon: NotebookPen,
            title: "Daily reporting",
            text: "Log site activity without slowing down the day. Capture updates in real time to keep operations efficient and teams aligned with quarry management goals.",
          },
          {
            icon: Database,
            title: "Data management",
            text: "Centralize everything from haul road measurements to stockpile history in one platform. Give your team access to the site data they need for precise construction aggregates measurement and reporting, when they need it, with data reports collected in your Nkem Aeronautics Logbook portal.",
          },
        ],
      },
      {
        type: "text",
        id: "whats-new",
        label: "Now in Nkem Aeronautics",
        heading: "Not your average 3D drone mapping software",
        paragraphs: [
          "Handheld scanning, RTK, and more.",
          "From field to office, these updates make it easier to capture data, move faster, and stay aligned on the same map using the Nkem Aeronautics website alongside your Logbook.",
        ],
      },
    ],
    features: [
      "Topographic & cadastral surveys",
      "Volumetric & stockpile measurement",
      "Digital elevation models (DEM)",
      "GIS-ready deliverables",
    ],
    cta: "Get in Touch",
    ctaHref: "/contact",
  },
  {
    slug: "evtol",
    icon: Zap,
    title: "eVTOL & Heavy-Lift Operations",
    description:
      "Specialised heavy-lift VTOL fixed-wing drone missions for cargo, emergency supply, and large-scale field operations.",
    image: "/images/services/evtol-heavy-lift.jpg",
    features: [
      "Heavy-lift payload delivery",
      "Emergency supply drops",
      "Large-area field coverage",
      "Long-range autonomous missions",
    ],
    cta: "Get in Touch",
    ctaHref: "/contact",
  },
];
