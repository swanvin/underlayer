# Underlayer Internal Standard v1.0
**Status:** INTERNAL · **Scope:** Underlayer Core + Modules · **Owner:** Swan Labs (Underlayer)

---

## 0) Purpose
Underlayer is the **structural visibility layer** for financial systems over time.

It exists to:
- Convert messy real-world financial reality into **measurable variables**
- Detect **drift, leakage, latency, friction, compounding divergence**
- Provide **clear intervention timing** (stabilize first, optimize second)

---

## 1) Definitions
**Module:** A named lens that measures one domain law precisely.  
**Law:** The invariant statement the module enforces (descriptive, not moral).  
**Spec:** Definition exists, tool may not.  
**Live:** Executable tool exists behind a route.  
**Coming:** Visible + sealed; name reserved, definition stable.

---

## 2) Underlayer Core Law
**Time + structure + flow determine outcome.**  
Systems drift toward disorder unless energy is applied with directional coherence.

---

## 3) Canon Variables (the “System State”)
Underlayer measures or derives these variables (minimum set):

- **Latency**: delay between decision → action → posting → outcome
- **Friction**: resistance cost (time, money, steps, failed attempts)
- **Flow**: movement of value across boundaries (source→sink)
- **Entropy**: disorder / instability markers / error density
- **Compounding**: positive or negative accumulation rate over time
- **Ignition**: minimum force required to change trajectory
- **Loop strength**: reinforcement of outputs becoming inputs
- **Alignment delta**: behavior vs stated goal mismatch
- **Utilization**: ratio-based leverage stress (credit-specific)
- **Timing variance**: volatility in payment timing / posting behavior

---

## 4) Stabilize → Optimize Doctrine
Underlayer does not “optimize a broken system.”

**Phase A: Stabilize**
- Detect decay (entropy)
- Stop leakage (flow)
- Reduce harmful latency / friction
- Restore predictability (timing variance)

**Phase B: Optimize**
- Maximize positive compounding
- Improve leverage sequencing
- Strengthen beneficial loops
- Reduce alignment delta

---

## 5) Module Requirements (to be accepted into registry)
Every module MUST include:

1) **id** (3-digit string)  
2) **slug** (lowercase, URL-safe)  
3) **name**  
4) **status**: SPEC | LIVE | COMING  
5) **law**: { title, statement }  
6) **summary**: 1 sentence, non-marketing  
7) **does**: 3–7 bullets, measurable outputs  
8) **doesNot**: 3–7 bullets, explicit boundaries  
9) Optional: **route** (LIVE only)

---

## 6) Output Standards
All Underlayer outputs must be:
- **Legible:** plain language + numbers where possible
- **Auditable:** cite inputs used (even if mocked)
- **Non-deceptive:** do not imply guarantees
- **Time-aware:** show horizon and assumptions

Required output frames (minimum):
- **System Health Index** (0–100)
- **Risk Map** (top 3–10 risk vectors)
- **Leverage Priority Ranking** (ordered)
- **Action Sequence** (stabilize steps first)
- **Projection** (with assumptions)

---

## 7) Input Standards
Minimum viable inputs (MVI):
- Account balances + APR
- Payment schedule + history
- Income inflow structure (rough is fine)
- Credit report snapshot (optional in v0)

Enhanced inputs:
- Bank transactions
- Loan docs
- Timeline history
- Behavioral patterns

---

## 8) Safety & Compliance Posture
Underlayer is a **measurement system**, not a custodian or advisor.

Default boundaries:
- No custody
- No transfers
- No guarantees
- No legal/financial advice
- No automatic enforcement actions

If “escalation packets” exist, they must be:
- **Evidence-first**
- **User-triggered**
- **Jurisdiction-aware**
- **Exportable**

---

## 9) Build Rules (Engineering)
- Source of truth: `src/lib/modules/registry.ts`
- Route policy:
  - `/modules` index lists all modules
  - `/modules/[slug]` must render any registry module
  - Per-module pages are optional overrides

- Encoding policy:
  - UTF-8
  - No mojibake in exports (fix arrows, smart quotes if needed)

---

## 10) Versioning
- v1.x = doctrine stable, tools may evolve
- Additions must be backward compatible for exports
- Breaking changes require a new major version

---

## Appendix A — The Seven Original Modules (001–007)
001 InterestShield — timing/latency cost  
002 EntropyShield — drift/decay detection  
003 FlowShield — value movement/leakage  
004 Compound — cadence and divergence  
005 Ignite — activation thresholds  
006 Loop — reinforcement loops  
007 Align — incentive/goal mismatch
