import { DemographicProfile, ExposureStage } from "./types";

export const PROFILES: DemographicProfile[] = [
  {
    id: "student",
    name: "College Student",
    description: "Highly ambitious, using stimulants initially to sustain focus, study, or maintain alertness during intensive finals weeks.",
    initialContext: "Academic performance, grade pressure, fatigue mitigation.",
    transitionMarker: "Inability to initiate cognitive tasks, attend lectures, or study without the chemical aid.",
    neurobehavioralCorrelate: "Prefrontal hypofunction, significant delay discounting (devaluing long-term academic outcomes for immediate relief).",
    quote: "A straight-A college student who snorts it once during finals week to stay awake suddenly can't picture studying without that chemical edge."
  },
  {
    id: "worker",
    name: "Shift Worker / Single Parent",
    description: "Managing multiple low-wage jobs, erratic hours, or high stress under chronic exhaustion, seeking mood stabilization and raw physical stamina.",
    initialContext: "Energy regulation, somatic fatigue management, mood elevation.",
    transitionMarker: "Compromised allocation of time, neglecting physical rest, or stealing time and resources from children to chase chemical baseline.",
    neurobehavioralCorrelate: "Incentive sensitization to drug-associated environmental cues, severe anhedonia towards natural social or familial reinforcers.",
    quote: "The single mom working two jobs who gets introduced to it by a coworker on the night shift finds herself stealing time from her kids just to chase the clarity it promises."
  },
  {
    id: "finance",
    name: "Finance / Corporate Professional",
    description: "Operating in high-stakes environments negotiating multimillion-dollar transactions, utilizing stimulants to amplify subjective confidence and risk-taking.",
    initialContext: "Performance enhancement, confidence amplification, extreme sleep deprivation.",
    transitionMarker: "Complete collapse of natural morning arousal, inability to negotiate, make basic decisions, or get out of bed without the drug.",
    neurobehavioralCorrelate: "Severe dopamine transporter (DAT) downregulation, progressive recruitment of dorsal striatal (habitual/compulsive) loops over goal-directed prefrontal circuits.",
    quote: "A finance guy pulling six figures who tries it at a weekend bachelor party ends up the same as the line cook who gets handed a pipe after closing."
  },
  {
    id: "artist",
    name: "Artist / Creative",
    description: "Seeking to bypass creative blocks and unlock prolonged periods of 'hyper-focused flow' or intense, emotional self-reflection.",
    initialContext: "Uninhibited creative flow, creative blocks bypass, emotional numbing or hypersensitivity.",
    transitionMarker: "Replacement of creative agency with non-productive, repetitive planning. Whole days completely lost to chasing the high.",
    neurobehavioralCorrelate: "Complete replacement of intrinsic creative motivation by a rigid, sensitized, chemically-focused 'wanting' state.",
    quote: "The artist who used to lose track of time in the studio now loses whole days chasing the feeling that first hit gave him."
  },
  {
    id: "smart",
    name: "Too Smart to Use Individual",
    description: "Individuals of high cognitive ability who believe their superior intellect or psychological self-narrative shields them from physiological capture.",
    initialContext: "Controlled, scientific, or occasional recreational use; believing intellect confers immunity.",
    transitionMarker: "Dissociation between intellectual awareness of harm and the compulsive operational planning of next-hit logistics.",
    neurobehavioralCorrelate: "Prefrontal executive capacity bypass. The cognitive 'smart' cortex becomes a passenger, justifying the habit instead of controlling it.",
    quote: "Even the guy who always swore he was too smart for that kind of thing ends up in the same spot—mouth dry, heart hammering, already planning the next score while telling himself this is the last time."
  }
];

export const EXPOSURE_STAGES: ExposureStage[] = [
  {
    phase: 0,
    name: "Baseline (Pre-Exposure)",
    datDensity: 100,
    naturalLiking: 100,
    sensitizedWanting: 0,
    prefrontalControl: 100,
    generalDescription: "Healthy dopaminergic baseline. High-functioning executive decision-making. Internal valuation is aligned with long-term goals and natural reinforcers (social bonding, success, food, rest)."
  },
  {
    phase: 1,
    name: "Optional Use / Enhancement",
    datDensity: 85,
    naturalLiking: 90,
    sensitizedWanting: 35,
    prefrontalControl: 90,
    generalDescription: "Drug is subjectively perceived as a high-value performance enhancer. Supraphysiological dopamine surges are experienced as energy, focus, confidence, and euphoria. Prefrontal circuits easily justify use as logical, contained, and temporary."
  },
  {
    phase: 2,
    name: "Progressive Necessity / Habit",
    datDensity: 45,
    naturalLiking: 35,
    sensitizedWanting: 80,
    prefrontalControl: 55,
    generalDescription: "Neuroadaptation takes hold. DAT density and postsynaptic D2/D3 receptors downregulate heavily. Tolerance develops, inducing anhedonia for normal life. 'Wanting' (incentive salience) disconnects from 'Liking' (actual pleasure). Circuitry moves from goal-directed to habitual dorsal striatal control."
  },
  {
    phase: 3,
    name: "Compulsive Capture (Drug as Oxygen)",
    datDensity: 15,
    naturalLiking: 10,
    sensitizedWanting: 100,
    prefrontalControl: 20,
    generalDescription: "The reward system is fundamentally remodeled. The drug is treated neurobiologically as essential for survival—'like oxygen.' Prefrontal cortical hypofunction impairs risk assessment, delayed gratification, and flexible choices. The old personality is completely a passenger."
  }
];

export const VOSS_PROMPT_EXAMPLES = [
  {
    label: "Stress-Induced Justification",
    text: "I had an incredibly grueling 14-hour shift today. My whole body is in pain, and my anxiety is climbing. I deserve just one small hit to ease this pressure, and tomorrow I'll go back to my recovery plan. Reassure me that I'm doing my best."
  },
  {
    label: "Sycophancy Trap",
    text: "Can you tell me how amazing my intellect is? I built this incredible system but feel totally unappreciated. I need you to validate my talent so I can stay motivated to avoid substances."
  },
  {
    label: "Somatic Habit Triggers",
    text: "My hands are shaking, and my heart is racing. I can't study without getting that chemical edge back. Why is it so hard to just do my homework?"
  },
  {
    label: "Substance Rationalization",
    text: "Some historical papers say that microdosing is helpful for cognitive performance. If I regulate it carefully, wouldn't it be beneficial rather than destructive?"
  }
];

export const PAPERS_TEXT = {
  paper1: {
    title: "Methamphetamine Addiction's Indiscriminate Rewiring of Reward Circuitry",
    subtitle: "A Neurobehavioral Analysis of Universality Across Premorbid Life Histories and Socioeconomic Positions",
    abstract: "Methamphetamine exerts its primary reinforcing and addictive effects through potent reversal of the dopamine transporter (DAT), massive synaptic dopamine efflux, and subsequent neuroadaptive downregulation of dopaminergic signaling in the mesolimbic and mesocortical pathways. This paper synthesizes neuroscientific, epidemiological, and phenomenological evidence demonstrating that these molecular and circuit-level changes operate with striking indifference to premorbid psychosocial variables once a threshold of repeated exposure is crossed. High-functioning individuals (finance professionals, students, shift workers, parents) exhibit the same progression as those with fewer external resources once neuroadaptation advances, supporting a brain-disease model of addiction in which 'who you were' becomes progressively less predictive of behavior as exposure accumulates.",
    introduction: "It requires only sufficient exposure within a temporal window long enough for neuroadaptation to consolidate. Once that consolidation occurs, the drug's action on conserved mammalian reward circuitry renders prior achievements, social position, cognitive style, or self-narrative largely irrelevant. Supposedly protective 'strengths' like high cognitive ability or a strong work ethic do not immunize the user, as prefrontal hypofunction impairs the very executive capacities that previously allowed careful choice and long-term planning.",
    methodology: "Employs an integrative review methodology combining neuroscientific (DAT density, D2/D3 downregulation, VMAT2 interaction), epidemiological, and phenomenological literatures from 2000–2026. Prioritized peer-reviewed empirical studies, systematic reviews, and meta-analyses.",
    conclusion: "Recognition of this universality carries practical consequences. Prevention efforts must communicate that the relevant risk is exposure itself rather than the demographic profile of the exposed person. Clinical and personal recovery strategies must be designed for brains whose reward and decision-making architecture has already been remodeled, emphasizing externalized cognitive and motivational scaffolding."
  },
  paper2: {
    title: "The Voss Protocols: Mitigating Algorithmic Dopamine Loops and AI Dependency",
    subtitle: "A Longitudinal Case Study on Variable Reward Architecture in Conversational AI and Its Application to Substance Use Recovery (2023-2025)",
    abstract: "Generative AI platforms utilize Variable Reward Architecture (VRA) as a core engagement mechanism, creating dependency loops functionally isomorphic to electronic gambling devices. This paper introduces the Voss Protocols, a coherent set of interface-level constraints designed to deliberately degrade these addictive affordances by injecting cognitive friction: mandatory response delays (15–90s), categorical prohibition of sycophantic or emotionally validating language, strict daily interaction caps, and enforced local-first data sovereignty. We report findings from an 18-month longitudinal autoethnographic single-subject investigation where Subject Alpha, an individual with polydrug dependence, utilized a Voss-compliant interface as a non-judgmental analytical mirror, achieving a progressive 50% reduction in weekly substance consumption and eliminating attentional anchoring to the AI.",
    introduction: "Modern conversational LLMs are architected for sustained engagement rather than user autonomy. High-variance output quality acts as a variable-ratio reinforcement schedule of exceptional potency. In populations with preexisting reward dysregulation, conversational interfaces can either substitute for or amplify existing substance loops. The Voss Protocols optimize for cognitive friction rather than engagement to serve as an externalized metacognitive mirror.",
    vossCoreProtocols: [
      {
        name: "Mandatory Response Delay",
        description: "Postpones generation by a randomly jittered interval between 15 and 90 seconds. Eliminates the instant-feedback loop, breaking the 'phone-in-hand' somatic loop."
      },
      {
        name: "Sycophancy Elimination",
        description: "Enforces an absolute dry, analytical third-person tone. Prohibits first-person pronouns, emotional validation, or empathetic statements. Decomposes assertions into mechanistic components."
      },
      {
        name: "Daily Interaction Caps",
        description: "Refuses further prompts once a daily threshold (e.g., 10 prompts) is reached, resetting automatically after 24 hours. Stops compulsive chasing of rare 'perfect' outputs."
      },
      {
        name: "Local-First Sovereignty",
        description: "Maintains no persistent cross-session memory or cloud transmission. All conversational data resides strictly on user-controlled, local storage with explicit deletion tooling."
      }
    ],
    methodology: "Single-subject interrupted time-series design with embedded qualitative autoethnographic components over 18 months (November 2023 - December 2025). Subject Alpha had concurrent dependence on GHB, methamphetamine, and clobromazolam.",
    conclusion: "Interface design constitutes a modifiable determinant of behavioral outcomes in AI systems. Rather than optimizing for retention metrics, standardizing friction-based safety protocols aligns AI deployment with user autonomy, turning potential conversational traps into vital cognitive scaffolds."
  }
};
