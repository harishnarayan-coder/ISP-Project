"""
Vercel Serverless Entrypoint for FastAPI
Directs all /api routes to the FastAPI application
"""

import sys
import os

# Add root project directory to sys.path so backend and ml modules resolve correctly
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from backend.app.main import app
