const HOLYSHEET_BASE_URL = 'https://holysheet.soneshjain.com/api/v1';
const HOLYSHEET_API_KEY = process.env.HOLYSHEET_API_KEY || '6BvKa5GpWg3S4rwjnG1BFk0ISRVRNRL4';

const ratingLabels: { [key: number]: string } = {
  5: 'Excellent',
  4: 'Very Good',
  3: 'Good',
  2: 'Fair',
  1: 'Needs Work'
};

const rowColumnOrder = [
  'submittedAt',
  'firstName',
  'lastName',
  'registeredMobile',
  'registeredEmail',
  'artistTypes',
  'completion',
  'pace',
  'clarity',
  'depth',
  'usefulness',
  'courseInterest',
  'weightedRating',
  'improvementSuggestion',
  'name',
  'title',
  'content',
  'rating',
  'ratingText',
  'isApproved'
] as const;

const normalizeKey = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '');

const getField = (row: Record<string, any>, aliases: string[]) => {
  const aliasSet = new Set(aliases.map(normalizeKey));
  for (const [key, value] of Object.entries(row)) {
    if (aliasSet.has(normalizeKey(key))) {
      return value;
    }
  }
  return undefined;
};

const parseApproved = (value: unknown) => {
  if (typeof value === 'boolean') return value;
  const normalized = String(value ?? '').trim().toLowerCase();
  return normalized === 'true' || normalized === '1' || normalized === 'yes' || normalized === 'y';
};

const isHeaderLikeIncomingRow = (row: Record<string, any>) => {
  const pairs: Array<[string, string[]]> = [
    ['firstName', ['firstName', 'first name']],
    ['lastName', ['lastName', 'last name']],
    ['registeredEmail', ['registeredEmail', 'registered email']],
    ['submittedAt', ['submittedAt', 'submitted at']],
  ];

  return pairs.some(([expected, aliases]) => {
    const value = String(getField(row, aliases) ?? '').trim().toLowerCase();
    return value === expected.toLowerCase();
  });
};

const buildRowsUrl = () => `${HOLYSHEET_BASE_URL}/${HOLYSHEET_API_KEY}/rows`;

export default async function handler(req: any, res: any) {
  try {
    if (req.method === 'GET') {
      const response = await fetch(buildRowsUrl(), {
        method: 'GET',
      });

      const data = await response.json();
      if (!response.ok) {
        return res.status(response.status).json({
          error: data?.error || 'Failed to fetch rows from HolySheet',
          details: data,
        });
      }

      const rawRows = Array.isArray(data?.data) ? data.data : [];
      const rows = rawRows.filter((row: any) => !isHeaderLikeIncomingRow(row));

      const allReviews = rows.map((row: any, index: number) => {
        const numericRating = parseFloat(String(getField(row, ['weightedRating', 'weighted rating', 'rating']) || '5')) || 5;
        const approvedValue = getField(row, ['isApproved', 'is approved', 'is_approved', 'approved', 'approval']);
        const completion = getField(row, ['completion']) || '';
        const artistTypes = getField(row, ['artistTypes', 'artist types']) || '';
        return {
          id: index + 1,
          date: getField(row, ['submittedAt', 'submitted at']) || '',
          name:
            getField(row, ['name']) ||
            `${getField(row, ['firstName', 'first name']) || ''} ${getField(row, ['lastName', 'last name']) || ''}`.trim() ||
            'Anonymous',
          title: getField(row, ['title']) || 'Masterclass Review',
          content: getField(row, ['oneLineExperience', 'one line experience', 'content']) || row.improvementSuggestion || '',
          rating: numericRating,
          completion,
          artistTypes,
          isApproved: parseApproved(approvedValue),
        };
      });

      const visibleReviews = allReviews.filter((review: any) => review.isApproved);

      const totalCount = allReviews.length;
      const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as Record<number, number>;
      let sumRating = 0;

      allReviews.forEach((item: any) => {
        const rate = Math.max(1, Math.min(5, Math.round(item.rating)));
        if (distribution[rate] !== undefined) {
          distribution[rate] += 1;
          sumRating += item.rating;
        }
      });

      const average = totalCount > 0 ? (sumRating / totalCount).toFixed(1) : '5.0';

      return res.status(200).json({
        success: true,
        count: visibleReviews.length,
        totalCount,
        reviews: visibleReviews,
        stats: {
          average,
          distribution: [
            { stars: 5, count: distribution[5] },
            { stars: 4, count: distribution[4] },
            { stars: 3, count: distribution[3] },
            { stars: 2, count: distribution[2] },
            { stars: 1, count: distribution[1] },
          ],
        },
      });
    }

    if (req.method === 'POST') {
      const {
        firstName,
        lastName,
        registeredMobile,
        registeredEmail,
        artistTypes,
        completion,
        pace,
        clarity,
        depth,
        usefulness,
        courseInterest,
        weightedRating,
        oneLineExperience,
        improvementSuggestion,
        name,
        title,
        content,
        rating,
      } = req.body;

      if (!firstName || !lastName || !registeredMobile || !registeredEmail || !oneLineExperience || !improvementSuggestion) {
        return res.status(400).json({
          error: 'Missing required fields',
          required: ['firstName', 'lastName', 'registeredMobile', 'registeredEmail', 'oneLineExperience', 'improvementSuggestion'],
        });
      }

      const numericRating = parseInt(String(rating || '5'), 10) || 5;
      const ratingText = ratingLabels[numericRating] || 'Good';
      const now = new Date().toISOString();
      const finalWeightedRating = Number(parseFloat(String(weightedRating || numericRating)).toFixed(2));

      const row = {
        submittedAt: now,
        firstName,
        lastName,
        registeredMobile,
        registeredEmail,
        artistTypes: Array.isArray(artistTypes) ? artistTypes.join(', ') : String(artistTypes || ''),
        completion: completion || '',
        pace: pace || '',
        clarity: clarity || '',
        depth: depth || '',
        usefulness: usefulness || '',
        courseInterest: courseInterest || '',
        weightedRating: finalWeightedRating,
        oneLineExperience: oneLineExperience || '',
        improvementSuggestion: improvementSuggestion || '',
        name: name || `${firstName} ${lastName}`.trim(),
        title: title || 'Masterclass Review',
        content: content || '',
        rating: finalWeightedRating,
        ratingText,
        isApproved: false,
      };

      const isHeaderLikeRow = rowColumnOrder.every((columnName) => {
        const value = String((row as any)[columnName] ?? '').trim().toLowerCase();
        return value === columnName.toLowerCase();
      });

      if (isHeaderLikeRow) {
        return res.status(400).json({
          error: 'Invalid row payload detected',
          details: 'Header-like values were detected and blocked to avoid duplicate column name rows.',
        });
      }

      const rowValues = rowColumnOrder.map((columnName) => (row as any)[columnName]);

      const response = await fetch(buildRowsUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rows: [rowValues] }),
      });

      const data = await response.json();
      if (!response.ok) {
        return res.status(response.status).json({
          error: data?.error || 'Failed to append row to HolySheet',
          details: data,
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Successfully submitted review.',
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Error with HolySheet API:', error);
    return res.status(500).json({ error: 'Failed to process request', details: error.message });
  }
}
