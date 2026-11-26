import type { RecoveryStep } from './smokingRecoveryData'

const alcoholRecovery: RecoveryStep[] = [
  // First hour

  { hours: 0, description: 'Additional exposure to ethanol and its toxic metabolic byproducts stops.' },
  { hours: 0, description: 'The body is no longer receiving additional calories from alcoholic beverages.' },
  { hours: 15 / 60, description: 'The digestive system begins processing the remaining alcohol from the last drink.' },
  { hours: 30 / 60, description: 'The liver continues converting ethanol into acetaldehyde and subsequently into acetate.' },
  { hours: 45 / 60, description: 'Alcohol metabolism continues, although blood alcohol levels may still rise if absorption is incomplete.' },
  { hours: 1, description: 'The liver continues eliminating circulating alcohol, gradually reducing exposure to its intoxicating effects once absorption has ended.' },

  // First 24 hours

  { hours: 2, description: 'Once blood alcohol concentrations begin declining, the direct depressant effects of alcohol on the central nervous system gradually diminish.' },
  { hours: 3, description: 'As intoxication subsides, alcohol-induced impairment of coordination and motor control may begin decreasing.' },
  { hours: 4, description: 'The liver continues metabolizing alcohol and its remaining metabolic byproducts.' },
  { hours: 5, description: 'Alcohol-induced suppression of vasopressin may begin easing as circulating alcohol levels decline.' },
  { hours: 6, description: 'The kidneys may gradually recover their normal regulation of water retention as alcohol-induced diuresis subsides.' },
  { hours: 6, description: 'The nervous system may begin adjusting to declining alcohol concentrations. Withdrawal symptoms can emerge in physically dependent individuals.' },
  { hours: 7, description: 'Alcohol-related impairment of judgment and reaction time may gradually diminish as intoxication resolves.' },
  { hours: 8, description: 'Hydration may begin improving with adequate water and electrolyte intake.' },
  { hours: 9, description: 'The stomach is no longer receiving additional direct irritation from alcoholic beverages.' },
  { hours: 10, description: 'Alcohol-induced disruption of glucose regulation may begin easing as ethanol is eliminated.' },
  { hours: 11, description: 'The liver may gradually become less occupied with ethanol metabolism as circulating alcohol declines.' },
  { hours: 12, description: 'Depending on the quantity consumed, blood alcohol concentrations may have decreased substantially.' },
  { hours: 12, description: 'The body may begin recovering from alcohol-induced dehydration, provided fluid losses are adequately replaced.' },
  { hours: 13, description: 'As intoxication resolves, communication between brain regions involved in attention and coordination may become more effective.' },
  { hours: 14, description: 'The digestive tract continues recovering without additional exposure to alcohol-related chemical irritation.' },
  { hours: 15, description: 'The liver continues adjusting its metabolic priorities as ethanol concentrations decrease.' },
  { hours: 16, description: 'Alcohol-induced impairment of short-term memory formation may diminish as intoxication resolves.' },
  { hours: 17, description: 'The body has avoided another period of alcohol-induced suppression of fat oxidation.' },
  { hours: 18, description: 'Electrolyte balance may gradually improve with adequate nutrition and hydration, although withdrawal can complicate recovery.' },
  { hours: 19, description: 'The gastrointestinal tract continues benefiting from the absence of additional alcohol exposure.' },
  { hours: 20, description: 'The body may be recovering from acute alcohol-related metabolic disturbances.' },
  { hours: 21, description: 'The nervous system continues adjusting to the absence of alcohol-induced sedation.' },
  { hours: 22, description: 'The liver has experienced nearly an entire day without additional ethanol consumption.' },
  { hours: 23, description: 'The body approaches its first full day without renewed alcohol-induced intoxication.' },
  { hours: 24, description: 'One full day without additional alcohol consumption has been completed.', major: true },
  { hours: 24, description: 'Acute intoxication may have resolved, depending on the amount previously consumed.' },
  { hours: 24, description: 'Hangover-related headache, nausea and fatigue may begin subsiding.' },
  { hours: 24, description: 'The liver may begin devoting more metabolic resources to its ordinary functions once ethanol has been eliminated.' },
  { hours: 24, description: 'The brain has begun adapting to the absence of repeated alcohol exposure, although withdrawal may temporarily intensify.' },

  // 24–48 hours

  { hours: 26, description: 'The stomach lining continues recovering from alcohol-related irritation.' },
  { hours: 28, description: 'The digestive system continues adjusting to the absence of alcohol-induced disturbances in gastrointestinal motility.' },
  { hours: 30, description: 'Normal appetite regulation may gradually recover, although nausea and reduced appetite can persist during withdrawal.' },
  { hours: 32, description: 'The body continues benefiting from the absence of additional alcohol-related oxidative stress.' },
  { hours: 34, description: 'The liver continues recovering from repeated exposure to ethanol and acetaldehyde.' },
  { hours: 36, description: 'Fluid balance may become more stable with adequate hydration and resolution of acute alcohol effects.' },
  { hours: 38, description: 'The nervous system continues adapting its excitatory and inhibitory signaling without alcohol.' },
  { hours: 40, description: 'The digestive system may gradually become more tolerant of regular meals as acute nausea subsides.' },
  { hours: 42, description: 'The cardiovascular system continues benefiting from the absence of new episodes of intoxication.' },
  { hours: 44, description: 'The body continues recovering its normal metabolic regulation without additional ethanol consumption.' },
  { hours: 46, description: 'The brain approaches two full days without renewed alcohol-induced impairment.' },
  { hours: 48, description: 'Two full days without additional alcohol consumption have been completed.' },
  { hours: 48, description: 'Hangover-related symptoms have often resolved, although alcohol withdrawal symptoms may remain severe.' },
  { hours: 48, description: 'Alcohol-related dehydration may have substantially improved with adequate fluid and nutrient replacement.' },
  { hours: 48, description: 'The stomach and intestines have experienced two days without direct exposure to alcoholic beverages.' },
  { hours: 48, description: 'The liver continues recovering without additional alcohol-induced disruption of lipid metabolism.' },

  // 48–72 hours

  { hours: 50, description: 'The nervous system continues adapting to functioning without alcohol-induced enhancement of inhibitory signaling.' },
  { hours: 52, description: 'The brain continues adapting to changes in glutamate and GABA signaling associated with abstinence.' },
  { hours: 54, description: 'The liver continues benefiting from the absence of additional acetaldehyde production from newly consumed alcohol.' },
  { hours: 56, description: 'The digestive tract continues recovering from repeated alcohol-related irritation.' },
  { hours: 58, description: 'The body continues restoring ordinary patterns of energy metabolism without renewed alcohol exposure.' },
  { hours: 60, description: 'In uncomplicated withdrawal, some physical symptoms may begin stabilizing, although severe complications remain possible.' },
  { hours: 62, description: 'The brain continues adjusting its regulation of alertness, anxiety and physiological arousal.' },
  { hours: 64, description: 'The body continues recovering without additional alcohol-induced disruptions to sleep architecture.' },
  { hours: 66, description: 'The liver continues benefiting from reduced exposure to alcohol-related metabolic stress.' },
  { hours: 68, description: 'The body approaches the end of the typical peak period for many uncomplicated withdrawal symptoms.' },
  { hours: 70, description: 'Early recovery of appetite and digestive comfort may become more noticeable in individuals with uncomplicated withdrawal.' },
  { hours: 72, description: 'Three full days without additional alcohol consumption have been completed.' },
  { hours: 72, description: 'Many uncomplicated withdrawal symptoms may begin decreasing in intensity, although serious withdrawal complications can still occur.' },
  { hours: 72, description: 'Blood pressure may begin decreasing in individuals whose hypertension was partly caused by heavy drinking.', major: true },
  { hours: 72, description: 'The cardiovascular system continues recovering from repeated alcohol-induced fluctuations in blood pressure.' },
  { hours: 72, description: 'The digestive system may begin functioning more comfortably as acute gastrointestinal irritation subsides.' },

  // Day 4

  { hours: 78, description: 'Early neurological adaptation continues as the brain adjusts to sustained abstinence.' },
  { hours: 84, description: 'In uncomplicated withdrawal, sweating, shaking and physical restlessness may begin gradually decreasing.' },
  { hours: 90, description: 'The body continues recovering its ordinary regulation of heart rate and autonomic nervous system activity.' },
  { hours: 96, description: 'Four full days of abstinence have been completed.' },
  { hours: 96, description: 'Many individuals with uncomplicated withdrawal may be moving beyond its most intense physical phase.' },
  { hours: 96, description: 'Regular meals may become easier to tolerate as withdrawal-related nausea diminishes.' },

  // Day 5

  { hours: 102, description: 'Withdrawal-related fluctuations in body temperature and sweating may gradually become less pronounced.' },
  { hours: 108, description: 'The brain continues adjusting its regulation of stress responses without alcohol.' },
  { hours: 114, description: 'Digestive comfort and appetite may continue improving as acute withdrawal subsides.' },
  { hours: 120, description: 'Five full days without additional alcohol consumption have been completed.' },
  { hours: 120, description: 'Elevated bilirubin levels may begin showing measurable improvement in some individuals recovering from alcohol-related liver dysfunction.' },
  { hours: 120, description: 'Early improvements in certain liver-related blood markers may become detectable.' },
  { hours: 120, description: 'Acute withdrawal-related tremors and excessive sweating may have substantially diminished in uncomplicated cases.' },

  // Day 6

  { hours: 126, description: 'The nervous system continues adapting its regulation of attention and physiological arousal.' },
  { hours: 132, description: 'Withdrawal-related agitation may gradually become less disruptive.' },
  { hours: 138, description: 'The body continues recovering its normal relationship between food intake, hydration and energy availability.' },
  { hours: 144, description: 'Six full days without alcohol have been completed.' },
  { hours: 144, description: 'Platelet production and circulating platelet counts may begin recovering from alcohol-related suppression.' },

  // Day 7

  { hours: 150, description: 'Periods of mental clarity between withdrawal-related symptoms may become longer.' },
  { hours: 156, description: 'The cardiovascular system continues adapting to sustained abstinence.' },
  { hours: 162, description: 'The body approaches its first full week without alcohol-induced intoxication or renewed metabolic exposure.' },
  { hours: 168, description: 'One full week of continuous abstinence has been completed.', major: true },
  { hours: 168, description: 'Acute withdrawal symptoms have usually substantially diminished in uncomplicated cases.', major: true },
  { hours: 168, description: 'Blood pressure may have measurably decreased in individuals with alcohol-associated hypertension.', major: true },
  { hours: 168, description: 'Markers of intestinal barrier dysfunction may begin showing measurable improvement.' },
  { hours: 168, description: 'The intestinal barrier may be recovering its ability to limit the passage of bacterial products into the bloodstream.' },
  { hours: 168, description: 'Certain biomarkers associated with alcohol-related liver injury may have improved.', major: true },
  { hours: 168, description: 'Markers associated with impaired vascular function may begin decreasing.' },
  { hours: 168, description: 'The body has completed an entire week without the additional caloric intake associated with alcoholic beverages.' },
  { hours: 168, description: 'Sleep may begin becoming more restorative as acute withdrawal subsides, although insomnia can persist.', major: true },

  // Day 8

  { hours: 174, description: 'The nervous system continues adjusting its regulation of sleep, wakefulness and alertness.' },
  { hours: 180, description: 'Withdrawal-related physical restlessness may become less disruptive to everyday activities.' },
  { hours: 186, description: 'The digestive system continues benefiting from sustained freedom from alcohol-related irritation.' },
  { hours: 192, description: 'Morning alertness may improve as repeated episodes of intoxication and hangovers are avoided.' },
  { hours: 192, description: 'Alcohol-related platelet deficiencies may continue recovering.' },

  // Day 9

  { hours: 198, description: 'The brain continues adapting to performing ordinary activities without alcohol-induced sedation.' },
  { hours: 204, description: 'Regular nutritional intake may become easier to maintain as acute digestive symptoms improve.' },
  { hours: 210, description: 'Withdrawal-related emotional instability may gradually become less disruptive.' },
  { hours: 216, description: 'Periods of sustained concentration may begin improving as acute withdrawal and sleep disruption diminish.' },
  { hours: 216, description: 'Liver recovery continues without renewed exposure to ethanol-related metabolic injury.' },

  // Day 10

  { hours: 222, description: 'The nervous system continues adjusting its regulation of anxiety, motivation and reward.' },
  { hours: 228, description: 'Physical energy may gradually improve as hydration, nutrition and sleep become more stable.' },
  { hours: 234, description: 'The cardiovascular system continues benefiting from reduced exposure to alcohol-related physiological stress.' },
  { hours: 240, description: 'Ten full days of continuous abstinence have been completed.' },
  { hours: 240, description: 'Elevated aspartate aminotransferase, or AST, may show measurable improvement in individuals with alcohol-related liver injury.' },
  { hours: 240, description: 'Elevated bilirubin concentrations may have substantially decreased in some individuals.' },
  { hours: 240, description: 'Elevated alkaline phosphatase levels may begin showing measurable improvement in some individuals.' },
  { hours: 240, description: 'Circulating platelet counts may have recovered significantly if previously suppressed by heavy alcohol consumption.' },
  { hours: 240, description: 'Physical symptoms associated with uncomplicated acute alcohol withdrawal may have largely resolved.' },

  // Day 11

  { hours: 246, description: 'The brain continues adapting its regulation of emotional responses without alcohol.' },
  { hours: 252, description: 'Alcohol-related fluctuations in daytime energy may become less pronounced.' },
  { hours: 258, description: 'The ability to sustain attention may gradually improve as the acute recovery period progresses.' },
  { hours: 264, description: 'Withdrawal-related anxiety may become less intense in some individuals.' },
  { hours: 264, description: 'The liver continues recovering its ordinary metabolic functions without additional ethanol exposure.' },

  // Day 12

  { hours: 270, description: 'Sleep continuity may gradually improve, although alcohol-related insomnia can persist for considerably longer.' },
  { hours: 276, description: 'Periods of stable mood may become more frequent as acute neurological adaptation progresses.' },
  { hours: 282, description: 'The body continues benefiting from the absence of alcohol-related disruptions to nutritional intake and metabolism.' },
  { hours: 288, description: 'Concentration and mental alertness may become more consistent throughout the day.' },
  { hours: 288, description: 'The digestive tract continues recovering its protective barrier function without additional alcohol exposure.' },

  // Day 13

  { hours: 294, description: 'The brain continues adapting to regulating motivation and reward without repeated alcohol consumption.' },
  { hours: 300, description: 'Withdrawal-related fatigue may gradually diminish as sleep and nutritional intake improve.' },
  { hours: 306, description: 'The liver approaches the early recovery period associated with potentially measurable reductions in alcohol-related fat accumulation.' },
  { hours: 312, description: 'Emotional regulation may continue improving as the acute withdrawal period becomes more distant.' },
  { hours: 312, description: 'Daily functioning may become more consistent in the absence of repeated intoxication, hangovers and acute withdrawal.' },

  // Day 14

  { hours: 318, description: 'The cardiovascular system approaches two full weeks without renewed alcohol-induced physiological stress.' },
  { hours: 324, description: 'The brain approaches a period in which measurable structural recovery has been observed in some clinical studies.' },
  { hours: 330, description: 'The liver approaches two full weeks of continuous recovery without additional ethanol consumption.' },

  // Two-week milestones: general recovery

  { hours: 336, description: 'Two full weeks of continuous abstinence have been completed.', major: true },
  { hours: 336, description: 'The body has avoided fourteen days of additional exposure to ethanol and its toxic metabolic byproducts.' },
  { hours: 336, description: 'The acute withdrawal phase has usually resolved, although longer-lasting withdrawal symptoms can persist.' },

  // Two-week milestones: liver

  { hours: 336, description: 'Alcohol-related fat accumulation within liver cells may have substantially decreased.', major: true },
  { hours: 336, description: 'Early-stage uncomplicated alcohol-related fatty liver disease may be approaching reversal.' },
  { hours: 336, description: 'Elevated liver enzymes associated with alcohol-related injury may have begun returning toward healthier levels.', major: true },
  { hours: 336, description: 'The liver continues recovering its ability to regulate lipid and energy metabolism.' },
  { hours: 336, description: 'Alcohol-related oxidative and metabolic stress within the liver may have decreased.' },

  // Two-week milestones: brain and cognition

  { hours: 336, description: 'Partial recovery of gray matter volume may already be measurable in certain brain regions, as demonstrated in studies of supervised abstinence.' },
  { hours: 336, description: 'The brain continues adapting its balance between excitatory glutamate signaling and inhibitory GABA signaling.' },
  { hours: 336, description: 'The nervous system continues adapting its regulation of attention, alertness and emotional responses.' },
  { hours: 336, description: 'Mental clarity may have improved compared with the first days of abstinence.' },
  { hours: 336, description: 'The ability to sustain attention may begin improving, although cognitive recovery can require several months.' },
  { hours: 336, description: 'Everyday cognitive performance may improve as intoxication, hangovers and acute withdrawal cease interfering with brain function.' },

  // Two-week milestones: cardiovascular system

  { hours: 336, description: 'Resting blood pressure may have measurably improved, particularly in individuals with alcohol-associated hypertension.', major: true },
  { hours: 336, description: 'Certain markers associated with impaired vascular regulation may have decreased.' },
  { hours: 336, description: 'Circulating platelet counts may have substantially recovered from alcohol-related suppression.' },
  { hours: 336, description: 'The cardiovascular system is no longer experiencing repeated episodes of alcohol-induced physiological stress.' },

  // Two-week milestones: digestive system

  { hours: 336, description: 'Alcohol-related irritation of the stomach lining may have substantially diminished.' },
  { hours: 336, description: 'Markers associated with excessive intestinal permeability may have improved.' },
  { hours: 336, description: 'Digestive discomfort associated with repeated alcohol consumption may have decreased.' },
  { hours: 336, description: 'Appetite and ordinary eating patterns may have become more stable.' },

  // Two-week milestones: sleep and energy

  { hours: 336, description: 'Sleep quality may begin improving as the body adapts to sleeping without alcohol.', major: true },
  { hours: 336, description: 'Alcohol-induced fragmentation of sleep is no longer being repeatedly triggered by drinking.' },
  { hours: 336, description: 'Daytime energy may have improved through better hydration, nutrition and sleep.' },
  { hours: 336, description: 'Morning fatigue associated with repeated intoxication and hangovers may have substantially diminished.' },

  // Two-week milestones: psychological recovery

  { hours: 336, description: 'Alcohol-related anxiety may have measurably decreased compared with the beginning of abstinence.' },
  { hours: 336, description: 'Alcohol-related depressive symptoms may have begun improving.' },
  { hours: 336, description: 'Withdrawal-related irritability and emotional fluctuations may have become less intense.' },
  { hours: 336, description: 'The ability to maintain a stable mood without alcohol may be gradually improving.' },
  { hours: 336, description: 'Alcohol cravings may become less disruptive, although psychological cravings can remain significant.' },
  { hours: 336, description: 'The brain continues adapting to experiencing ordinary activities and rewards without alcohol consumption.' },
]

export default alcoholRecovery