/**
 * POST /api/predict
 *
 * Endpoint for making digit predictions using the neural network.
 * Accepts image data, runs it through the model, logs to database,
 * and returns prediction results with activations for visualization.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getNetworkInstance } from '@/lib/neuralNetwork';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { imageData, inputLabel } = body;

    // Validate input
    if (!imageData || !Array.isArray(imageData)) {
      return NextResponse.json(
        { error: 'Invalid image data. Expected array of pixel values.' },
        { status: 400 }
      );
    }

    if (imageData.length !== 784) {
      return NextResponse.json(
        { error: `Invalid image size. Expected 784 pixels (28x28), got ${imageData.length}` },
        { status: 400 }
      );
    }

    // Get neural network instance
    const network = getNetworkInstance();
    await network.initialize();

    // Make prediction
    const result = await network.predict(imageData);

    // Prepare probabilities object for database (digit: probability)
    const probabilitiesObj: { [key: string]: number } = {};
    result.probabilities.forEach((prob, index) => {
      probabilitiesObj[index.toString()] = prob;
    });

    // Get client metadata
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0] : 'unknown';

    const metadata = {
      userAgent,
      ip,
      timestamp: new Date().toISOString(),
    };

    // Save prediction to database
    const prediction = await prisma.prediction.create({
      data: {
        inputLabel: inputLabel || null,
        predictedDigit: result.predictedDigit,
        probabilities: probabilitiesObj,
        activations: {
          inputSize: result.activations.input.length,
          hidden1Size: result.activations.hidden1.length,
          hidden2Size: result.activations.hidden2.length,
          outputSize: result.activations.output.length,
          // Store only summary statistics to keep JSON size manageable
          hidden1: {
            mean: result.activations.hidden1.reduce((a, b) => a + b, 0) / result.activations.hidden1.length,
            max: Math.max(...result.activations.hidden1),
            min: Math.min(...result.activations.hidden1),
            values: result.activations.hidden1, // Full values for visualization
          },
          hidden2: {
            mean: result.activations.hidden2.reduce((a, b) => a + b, 0) / result.activations.hidden2.length,
            max: Math.max(...result.activations.hidden2),
            min: Math.min(...result.activations.hidden2),
            values: result.activations.hidden2, // Full values for visualization
          },
          output: result.activations.output,
        },
        meta: metadata,
      },
    });

    // Return prediction result
    return NextResponse.json({
      success: true,
      id: prediction.id,
      predictedDigit: result.predictedDigit,
      confidence: result.confidence,
      probabilities: result.probabilities,
      activations: result.activations,
    });
  } catch (error) {
    console.error('Prediction error:', error);

    return NextResponse.json(
      {
        error: 'Failed to make prediction',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
