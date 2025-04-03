import { getServerSession } from "next-auth";
import { prisma } from "../../../../prisma/index";

export async function GET() {
    const session = await getServerSession();

    if (!session?.user?.email) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { name: true, bio: true, location: true, website: true },
    });

    if (!user) {
        return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(user), { status: 200 });
}
