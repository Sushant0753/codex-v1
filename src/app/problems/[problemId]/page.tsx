import { Navbar } from "@/components/Navbar";
import { ProblemStatement } from "@/components/ProblemStatement";
import { ProblemSubmitBar, IProblem } from "@/components/ProblemSubmitBar";
import path from 'path';
import { promises as fsPromises } from 'fs';
import { getServerSession } from 'next-auth';
import { redirect } from "next/navigation";

export interface IProblemWithDescription extends IProblem {
  fullDescription: string;
}

export const getProblem = async (id: number): Promise<IProblemWithDescription | undefined> => {
  const problems: IProblem[] = [
    {
      id: "1",
      title: "Two Sum",
      description: "Find two numbers that add up to a given target.",
      slug: "two-sum",
      defaultCode: [
        {
          code: "# Write your Python code here\ndef solution(nums, target):\n  # Your implementation here\n  return []\n"
        }
      ]
    },
    {
      id: "2",
      title: "Reverse a String",
      description: "Reverse the input string.",
      slug: "reverse-string",
      defaultCode: [
        {
          code: "# Write your Python code here\ndef solution(s):\n  # Your implementation here\n  return s\n"
        }
      ]
    },
    {
      id: "3",
      title: "Longest Substring Without Repeating Characters",
      description: "Find the longest substring without repeating characters.",
      slug: "longest-substring",
      defaultCode: [
        {
          code: "# Write your Python code here\ndef solution(s):\n  # Your implementation here\n  return 0\n"
        }
      ]
    }
  ];

  const problem = problems.find((p) => parseInt(p.id) === id);
  
  if (!problem) {
    return undefined;
  }

  // Map the problem slug to its corresponding file in the lib/problems directory
  const fileNameMap: {[key: string]: string} = {
    'two-sum': 'twoSums.txt',
    'reverse-string': 'reverseString.txt',
    'longest-substring': 'longestSubstring.txt'
  };
  
  const fileName = fileNameMap[problem.slug];
  
  if (!fileName) {
    return {
      ...problem,
      fullDescription: problem.description
    };
  }

  try {
    const filePath = path.join(process.cwd(), 'src', 'problems' , fileName);
    const fileContent = await fsPromises.readFile(filePath, 'utf8');
    
    return {
      ...problem,
      fullDescription: fileContent
    };
  } catch (error) {
    console.error(`Error reading problem description file: ${error}`);
    return {
      ...problem,
      fullDescription: problem.description
    };
  }
};

export default async function ProblemPage({
  params,
}: {
  params?: { problemId?: string };
}) { 
  const session = await getServerSession();
  if(!session || !session.user) {
    redirect("/login?callbackUrl=/problems");
  }

  const { problemId } = await params || {};
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
      {session ? (
        <div className="container mx-auto p-6">You are logged in as {session.user?.name}</div>
      ) : (
        <div className="container mx-auto p-6">Please log in to submit solutions</div>
      )}
    </div>
  );
}

export const dynamic = "force-dynamic";
