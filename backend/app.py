from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os
from datetime import datetime


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
    
    @app.get("/api/admin/export")
    def export_csv():
        # --- simple token check (set ADMIN_TOKEN in Render) ---
        expected = os.environ.get("ADMIN_TOKEN")
        token = request.args.get("token", "")
        if expected and token != expected:
            return jsonify({"ok": False, "error": "unauthorized"}), 401

        # optional date filters: ?from=YYYY-MM-DD&to=YYYY-MM-DD
        d_from = request.args.get("from")
        d_to = request.args.get("to")

        q = "SELECT id, name, email, phone, created_at FROM interests"
        params = []
        if d_from or d_to:
            q += " WHERE 1=1"
            if d_from:
                q += " AND date(created_at) >= date(?)"
                params.append(d_from)
            if d_to:
                q += " AND date(created_at) <= date(?)"
                params.append(d_to)
        q += " ORDER BY id DESC"

        import csv, io
        from flask import Response

        with sqlite3.connect(DB_PATH) as conn:
            conn.row_factory = sqlite3.Row
            rows = conn.execute(q, params).fetchall()

        # build CSV in-memory
        buf = io.StringIO()
        w = csv.writer(buf)
        w.writerow(["id", "name", "email", "phone", "created_at"])
        for r in rows:
            w.writerow([r["id"], r["name"], r["email"], r["phone"], r["created_at"]])

        filename = f"interests-{datetime.utcnow().date()}.csv"
        return Response(
            buf.getvalue(),
            mimetype="text/csv",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )


    return app

app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
