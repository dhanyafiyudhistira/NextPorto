/**
 * GET /api/history
 *
 * Endpoint for retrieving prediction history from the database.
 * Supports pagination and filtering by date range and predicted digit.
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Filter parameters
    const predictedDigit = searchParams.get('digit');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build filter object
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
        // Add 1 day to include the entire end date
        const endDateTime = new Date(endDate);
        endDateTime.setDate(endDateTime.getDate() + 1);
        where.createdAt.lt = endDateTime;
      }
    }

    // Get total count for pagination
    const total = await prisma.prediction.count({ where });

    // Fetch predictions
    const predictions = await prisma.prediction.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
      select: {
        id: true,
        createdAt: true,
        inputLabel: true,
        predictedDigit: true,
        probabilities: true,
      },
    });

    // Format predictions for frontend
    const formattedPredictions = predictions.map((pred) => {
      const probs = pred.probabilities as { [key: string]: number };

      // Get top 3 probabilities
      const probEntries = Object.entries(probs)
        .map(([digit, prob]) => ({ digit: parseInt(digit), probability: prob }))
        .sort((a, b) => b.probability - a.probability)
        .slice(0, 3);

      return {
        id: pred.id,
        createdAt: pred.createdAt,
        inputLabel: pred.inputLabel,
        predictedDigit: pred.predictedDigit,
        topProbabilities: probEntries,
        allProbabilities: probs,
      };
    });

    return NextResponse.json({
      success: true,
      data: formattedPredictions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('History fetch error:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch history',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
