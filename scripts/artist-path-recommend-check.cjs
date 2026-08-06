/**
 * Self-check: artist-path course recommendation scoring
 * (mirrors public/js/tsc-components.js getRecommendedCourse)
 */
const courses = [
  {
    id: 'composition',
    title: 'The heART of Composition',
    keywords: ['imagination', 'emotion', 'expression', 'songwriting', 'composer', 'lyrics', 'writing', 'mainstream']
  },
  {
    id: 'classical',
    title: 'Roots of Hindustani Classical',
    keywords: ['classical', 'riyaaz', 'vocal', 'guruji', 'raag', 'hindustani', 'gharanas', 'singing']
  },
  {
    id: 'production',
    title: 'A to Z of Music Production',
    keywords: ['daw', 'ableton', 'logic', 'fl studio', 'production', 'mixing', 'mastering', 'tech', 'studio', 'beat', 'orchestration']
  }
];

function getRecommendedCourse(data) {
  const text = [
    data.artistIdentity,
    data.trainingDetails,
    data.coreSkills,
    data.mentorshipNeeds,
    data.learningNeeds,
    data.currentSetup,
    data.currentlyWorkingOn
  ].join(' ').toLowerCase();
  const scores = { composition: 0, classical: 0, production: 0 };
  courses.forEach((course) => {
    course.keywords.forEach((kw) => {
      if (text.includes(kw)) scores[course.id] += 1;
    });
  });
  if (scores.classical > 0 && scores.classical >= scores.production && scores.classical >= scores.composition) {
    return courses[1];
  }
  if (scores.production > scores.composition && scores.production > scores.classical) {
    return courses[2];
  }
  return courses[0];
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

assert(
  getRecommendedCourse({ trainingDetails: 'daily riyaaz and raag practice', learningNeeds: 'hindustani vocal' }).id === 'classical',
  'classical path'
);
assert(
  getRecommendedCourse({ coreSkills: 'ableton production', currentSetup: 'Logic mixing studio', learningNeeds: 'mastering' }).id === 'production',
  'production path'
);
assert(
  getRecommendedCourse({ artistIdentity: 'songwriting and lyrics', coreSkills: 'composer expression' }).id === 'composition',
  'composition path'
);
assert(getRecommendedCourse({}).id === 'composition', 'default composition');

console.log('artist-path recommend self-check OK');
