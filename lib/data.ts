import { getProjectCrystalColor } from './projectColors';
import type { CrystalColor } from './projectColors';

export type Project = {
  name: string;
  desc: string;
  longDesc: string;
  tech: string[];
  demoLink?: string;
  demoLabel?: string;
  githubLink?: string;
  crystalColor?: CrystalColor;
  featured: boolean;
};

const projectData: Project[] = [
  {
    name: 'Meridian',
    desc: 'Group trip planner that uses AI to scrape conversation history and generate full itineraries. Built at Yale Hacks 2026.',
    longDesc: 'Group trip planner that uses AI to scrape conversation history and generate full itineraries. Built at Yale Hacks 2026.',
    tech: ['Next.js', 'TypeScript', 'MongoDB', 'Prisma', 'TailwindCSS'],
    demoLink: 'https://devpost.com/software/meridian-geqs1c',
    demoLabel: 'Devpost',
    featured: true,
  },
  {
    name: 'Cornell Guessr',
    desc: 'Cornell-themed GeoGuessr with React TypeScript frontend, Google Maps API for interactive guessing, and Firebase for auth and stats.',
    longDesc: 'Cornell-themed GeoGuessr with React TypeScript frontend, Google Maps API for interactive guessing, and Firebase for auth and stats.',
    tech: ['React', 'TypeScript', 'Firebase', 'Google Maps API', 'Express.js'],
    demoLink: 'https://cornellguessr.vercel.app/',
    demoLabel: 'Live site',
    githubLink: "https://github.com/carlhuu/CornellGuessr",
    featured: false,
  },
  {
    name: 'Cornell Table Tennis',
    desc: 'Full-stack website for the Cornell Table Tennis Club. Firebase auth, member management, and event listings.',
    longDesc: 'Full-stack website for the Cornell Table Tennis Club. Firebase auth, member management, and event listings.',
    tech: ['React.js', 'Firebase', 'TailwindCSS', 'Express.js', 'Node.js'],
    demoLink: 'https://cuttc.vercel.app/',
    demoLabel: 'Live site',
    featured: false,
  },
  {
    name: "CSES Solutions",
    desc: 'Collection of Java, C++ solutions to different algorithm problems in CSES Problem Set.',
    longDesc: 'Collection of Java solutions to different algorithm problems in CSES Problem Set, including dynamic programming and graph traversal algorithms.',
    tech: ['Java', 'C++'],
    githubLink: "https://github.com/gordonm0253/cses",
    featured: false,
  },
  {
    name: 'Critter World',
    desc: 'Multithreaded simulation where programmable critters eat, fighting, and evolve on a hex grid.',
    longDesc: 'Multithreaded simulation where programmable critters eat, fighting, and evolve on a hex grid.',
    tech: ['Java', 'JavaFX'],
    featured: false,
  },
  {
    name: 'Napify',
    desc: 'Beli-like app for Cornell campus nap spots. Won best UI during Spring 2026 AppDev Hack Challenge.',
    longDesc: 'Beli-like app for Cornell campus nap spots. Won best UI during Spring 2026 AppDev Hack Challenge.',
    tech: ['Swift', 'Python', 'Flask', 'SQLAlchemy'],
    githubLink: 'https://github.com/gordonm0253/napify',
    featured: false,
  },
  {
    name: "GD Visualizer",
    desc: "Visualizer for different gradient descent methods, such as SGD, SGD w/ momentum, and Adam.",
    longDesc: "Visualizer for different gradient descent methods, such as SGD, SGD w/ momentum, and Adam.",
    tech: ["JavaScript", "HTML/CSS"],
    demoLink: "https://gordonm0253.github.io/optimization-demo/",
    demoLabel: "Live Site",
    featured: false
  },
  {
    name: "CS Notes",
    desc: "Compilation of notes for different Cornell CS classes",
    longDesc: "Compilation of notes for different Cornell CS classes",
    tech: ["React.js", "HTML/CSS"],
    demoLink: "https://gordonm0253.github.io/cs-notes/",
    demoLabel: "Live Site",
    featured: false
  },
  {
    name: 'Greed',
    desc: 'Interactive dice game with a strategy simulator. Play Greed yourself and design your custom strategy.',
    longDesc: 'Interactive Greed dice game with two modes: play the game yourself (maximizing average score per turn), or use the Strategy Lab to define threshold-based rules and simulate 10,000 turns to compare expected value and bust rates.',
    tech: ['Next.js', 'TypeScript', 'CSS Modules'],
    demoLink: '/greed',
    demoLabel: 'Play',
    featured: false,
  },
];

export const projects = projectData
  .filter((project, index, allProjects) => (
    allProjects.findIndex((candidate) => candidate.name === project.name) === index
  ))
  .map((project, index) => ({
    ...project,
    crystalColor: project.crystalColor ?? getProjectCrystalColor(index),
  }));

export const social = {
  github: 'https://github.com/gordonm0253',
  linkedin: 'https://www.linkedin.com/in/gordon-mei/',
  email: 'gam278@cornell.edu',
};
