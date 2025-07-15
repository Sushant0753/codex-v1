import path from 'path';
import { promises as fsPromises } from 'fs';
import { IProblem } from '@/components/ProblemSubmitBar';

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
