'use client';

import { useState } from 'react';
import styles from './GameSection.module.css';
import DiceRow, { type DieState } from './DiceRow';
import { rollDice, scoreDice, isBust } from '@/lib/greed';

function HowToPlay() {
  const [open, setOpen] = useState(true);
  return (
    <div className={styles.howTo}>
      <button className={styles.howToToggle} onClick={() => setOpen(o => !o)}>
        <span>How to Play</span>
        <span className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}>▾</span>
      </button>
      {open && (
        <div className={styles.howToBody}>
          <div className={styles.howToStep}>
            <span className={styles.howToNum}>1</span>
            <span>Press <strong>Roll</strong> to roll all 6 dice. If no dice score, you <strong className={styles.colorRed}>bust</strong> — turn ends with 0.</span>
          </div>
          <div className={styles.howToStep}>
            <span className={styles.howToNum}>2</span>
            <span>When dice score, you have <strong>three choices</strong>:</span>
          </div>
          <div className={styles.howToChoices}>
            <div className={styles.howToChoice}>
              <span className={styles.howToChoiceLabel} style={{color:'var(--blue-crystal)'}}>Bank</span>
              <span>End your turn and keep all points scored so far.</span>
            </div>
            <div className={styles.howToChoice}>
              <span className={styles.howToChoiceLabel} style={{color:'var(--gold)'}}>Set Aside &amp; Roll</span>
              <span>Move the scoring dice to the side. Roll the remaining dice for more points. If the new roll doesn't score — you <strong className={styles.colorRed}>bust</strong> and lose everything.</span>
            </div>
            <div className={styles.howToChoice}>
              <span className={styles.howToChoiceLabel} style={{color:'rgba(200,80,80,0.85)'}}>Re-roll All 6</span>
              <span>Abandon your current points and re-roll all 6 dice for a fresh start.</span>
            </div>
          </div>
          <div className={styles.howToGoal}>
            Goal: maximize your <strong>average score per turn</strong>.
          </div>
          <div className={styles.howToScoring}>
            <div className={styles.howToScoringTitle}>Scoring</div>
            <div className={styles.howToScoringGrid}>
              <span>Single 1</span><span>100 pts</span>
              <span>Single 5</span><span>50 pts</span>
              <span>Three of a kind (N)</span><span>N × 100 pts</span>
              <span>Three 1s</span><span>1000 pts</span>
              <span>Four+ of a kind</span><span>doubles each extra die</span>
              <span>Three pairs</span><span>500 pts</span>
              <span>Straight 1–5 or 2–6</span><span>1000 pts</span>
              <span>Straight 1–6</span><span>1500 pts</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

type Phase = 'start' | 'rolled' | 'bust' | 'banked';

interface AsideRound {
  dice: number[];
  points: number;
}

interface TurnRecord {
  score: number;
  bust: boolean;
}

function avg(records: TurnRecord[]): number {
  if (!records.length) return 0;
  return records.reduce((s, r) => s + r.score, 0) / records.length;
}

export default function GameSection() {
  const [phase, setPhase] = useState<Phase>('start');
  const [activeDice, setActiveDice] = useState<number[]>([]);
  // Each entry is one "set aside" action: the dice kept and their points
  const [asideRounds, setAsideRounds] = useState<AsideRound[]>([]);
  const [history, setHistory] = useState<TurnRecord[]>([]);
  const [lastBanked, setLastBanked] = useState(0);

  const turnTotal = asideRounds.reduce((s, r) => s + r.points, 0);

  // Points scored by the current active roll
  const activeScore = phase === 'rolled' ? scoreDice(activeDice) : null;
  const activePoints = activeScore?.points ?? 0;
  const activeLeftover = activeScore?.leftover ?? [];
  const totalIfBank = turnTotal + activePoints;
  const allDiceScored = phase === 'rolled' && activeLeftover.length === 0;
  const runningAvg = avg(history);

  const statusMessage = (): string => {
    if (phase === 'start') return 'Roll to begin your turn.';
    if (phase === 'bust') return '💥 Bust — no scoring dice. Turn ends with 0 points.';
    if (phase === 'banked') return `✓ Banked ${lastBanked} pts! Press New Turn to go again.`;
    if (allDiceScored) return `All 6 dice scored (${activePoints} pts)! Bank your ${totalIfBank} pts, set them aside and re-roll all 6, or Re-roll All 6 and lose your points.`;
    return `You rolled ${activePoints} pts. Bank to keep them, Set Aside & Roll the remaining ${activeLeftover.length} dice for more (bust = 0), or Re-roll All 6 and lose your current points.`;
  };

  const doRoll = (count: number, nextAsideRounds: AsideRound[]) => {
    const rolled = rollDice(count);
    if (isBust(rolled)) {
      setActiveDice(rolled);
      setAsideRounds(nextAsideRounds);
      setPhase('bust');
      setHistory(h => [...h, { score: 0, bust: true }]);
    } else {
      setActiveDice(rolled);
      setAsideRounds(nextAsideRounds);
      setPhase('rolled');
    }
  };

  const handleRoll = () => doRoll(6, []);

  const handleBank = () => {
    const { kept, points } = scoreDice(activeDice);
    const finalRounds = [...asideRounds, { dice: kept, points }];
    const total = totalIfBank;
    setAsideRounds(finalRounds);
    setActiveDice([]);
    setLastBanked(total);
    setHistory(h => [...h, { score: total, bust: false }]);
    setPhase('banked');
  };

  const handleSetAsideAndRoll = () => {
    const { kept, leftover, points } = scoreDice(activeDice);
    const nextRounds = [...asideRounds, { dice: kept, points }];
    doRoll(leftover.length === 0 ? 6 : leftover.length, nextRounds);
  };

  const handleRerollAll = () => doRoll(6, []);

  const handleNewTurn = () => {
    setPhase('start');
    setActiveDice([]);
    setAsideRounds([]);
  };

  const activeStates: DieState[] = activeDice.map(() =>
    phase === 'bust' ? 'bust' : 'scoring'
  );
  // Mark non-scoring active dice as idle
  if (phase === 'rolled') {
    const { kept } = scoreDice(activeDice);
    const remaining = [...kept];
    for (let i = 0; i < activeDice.length; i++) {
      const idx = remaining.indexOf(activeDice[i]);
      if (idx !== -1) {
        activeStates[i] = 'scoring';
        remaining.splice(idx, 1);
      } else {
        activeStates[i] = 'idle';
      }
    }
  }

  return (
    <div className={styles.layout}>
      <div className={styles.gameArea}>
        <h2 className={styles.sectionTitle}>Play Greed</h2>
        <p className={styles.subtitle}>Maximize your average score per turn</p>

        <HowToPlay />

        <div className={`${styles.messageBar} ${phase === 'bust' ? styles.messageBarBust : phase === 'banked' ? styles.messageBarBanked : ''}`}>
          {statusMessage()}
        </div>

        {/* Set-aside zone */}
        {asideRounds.length > 0 && (
          <div className={styles.asideZone}>
            <div className={styles.asideLabel}>SET ASIDE — {turnTotal} pts total</div>
            {asideRounds.map((round, i) => (
              <div key={i} className={styles.asideRound}>
                <div className={styles.asideRoundLabel}>
                  Round {i + 1} — +{round.points} pts
                </div>
                <DiceRow
                  dice={round.dice}
                  states={round.dice.map(() => 'kept' as DieState)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Active dice zone */}
        <div className={styles.diceZone}>
          {activeDice.length === 0 ? (
            <div className={styles.emptyDice}>
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className={styles.placeholderDie} />
              ))}
            </div>
          ) : (
            <>
              <div className={styles.diceZoneLabel}>
                {phase === 'rolled' ? `Rolled — ${activePoints} pts` : phase === 'bust' ? 'Bust roll' : ''}
              </div>
              <DiceRow dice={activeDice} states={activeStates} />
              {phase === 'rolled' && (
                <div className={styles.dieLegend}>
                  <span className={styles.legendScoring}>■ scoring</span>
                  <span className={styles.legendIdle}>■ non-scoring</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Score display */}
        {phase === 'rolled' && (
          <div className={styles.scoreBar}>
            <div className={styles.scoreItem}>
              <span className={styles.scoreLabel}>TOTAL IF BANKED</span>
              <span className={styles.scoreValue}>{totalIfBank}</span>
            </div>
            {turnTotal > 0 && (
              <div className={styles.scoreItem}>
                <span className={styles.scoreLabel}>SET ASIDE</span>
                <span className={styles.scoreValueDim}>{turnTotal}</span>
              </div>
            )}
            <div className={styles.scoreItem}>
              <span className={styles.scoreLabel}>THIS ROLL</span>
              <span className={styles.scoreValueDim}>{activePoints}</span>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className={styles.controls}>
          {phase === 'start' && (
            <button className={styles.btn} onClick={handleRoll}>Roll</button>
          )}
          {(phase === 'bust' || phase === 'banked') && (
            <button className={styles.btn} onClick={handleNewTurn}>New Turn</button>
          )}
          {phase === 'rolled' && (
            <>
              <button className={`${styles.btn} ${styles.btnBank}`} onClick={handleBank}>
                Bank {totalIfBank} pts
              </button>
              <button className={styles.btn} onClick={handleSetAsideAndRoll}>
                {allDiceScored ? 'Set Aside & Roll All 6' : 'Set Aside & Roll'}
              </button>
              <button className={`${styles.btn} ${styles.btnReroll}`} onClick={handleRerollAll}>
                Re-roll All 6
              </button>
            </>
          )}
        </div>
      </div>

      <div className={styles.sidebar}>
        <div className={styles.statBlock}>
          <div className={styles.statLabel}>RUNNING AVERAGE</div>
          <div className={styles.statBig}>{runningAvg.toFixed(1)}</div>
          <div className={styles.statSub}>{history.length} turn{history.length !== 1 ? 's' : ''}</div>
        </div>

        <div className={styles.statBlock}>
          <div className={styles.statLabel}>BUST RATE</div>
          <div className={styles.statBig}>
            {history.length
              ? ((history.filter(r => r.bust).length / history.length) * 100).toFixed(0) + '%'
              : '—'}
          </div>
        </div>

        <div className={styles.historyHeader}>Turn History</div>
        <div className={styles.historyList}>
          {history.length === 0 && (
            <div className={styles.historyEmpty}>No turns yet</div>
          )}
          {[...history].reverse().map((r, i) => (
            <div key={i} className={`${styles.historyItem} ${r.bust ? styles.historyBust : ''}`}>
              <span className={styles.historyNum}>#{history.length - i}</span>
              <span className={styles.historyScore}>{r.bust ? 'BUST' : `+${r.score}`}</span>
            </div>
          ))}
        </div>

        {history.length > 0 && (
          <button className={styles.resetBtn} onClick={() => { setHistory([]); handleNewTurn(); }}>
            Reset Stats
          </button>
        )}
      </div>
    </div>
  );
}
