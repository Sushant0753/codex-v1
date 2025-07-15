import sys
import json
import base64
import multiprocessing
import traceback

def run_tests(code, test_cases, result_queue):
    """
    Execute user code against provided test cases and store results in a queue.
    
    Args:
        code (str): User-submitted code
        test_cases (list): List of test case dictionaries
        result_queue (multiprocessing.Queue): Queue to store results
    """
    try:
        # Create a temporary namespace to execute the code
        namespace = {}
        exec(code, namespace)
        
        # Prepare test results
        test_results = []
        passed_tests = 0
        
        # Run each test case
        for test_case in test_cases:
            try:
                # Parse input and output
                inputs = json.loads(test_case['input'])
                expected_output = json.loads(test_case['output'])
                
                # Assume the function is named 'solution'
                solution_func = namespace.get('solution')
                
                if not solution_func:
                    raise ValueError("No 'solution' function found in the code")
                
                # Call the solution function with inputs
                actual_output = solution_func(*inputs)
                
                # Compare outputs
                test_passed = actual_output == expected_output
                
                test_results.append({
                    'input': inputs,
                    'expected': expected_output,
                    'actual': actual_output,
                    'passed': test_passed
                })
                
                if test_passed:
                    passed_tests += 1
            
            except Exception as test_error:
                test_results.append({
                    'input': inputs,
                    'error': str(test_error),
                    'passed': False
                })
        
        result = {
            'status': 'success' if passed_tests == len(test_cases) else 'partial',
            'output': 'Tests completed',
            'test_results': test_results,
            'passed_tests': passed_tests,
            'total_tests': len(test_cases)
        }

    except Exception as e:
        result = {
            'status': 'error',
            'output': f'Execution error: {str(e)}',
            'error_trace': traceback.format_exc()
        }
    

    result_queue.put(result)

def main():
    if len(sys.argv) < 2:
        print(json.dumps({
            'status': 'error',
            'output': 'No arguments provided'
        }))
        sys.exit(1)
    
    try:
        input_data = json.loads(base64.b64decode(sys.argv[1]).decode('utf-8'))
        
        code = input_data.get('code', '')
        test_cases = input_data.get('testCases', [])


        result_queue = multiprocessing.Queue()


        process = multiprocessing.Process(target=run_tests, args=(code, test_cases, result_queue))
        process.start()

        process.join(timeout=10)

        if process.is_alive():
            process.terminate()
            process.join()  
            result = {
                'status': 'error',
                'output': 'Execution timed out',
                'test_results': [],
                'passed_tests': 0,
                'total_tests': len(test_cases)
            }
        else:
            result = result_queue.get() if not result_queue.empty() else {
                'status': 'error',
                'output': 'No result returned from execution'
            }

        print(json.dumps(result))

    except Exception as e:
        print(json.dumps({
            'status': 'error',
            'output': f'Processing error: {str(e)}',
            'error_trace': traceback.format_exc()
        }))

if __name__ == "__main__":
    main()