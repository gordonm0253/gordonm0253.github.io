import { getProjectCrystalColor } from './projectColors';
import type { CrystalColor } from './projectColors';

export type Project = {
  name: string;
  desc: string;
  tech: string[];
  link: string | null;
  linkLabel: string;
  crystalColor?: CrystalColor;
  featured: boolean;
};

const projectData: Project[] = [
  {
    name: 'Meridian',
    desc: 'Group trip planner that uses AI to scrape conversation history and generate full itineraries. Built at Yale Hacks 2026.',
    tech: ['Next.js', 'TypeScript', 'MongoDB', 'Prisma', 'TailwindCSS'],
    link: 'https://devpost.com/software/meridian-geqs1c',
    linkLabel: 'Devpost ↗',
    featured: true,
  },
  {
    name: 'Cornell Guessr',
    desc: 'Cornell-themed GeoGuessr with React TypeScript frontend, Google Maps API for interactive guessing, and Firebase for auth and stats.',
    tech: ['React', 'TypeScript', 'Firebase', 'Maps API', 'Express.js'],
    link: 'https://cornellguessr.vercel.app/',
    linkLabel: 'Live site ↗',
    featured: false,
  },
  {
    name: 'Cornell Table Tennis',
    desc: 'Full-stack website for the Cornell Table Tennis Club. Firebase auth, member management, and event listings.',
    tech: ['React.js', 'Firebase', 'TailwindCSS', 'Express.js', 'Node.js'],
    link: 'https://cuttc.vercel.app/',
    linkLabel: 'Live site ↗',
    featured: false,
  },
  {
    name: 'Critter World',
    desc: 'Multithreaded simulation where programmable critters eat, fighting, and evolve on a hex grid.',
    tech: ['Java', 'JavaFX'],
    link: null,
    linkLabel: 'Repo coming soon...',
    featured: false,
  },
  {
    name: 'napify',
    desc: 'Beli-like app for Cornell campus nap spots. Creating during Spring26 AppDev Hack Challenge.',
    tech: ['Swift', 'Python', 'Flask', 'SQLAlchemy'],
    link: 'https://github.com/gordonm0253/napify',
    linkLabel: 'Github ↗',
    featured: false,
  },
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
