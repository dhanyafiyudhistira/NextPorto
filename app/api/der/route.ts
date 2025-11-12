import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// GET all DERs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const status = searchParams.get("status");

    const where: any = {};
    if (type) where.type = type;
    if (status) where.status = status;

    const ders = await prisma.der.findMany({
      where,
      orderBy: { name: "asc" }
    });

    return NextResponse.json({ success: true, data: ders });
  } catch (error) {
    console.error("Error fetching DERs:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch DERs" },
      { status: 500 }
    );
  }
}

// POST create DER
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const der = await prisma.der.create({
      data: body
    });

    return NextResponse.json({
      success: true,
      data: der,
      message: "DER created successfully"
    });
  } catch (error) {
    console.error("Error creating DER:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create DER" },
      { status: 500 }
    );
  }
}

// PUT update DER
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    const der = await prisma.der.update({
      where: { id },
      data
    });

    return NextResponse.json({
      success: true,
      data: der,
      message: "DER updated successfully"
    });
  } catch (error) {
    console.error("Error updating DER:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update DER" },
      { status: 500 }
    );
  }
}
