from fastapi import APIRouter, HTTPException
from schemas.execute import CodeRequest
import subprocess
import os
import json
import base64
from typing import List

router = APIRouter()

def get_test_cases(problem_id: str):
    return [
        {
            "input": json.dumps([[2, 7, 11, 15], 9]),
            "output": json.dumps([0, 1])
        },
        {
            "input": json.dumps([[3, 2, 4], 6]),
            "output": json.dumps([1, 2])
        },
        {
            "input": json.dumps([[3, 3], 6]),
            "output": json.dumps([0, 1])
        },
        {
            "input": json.dumps([[3, 2, 3], 6]),
            "output": json.dumps([0, 2])
        },
        {
            "input": json.dumps([[2, 5, 5, 11], 13]),
            "output": json.dumps([0, 3])
        }
    ]

@router.post("/execute")
async def run_code(request: CodeRequest):
    code = request.code
    problem_id = request.problemId

    if not code or not problem_id:
        raise HTTPException(status_code=400, detail="Code and problemId are required.")

    
    test_cases = get_test_cases(problem_id)

    script_path = os.path.join(os.getcwd(), "helpers", "code_executor.py")

    if not os.path.exists(script_path):
        raise HTTPException(status_code=500, detail="Executor script not found.")

    
    try:
        encoded_input = base64.b64encode(json.dumps({
            "code": code,
            "testCases": test_cases
        }).encode()).decode()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to encode input: {str(e)}")

    try:
        
        process = subprocess.Popen(
            ["python", "-u", script_path, encoded_input],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )

        stdout, stderr = process.communicate()

        try:
            result = json.loads(stdout.strip())
        except json.JSONDecodeError as e:
            raise HTTPException(status_code=500, detail=f"Failed to parse JSON output. Error: {str(e)}")

        return {
            "status": result.get("status", "error"),
            "output": result.get("output", ""),
            "errorOutput": stderr or result.get("error_trace", ""),
            "testResults": result.get("test_results", []),
            "passedTests": result.get("passed_tests", 0),
            "totalTests": result.get("total_tests", 0)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Execution error: {str(e)}")