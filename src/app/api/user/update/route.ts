import { getServerSession } from "next-auth";
import { prisma } from "../../../../../prisma/index";

export async function PUT(req: Request) {
    const session = await getServerSession();

    if (!session?.user?.email) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const { name, bio, location, website } = await req.json();

    try {
        await prisma.user.update({
            where: { email: session.user.email },
            data: { name, bio, location, website },
        });

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        console.error("Error updating user profile:", error);
        return new Response(JSON.stringify({ error: "Failed to update profile" }), { status: 500 });
    }
}
