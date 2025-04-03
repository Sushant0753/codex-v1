import { NextResponse } from "next/server";
import { prisma } from "../../../../../prisma";

export async function POST(request: Request) {
  try {
    const { email, verifyCode } = await request.json();
    const user = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: 'insensitive'
        },
        verifyCode,
        verifyCodeExpiry: {
          gt: new Date()
        }
      }
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "Invalid or expired verification code"
      }, { status: 400 });
    }

    const currentDate = new Date();
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verifyCode: "", 
        verifyCodeExpiry: currentDate.toISOString()
      }
    });

    return NextResponse.json({
      success: true,
      message: "Email verified successfully. You can now sign in."
    }, { status: 200 });
    
  } catch (error) {
    console.error("Error verifying email:", error);
    return NextResponse.json({
      success: false,
      message: "Error verifying email"
    }, { status: 500 });
  }
}