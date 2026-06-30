'use client';

import { useState, useCallback } from 'react';
import styles from './StrategySection.module.css';
import {
  PRESET_STRATEGIES,
  makeThresholdStrategy,
  simulateStrategy,
  HIST_LABELS,
  type SimResult,
} from '@/lib/greed';

const SIM_TURNS = 10_000;

interface StrategyResult {
  name: string;
  result: SimResult;
}

function Histogram({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data, 0.01);
  return (
    <div className={styles.histogram}>
      {data.map((v, i) => (
        <div key={i} className={styles.histCol}>
          <div className={styles.histBarWrap}>
            <div
              className={styles.histBar}
              style={{ height: `${(v / max) * 100}%`, background: color }}
            />
          </div>
          <div className={styles.histPct}>{(v * 100).toFixed(0)}%</div>
          <div className={styles.histLabel}>{HIST_LABELS[i]}</div>
        </div>
      ))}
    </div>
  );
}

function ResultCard({ res, color }: { res: StrategyResult; color: string }) {
  return (
    <div className={styles.resultCard} style={{ borderColor: color + '55' }}>
      <div className={styles.resultName} style={{ color }}>{res.name}</div>
      <div className={styles.resultStats}>
        <div className={styles.resultStat}>
          <span className={styles.resultStatLabel}>AVG / TURN</span>
          <span className={styles.resultStatValue} style={{ color }}>
            {res.result.avgPoints.toFixed(1)}
          </span>
        </div>
        <div className={styles.resultStat}>
          <span className={styles.resultStatLabel}>BUST RATE</span>
          <span className={styles.resultStatValue}>
            {(res.result.bustRate * 100).toFixed(1)}%
          </span>
        </div>
      </div>
      <Histogram data={res.result.histogram} color={color} />
    </div>
  );
}

export default function StrategySection() {
  const [preset1, setPreset1] = useState(0);
  const [preset2, setPreset2] = useState(1);
  const [bankAt, setBankAt] = useState(400);
  const [bankIfDice, setBankIfDice] = useState(2);
  const [alwaysRoll, setAlwaysRoll] = useState(200);
  const [useCustom, setUseCustom] = useState(false);

  const [results, setResults] = useState<[StrategyResult, StrategyResult] | null>(null);
  const [running, setRunning] = useState(false);

  const run = useCallback(() => {
    setRunning(true);
    setTimeout(() => {
      const s1 = useCustom
        ? makeThresholdStrategy(bankAt, bankIfDice, alwaysRoll)
        : PRESET_STRATEGIES[preset1];
      const s2 = PRESET_STRATEGIES[preset2];

      const r1 = simulateStrategy(s1, SIM_TURNS);
      const r2 = simulateStrategy(s2, SIM_TURNS);

      setResults([
        { name: s1.name, result: r1 },
        { name: s2.name, result: r2 },
      ]);
      setRunning(false);
    }, 0);
  }, [useCustom, bankAt, bankIfDice, alwaysRoll, preset1, preset2]);

  const COLORS = ['var(--gold)', 'var(--blue-crystal)'];

  return (
    <div className={styles.wrap}>
      <h2 className={styles.sectionTitle}>Design a Strategy</h2>
      <p className={styles.subtitle}>
        Define decision rules and simulate {SIM_TURNS.toLocaleString()} turns to find the optimal approach.
      </p>

      <div className={styles.builderGrid}>
        {/* Strategy A */}
        <div className={styles.builderCard} style={{ borderColor: 'rgba(201,166,74,0.35)' }}>
          <div className={styles.cardLabel} style={{ color: 'var(--gold)' }}>Strategy A</div>

          <div className={styles.toggleRow}>
            <button
              className={`${styles.toggleBtn} ${!useCustom ? styles.toggleActive : ''}`}
              onClick={() => setUseCustom(false)}
            >
              Preset
            </button>
            <button
              className={`${styles.toggleBtn} ${useCustom ? styles.toggleActive : ''}`}
              onClick={() => setUseCustom(true)}
            >
              Custom
            </button>
          </div>

          {!useCustom ? (
            <div className={styles.presetList}>
              {PRESET_STRATEGIES.map((s, i) => (
                <button
                  key={s.name}
                  className={`${styles.presetBtn} ${preset1 === i ? styles.presetActive : ''}`}
                  onClick={() => setPreset1(i)}
                >
                  {s.name}
                </button>
              ))}
            </div>
          ) : (
            <div className={styles.sliders}>
              <label className={styles.sliderLabel}>
                <span>Bank if turn total ≥ <strong style={{ color: 'var(--gold)' }}>{bankAt}</strong></span>
                <input
                  type="range" min={100} max={2000} step={50}
                  value={bankAt}
                  onChange={e => setBankAt(Number(e.target.value))}
                  className={styles.slider}
                />
              </label>
              <label className={styles.sliderLabel}>
                <span>Bank if dice remaining ≤ <strong style={{ color: 'var(--gold)' }}>{bankIfDice}</strong></span>
                <input
                  type="range" min={0} max={5} step={1}
                  value={bankIfDice}
                  onChange={e => setBankIfDice(Number(e.target.value))}
                  className={styles.slider}
                />
              </label>
              <label className={styles.sliderLabel}>
                <span>Force-roll if total &lt; <strong style={{ color: 'var(--gold)' }}>{alwaysRoll}</strong></span>
                <input
                  type="range" min={0} max={1000} step={50}
                  value={alwaysRoll}
                  onChange={e => setAlwaysRoll(Number(e.target.value))}
                  className={styles.slider}
                />
              </label>
              <p className={styles.rulePreview}>
                Rule: if total &lt; {alwaysRoll} → roll; else if total ≥ {bankAt} or dice ≤ {bankIfDice} → bank; else roll
              </p>
            </div>
          )}
        </div>

        {/* Strategy B */}
        <div className={styles.builderCard} style={{ borderColor: 'rgba(79,168,232,0.35)' }}>
          <div className={styles.cardLabel} style={{ color: 'var(--blue-crystal)' }}>Strategy B (compare)</div>
          <div className={styles.presetList}>
            {PRESET_STRATEGIES.map((s, i) => (
              <button
                key={s.name}
                className={`${styles.presetBtn} ${preset2 === i ? styles.presetActiveBlue : ''}`}
                onClick={() => setPreset2(i)}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        className={styles.runBtn}
        onClick={run}
        disabled={running}
      >
        {running ? 'Simulating…' : `Run ${SIM_TURNS.toLocaleString()} Turns`}
      </button>

      {results && (
        <div className={styles.resultsGrid}>
          <ResultCard res={results[0]} color={COLORS[0]} />
          <ResultCard res={results[1]} color={COLORS[1]} />
        </div>
      )}
    </div>
  );
}
