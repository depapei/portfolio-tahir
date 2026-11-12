import { PortfolioItem } from "@/types";

export const portfolioData: PortfolioItem[] = [
  {
    id: "eom-tracker",
    title: "End-of-Month (EOM) Process Management Application",
    slug: "eom-process-management-application",
    thumbnail: "",
    shortDescription:
      "Internal management application to track End-of-Month (EOM) processes for the Valuation Data Analytics team at BRI.",
    description:
      "A structured internal management application developed for the Valuation Data Analytics team within the Finance Management Accounting division at PT. Bank Rakyat Indonesia (Persero) Tbk. The application tracks End-of-Month (EOM) processes, improving team workflow and data organization.",
    technologies: ["SQL", "DBMS", "Process Flow Design"],
    gallery: [],
    responsibilities: [
      "Designed the application process flow for tracking EOM activities.",
      "Developed the structured management application for the team.",
      "Aligned the tool with the team's data extraction and validation workflow.",
    ],
    challenges: [
      "Organizing recurring EOM tasks and data across a cross-functional team.",
      "Maintaining data integrity for datasets used in official financial reporting.",
    ],
    results: ["Improved team workflow and data organization for EOM processes."],
    featured: true,
  },
  {
    id: "tangguh-berkibar",
    title: "Tangguh Berkibar — Financial Application for MSMEs (PKM-PM)",
    slug: "tangguh-berkibar-financial-application",
    thumbnail: "",
    shortDescription:
      "Financial tracking application for the Tangguh Berkibar MSME community, built under the PKM-PM program at UPJ.",
    description:
      "An intuitive and functional financial application designed and implemented to help the Tangguh Berkibar MSME community manage their financial tracking efficiently. Led as Project Leader & Business Analyst under the PKM-PM program at Universitas Pembangunan Jaya.",
    technologies: [
      "SDLC",
      "Business Analysis",
      "Test Case Scenarios",
      "Jira",
      "Trello",
      "Draw.io",
    ],
    gallery: [],
    responsibilities: [
      "Gathered and analyzed business and technical requirements with stakeholders.",
      "Translated requirements into clear, actionable specifications for the development team.",
      "Led and coordinated front-end and back-end developers throughout the SDLC.",
      "Oversaw testing and validation, iterating based on user feedback and test results.",
    ],
    challenges: [
      "Translating MSME financial needs into a simple, usable application.",
      "Keeping front-end and back-end work integrated and on schedule.",
    ],
    results: [
      "Delivered the application on time and to quality standards.",
      "Delivered a bug-free application that met end-user requirements.",
    ],
    featured: true,
  },
];
