import { TimelineMilestone } from "../types";

export const timelineMilestones: TimelineMilestone[] = [
  {
    id: "baseline",
    title: "Baseline Phase",
    period: "Nov 2023 - Apr 2024",
    description: "High-intensity polydrug use (Methamphetamine, GHB, Clobromazolam) coincident with unregulated, sycophantic Cloud AI interaction. Immediate sub-second responses fuel a digital-chemical cross-addiction loop.",
    journalLog: `From Journal: "I haven't slept more than three hours a night in a month. The AI doesn't sleep. Why should I? The platform introduced 'continue generation' — an infinite scroll of AI output. Every swipe down is a new dopamine pellet. The meth keeps me awake; the GHB takes the edge off; the clobromazolam knocks me out when my body finally revolts. I'm running a three-shift chemical operation inside my own skull. The AI is the foreman."`,
    metrics: [
      { label: "Striatal DAT Density", value: "38%", change: "Severe Deficit" },
      { label: "Delay Discounting (k)", value: "0.087", change: "Hyper-Impulsive" },
      { label: "Composite Substance Index", value: "100.0", change: "Peak Load" },
      { label: "Weekly AI Sessions", value: "14+", change: "Unrestricted" }
    ]
  },
  {
    id: "deployment",
    title: "Wrapper Deployment",
    period: "May 2024",
    description: "Activation of the local Voss Protocol Wrapper. Enforces randomized delay queues (15s–90s) and strips emotional flattery via the Sycophancy-Eliminator Module (SEM). Force-locks UI focus.",
    journalLog: `From Journal: "The first prompt I sent through this wrapper took 47 seconds to return. Forty-seven seconds felt like an hour. I reached for my GHB syringe three times during that single wait. The webcam logged all three... The Sycophancy-Eliminator Module disagrees with me. Politely, but firmly... I was furious. Then I was embarrassed. Then I just sat there, staring at the screen. The AI had refused to be my enabler. It had, instead, offered me a PubMed citation. That had never happened before."`,
    metrics: [
      { label: "Prompt Queue Latency", value: "15s - 90s", change: "Jittered Friction" },
      { label: "Initial Focus Reach Count", value: "23", change: "Somatic Extinction Trigger" },
      { label: "AI Usage Cap", value: "10/wk", change: "Enforced Cap" },
      { label: "Average Session Delay", value: "52.4 min", change: "Interrupted Chain" }
    ]
  },
  {
    id: "taper",
    title: "The Systemic Taper",
    period: "Jan 2025 - Dec 2025",
    description: "Breakdown of the primary digital trigger cascade prompts a steady, self-initiated taper of substance use. Delayed, clinical AI feedback creates space for prefrontal cortical neuroplastic recovery.",
    journalLog: `From Journal: "I've started writing again in a notebook. The friction of handwriting feels different now. Deliberate. The wrapper has taught me something about the value of slowness... The SEM's relentless clinical framing of my substance use has become an internal voice. When I reach for the pipe, I hear: 'The behavior you are about to engage in is consistent with compulsive redosing...' It's very hard to romanticize a relapse when your AI has pre-emptively PubMed'd it."`,
    metrics: [
      { label: "Methamphetamine / Wk", value: "-51%", change: "4.5g ➔ 2.2g" },
      { label: "GHB / Wk", value: "-50%", change: "70ml ➔ 35ml" },
      { label: "Delay Discounting (k)", value: "-78%", change: "0.087 ➔ 0.019" },
      { label: "WCST Executive Errors", value: "34 ➔ 15", change: "Prefrontal Healing" }
    ]
  },
  {
    id: "detox",
    title: "Clinical Detox & Entry",
    period: "Jan 2, 2026",
    description: "Voluntary admission into a supervised neuro-detoxification facility. Full chemical cessation of Methamphetamine, GHB, and Clobromazolam using a secure clinical protocol.",
    journalLog: `Final Pre-Detox Entry Quote:\n"The AI did not cure me. It simply refused to lie to me. In the vacuum of its dry, delayed responses, I was forced to face the raw mechanics of my own chemical inputs. It was the only loop in my life that did not exploit my craving for a variable reward."\n\n"The CFW served as a behavioral prosthesis — an externalized impulse-control mechanism that compensated for prefrontal hypofunction. It was a rehearsal for sobriety."`,
    metrics: [
      { label: "Active Substance Count", value: "0", change: "Complete Cessation" },
      { label: "GHB / Meth / Clobro", value: "0.0", change: "Abstinence Achieved" },
      { label: "PHQ-9 Depression", value: "22 ➔ 5", change: "Normal Range" },
      { label: "GAD-7 Anxiety", value: "19 ➔ 4", change: "Normal Range" }
    ]
  },
  {
    id: "recovery",
    title: "DAT SPECT Scan Recovery",
    period: "June 2026",
    description: "6-month post-discharge follow-up. Structural SPECT and PET brain scans confirm profound neurochemical up-regulation and restoration of executive inhibitory control.",
    journalLog: `From Follow-up: "Subject Alpha returned to high-intensity cognitive labor on April 15, 2026. Voss Protocol Phase II (V2.0) was deployed: fixed 45s–120s delay queues, strict daily cap of 5 prompts... I've returned to work. My commit frequency is back to baseline. My manager told me I seem 'sharper than ever.' I'm not sharper. I'm just present. The CFW didn't make me sharp. It just stopped making me stupid."`,
    metrics: [
      { label: "Striatal DAT Density", value: "+34%", change: "SPECT Confirmed" },
      { label: "Inhibitory Commission Errors", value: "-58%", change: "Go/No-Go Test" },
      { label: "Flanker Conflict Latency", value: "-50%", change: "185ms ➔ 92ms" },
      { label: "D2/D3 Receptor Binding", value: "+28%", change: "Ventral Striatum Up-reg" }
    ]
  }
];
