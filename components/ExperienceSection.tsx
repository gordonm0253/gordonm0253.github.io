'use client';

import { useEffect, useRef } from 'react';
import styles from './ExperienceSection.module.css';

interface Props {
  opacity: number;
  translateY: number;
}

export default function ExperienceSection({ opacity, translateY }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.opacity = String(opacity);
      ref.current.style.transform = `translateY(${translateY}px)`;
    }
  }, [opacity, translateY]);

  return (
    <section id="experience" className={styles.section}>
      <div ref={ref} className={styles.content}>
        <h2 className={styles.tag}>About Me</h2>

        <div className={styles.box}>
          <p className={styles.intro}>
            I'm a student at Cornell studying math and computer science. My interests span
            software development, machine learning, theory of computation, and computational biology. Outside of classes, I am a ...
          </p>
          <ul className={styles.bullets}>
            <li>
              Researcher at the{' '}
              <a href="https://aprilweilab.github.io/" target="_blank" rel="noopener noreferrer" className={styles.link}>Wei Lab</a>,
               where I work on building scalable pipelines for large-scale genomic analysis and local ancestry inference.
            </li>
            <li>
              Teaching Assistant for CS 4820 (Analysis of Algorithms), where I configure the autograder for programming assignments and run weekly office hours and discussion sections.
            </li>
            <li>
              Software Developer for <a href="https://cornellnexus.com" target="_blank" rel="noopener noreferrer" className={styles.link}>Cornell Nexus</a>, where we are 
              working on autonomous docking/parking routine for beach cleaning robot using CV and the ROS2 framework.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}