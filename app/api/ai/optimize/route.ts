import { NextRequest, NextResponse } from 'next/server';
import { getOptimizer } from '@/lib/ai/optimization';
import { prisma } from '@/lib/db/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { method, constraints, gridState } = body;

    // Get current DER states from database
    const ders = await prisma.der.findMany({
      where: { isEnabled: true },
      select: {
        id: true,
        name: true,
        pMax: true,
        pActual: true,
        curtailmentPercent: true,
      },
    });

    // Prepare optimization input
    const input = {
      ders: ders.map((der: any) => ({
        id: der.id,
        name: der.name,
        pMax: der.pMax,
        pActual: der.pActual,
        currentCurtailment: der.curtailmentPercent,
      })),
      constraints: constraints || {
        voltageMin: 0.95,
        voltageMax: 1.05,
        maxLoading: 100,
        minimizeCurtailment: true,
      },
      gridState: gridState || {
        voltage: 1.0,
        loading: 85,
        congestionPoints: [],
      },
    };

    // Run optimization
    const optimizer = getOptimizer(method || 'LINEAR_PROGRAMMING');
    const result = optimizer.optimize(input);

    // Save optimization result to database
    const optimizationRecord = await prisma.aiOptimizationResult.create({
      data: {
        method: method || 'LINEAR_PROGRAMMING',
        status: 'COMPLETED',
        inputData: input as any,
        recommendedCurtailment: result.recommendations as any,
        expectedImprovement: result.recommendations.reduce(
          (sum, r) => sum + r.expectedReduction,
          0
        ),
        executionTime: result.metrics.executionTime,
        iterations: result.metrics.iterations,
        convergence: result.metrics.convergence,
      },
    });

    return NextResponse.json({
      success: true,
      data: result,
      optimizationId: optimizationRecord.id,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
