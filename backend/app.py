from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "seekkrr.db")
DB_PATH = os.environ.get("DATABASE_PATH", os.path.join(os.path.dirname(__file__), "seekkrr.db"))


def init_db():
    with sqlite3.connect(DB_PATH) as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS interests (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                email TEXT,
                phone TEXT,
                created_at TEXT NOT NULL
            );
            """
        )
        conn.commit()

def create_app():
    app = Flask(__name__)
    CORS(app)
    init_db()

    @app.get("/api/health")
    def health():
        return jsonify({"ok": True})

    @app.post("/api/interest")
    def interest():
        data = request.get_json(force=True) or {}
        name = (data.get("name") or "").strip()
        email = (data.get("email") or "").strip()
        phone = (data.get("phone") or "").strip()

        with sqlite3.connect(DB_PATH) as conn:
            conn.execute(
                "INSERT INTO interests (name, email, phone, created_at) VALUES (?, ?, ?, ?)",
                (name, email, phone, datetime.utcnow().isoformat() + "Z"),
            )
            conn.commit()
        return jsonify({"ok": True})

    return app

app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
