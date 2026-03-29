import os
import subprocess
import sys

def run_tests():
    print("[START] Starting Automated Test Suite...\n")
    
    # 1. Run Backend Tests
    print("========================================")
    print("[BACKEND] Running Django Tests...")
    print("========================================")
    backend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "backend")
    
    backend_result = subprocess.run(
        [sys.executable, "manage.py", "test", "api.tests"],
        cwd=backend_dir,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace"
    )
    
    print(backend_result.stdout)
    if backend_result.stderr:
        print(backend_result.stderr)
        
    backend_passed = backend_result.returncode == 0
    
    if backend_passed:
        print("[OK] Backend Tests PASSED!\n")
    else:
        print("[FAIL] Backend Tests FAILED!\n")
        
    # 2. Run Frontend Tests
    print("========================================")
    print("[FRONTEND] Running Vitest Tests...")
    print("========================================")
    frontend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "frontend")
    
    frontend_result = subprocess.run(
        ["npm", "run", "test:run"], 
        cwd=frontend_dir,
        capture_output=True,
        text=True,
        shell=True,
        encoding="utf-8",
        errors="replace"
    )
    
    print(frontend_result.stdout)
    if frontend_result.stderr and "ERR!" in frontend_result.stderr:
        print(frontend_result.stderr)
        
    frontend_passed = frontend_result.returncode == 0
    
    if frontend_passed:
        print("[OK] Frontend Tests PASSED!\n")
    else:
        print("[FAIL] Frontend Tests FAILED!\n")
        
    # 3. Summary
    print("========================================")
    print("OVERALL SUMMARY")
    print("========================================")
    
    if backend_passed and frontend_passed:
        print("[SUCCESS] ALL TESTS PASSED SUCCESSFULLY!")
        print("   - Backend Models & API CRUD: OK")
        print("   - Cloudinary Integration (Upload/Delete): OK")
        print("   - Frontend API Services Data Retrieval: OK")
        sys.exit(0)
    else:
        print("[WARNING] SOME TESTS FAILED. Please review the logs above.")
        sys.exit(1)

if __name__ == "__main__":
    run_tests()
