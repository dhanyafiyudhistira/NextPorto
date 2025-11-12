import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// GET all assets
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const status = searchParams.get("status");

    const where: any = {};
    if (type) where.type = type;
    if (status) where.status = status;

    const assets = await prisma.asset.findMany({
      where,
      orderBy: { name: "asc" },
      include: {
        parentAsset: { select: { id: true, name: true, type: true } },
        childAssets: { select: { id: true, name: true, type: true } }
      }
    });

    return NextResponse.json({ success: true, data: assets });
  } catch (error) {
    console.error("Error fetching assets:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch assets" },
      { status: 500 }
    );
  }
}

// POST create asset
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const asset = await prisma.asset.create({
      data: body
    });

    return NextResponse.json({
      success: true,
      data: asset,
      message: "Asset created successfully"
    });
  } catch (error) {
    console.error("Error creating asset:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create asset" },
      { status: 500 }
    );
  }
}

// PUT update asset
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    const asset = await prisma.asset.update({
      where: { id },
      data
    });

    return NextResponse.json({
      success: true,
      data: asset,
      message: "Asset updated successfully"
    });
  } catch (error) {
    console.error("Error updating asset:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update asset" },
      { status: 500 }
    );
  }
}
