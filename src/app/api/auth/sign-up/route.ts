import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationMails";
import { prisma } from "../../../../../prisma";
import { NextResponse } from "next/server"; 

export async function POST(request: Request) {
    try {
        const { name, username, email, password } = await request.json();
        const existingUser = await prisma.user.findFirst({
            where: {
                username,
                isVerified: true
            }
        });

        if (existingUser) {
            return NextResponse.json({
                success: false,
                message: "Username is already taken"
            }, {
                status: 400
            });
        }

        const existingUserByEmail = await prisma.user.findFirst({
            where: {
                email: {
                    equals: email,
                    mode: 'insensitive'
                }
            }
        });

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return NextResponse.json({
                    success: false,
                    message: "User already exists"
                }, { status: 400 });
            } else {
                
                const hashedPassword = await bcrypt.hash(password, 10);

                await prisma.user.update({
                    where: { id: existingUserByEmail.id },
                    data: {
                        password: hashedPassword,
                        verifyCode: verifyCode,
                        verifyCodeExpiry: new Date(Date.now() + 3600000) 
                    }
                });
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);
            await prisma.user.create({
                data: {
                    name: name,
                    username,
                    email,
                    password: hashedPassword,
                    verifyCode,
                    verifyCodeExpiry: expiryDate,
                    isVerified: false
                }
            });
        }
        const emailResponse = await sendVerificationEmail(email, username, verifyCode);

        if (!emailResponse.success) {
            return NextResponse.json({
                success: false,
                message: emailResponse.message
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: "User registered successfully, please verify"
        }, { status: 201 });

    } catch (error) {
        console.error("Error registering user:", error);
        return NextResponse.json({
            success: false,
            message: "Error registering user"
        }, { status: 500 });
    }
}
