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
    githubLink: "https://github.com/gordonm0253/cuttc",
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
    name: 'Critter World',
    desc: 'Multithreaded simulation where programmable critters eat, fighting, and evolve on a hex grid.',
    longDesc: 'Multithreaded simulation where programmable critters eat, fighting, and evolve on a hex grid.',
    tech: ['Java', 'JavaFX'],
    featured: false,
  },
  {
    name: 'Napify',
    desc: 'Beli-like app for Cornell campus nap spots. Created during Spring26 AppDev Hack Challenge.',
    longDesc: 'Beli-like app for Cornell campus nap spots. Created during Spring26 AppDev Hack Challenge.',
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
  }
];

export const projects = projectData
  .map((project) => ({
    ...project,
    crystalColor: project.crystalColor ?? getProjectCrystalColor(project.name),
  }))
  .filter((project, index, allProjects) => (
    allProjects.findIndex((candidate) => candidate.name === project.name) === index
  ));

export const social = {
  github: 'https://github.com/gordonm0253',
  linkedin: 'https://www.linkedin.com/in/gordon-mei/',
  email: 'gam278@cornell.edu',
};
