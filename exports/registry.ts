import { Module } from "./types";

export const MODULES: Module[] = [
  {
    id: "001",
    slug: "interestshield",
    name: "InterestShield",
    status: "LIVE",
    law: { title: "Time & Latency", statement: "Delay changes outcomes. Costs compound quietly." },
    summary: "Reveals cost created by timing and posting behavior variability.",
    does: [
      "Compares timing scenarios with the same inputs",
      "Surfaces latency between payment and application",
      "Shows outcome divergence over time",
    ],
    doesNot: ["No custody", "No transfers", "No advice", "No guarantees"],
    route: "/tools/interestshield",
  },
  {
    id: "002",
    slug: "entropyshield",
    name: "EntropyShield",
    status: "SPEC",
    law: { title: "Entropy", statement: "Without intervention, disorder increases." },
    summary: "Measures drift and decay before it becomes damage.",
    does: ["Tracks drift indicators", "Surfaces decay hotspots", "Maps silent loss vectors"],
    doesNot: ["No automatic actions", "No coaching", "No guarantees"],
  },
  {
    id: "003",
    slug: "flowshield",
    name: "FlowShield",
    status: "SPEC",
    law: { title: "Conservation of Value", statement: "Value rarely disappears. It moves." },
    summary: "Maps value movement across boundaries and detects leakage.",
    does: ["Builds sourceâ†’sink flow maps", "Measures diffusion vs concentration", "Flags leakage boundaries"],
    doesNot: ["No recovery actions", "No rerouting", "No advice"],
  },
  {
    id: "004",
    slug: "compound",
    name: "Compound",
    status: "SPEC",
    law: { title: "Compounding", statement: "Repeated inputs outweigh intense inputs." },
    summary: "Visualizes accumulation curves and divergence by cadence.",
    does: ["Shows accumulation curves", "Compares cadence counterfactuals", "Surfaces breakpoints"],
    doesNot: ["No nudges", "No coaching", "No guarantees"],
  },
  {
    id: "005",
    slug: "ignite",
    name: "Ignite",
    status: "SPEC",
    law: { title: "Inertia", statement: "Systems resist change until acted on." },
    summary: "Detects activation thresholds and friction concentration.",
    does: ["Maps setup friction", "Measures time-to-first-effect", "Identifies stalled-by-design chains"],
    doesNot: ["No motivation layer", "No gamification", "No coaching"],
  },
  {
    id: "006",
    slug: "loop",
    name: "Loop",
    status: "SPEC",
    law: { title: "Feedback", statement: "Outputs become inputs." },
    summary: "Identifies reinforcing loops and their strength over time.",
    does: ["Classifies positive/negative loops", "Measures reinforcement strength", "Flags breakpoints"],
    doesNot: ["No correction suggestions", "No performance promises"],
  },
  {
    id: "007",
    slug: "align",
    name: "Align",
    status: "SPEC",
    law: { title: "Alignment", statement: "Systems optimize what they measure." },
    summary: "Audits metric-to-behavior mapping and incentive drift.",
    does: ["Maps metricsâ†’behavior", "Surfaces divergence", "Flags hidden optimization"],
    doesNot: ["No governance enforcement", "No policy changes", "No advice"],
  },

  {
    id: "008",
    slug: "scarcitylens",
    name: "ScarcityLens",
    status: "SPEC",
    law: { title: "Scarcity", statement: "Constraints create price, behavior, and strategy." },
    summary: "Measures constraint pressure and where it forces tradeoffs.",
    does: ["Maps constraint bottlenecks","Quantifies pressure points","Surfaces hidden rationing"],
    doesNot: ["No advice","No enforcement","No guarantees"],
  },

  {
    id: "009",
    slug: "friction",
    name: "Friction",
    status: "SPEC",
    law: { title: "Friction", statement: "Resistance reveals cost, inefficiency, and leverage." },
    summary: "Identifies resistance points where energy, time, or capital is lost.",
    does: ["Surfaces resistance in systems","Exposes inefficiencies","Highlights leverage through removal"],
    doesNot: ["No optimization advice","No enforcement","No guarantees"],
  },

  {
    id: "010",
    slug: "latency",
    name: "Latency",
    status: "SPEC",
    law: { title: "Latency", statement: "Delay converts intent into loss." },
    summary: "Measures time-delay between decision, action, and outcome.",
    does: ["Surfaces delay between steps","Quantifies response lag","Reveals time-based loss"],
    doesNot: ["No optimization advice","No automation","No guarantees"],
  },
];

export function getModule(slug: string) {
  return MODULES.find(m => m.slug === slug) ?? null;
}



export function listModules() {
  // Prefer whatever array you already use; this assumes `MODULES` exists.
  // If your array is named differently, change MODULES below to that name.
  const all = (MODULES ?? []) as any[];
  return [...all].sort((a, b) => String(a.id).localeCompare(String(b.id)));
}

