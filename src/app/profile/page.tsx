import { getServerSession } from "next-auth";
import { prisma } from "../../../prisma/index";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import Link from "next/link";

const fetchUserData = async () => {
    const session = await getServerSession();

    if (!session?.user?.email) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { badges: true, activities: true },
    });

    return user;
};

const ProfilePage = async () => {
    const user = await fetchUserData();

    if (!user) {
        return <p className="text-center text-red-500">User not found</p>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="pt-18 px-4 sm:px-6 lg:px-8 py-12 overflow-hidden">
                <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-8">
                    <div className="relative">
                        <Link href="/edit-profile" className="absolute top-0 right-0">
                            <div className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                                </svg>
                            </div>
                        </Link>
                        
                        <div className="flex flex-col items-center">
                            <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4">
                                <Image
                                    src={user.avatarUrl || "/images/default-avatar.png"}
                                    alt="Profile picture"
                                    width={128}
                                    height={128}
                                    className="object-cover"
                                />
                            </div>
                            
                            <h1 className="text-2xl font-bold mb-2">{user.name}</h1>
                            <p className="text-gray-600 mb-2">@{user.username}</p>
                            <p className="text-gray-600 mb-4">{user.bio || "No bio available."}</p>

                            <div className="w-full border-t border-gray-200 pt-4 mt-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <h2 className="font-semibold">Profile Information</h2>
                                        <p>Email: {user.email}</p>
                                        <p>Location: {user.location || "Not specified"}</p>
                                        <p>Website: 
                                            <a href={user.website || "#"} target="_blank" className="text-blue-600 ml-1">
                                                {user.website || "N/A"}
                                            </a>
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <h2 className="font-semibold">Stats</h2>
                                        <p>Rank: {user.rank}</p>
                                        <p>Rating: {user.rating}</p>
                                        <p>Current Streak: {user.currentStreak} days</p>
                                        <p>Longest Streak: {user.longestStreak} days</p>
                                    </div>
                                </div>
                            </div>

                            {user.badges?.length > 0 && (
                                <div className="w-full border-t border-gray-200 pt-4 mt-4">
                                    <h2 className="font-semibold mb-2">Badges</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {user.badges.map((badge) => (
                                            <span key={badge.id} className="px-3 py-1 bg-yellow-300 text-sm rounded-lg">
                                                {badge.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {user.activities?.length > 0 && (
                                <div className="w-full border-t border-gray-200 pt-4 mt-4">
                                    <h2 className="font-semibold mb-2">Recent Activity</h2>
                                    <ul className="list-disc pl-5 space-y-2 text-gray-600">
                                        {user.activities.map((activity) => (
                                            <li key={activity.id}>{String(activity.details)}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;