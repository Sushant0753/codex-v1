import { Navbar } from "@/components/Navbar";
import { ProblemStatement } from "@/components/ProblemStatement";
import { ProblemSubmitBar } from "@/components/ProblemSubmitBar";
import { getProblem } from "@/lib/problem";
import { getServerSession } from 'next-auth';
import { redirect } from "next/navigation";

export default async function ProblemPage({
  params,
}: {
  params: { problemId?: string };
}) {
  const session = await getServerSession();
  if (!session || !session.user) {
    redirect("/login?callbackUrl=/problems");
  }

  const { problemId } = params || {};
  const id = problemId ? parseInt(problemId, 10) : NaN;

  if (isNaN(id)) {
    return <div className="container mx-auto p-6">Invalid problem ID</div>;
  }

  const problem = await getProblem(id);

  if (!problem) {
    return <div className="container mx-auto p-6">Problem not found</div>;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex flex-col pt-16">
        <main className="flex-1 py-8 md:py-12 container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
              <h1 className="text-2xl font-bold mb-4">{problem.title}</h1>
              <div className="prose prose-stone dark:prose-invert max-w-none">
                <ProblemStatement description={problem.fullDescription ?? problem.description} />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md">
              <ProblemSubmitBar problem={problem} />
            </div>
          </div>
        </main>
      </div>
      <div className="container mx-auto p-6">
        You are logged in as {session.user?.name}
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";
