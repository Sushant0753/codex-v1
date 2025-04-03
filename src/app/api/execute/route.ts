import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { prisma } from '../../../../prisma';

export async function POST(request: Request) {
    try {
        const { code, problemId } = await request.json();
        if (!code || !problemId) {
            return NextResponse.json({
                status: 'error',
                output: 'Code and Problem ID are required',
            }, { status: 400 });
        }

        // const testCases = await getTestCases(problemId);
        //dummy data - test cases
        const testCases = [
            {
                input: JSON.stringify([[2, 7, 11, 15], 9]),
                output: JSON.stringify([0, 1])
            },
            {
                input: JSON.stringify([[3, 2, 4], 6]),
                output: JSON.stringify([1, 2])
            },
            {
                input: JSON.stringify([[3, 3], 6]),
                output: JSON.stringify([0, 1])
            }
        ];

        const scriptPath = path.join(process.cwd(), 'src', 'app', 'scripts', 'code_executor.py');

        if (!fs.existsSync(scriptPath)) {
            return NextResponse.json({
                status: 'error',
                output: 'Execution script not found',
            }, { status: 500 });
        }

        return new Promise((resolve) => {
            
            const pythonProcess = spawn('python', [
                '-u', 
                scriptPath,
                Buffer.from(JSON.stringify({
                    code: code,
                    testCases: testCases
                })).toString('base64')
            ]);
            
            let output = '';
            let errorOutput = '';

            pythonProcess.stdout.on('data', (data) => {
                const dataStr = data.toString().trim();
                output += dataStr;
                console.log('STDOUT', dataStr);
            });

            pythonProcess.stderr.on('data', (data) => {
                const dataStr = data.toString().trim();
                errorOutput += dataStr;
                console.log('STDERR', dataStr);
            });

            pythonProcess.on('close',() => {
                console.log('Process Closed:', {
                    output,
                    errorOutput
                });
                try {
                    const result = JSON.parse(output);
                    
                    resolve(
                        NextResponse.json({
                            status: result.status,
                            output: result.output,
                            errorOutput: errorOutput || result.error_trace || '',  
                            testResults: result.test_results || [],
                            passedTests: result.passed_tests || 0,
                            totalTests: result.total_tests || 0
                        })
                    );
                } catch (parseError) {
                    console.log('Failed to parse execution result:', parseError);
                    resolve(
                        NextResponse.json({
                            status: 'error',
                            output: 'Failed to parse execution result',
                            errorOutput: errorOutput || 'Error in execution process'  
                        })
                    );
                }
            });

            pythonProcess.on('error', (err) => {
                resolve(
                    NextResponse.json({
                        status: 'error',
                        output: `Process execution failed: ${err.message}`,
                        errorOutput: err.stack || err.message
                    })
                );
            });
        });
    } catch (error) {
        return NextResponse.json(
            {
                status: 'error',
                output: 'Failed to execute code',
                error: (error as Error).message,
                errorOutput: (error as Error).stack || (error as Error).message
            },
            { status: 500 }
        );
    }
}

async function getTestCases(id: string) {
    return await prisma.testCases.findMany({
        where: {
            problemId: id
        },
        select: {
            input: true,
            output: true
        }
    });
}