import React from "react";
import { Navbar } from "@/components/Navbar";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import AnimatedHeading from "@/components/AnimatedHeadings";

const LeaderboardPage = async () => {
    const session = await getServerSession();
    if (!session?.user?.email) {
        redirect("/sign-in");
    }
    return (
        <section className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white py-24 transition-colors duration-200">
            <Navbar />
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="w-96 h-96 bg-blue-300 dark:bg-blue-500 opacity-5 dark:opacity-10 blur-3xl absolute top-1/3 left-1/2 transform -translate-x-1/2"></div>
                <div className="w-80 h-80 bg-purple-300 dark:bg-purple-500 opacity-5 dark:opacity-10 blur-3xl absolute top-2/3 left-1/4 transform -translate-x-1/2"></div>
            </div>
            <div className="container mx-auto px-4 md:px-6">
                <AnimatedHeading 
                    title="Leaderboards" 
                    subtitle="View top performers and their scores in various contests and challenges."
                />
            </div>
        </section>
    )
}

export default LeaderboardPage;