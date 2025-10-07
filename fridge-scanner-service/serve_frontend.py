#!/usr/bin/env python3
"""
Simple HTTP server to serve the Fridge Scanner frontend
"""

import http.server
import socketserver
import webbrowser
import os
import sys
from pathlib import Path

def start_frontend_server():
    """Start a simple HTTP server for the frontend"""
    
    # Get the frontend directory
    frontend_dir = Path(__file__).parent / "frontend"
    
    if not frontend_dir.exists():
        print("❌ Frontend directory not found!")
        return False
    
    # Change to frontend directory
    os.chdir(frontend_dir)
    
    # Server configuration
    PORT = 8080
    Handler = http.server.SimpleHTTPRequestHandler
    
    try:
        with socketserver.TCPServer(("", PORT), Handler) as httpd:
            print("🌐 Fridge Scanner Frontend Server")
            print("=" * 40)
            print(f"📁 Serving from: {frontend_dir}")
            print(f"🌍 Server running at: http://localhost:{PORT}")
            print(f"🔗 Open in browser: http://localhost:{PORT}")
            print("\nPress Ctrl+C to stop the server")
            print("=" * 40)
            
            # Try to open browser automatically
            try:
                webbrowser.open(f'http://localhost:{PORT}')
                print("🚀 Browser opened automatically")
            except:
                print("⚠️  Could not open browser automatically")
            
            # Start the server
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
        return True
    except OSError as e:
        if e.errno == 98:  # Address already in use
            print(f"❌ Port {PORT} is already in use. Try a different port.")
            return False
        else:
            print(f"❌ Server error: {e}")
            return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

def main():
    """Main function"""
    print("🍎 Fridge Scanner Frontend Server")
    print("Make sure the backend is running on port 4005!")
    print()
    
    success = start_frontend_server()
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
