import { NCERTGrade } from '../types';

export const NCERT_CLASSES = [
  'Class 1',
  'Class 2',
  'Class 3',
  'Class 4',
  'Class 5',
  'Class 6',
  'Class 7',
  'Class 8',
];

export const NCERT_SUBJECTS = [
  'Mathematics',
  'Science/EVS',
  'English',
  'Hindi',
  'Social Science',
];

// Highly detailed pre-seeded core chapters & topics for Classes 1 to 8
export const preSeededNCERTData: { [grade: string]: NCERTGrade } = {
  'Class 1': {
    id: 'Class 1',
    subjects: {
      'Mathematics': {
        id: 'math-1',
        name: 'Mathematics',
        chapters: [
          {
            id: 'c1-m-ch1',
            number: 1,
            title: 'Shapes and Space',
            topics: [
              { id: 'c1-m-ch1-t1', name: 'Inside and Outside', isCompleted: false },
              { id: 'c1-m-ch1-t2', name: 'Bigger and Smaller', isCompleted: false },
              { id: 'c1-m-ch1-t3', name: 'Top and Bottom', isCompleted: false },
              { id: 'c1-m-ch1-t4', name: 'Nearer and Farther', isCompleted: false },
            ],
          },
          {
            id: 'c1-m-ch2',
            number: 2,
            title: 'Numbers from One to Nine',
            topics: [
              { id: 'c1-m-ch2-t1', name: 'As many as (Matching)', isCompleted: false },
              { id: 'c1-m-ch2-t2', name: 'Counting 1 to 5', isCompleted: false },
              { id: 'c1-m-ch2-t3', name: 'Counting 6 to 9', isCompleted: false },
              { id: 'c1-m-ch2-t4', name: 'Concept of Zero', isCompleted: false },
            ],
          },
        ],
      },
      'Science/EVS': {
        id: 'evs-1',
        name: 'Science/EVS',
        chapters: [
          {
            id: 'c1-e-ch1',
            number: 1,
            title: 'About Me & My Body',
            topics: [
              { id: 'c1-e-ch1-t1', name: 'Parts of the Body', isCompleted: false },
              { id: 'c1-e-ch1-t2', name: 'Our Five Sense Organs', isCompleted: false },
              { id: 'c1-e-ch1-t3', name: 'Keeping Clean (Hygiene)', isCompleted: false },
            ],
          },
        ],
      },
      'English': {
        id: 'eng-1',
        name: 'English',
        chapters: [
          {
            id: 'c1-en-ch1',
            number: 1,
            title: 'A Happy Child (Poem)',
            topics: [
              { id: 'c1-en-ch1-t1', name: 'Recitation and Meaning', isCompleted: false },
              { id: 'c1-en-ch1-t2', name: 'Color Identification (Red/Green/Yellow)', isCompleted: false },
              { id: 'c1-en-ch1-t3', name: 'Vocabulary & Rhyming Words', isCompleted: false },
            ],
          },
        ],
      },
      'Hindi': {
        id: 'hin-1',
        name: 'Hindi',
        chapters: [
          {
            id: 'c1-h-ch1',
            number: 1,
            title: 'झूला (कविता)',
            topics: [
              { id: 'c1-h-ch1-t1', name: 'सस्वर वाचन', isCompleted: false },
              { id: 'c1-h-ch1-t2', name: 'शब्दावली और मिलान', isCompleted: false },
            ],
          },
        ],
      },
      'Social Science': {
        id: 'ss-1',
        name: 'Social Science',
        chapters: [
          {
            id: 'c1-ss-ch1',
            number: 1,
            title: 'My Family & Home',
            topics: [
              { id: 'c1-ss-ch1-t1', name: 'Types of Families', isCompleted: false },
              { id: 'c1-ss-ch1-t2', name: 'Helping at Home', isCompleted: false },
            ],
          },
        ],
      },
    },
  },
  'Class 2': {
    id: 'Class 2',
    subjects: {
      'Mathematics': {
        id: 'math-2',
        name: 'Mathematics',
        chapters: [
          {
            id: 'c2-m-ch1',
            number: 1,
            title: 'What is Long, What is Round?',
            topics: [
              { id: 'c2-m-ch1-t1', name: 'Rolling and Sliding', isCompleted: false },
              { id: 'c2-m-ch1-t2', name: 'Tracing 2D shapes', isCompleted: false },
            ],
          },
        ],
      },
      'Science/EVS': {
        id: 'evs-2',
        name: 'Science/EVS',
        chapters: [
          {
            id: 'c2-e-ch1',
            number: 1,
            title: 'Plants Around Us',
            topics: [
              { id: 'c2-e-ch1-t1', name: 'Types of Plants (Trees, Herbs, Shrubs)', isCompleted: false },
              { id: 'c2-e-ch1-t2', name: 'Parts of a Plant', isCompleted: false },
            ],
          },
        ],
      },
      'English': {
        id: 'eng-2',
        name: 'English',
        chapters: [
          {
            id: 'c2-en-ch1',
            number: 1,
            title: 'First Day at School',
            topics: [
              { id: 'c2-en-ch1-t1', name: 'Reading and Comprehension', isCompleted: false },
              { id: 'c2-en-ch1-t2', name: 'Classroom Vocabulary', isCompleted: false },
            ],
          },
        ],
      },
      'Hindi': {
        id: 'hin-2',
        name: 'Hindi',
        chapters: [
          {
            id: 'c2-h-ch1',
            number: 1,
            title: 'ऊँट चला',
            topics: [
              { id: 'c2-h-ch1-t1', name: 'कविता पठन और शब्दार्थ', isCompleted: false },
            ],
          },
        ],
      },
      'Social Science': {
        id: 'ss-2',
        name: 'Social Science',
        chapters: [
          {
            id: 'c2-ss-ch1',
            number: 1,
            title: 'Our Neighborhood',
            topics: [
              { id: 'c2-ss-ch1-t1', name: 'Important Places (Market, Post Office, Hospital)', isCompleted: false },
            ],
          },
        ],
      },
    },
  },
  'Class 3': {
    id: 'Class 3',
    subjects: {
      'Mathematics': {
        id: 'math-3',
        name: 'Mathematics',
        chapters: [
          {
            id: 'c3-m-ch1',
            number: 1,
            title: 'Where to Look From',
            topics: [
              { id: 'c3-m-ch1-t1', name: 'Top, Side and Front Views', isCompleted: false },
              { id: 'c3-m-ch1-t2', name: 'Symmetrical Shapes & Dot Grid', isCompleted: false },
            ],
          },
        ],
      },
      'Science/EVS': {
        id: 'evs-3',
        name: 'Science/EVS',
        chapters: [
          {
            id: 'c3-e-ch1',
            number: 1,
            title: 'Poonam’s Day Out',
            topics: [
              { id: 'c3-e-ch1-t1', name: 'Animal Habitats (Land, Water, Air)', isCompleted: false },
              { id: 'c3-e-ch1-t2', name: 'Sounds and Movements of Animals', isCompleted: false },
            ],
          },
        ],
      },
      'English': {
        id: 'eng-3',
        name: 'English',
        chapters: [
          {
            id: 'c3-en-ch1',
            number: 1,
            title: 'Good Morning (Poem)',
            topics: [
              { id: 'c3-en-ch1-t1', name: 'Poem Recitation & Central Idea', isCompleted: false },
            ],
          },
        ],
      },
      'Hindi': {
        id: 'hin-3',
        name: 'Hindi',
        chapters: [
          {
            id: 'c3-h-ch1',
            number: 1,
            title: 'कक्कू',
            topics: [
              { id: 'c3-h-ch1-t1', name: 'चिढ़ने वाले स्वभाव का वर्णन', isCompleted: false },
            ],
          },
        ],
      },
      'Social Science': {
        id: 'ss-3',
        name: 'Social Science',
        chapters: [
          {
            id: 'c3-ss-ch1',
            number: 1,
            title: 'Maps & Directions',
            topics: [
              { id: 'c3-ss-ch1-t1', name: 'The Four Cardinal Directions', isCompleted: false },
              { id: 'c3-ss-ch1-t2', name: 'Introduction to Symbols', isCompleted: false },
            ],
          },
        ],
      },
    },
  },
  'Class 4': {
    id: 'Class 4',
    subjects: {
      'Mathematics': {
        id: 'math-4',
        name: 'Mathematics',
        chapters: [
          {
            id: 'c4-m-ch1',
            number: 1,
            title: 'Building with Bricks',
            topics: [
              { id: 'c4-m-ch1-t1', name: 'Brick Patterns and Arch designs', isCompleted: false },
              { id: 'c4-m-ch1-t2', name: 'Estimating Large Numbers (Thousands/Lakhs)', isCompleted: false },
            ],
          },
        ],
      },
      'Science/EVS': {
        id: 'evs-4',
        name: 'Science/EVS',
        chapters: [
          {
            id: 'c4-e-ch1',
            number: 1,
            title: 'Going to School',
            topics: [
              { id: 'c4-e-ch1-t1', name: 'Bamboo Bridges & Trolleys (Himalayan areas)', isCompleted: false },
              { id: 'c4-e-ch1-t2', name: 'Vallam and Camel Carts', isCompleted: false },
            ],
          },
        ],
      },
      'English': {
        id: 'eng-4',
        name: 'English',
        chapters: [
          {
            id: 'c4-en-ch1',
            number: 1,
            title: 'Wake Up! (Poem)',
            topics: [
              { id: 'c4-en-ch1-t1', name: 'Morning Descriptions & Sounds', isCompleted: false },
            ],
          },
        ],
      },
      'Hindi': {
        id: 'hin-4',
        name: 'Hindi',
        chapters: [
          {
            id: 'c4-h-ch1',
            number: 1,
            title: 'मन के भोले-भाले बादल',
            topics: [
              { id: 'c4-h-ch1-t1', name: 'बादलों की कल्पना और उपमाएँ', isCompleted: false },
            ],
          },
        ],
      },
      'Social Science': {
        id: 'ss-4',
        name: 'Social Science',
        chapters: [
          {
            id: 'c4-ss-ch1',
            number: 1,
            title: 'Our Beautiful Country India',
            topics: [
              { id: 'c4-ss-ch1-t1', name: 'States and Union Territories', isCompleted: false },
              { id: 'c4-ss-ch1-t2', name: 'Physical Divisions of India', isCompleted: false },
            ],
          },
        ],
      },
    },
  },
  'Class 5': {
    id: 'Class 5',
    subjects: {
      'Mathematics': {
        id: 'math-5',
        name: 'Mathematics',
        chapters: [
          {
            id: 'c5-m-ch1',
            number: 1,
            title: 'The Fish Tale',
            topics: [
              { id: 'c5-m-ch1-t1', name: 'Log Cabin Calculations', isCompleted: false },
              { id: 'c5-m-ch1-t2', name: 'Place Value up to Crore', isCompleted: false },
              { id: 'c5-m-ch1-t3', name: 'Speed, Distance and Time Word Problems', isCompleted: false },
            ],
          },
          {
            id: 'c5-m-ch2',
            number: 2,
            title: 'Shapes and Angles',
            topics: [
              { id: 'c5-m-ch2-t1', name: 'Right Angles & Acute/Obtuse', isCompleted: false },
              { id: 'c5-m-ch2-t2', name: 'Angles in Names and Clocks', isCompleted: false },
            ],
          },
        ],
      },
      'Science/EVS': {
        id: 'evs-5',
        name: 'Science/EVS',
        chapters: [
          {
            id: 'c5-e-ch1',
            number: 1,
            title: 'Super Senses',
            topics: [
              { id: 'c5-e-ch1-t1', name: 'Amazing Sight of Eagles', isCompleted: false },
              { id: 'c5-e-ch1-t2', name: 'Scent Trails of Ants & Dogs', isCompleted: false },
              { id: 'c5-e-ch1-t3', name: 'Sleeping and Waking Cycles of Animals', isCompleted: false },
            ],
          },
          {
            id: 'c5-e-ch2',
            number: 2,
            title: 'A Snake Charmer’s Story',
            topics: [
              { id: 'c5-e-ch2-t1', name: 'Kalbelia Dance and Bean Music', isCompleted: false },
              { id: 'c5-e-ch2-t2', name: 'Poisonous Snakes in India', isCompleted: false },
            ],
          },
        ],
      },
      'English': {
        id: 'eng-5',
        name: 'English',
        chapters: [
          {
            id: 'c5-en-ch1',
            number: 1,
            title: 'Ice-cream Man (Poem)',
            topics: [
              { id: 'c5-en-ch1-t1', name: 'Rhyme Scheme and Sensory Details', isCompleted: false },
            ],
          },
        ],
      },
      'Hindi': {
        id: 'hin-5',
        name: 'Hindi',
        chapters: [
          {
            id: 'c5-h-ch1',
            number: 1,
            title: 'राख की रस्सी',
            topics: [
              { id: 'c5-h-ch1-t1', name: 'तिब्बती लोककथा और चालाकी', isCompleted: false },
            ],
          },
        ],
      },
      'Social Science': {
        id: 'ss-5',
        name: 'Social Science',
        chapters: [
          {
            id: 'c5-ss-ch1',
            number: 1,
            title: 'The Globe and Maps',
            topics: [
              { id: 'c5-ss-ch1-t1', name: 'Latitudes and Longitudes', isCompleted: false },
              { id: 'c5-ss-ch1-t2', name: 'Equator and Prime Meridian', isCompleted: false },
            ],
          },
        ],
      },
    },
  },
  'Class 6': {
    id: 'Class 6',
    subjects: {
      'Mathematics': {
        id: 'math-6',
        name: 'Mathematics',
        chapters: [
          {
            id: 'c6-m-ch1',
            number: 1,
            title: 'Knowing Our Numbers',
            topics: [
              { id: 'c6-m-ch1-t1', name: 'Comparing Numbers', isCompleted: false },
              { id: 'c6-m-ch1-t2', name: 'Indian and International Place Value Systems', isCompleted: false },
              { id: 'c6-m-ch1-t3', name: 'Estimation & Roman Numerals', isCompleted: false },
            ],
          },
          {
            id: 'c6-m-ch2',
            number: 2,
            title: 'Whole Numbers',
            topics: [
              { id: 'c6-m-ch2-t1', name: 'Predecessor and Successor', isCompleted: false },
              { id: 'c6-m-ch2-t2', name: 'Properties of Whole Numbers', isCompleted: false },
            ],
          },
        ],
      },
      'Science/EVS': {
        id: 'evs-6',
        name: 'Science/EVS',
        chapters: [
          {
            id: 'c6-e-ch1',
            number: 1,
            title: 'Components of Food',
            topics: [
              { id: 'c6-e-ch1-t1', name: 'Nutrients: Carbohydrates, Proteins, Fats', isCompleted: false },
              { id: 'c6-e-ch1-t2', name: 'Deficiency Diseases', isCompleted: false },
              { id: 'c6-e-ch1-t3', name: 'Balanced Diet', isCompleted: false },
            ],
          },
        ],
      },
      'English': {
        id: 'eng-6',
        name: 'English',
        chapters: [
          {
            id: 'c6-en-ch1',
            number: 1,
            title: 'Who Did Patrick’s Homework?',
            topics: [
              { id: 'c6-en-ch1-t1', name: 'Reading & Discussion on Homework Ethics', isCompleted: false },
              { id: 'c6-en-ch1-t2', name: 'Nouns and Pronouns Exercises', isCompleted: false },
            ],
          },
        ],
      },
      'Hindi': {
        id: 'hin-6',
        name: 'Hindi',
        chapters: [
          {
            id: 'c6-h-ch1',
            number: 1,
            title: 'वह चिड़िया जो',
            topics: [
              { id: 'c6-h-ch1-t1', name: 'स्वतंत्रता और प्रकृति प्रेम', isCompleted: false },
            ],
          },
        ],
      },
      'Social Science': {
        id: 'ss-6',
        name: 'Social Science',
        chapters: [
          {
            id: 'c6-ss-ch1',
            number: 1,
            title: 'What, Where, How and When?',
            topics: [
              { id: 'c6-ss-ch1-t1', name: 'Life Along River Narmada', isCompleted: false },
              { id: 'c6-ss-ch1-t2', name: 'Manuscripts and Inscriptions', isCompleted: false },
            ],
          },
        ],
      },
    },
  },
  'Class 7': {
    id: 'Class 7',
    subjects: {
      'Mathematics': {
        id: 'math-7',
        name: 'Mathematics',
        chapters: [
          {
            id: 'c7-m-ch1',
            number: 1,
            title: 'Integers',
            topics: [
              { id: 'c7-m-ch1-t1', name: 'Properties of Addition & Subtraction', isCompleted: false },
              { id: 'c7-m-ch1-t2', name: 'Multiplication & Division of Integers', isCompleted: false },
            ],
          },
        ],
      },
      'Science/EVS': {
        id: 'evs-7',
        name: 'Science/EVS',
        chapters: [
          {
            id: 'c7-e-ch1',
            number: 1,
            title: 'Nutrition in Plants',
            topics: [
              { id: 'c7-e-ch1-t1', name: 'Photosynthesis Mechanism', isCompleted: false },
              { id: 'c7-e-ch1-t2', name: 'Insectivorous & Parasitic Plants', isCompleted: false },
            ],
          },
        ],
      },
      'English': {
        id: 'eng-7',
        name: 'English',
        chapters: [
          {
            id: 'c7-en-ch1',
            number: 1,
            title: 'Three Questions (Leo Tolstoy)',
            topics: [
              { id: 'c7-en-ch1-t1', name: 'Moral Meaning & Characters', isCompleted: false },
            ],
          },
        ],
      },
      'Hindi': {
        id: 'hin-7',
        name: 'Hindi',
        chapters: [
          {
            id: 'c7-h-ch1',
            number: 1,
            title: 'हम पंछी उन्मुक्त गगन के',
            topics: [
              { id: 'c7-h-ch1-t1', name: 'कविता व्याख्या और स्वतंत्रता महत्व', isCompleted: false },
            ],
          },
        ],
      },
      'Social Science': {
        id: 'ss-7',
        name: 'Social Science',
        chapters: [
          {
            id: 'c7-ss-ch1',
            number: 1,
            title: 'Tracing Changes Through a Thousand Years',
            topics: [
              { id: 'c7-ss-ch1-t1', name: 'New Terminology & Cartography Changes', isCompleted: false },
            ],
          },
        ],
      },
    },
  },
  'Class 8': {
    id: 'Class 8',
    subjects: {
      'Mathematics': {
        id: 'math-8',
        name: 'Mathematics',
        chapters: [
          {
            id: 'c8-m-ch1',
            number: 1,
            title: 'Rational Numbers',
            topics: [
              { id: 'c8-m-ch1-t1', name: 'Closure, Commutative & Associative Properties', isCompleted: false },
              { id: 'c8-m-ch1-t2', name: 'Additive Inverse and Reciprocal', isCompleted: false },
              { id: 'c8-m-ch1-t3', name: 'Representation on Number Line', isCompleted: false },
            ],
          },
          {
            id: 'c8-m-ch2',
            number: 2,
            title: 'Linear Equations in One Variable',
            topics: [
              { id: 'c8-m-ch2-t1', name: 'Solving Equations with Variables on Both Sides', isCompleted: false },
              { id: 'c8-m-ch2-t2', name: 'Practical Applications Word Problems', isCompleted: false },
            ],
          },
        ],
      },
      'Science/EVS': {
        id: 'evs-8',
        name: 'Science/EVS',
        chapters: [
          {
            id: 'c8-e-ch1',
            number: 1,
            title: 'Crop Production and Management',
            topics: [
              { id: 'c8-e-ch1-t1', name: 'Agricultural Implements & Soil Preparation', isCompleted: false },
              { id: 'c8-e-ch1-t2', name: 'Sowing, Manure and Fertilizers', isCompleted: false },
              { id: 'c8-e-ch1-t3', name: 'Irrigation Methods (Drip & Sprinkler)', isCompleted: false },
            ],
          },
          {
            id: 'c8-e-ch2',
            number: 2,
            title: 'Microorganisms: Friend and Foe',
            topics: [
              { id: 'c8-e-ch2-t1', name: 'Types of Microbes', isCompleted: false },
              { id: 'c8-e-ch2-t2', name: 'Pathogens and Vaccine Action', isCompleted: false },
            ],
          },
        ],
      },
      'English': {
        id: 'eng-8',
        name: 'English',
        chapters: [
          {
            id: 'c8-en-ch1',
            number: 1,
            title: 'The Best Christmas Present in the World',
            topics: [
              { id: 'c8-en-ch1-t1', name: 'WWI War Letters and Analysis', isCompleted: false },
            ],
          },
        ],
      },
      'Hindi': {
        id: 'hin-8',
        name: 'Hindi',
        chapters: [
          {
            id: 'c8-h-ch1',
            number: 1,
            title: 'ध्वनि (कविता)',
            topics: [
              { id: 'c8-h-ch1-t1', name: 'सूर्यकांत त्रिपाठी निराला - भावार्थ', isCompleted: false },
            ],
          },
        ],
      },
      'Social Science': {
        id: 'ss-8',
        name: 'Social Science',
        chapters: [
          {
            id: 'c8-ss-ch1',
            number: 1,
            title: 'The Indian Constitution',
            topics: [
              { id: 'c8-ss-ch1-t1', name: 'Why does a Country need a Constitution?', isCompleted: false },
              { id: 'c8-ss-ch1-t2', name: 'Key Features: Federalism & Secularism', isCompleted: false },
            ],
          },
        ],
      },
    },
  },
};
