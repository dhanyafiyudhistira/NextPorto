/**
 * GET /api/history/export
 *
 * Endpoint for exporting prediction history as CSV file.
 * Supports the same filters as the history endpoint.
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Filter parameters
    const predictedDigit = searchParams.get('digit');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build filter object (same as history route)
    const where: any = {};

    if (predictedDigit !== null && predictedDigit !== '') {
      where.predictedDigit = parseInt(predictedDigit);
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        const endDateTime = new Date(endDate);
        endDateTime.setDate(endDateTime.getDate() + 1);
        where.createdAt.lt = endDateTime;
      }
    }

    // Fetch all matching predictions
    const predictions = await prisma.prediction.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        createdAt: true,
        inputLabel: true,
        predictedDigit: true,
        probabilities: true,
      },
    });

    // Generate CSV content
    const csvRows: string[] = [];

    // Header row
    const headers = [
      'ID',
      'Timestamp',
      'Input Label',
      'Predicted Digit',
      'Prob_0',
      'Prob_1',
      'Prob_2',
      'Prob_3',
      'Prob_4',
      'Prob_5',
      'Prob_6',
      'Prob_7',
      'Prob_8',
      'Prob_9',
    ];
    csvRows.push(headers.join(','));

    // Data rows
    for (const pred of predictions) {
      const probs = pred.probabilities as { [key: string]: number };

      const row = [
        pred.id.toString(),
        new Date(pred.createdAt).toISOString(),
        pred.inputLabel || '',
        pred.predictedDigit.toString(),
        ...[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) =>
          (probs[digit.toString()] || 0).toFixed(6)
        ),
      ];

      csvRows.push(row.join(','));
    }

    const csvContent = csvRows.join('\n');

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `predictions-${timestamp}.csv`;

    // Return CSV file
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('CSV export error:', error);

    return NextResponse.json(
      {
        error: 'Failed to export CSV',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
