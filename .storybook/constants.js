import { object } from '@storybook/addon-knobs'

const OUTCOME_COUNT=10

export const basicOutcome = {
  id: '1',
  group: false,
  title: 'Kindergarten',
  description: 'Description of Kindergarten',
  label: 'Kindergarten'
}

export const defaultOutcomes = () => {
  let outcomes = []
  for(let i = 1; i <= OUTCOME_COUNT; i++) {
    outcomes.push(
      {
        id: i,
        label: `Lbl-0${i}`,
        title: `Grade ${i}`,
        summary: `Summary of Grade ${i}`,
        description: `Description of Grade ${i}`
      }
    )
  }
  return outcomes
}

const defaultOutcomeIdsAsStrings = () => {
  let outcomeIds = []
  for(let i = 1; i <= OUTCOME_COUNT; i++) {
    outcomeIds.push(`${i}`)
  }
  return outcomeIds
}

export const defaultOutcomeIds = defaultOutcomeIdsAsStrings()

export const defaultOutcomeIdsAsObjects = () => {
  let outcomeIds = []
  for(let i = 1; i <= OUTCOME_COUNT; i++) {
    outcomeIds.push({id: i})
  }
  return outcomeIds
}

export const getOutcome = (id) => {
  const outcomes = defaultOutcomes()

  for(let i = 0; i < outcomes.length; i++){
    if(parseInt(outcomes[i].id) === parseInt(id)) {
      return object(`Outcome ${i+1}`, outcomes[i])
    }
  }
  return null
}

export const getOutcomeSummary = (id) => {
  const outcomes = object('Outcomes', defaultOutcomes())

  for(let i = 0; i < outcomes.length; i++){
    if(parseInt(outcomes[i].id) === parseInt(id)) {
      return outcomes[i].summary
    }
  }
  return null
}

export const defaultCollections = {
  1: {
    has_children: true,
    guid: '',
    is_partial: false,
    label: 'Parent Label 1',
    child_ids: ['4'],
    title: 'Parent Title 1',
    id: '1',
    description: 'Description of Parent Outcome 1',
    group: true,
    name: 'Parent Outcome 1',
    collections: ['4'],
    descriptor: '1 Group'
  },
  2: {
    has_children: true,
    guid: '',
    is_partial: false,
    label: 'Parent Label 2',
    child_ids: [],
    title: 'Parent Title 2',
    id: '2',
    description: 'Description of Parent Outcome 2',
    group: true,
    name: 'Parent Outcome 2',
    collections: [],
    descriptor: '1 Outcome'
  },
  3: {
    has_children: true,
    guid: '',
    is_partial: false,
    label: 'Parent Label 3',
    child_ids: [],
    title: 'Parent Title 3',
    id: '3',
    description: 'Description of Parent Outcome 3',
    group: true,
    name: 'Parent Outcome 3',
    collections: [],
    descriptor: '1 Outcome'
  },
  4: {
    has_children: true,
    guid: '',
    is_partial: false,
    label: 'Child Label 1',
    child_ids: ['5'],
    title: 'Child Title 1',
    id: '4',
    description: 'Description of Child Outcome Group',
    group: true,
    name: 'Child Outcome 1',
    collections: ['5'],
    descriptor: '3 Outcomes'
  },
  5: {
    has_children: true,
    guid: '',
    is_partial: false,
    label: 'Child Label 2',
    child_ids: [],
    title: 'Child Title 2',
    id: '5',
    description: 'Description of Child 2 Outcome Group',
    group: true,
    name: 'Child Outcome 2',
    collections: [],
    descriptor: '500 Outcomes'
  },
  root: {
    id: 'root',
    title: 'Home',
    description: 'Root group',
    child_ids: ['1', '2', '3'],
    collections: ['1', '2', '3'],
    descriptor: '3 Groups'
  }
}

export const defaultActiveCollection = {
  id: 1,
  header: 'Outcome Title',
  summary: 'Outcome Summary',
  description: 'Outcome Description'
}

export const outcomeRollup = {
  outcomeId: '1',
  averageScore: 0.50,
  count: 55,
  masteryCount: 36,
  childArtifactCount: 3,
  usesBank: undefined
}

export const defaultScore = {
  userId: '123456',
  percentScore: 1,
  points: 3,
  pointsPossible: 3
}

export const defaultScoringMethod = {
  algorithm: 'highest',
  algorithm_data: {},
  mastery_percent: 0.6,
  points_possible: 5
}

export const defaultScoringTiers = [
  { id: '100', description: 'Exceeds Expectations', percent: 1 },
  { id: '101', description: 'Meets Expectations', percent: 0.6 },
  { id: '102', description: 'Does Not Meet Expectations', percent: 0 }
]

export const scoringTiersWithResults = [
  { id: '91', description: 'Exceeds Expectations. The student has done very well to explain how well they have done.', percent: 1, count: 20 },
  { id: '92', description: 'Meets Expectations. The only thing remarkable here is the verbosity of this description.', percent: 0.6, count: 5 },
  { id: '93', description: 'Does Not Meet Expectations', percent: 0, count: 25 }
]

export const scoringMethodWithRollups = {
  algorithm: 'highest',
  algorithm_data: {},
  mastery_percent: 0.6,
  points_possible: 5,
  scoring_tiers: scoringTiersWithResults
}

export const resultAverageScore = {
  averageScore: 0.50
}

export const outcomeWithScoring = {
  id: '15',
  guid: '12345678-1234-1234-12345678901234',
  group: false,
  label: 'Lbl-000',
  title: 'Grade 7 English Language Arts',
  description: 'Description of Grade 7 English Language Arts',
  scoring_method: defaultScoringMethod,
  scoring_tiers: defaultScoringTiers
}

export const outcomeViewWithResults = {
  id: '15',
  guid: '12345678-1234-1234-12345678901234',
  group: false,
  label: 'Lbl-000',
  title: 'Grade 7 English Language Arts',
  description: 'Description of Grade 7 English Language Arts',
  scoring_method: {
    algorithm: 'highest',
    algorithm_data: {},
    mastery_percent: 0.6,
    points_possible: 5,
    scoring_tiers: scoringTiersWithResults
  }
}

export const outcomeWithoutResults = {
  id: '15',
  guid: '12345678-1234-1234-12345678901234',
  group: false,
  label: 'Lbl-000',
  title: 'Grade 7 English Language Arts',
  description: 'Description of Grade 7 English Language Arts',
  scoring_method: {
    algorithm: 'highest',
    algorithm_data: {},
    mastery_percent: 0.6,
    points_possible: 5,
    scoring_tiers: defaultScoringTiers
  }
}


export const individualMasteryResults = [
  {
    outcome_id: 1,
    percent_score: 1.0,
    points: 3,
    points_possible: 3,
    outcome: {
      id: '1',
      group: false,
      label: 'Grade 5 Label',
      title: 'Grade 5 Title',
      description: 'Description of Grade 5',
      scoring_method: {
        algorithm: 'highest',
        algorithm_data: {},
        mastery_percent: 0.6,
        points_possible: 5
      }
    },
    outcome_rollup: {
      average_score: .5
    }
  },
  {
    outcome_id: 2,
    percent_score: 0.66,
    points: 2,
    points_possible: 3,
    outcome: {
      id: '2',
      group: false,
      label: 'Grade 3 Label',
      title: 'Grade 3 Title',
      description: 'Description of Grade 3',
      scoring_method: {
        algorithm: 'highest',
        algorithm_data: {},
        mastery_percent: 0.6,
        points_possible: 5
      }
    },
    outcome_rollup: {
      average_score: .75
    }
  },
]

export const individualNoMasteryResults = [
  {
    outcome_id: 1,
    percent_score: 0.33,
    points: 1,
    points_possible: 3,
    outcome: {
      id: '1',
      group: false,
      label: 'Grade 1 Label',
      title: 'Grade 1 Title',
      description: 'Description of Grade 1',
      scoring_method: {
        algorithm: 'highest',
        algorithm_data: {},
        mastery_percent: 0.6,
        points_possible: 5
      }
    },
    outcome_rollup: {
      average_score: 1.0
    }
  },
  {
    outcome_id: 2,
    percent_score: 0.25,
    points: 1,
    points_possible: 4,
    outcome: {
      id: '2',
      group: false,
      label: 'Grade 4 Label',
      title: 'Grade 4 Title',
      description: 'Description of Grade 4',
      scoring_method: {
        algorithm: 'highest',
        algorithm_data: {},
        mastery_percent: 0.6,
        points_possible: 5
      }
    },
    outcome_rollup: {
      average_score: .50
    }
  },
]
