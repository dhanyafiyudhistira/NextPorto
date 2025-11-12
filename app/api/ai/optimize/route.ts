import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// AI Optimization Engine (Stub Implementation)
// Supports: LP, DP, GA, DRL, MIP
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      optimizationType = "LINEAR_PROGRAMMING",
      inputData,
      constraints = {},
      objective = "MINIMIZE_CURTAILMENT"
    } = body;

    const startTime = Date.now();

    // Simulate optimization algorithm
    const result = await runOptimization(
      optimizationType,
      inputData,
      constraints,
      objective
    );

    const convergenceTime = (Date.now() - startTime) / 1000;

    // Store optimization result
    const optimizationResult = await prisma.aiOptimizationResult.create({
      data: {
        optimizationType,
        status: "COMPLETED",
        inputData,
        constraints,
        objective,
        results: result.recommendations,
        objectiveValue: result.objectiveValue,
        convergenceTime,
        iterations: result.iterations
      }
    });

    // Store DER recommendations
    for (const rec of result.recommendations) {
      await prisma.derRecommendation.create({
        data: {
          optimizationResultId: optimizationResult.id,
          derId: rec.derId,
          recommendedPower: rec.recommendedPower,
          recommendedCurtailment: rec.recommendedCurtailment,
          priority: rec.priority,
          reason: rec.reason
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        optimizationId: optimizationResult.id,
        recommendations: result.recommendations,
        objectiveValue: result.objectiveValue,
        convergenceTime,
        iterations: result.iterations
      },
      message: "Optimization completed successfully"
    });
  } catch (error) {
    console.error("AI optimization error:", error);
    return NextResponse.json(
      { success: false, error: "Optimization failed" },
      { status: 500 }
    );
  }
}

// Optimization algorithm stub
async function runOptimization(
  type: string,
  inputData: any,
  constraints: any,
  objective: string
) {
  // Stub implementation - replace with actual optimization algorithms
  const ders = inputData?.ders || [];

  const recommendations = ders
    .filter((der: any) => der.isControllable && der.isEnabled)
    .map((der: any, index: number) => {
      // Simple heuristic: reduce high-power DERs first
      const curtailmentNeeded = inputData?.systemState?.avgLoading > 85;
      let recommendedCurtailment = der.currentCurtailment;

      if (curtailmentNeeded && objective === "MINIMIZE_CURTAILMENT") {
        // Prioritize high-capacity DERs for curtailment
        const curtailmentFactor = der.pActual / der.pMax;
        recommendedCurtailment = Math.min(100, curtailmentFactor * 30);
      } else if (objective === "MAXIMIZE_REVENUE") {
        // Minimize curtailment to maximize revenue
        recommendedCurtailment = Math.max(0, der.currentCurtailment - 10);
      }

      const recommendedPower = der.pMax * (1 - recommendedCurtailment / 100);

      return {
        derId: der.id,
        derName: der.name,
        recommendedPower,
        recommendedCurtailment,
        currentPower: der.pActual,
        currentCurtailment: der.currentCurtailment,
        priority: index + 1,
        reason: curtailmentNeeded
          ? "Reduce line congestion"
          : "Optimize generation"
      };
    });

  const objectiveValue =
    recommendations.reduce((sum: number, r: any) => sum + r.recommendedCurtailment, 0) /
      recommendations.length || 0;

  return {
    recommendations,
    objectiveValue,
    iterations: Math.floor(Math.random() * 100) + 10
  };
}

// GET optimization history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");

    const results = await prisma.aiOptimizationResult.findMany({
      orderBy: { timestamp: "desc" },
      take: limit,
      include: {
        derRecommendations: {
          include: {
            der: {
              select: { name: true, type: true }
            }
          }
        }
      }
    });

    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    console.error("Error fetching optimization history:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch optimization history" },
      { status: 500 }
    );
  }
}
