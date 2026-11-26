const smokingRecovery = [
  // First hour

  {
    hours: 0,
    description: 'Exposure to cigarette smoke, tar, carbon monoxide and combustion-related carcinogens stops.',
  },
  { hours: 0, description: 'The lungs are no longer receiving additional smoke particles from cigarettes.' },
  { hours: 5 / 60, description: 'Nicotine concentrations begin declining after the final cigarette.' },
  { hours: 10 / 60, description: 'The acute stimulation of the sympathetic nervous system begins subsiding.' },
  { hours: 15 / 60, description: 'The immediate nicotine-induced release of stress hormones begins wearing off.' },
  { hours: 20 / 60, description: 'Heart rate begins returning toward its normal resting level.' },
  { hours: 20 / 60, description: 'Blood pressure begins decreasing from smoking-induced elevations.' },
  { hours: 30 / 60, description: 'Nicotine-induced constriction of blood vessels may begin easing.' },
  { hours: 45 / 60, description: 'Carbon monoxide is progressively being released from hemoglobin and exhaled.' },
  { hours: 1, description: 'The estimated concentration of circulating nicotine has decreased by approximately 29%.' },

  // First 24 hours

  { hours: 2, description: 'The estimated concentration of circulating nicotine has decreased by approximately 50%.' },
  { hours: 3, description: 'The estimated concentration of circulating nicotine has decreased by approximately 65%.' },
  { hours: 4, description: 'The estimated concentration of circulating nicotine has decreased by approximately 75%.' },
  {
    hours: 5,
    description: 'As carbon monoxide levels decline, more hemoglobin becomes available for transporting oxygen.',
  },
  {
    hours: 6,
    description: 'The estimated concentration of circulating nicotine has decreased by approximately 87.5%.',
  },
  { hours: 7, description: 'Oxygen availability to muscles, organs and other tissues continues recovering.' },
  {
    hours: 8,
    description: 'Blood carbon monoxide levels may have decreased substantially, potentially by around half.',
  },
  { hours: 8, description: 'The heart muscle benefits from improving oxygen availability.' },
  {
    hours: 9,
    description: 'The cardiovascular system continues recovering from repeated nicotine-induced stimulation.',
  },
  { hours: 10, description: 'The estimated concentration of circulating nicotine has decreased by approximately 97%.' },
  { hours: 11, description: 'Carbon monoxide continues being eliminated through normal respiration.' },
  {
    hours: 12,
    description:
      'Blood carbon monoxide may be approaching normal nonsmoker levels, although clearance can take longer.',
  },
  { hours: 12, description: 'Hemoglobin is progressively recovering its oxygen-carrying capacity.' },
  { hours: 13, description: 'The heart is no longer experiencing repeated cigarette-induced increases in workload.' },
  {
    hours: 14,
    description:
      'The estimated concentration of circulating nicotine has decreased by approximately 99% under a simplified elimination model.',
  },
  {
    hours: 15,
    description: 'Blood vessels continue benefiting from the absence of repeated smoke-induced constriction.',
  },
  { hours: 16, description: 'Cotinine, the principal metabolite of nicotine, continues being eliminated.' },
  {
    hours: 17,
    description: 'The airways remain protected from additional direct exposure to cigarette smoke irritants.',
  },
  {
    hours: 18,
    description: 'Oxygen delivery to peripheral tissues continues benefiting from carbon monoxide clearance.',
  },
  { hours: 19, description: 'The liver and kidneys continue processing and eliminating tobacco-related compounds.' },
  {
    hours: 20,
    description:
      'The respiratory tract has experienced nearly an entire day without fresh smoke-related chemical irritation.',
  },
  {
    hours: 21,
    description: 'The absence of new cigarette smoke exposure prevents additional smoke-induced oxidative stress.',
  },
  { hours: 22, description: 'The brain continues adapting to declining nicotine concentrations.' },
  {
    hours: 23,
    description: 'The cardiovascular system approaches its first full day without repeated cigarette-induced stress.',
  },
  {
    hours: 24,
    description: 'Blood nicotine levels are typically negligible if no additional nicotine has been consumed.',
  },
  {
    hours: 24,
    description: 'Early improvements in the ability of certain blood vessels to dilate may already be measurable.',
  },
  {
    hours: 24,
    description: 'One full day of continuous recovery without cigarette smoke exposure has been completed.',
  },

  // 24–48 hours

  {
    hours: 26,
    description:
      'The respiratory tract continues recovering from repeated exposure to hot gases and chemical irritants.',
  },
  {
    hours: 28,
    description: 'The nervous system continues adjusting to functioning without regular nicotine stimulation.',
  },
  {
    hours: 30,
    description: 'The cardiovascular system remains free from repeated smoking-induced increases in heart rate.',
  },
  {
    hours: 32,
    description: 'Cotinine concentrations continue declining as nicotine metabolites are processed and excreted.',
  },
  { hours: 34, description: 'The body continues eliminating residual short-lived tobacco-related chemicals.' },
  { hours: 36, description: 'Oxygen transport continues improving if residual carbon monoxide remains elevated.' },
  {
    hours: 38,
    description:
      'Smoke-induced changes in liver enzyme activity may begin reversing, altering the metabolism of caffeine and certain medications.',
  },
  { hours: 40, description: 'Early improvements in the perception of tastes and odors may become noticeable.' },
  {
    hours: 42,
    description: 'The mouth and nasal passages continue recovering from direct exposure to smoke irritants.',
  },
  {
    hours: 44,
    description:
      'The airways continue benefiting from the absence of additional smoke particles and chemical irritants.',
  },
  {
    hours: 46,
    description: 'The body approaches two full days without renewed exposure to cigarette combustion products.',
  },
  { hours: 48, description: 'The sense of taste may begin becoming noticeably sharper.' },
  { hours: 48, description: 'The sense of smell may begin becoming more sensitive.' },
  { hours: 48, description: 'The lungs may begin clearing accumulated mucus and trapped material more effectively.' },
  { hours: 48, description: 'Carbon monoxide levels may have returned to the normal nonsmoker range.' },
  { hours: 48, description: 'Food may become more flavorful as taste and smell begin recovering.' },

  // 48–72 hours

  {
    hours: 50,
    description: 'Sensory recovery continues as the mouth and nasal passages remain free from cigarette smoke.',
  },
  { hours: 52, description: 'Natural respiratory clearance mechanisms continue removing mucus and trapped particles.' },
  { hours: 54, description: 'The bronchial passages continue recovering from repeated chemical irritation.' },
  {
    hours: 56,
    description:
      'The nervous system continues adapting to the absence of frequent nicotine-induced neurotransmitter release.',
  },
  {
    hours: 58,
    description: 'The brain continues adjusting its regulation of attention, motivation and reward without nicotine.',
  },
  { hours: 60, description: 'Cotinine and other nicotine metabolites continue declining.' },
  {
    hours: 62,
    description: 'The body remains within the temporary adaptation period associated with acute nicotine withdrawal.',
  },
  { hours: 64, description: 'The most intense phase of nicotine withdrawal may be approaching its end.' },
  { hours: 66, description: 'The respiratory system continues recovering without additional smoke-induced stress.' },
  { hours: 68, description: 'Relaxation of the bronchial passages may begin making breathing more comfortable.' },
  { hours: 70, description: 'The body approaches the end of the typical peak period of acute nicotine withdrawal.' },
  {
    hours: 72,
    description: 'The bronchial tubes may begin relaxing, allowing air to move through the lungs more comfortably.',
  },
  { hours: 72, description: 'Breathing may begin feeling easier and less restricted.' },
  { hours: 72, description: 'Energy levels may begin improving as early respiratory recovery progresses.' },
  {
    hours: 72,
    description:
      'Acute nicotine withdrawal symptoms are often at or near their maximum intensity and may subsequently begin easing.',
  },

  // Day 4

  { hours: 78, description: 'The body may be moving beyond the most intense stage of acute nicotine withdrawal.' },
  { hours: 84, description: 'Physical cravings may begin gradually decreasing in intensity.' },
  {
    hours: 90,
    description: 'The brain continues adapting to normal daily activities without nicotine-induced reward stimulation.',
  },
  {
    hours: 96,
    description: 'Periods of discomfort associated with nicotine withdrawal may gradually become more manageable.',
  },
  {
    hours: 96,
    description: 'The lungs have completed four days without additional cigarette-related chemical injury.',
  },

  // Day 5

  { hours: 102, description: 'Withdrawal-related restlessness may begin gradually easing.' },
  { hours: 108, description: 'The nervous system continues adapting to nicotine-free functioning.' },
  { hours: 114, description: 'Intervals between strong cigarette cravings may begin becoming longer.' },
  {
    hours: 120,
    description:
      'Blood cotinine concentrations may have fallen substantially, although individual elimination rates vary.',
  },
  {
    hours: 120,
    description: 'Smoke-induced increases in certain liver enzyme activities may have substantially diminished.',
  },

  // Day 6

  {
    hours: 126,
    description: 'The brain continues adapting to the absence of regular nicotine-induced dopamine stimulation.',
  },
  { hours: 132, description: 'Withdrawal-related irritability may begin becoming less intense.' },
  { hours: 138, description: 'The respiratory system continues its gradual recovery from smoke-related irritation.' },
  {
    hours: 144,
    description: 'Physical cravings may become shorter or less disruptive as acute withdrawal gradually subsides.',
  },

  // Day 7

  { hours: 150, description: 'The nervous system continues adjusting its regulation of mood and attention.' },
  { hours: 156, description: 'Withdrawal-related physical discomfort may become increasingly manageable.' },
  {
    hours: 162,
    description: 'The body approaches one full week without repeated cigarette-induced cardiovascular stress.',
  },
  {
    hours: 168,
    description: 'One full week of uninterrupted recovery from cigarette smoke exposure has been completed.',
  },
  {
    hours: 168,
    description:
      'The most severe overall phase of nicotine withdrawal has typically passed, although individual symptoms may persist.',
  },
  {
    hours: 168,
    description:
      'Cotinine levels may have fallen below typical smoking-related thresholds if no nicotine has been consumed.',
  },
  {
    hours: 168,
    description:
      'The cardiovascular and respiratory systems have benefited from an entire week without additional cigarette smoke exposure.',
  },

  // Day 8

  {
    hours: 174,
    description: 'Withdrawal-related anxiety may gradually become less intense as neurological adaptation progresses.',
  },
  {
    hours: 180,
    description: 'Withdrawal-related sleep disturbances may begin improving, although disrupted sleep can persist.',
  },
  {
    hours: 186,
    description: 'The brain continues adapting to performing ordinary activities without nicotine stimulation.',
  },
  { hours: 192, description: 'Physical cigarette cravings may become less frequent or easier to tolerate.' },

  // Day 9

  { hours: 198, description: 'Respiratory recovery continues without additional exposure to smoke-related oxidants.' },
  { hours: 204, description: 'The nervous system continues adjusting to the absence of nicotine-induced stimulation.' },
  { hours: 210, description: 'Withdrawal-related emotional fluctuations may gradually become less disruptive.' },
  {
    hours: 216,
    description: 'Restlessness and irritability associated with nicotine withdrawal may gradually diminish.',
  },

  // Day 10

  {
    hours: 222,
    description: 'The ability to remain focused without nicotine may gradually improve as withdrawal subsides.',
  },
  { hours: 228, description: 'Concentration difficulties associated with acute nicotine withdrawal may begin easing.' },
  {
    hours: 234,
    description: 'The body continues recovering without repeated exposure to cigarette-related vascular toxins.',
  },
  { hours: 240, description: 'Physical withdrawal symptoms may become less disruptive to everyday activities.' },
  { hours: 240, description: 'Ten full days without cigarette smoke exposure have been completed.' },

  // Day 11

  { hours: 246, description: 'Periods of normal mood and attention between cravings may become longer.' },
  { hours: 252, description: 'Cravings may continue decreasing in frequency and intensity.' },
  {
    hours: 258,
    description:
      'The cardiovascular system continues recovering without repeated nicotine-induced increases in cardiac workload.',
  },
  {
    hours: 264,
    description: 'Blood vessels continue benefiting from the absence of cigarette-related chemical stress.',
  },

  // Day 12

  { hours: 270, description: 'Withdrawal-related nervousness may gradually diminish.' },
  { hours: 276, description: 'Emotional fluctuations associated with nicotine withdrawal may begin stabilizing.' },
  { hours: 282, description: 'Sleep quality may gradually improve as withdrawal-related disturbances subside.' },
  { hours: 288, description: 'Concentration and attention may become more consistent.' },

  // Day 13

  { hours: 294, description: 'The brain continues adapting to maintaining motivation and attention without nicotine.' },
  { hours: 300, description: 'Adjustment to nicotine-free daily functioning continues.' },
  {
    hours: 306,
    description:
      'The respiratory system approaches the early period in which measurable improvements in lung function may emerge.',
  },
  {
    hours: 312,
    description:
      'Withdrawal-related difficulties with sleep, attention and emotional regulation may continue improving.',
  },

  // Day 14

  {
    hours: 318,
    description:
      'The cardiovascular system approaches the period associated with measurable improvements in circulation.',
  },
  {
    hours: 324,
    description: 'The lungs approach the early recovery period associated with improving respiratory efficiency.',
  },
  {
    hours: 330,
    description: 'Physical withdrawal symptoms may have substantially diminished compared with the first three days.',
  },
  {
    hours: 336,
    description: 'Two full weeks of continuous recovery without cigarette smoke exposure have been completed.',
  },
  { hours: 336, description: 'Blood circulation may begin improving measurably.' },
  { hours: 336, description: 'Lung function may begin improving measurably.' },
  {
    hours: 336,
    description: 'Physical activity may begin feeling easier as circulation and respiratory function improve.',
  },
  { hours: 336, description: 'Walking and climbing stairs may begin requiring less respiratory effort.' },
  { hours: 336, description: 'The longer-term decline in heart attack risk is underway.' },
  {
    hours: 336,
    description:
      'Excessive platelet aggregation may decrease, reducing one contributor to abnormal blood clot formation.',
  },
  { hours: 336, description: 'Oxidative stress within blood platelets may have decreased.' },
  {
    hours: 336,
    description: 'Certain measurable biomarkers associated with tobacco-related oxidative damage may have improved.',
  },
  { hours: 336, description: 'Taste sensitivity at the tip and edges of the tongue may have measurably recovered.' },
  {
    hours: 336,
    description: 'Natural mucus clearance mechanisms in the nasal passages may be approaching improved functioning.',
  },
  { hours: 336, description: 'Physical nicotine withdrawal symptoms may have substantially decreased.' },
  { hours: 336, description: 'Withdrawal-related concentration difficulties may have become less severe.' },
  {
    hours: 336,
    description: 'Withdrawal-related anxiety and irritability may have decreased compared with the first week.',
  },
  { hours: 336, description: 'Sleep disturbances caused by acute nicotine withdrawal may have become less frequent.' },
  { hours: 336, description: 'Cigarette cravings may have become less frequent, less intense and easier to resist.' },
]

const millisecondsPerHour = 60 * 60 * 1000

export function formatMilestoneAgo(elapsed: number, milestoneHours: number) {
  const minutes = Math.floor(Math.max(0, elapsed - milestoneHours * millisecondsPerHour) / 60000)
  if (minutes === 0) return 'just now'
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  const parts = [
    ...(hours ? [`${hours} ${hours === 1 ? 'hour' : 'hours'}`] : []),
    ...(remainingMinutes ? [`${remainingMinutes} ${remainingMinutes === 1 ? 'minute' : 'minutes'}`] : []),
  ]
  return `${parts.join(' ')} ago`
}

export function groupRecoverySteps(steps: typeof smokingRecovery) {
  const groups = new Map<number, string[]>()
  for (const step of steps) {
    const descriptions = groups.get(step.hours)
    if (descriptions) {
      descriptions.push(step.description)
    } else {
      groups.set(step.hours, [step.description])
    }
  }
  return Array.from(groups, ([hours, descriptions]) => ({ hours, descriptions }))
    .sort((a, b) => b.hours - a.hours)
}

export function getRecoveryProgress(startedAt: number, now: number, steps: typeof smokingRecovery = smokingRecovery) {
  const elapsed = Math.max(0, now - startedAt)

  const achieved = steps.filter((step) => elapsed >= step.hours * millisecondsPerHour)

  const next = steps.find((step) => elapsed < step.hours * millisecondsPerHour)

  return {
    elapsed,
    achieved,
    next,
    nextSteps: next ? steps.filter((step) => step.hours === next.hours) : [],
    remaining: next ? Math.max(0, next.hours * millisecondsPerHour - elapsed) : null,
  }
}

export default smokingRecovery
