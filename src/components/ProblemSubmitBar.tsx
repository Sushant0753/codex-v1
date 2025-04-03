"use client";
import Editor from "@monaco-editor/react";
import { Tabs, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import axios from "axios";
import { ISubmission, SubmissionTable } from "./SubmissionTable";
import { toast } from "react-toastify";

enum SubmitStatus {
        SUBMIT = "SUBMIT",
        PENDING = "PENDING",
        ACCEPTED = "ACCEPTED",
        FAILED = "FAILED"
}

export interface IProblem {
        id: string;
        title: string;
        description: string;
        slug: string;
        defaultCode: {
                code: string;
        }[]
}

export const ProblemSubmitBar = ({
        problem
}: {
        problem: IProblem
}) => {
        const [activeTab, setActiveTab] = useState("problem");
        return (
                <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mt-3">
                        <div className="grid gap-4">
                                <div className="">
                                        <Tabs
                                                value={activeTab}
                                                onValueChange={setActiveTab}
                                                className="w-full pb-2"
                                        >
                                                <TabsList className="grid grid-cols-2 w-full">
                                                        <TabsTrigger 
                                                            value="problem" 
                                                            onClick={() => setActiveTab('problem')}
                                                            className={`py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                                                                activeTab === 'problem'
                                                                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                                                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                                                }`}
                                                        >Submit</TabsTrigger>
                                                        <TabsTrigger 
                                                            value="submissions" 
                                                            onClick={() => setActiveTab('submissions')}
                                                            className={`py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                                                                activeTab === 'submissions'
                                                                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                                                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                                            }`}
                                                        >Submissions</TabsTrigger>
                                                </TabsList>
                                        </Tabs>
                                </div>
                        </div>
                        <div className={`${activeTab === "problem" ? "" : "hidden"}`}>
                                <SubmitProblem problem={problem} />
                        </div>
                        {activeTab === "submissions" && <Submissions problem={problem} />}
                </div>
        );
}

function Submissions({ problem }: { problem: IProblem }) {
    const [submissions, setSubmissions] = useState<ISubmission[]>([]);

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const response = await axios.get(`/api/submissions/${problem.id}`);
                setSubmissions(response.data);
            } catch (error) {
                console.error('Failed to fetch submissions', error);
            }
        };
        fetchSubmissions();
    }, [problem.id]);

    return (
        <div>
            <SubmissionTable submissions={submissions} />
        </div>
    );
}

function SubmitProblem({ problem }: { problem: IProblem }) {
    const [code, setCode] = useState<Record<string, string>>({});
    const [status, setStatus] = useState<string>(SubmitStatus.SUBMIT);
    const [testResults, setTestResults] = useState<any[]>([]);
    const [passedTests, setPassedTests] = useState(0);
    const [totalTests, setTotalTests] = useState(0);
    // const [output, setOutput] = useState<string>('');
    const [errorOutput, setErrorOutput] = useState<string>('');

    useEffect(() => {
        let defaultCode: {[key: string] : string} = {};
        if (problem.defaultCode && problem.defaultCode.length > 0) {
            defaultCode = { code: problem.defaultCode[0].code };
        }
        setCode(defaultCode);
    }, [problem.defaultCode]);

    async function test() {
        try {
            setStatus(SubmitStatus.PENDING);
            // setOutput('');
            setErrorOutput('');
            
            console.log('Current code state before submission:', code);
            console.log('Code to submit:', code?.code);
            console.log('Problem ID:', problem.id);
    
            const response = await axios.post('/api/execute', {
                code: code?.code,  
                problemId: problem.id
            }, {
                timeout: 10000,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            // Set output from response
            // setOutput(response.data.output || 'No output generated');
            
            // Include error output if present
            setErrorOutput(response.data.errorOutput || '');
            
            setTestResults(response.data.testResults || []);
            setPassedTests(response.data.passedTests || 0);
            setTotalTests(response.data.totalTests || 0);

            if (response.data.status === "success") {
                setStatus(SubmitStatus.ACCEPTED);
                toast.success('All tests passed!');
            } else {
                setStatus(SubmitStatus.FAILED);
                toast.error(`Execution failed: ${response.data.output}`);
            }
            
        } catch (error: any) {
            console.error('Submission Error:', error);
            setStatus(SubmitStatus.FAILED);
            
            // Handle axios error responses
            if (error.response) {
                // setOutput(error.response.data?.output || 'Execution failed');
                setErrorOutput(error.response.data?.errorOutput || error.message);
            } else {
                setErrorOutput(error.message || 'Error submitting solution');
            }
            
            toast.error('Error submitting solution');
        }
    }
    
    async function submit() {
        try {
            setStatus(SubmitStatus.PENDING);
            await axios.post('/api/submissions', {
                code: code?.code,
                problemId: problem.id
            });
            toast.success('Solution submitted successfully!');
        } catch (error) {
            console.error('Final submission error:', error);
            toast.error('Error submitting solution');
        }
    }

    return (
        <div>
            <Label htmlFor="language">Language</Label>
            <div className="text-sm text-gray-500 mb-2">
                Python
            </div>

            <div className="pt-4 rounded-md">
                <Editor
                    height={"60vh"}
                    value={code.code || ''}  
                    theme="vs-dark"
                    language="python"  
                    onMount={() => {}}
                    options={{
                        fontSize: 14,
                        scrollBeyondLastLine: false,
                    }}
                    onChange={(value) => {
                        if (value !== undefined) {
                            setCode({ code: value }); 
                        }
                    }}
                />
            </div>
            <div className="flex justify-end">
                <Button
                    disabled={status === SubmitStatus.PENDING}
                    type="submit"
                    className="mt-4 align-right"
                    onClick={test}
                >
                    {status === SubmitStatus.PENDING ? "Testing..." : "Test"}
                </Button>
                <Button
                    type="submit"
                    className="mt-4 ml-2 bg-green-600 hover:bg-green-700"
                    onClick={submit}
                >
                    Submit
                </Button>
            </div>
            <div className="mt-4">
                <h3 className="font-semibold">Test Results</h3>
                <div className="text-sm">
                    Passed: {passedTests} / {totalTests}
                </div>
                {testResults.map((test, index) => (
                    <div 
                        key={index} 
                        className={`p-2 ${test.passed ? 'bg-green-100' : 'bg-red-100'}`}
                    >
                        <div>Status: {test.passed ? 'Passed' : 'Failed'}</div>
                        {!test.passed && test.error && (
                            <div className="text-red-600">Error: {test.error}</div>
                        )}
                    </div>
                ))}
            </div>
            {errorOutput && (
                <div className="mt-4 bg-red-50 dark:bg-red-900/20 p-4 rounded-md border border-red-200 dark:border-red-800">
                    <div className="font-semibold mb-2 text-red-600 dark:text-red-400">Error Output:</div>
                    <pre className="whitespace-pre-wrap break-words text-sm text-red-600 dark:text-red-400">
                        {errorOutput}
                    </pre>
                </div>
            )}
        </div>
    );
}