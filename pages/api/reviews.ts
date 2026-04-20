const HOLYSHEET_BASE_URL = 'https://holysheet.soneshjain.com/api/v1';
const HOLYSHEET_API_KEY = process.env.HOLYSHEET_API_KEY || '6BvKa5GpWg3S4rwjnG1BFk0ISRVRNRL4';

const ratingLabels: { [key: number]: string } = {
  5: 'Excellent',
  4: 'Very Good',
  3: 'Good',
  2: 'Fair',
  1: 'Needs Work'
};

const expectedColumns = [
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
  'ratingText'
];

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

      const rows = Array.isArray(data?.data) ? data.data : [];
      const allReviews = rows.map((row: any, index: number) => {
        const numericRating = parseFloat(String(row.weightedRating || row.rating || '5')) || 5;
        return {
          id: index + 1,
          date: row.submittedAt || '',
          name: row.name || `${row.firstName || ''} ${row.lastName || ''}`.trim() || 'Anonymous',
          title: row.title || 'Masterclass Review',
          content: row.content || row.improvementSuggestion || '',
          rating: numericRating,
        };
      });

      const totalCount = allReviews.length;
      const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as Record<number, number>;
      let sumRating = 0;

      allReviews.forEach((item: any) => {
        const rate = item.rating;
        if (distribution[rate] !== undefined) {
          distribution[rate] += 1;
          sumRating += rate;
        }
      });

      const average = totalCount > 0 ? (sumRating / totalCount).toFixed(1) : '5.0';

      return res.status(200).json({
        success: true,
        count: totalCount,
        totalCount,
        reviews: allReviews,
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
        expectedColumns,
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
        improvementSuggestion,
        name,
        title,
        content,
        rating,
      } = req.body;

      if (!firstName || !lastName || !registeredMobile || !registeredEmail || !improvementSuggestion) {
        return res.status(400).json({
          error: 'Missing required fields',
          required: ['firstName', 'lastName', 'registeredMobile', 'registeredEmail', 'improvementSuggestion'],
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
        improvementSuggestion: improvementSuggestion || '',
        name: name || `${firstName} ${lastName}`.trim(),
        title: title || 'Masterclass Review',
        content: content || '',
        rating: finalWeightedRating,
        ratingText,
      };

      const response = await fetch(buildRowsUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rows: [row] }),
      });

      const data = await response.json();
      if (!response.ok) {
        return res.status(response.status).json({
          error: data?.error || 'Failed to append row to HolySheet',
          details: data,
          expectedColumns,
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Successfully submitted review.',
        expectedColumns,
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Error with HolySheet API:', error);
    return res.status(500).json({ error: 'Failed to process request', details: error.message });
  }
}
