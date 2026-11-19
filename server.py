import http.server
import socketserver
import os
import sys
import json
import sqlite3
import hashlib
import secrets
import mimetypes
import base64
import re
from datetime import datetime, timedelta
from urllib.parse import urlparse, parse_qs

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
os.chdir(BASE_DIR)

PORT = 8000
DB_FILE = os.path.join(BASE_DIR, 'boutique.db')
UPLOAD_DIR = os.path.join(BASE_DIR, 'uploads')

# Ensure upload directory exists
os.makedirs(UPLOAD_DIR, exist_ok=True)

def get_db():
    conn = sqlite3.connect(DB_FILE, timeout=20)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        customer_name TEXT NOT NULL,
        customer_phone TEXT NOT NULL,
        city TEXT,
        category TEXT,
        custom_text TEXT,
        color TEXT,
        quantity INTEGER DEFAULT 1,
        event_date TEXT,
        budget TEXT,
        instructions TEXT,
        status TEXT DEFAULT 'Pending',
        admin_notes TEXT DEFAULT '',
        reference_images TEXT DEFAULT '[]',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
    )''')
    
    c.execute('''CREATE TABLE IF NOT EXISTS enquiries (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        subject TEXT,
        message TEXT NOT NULL,
        status TEXT DEFAULT 'New',
        admin_notes TEXT DEFAULT '',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
    )''')
    
    c.execute('''CREATE TABLE IF NOT EXISTS admin_users (
        username TEXT PRIMARY KEY,
        password_hash TEXT NOT NULL,
        salt TEXT NOT NULL,
        role TEXT DEFAULT 'Owner',
        created_at TEXT NOT NULL
    )''')
    
    c.execute('''CREATE TABLE IF NOT EXISTS sessions (
        token TEXT PRIMARY KEY,
        username TEXT NOT NULL,
        created_at TEXT NOT NULL,
        expires_at TEXT NOT NULL
    )''')
    
    # Initialize default admin if not exists
    c.execute("SELECT username FROM admin_users WHERE username = 'admin'")
    if not c.fetchone():
        salt = secrets.token_hex(16)
        pw_hash = hashlib.sha256(('bhami@craft2026' + salt).encode('utf-8')).hexdigest()
        now = datetime.now().isoformat()
        c.execute("INSERT INTO admin_users (username, password_hash, salt, role, created_at) VALUES (?, ?, ?, ?, ?)",
                  ('admin', pw_hash, salt, 'Owner', now))
        print("Initialized default admin owner account (admin / bhami@craft2026)")
        
    conn.commit()
    conn.close()

def hash_password(password, salt):
    return hashlib.sha256((password + salt).encode('utf-8')).hexdigest()

def verify_admin(username, password):
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT password_hash, salt FROM admin_users WHERE username = ?", (username,))
    row = c.fetchone()
    conn.close()
    if not row:
        return False
    expected_hash = hash_password(password, row['salt'])
    return secrets.compare_digest(row['password_hash'], expected_hash)

def create_session(username):
    token = secrets.token_hex(32)
    now = datetime.now()
    expires = (now + timedelta(days=2)).isoformat()
    conn = get_db()
    c = conn.cursor()
    c.execute("INSERT INTO sessions (token, username, created_at, expires_at) VALUES (?, ?, ?, ?)",
              (token, username, now.isoformat(), expires))
    conn.commit()
    conn.close()
    return token

def validate_token(token):
    if not token:
        return None
    conn = get_db()
    c = conn.cursor()
    now = datetime.now().isoformat()
    c.execute("SELECT username, expires_at FROM sessions WHERE token = ?", (token,))
    row = c.fetchone()
    conn.close()
    if row and row['expires_at'] > now:
        return row['username']
    return None

def invalidate_session(token):
    if not token:
        return
    conn = get_db()
    c = conn.cursor()
    c.execute("DELETE FROM sessions WHERE token = ?", (token,))
    conn.commit()
    conn.close()

def save_base64_image(data_url, order_id, idx, original_name):
    """Saves a base64 image dataUrl to disk in uploads/ and returns public URL"""
    try:
        if not data_url or not data_url.startswith('data:image/'):
            return None
        header, b64_data = data_url.split(',', 1)
        ext = 'jpg'
        if 'image/png' in header:
            ext = 'png'
        elif 'image/webp' in header:
            ext = 'webp'
        elif 'image/gif' in header:
            ext = 'gif'
            
        safe_name = re.sub(r'[^a-zA-Z0-9_\.-]', '_', original_name or f'photo_{idx}.{ext}')
        filename = f"{order_id}_{idx}_{safe_name}"
        if not filename.lower().endswith(f".{ext}"):
            filename = f"{filename}.{ext}"
            
        filepath = os.path.join(UPLOAD_DIR, filename)
        file_bytes = base64.b64decode(b64_data)
        with open(filepath, 'wb') as f:
            f.write(file_bytes)
            
        return f"/uploads/{filename}"
    except Exception as e:
        print(f"Error saving image: {e}")
        return None

class BoutiqueHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Enable CORS for local API access
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def get_auth_token(self):
        auth_header = self.headers.get('Authorization', '')
        if auth_header.startswith('Bearer '):
            return auth_header[7:].strip()
        cookie_header = self.headers.get('Cookie', '')
        if 'bhami_admin_token=' in cookie_header:
            match = re.search(r'bhami_admin_token=([^;]+)', cookie_header)
            if match:
                return match.group(1).strip()
        return None

    def require_auth(self):
        token = self.get_auth_token()
        username = validate_token(token)
        if not username:
            self.send_json_response({'success': False, 'error': 'Unauthorized. Please log in as owner.'}, 401)
            return None
        return username

    def send_json_response(self, data, status_code=200):
        body = json.dumps(data, indent=2, ensure_ascii=False).encode('utf-8')
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def read_json_body(self):
        content_length = int(self.headers.get('Content-Length', 0))
        if content_length <= 0:
            return {}
        raw = self.rfile.read(content_length).decode('utf-8')
        try:
            return json.loads(raw)
        except Exception:
            return {}

    def serve_static_file(self, rel_path, mime_type=None):
        clean_path = rel_path.lstrip('/')
        full_path = os.path.join(BASE_DIR, clean_path)
        if os.path.isdir(full_path):
            full_path = os.path.join(full_path, 'index.html')
        if not os.path.exists(full_path) or not os.path.isfile(full_path):
            self.send_error(404, f"File not found: {rel_path}")
            return
        if not mime_type:
            mime_type, _ = mimetypes.guess_type(full_path)
            if not mime_type:
                mime_type = 'application/octet-stream'
        if any(t in mime_type for t in ('text/', 'javascript', 'json')):
            if 'charset' not in mime_type:
                mime_type += '; charset=utf-8'
        try:
            with open(full_path, 'rb') as f:
                data = f.read()
            self.send_response(200)
            self.send_header('Content-Type', mime_type)
            self.send_header('Content-Length', str(len(data)))
            self.end_headers()
            self.wfile.write(data)
        except Exception as e:
            self.send_error(500, f"Error reading file: {e}")

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path
        query = parse_qs(parsed.query)

        # Route rewrites & direct file serving
        if path in ('/admin', '/admin/', '/admin/index.html'):
            return self.serve_static_file('admin/index.html', 'text/html')
        if path in ('/admin/login', '/admin/login/', '/admin/login.html'):
            return self.serve_static_file('admin/login.html', 'text/html')
        if path == '/admin/admin.css':
            return self.serve_static_file('admin/admin.css', 'text/css')
        if path == '/admin/admin.js':
            return self.serve_static_file('admin/admin.js', 'application/javascript')
        if path in ('/categories', '/categories/', '/categories/index.html'):
            return self.serve_static_file('categories/index.html', 'text/html')
        if path in ('/', '/index.html'):
            return self.serve_static_file('index.html', 'text/html')

        # API: Auth check
        if path == '/api/auth-check':
            token = self.get_auth_token()
            user = validate_token(token)
            if user:
                return self.send_json_response({'authenticated': True, 'username': user})
            else:
                return self.send_json_response({'authenticated': False}, 401)

        # API: Dashboard Stats
        if path == '/api/stats':
            if not self.require_auth():
                return
            conn = get_db()
            c = conn.cursor()
            c.execute("SELECT COUNT(*) FROM orders")
            total_orders = c.fetchone()[0]
            
            c.execute("SELECT COUNT(*) FROM orders WHERE status IN ('Pending', 'New Inquiry', 'Under Review')")
            pending_orders = c.fetchone()[0]
            
            c.execute("SELECT COUNT(*) FROM orders WHERE status IN ('Accepted', 'Approved', 'In Progress')")
            accepted_orders = c.fetchone()[0]
            
            c.execute("SELECT COUNT(*) FROM orders WHERE status = 'Completed'")
            completed_orders = c.fetchone()[0]
            
            c.execute("SELECT COUNT(*) FROM orders WHERE type IN ('custom', 'outfit')")
            custom_orders = c.fetchone()[0]

            c.execute("SELECT COUNT(*) FROM enquiries WHERE status = 'New'")
            new_enquiries = c.fetchone()[0]

            conn.close()
            return self.send_json_response({
                'success': True,
                'stats': {
                    'totalOrders': total_orders,
                    'pendingOrders': pending_orders,
                    'acceptedOrders': accepted_orders,
                    'completedOrders': completed_orders,
                    'customOrders': custom_orders,
                    'newCustomEnquiries': custom_orders + new_enquiries,
                    'newEnquiries': new_enquiries
                }
            })

        # API: Get Orders
        if path == '/api/orders':
            if not self.require_auth():
                return
            status_filter = query.get('status', [None])[0]
            type_filter = query.get('type', [None])[0]
            search_query = query.get('q', [None])[0]

            sql = "SELECT * FROM orders WHERE 1=1"
            params = []

            if status_filter and status_filter != 'all':
                sql += " AND status = ?"
                params.append(status_filter)
            if type_filter and type_filter != 'all':
                sql += " AND type = ?"
                params.append(type_filter)
            if search_query:
                q = f"%{search_query.strip()}%"
                sql += " AND (id LIKE ? OR customer_name LIKE ? OR customer_phone LIKE ? OR city LIKE ? OR category LIKE ? OR custom_text LIKE ? OR instructions LIKE ? OR admin_notes LIKE ?)"
                params.extend([q]*8)

            sql += " ORDER BY created_at DESC"

            conn = get_db()
            c = conn.cursor()
            c.execute(sql, params)
            rows = c.fetchall()
            orders = []
            for r in rows:
                o = dict(r)
                try:
                    o['referenceImages'] = json.loads(o['reference_images'] or '[]')
                except Exception:
                    o['referenceImages'] = []
                orders.append(o)
            conn.close()
            return self.send_json_response({'success': True, 'orders': orders, 'count': len(orders)})

        # API: Single Order
        if path.startswith('/api/orders/'):
            order_id = path[len('/api/orders/'):]
            if not self.require_auth():
                return
            conn = get_db()
            c = conn.cursor()
            c.execute("SELECT * FROM orders WHERE id = ?", (order_id,))
            row = c.fetchone()
            conn.close()
            if not row:
                return self.send_json_response({'success': False, 'error': 'Order not found'}, 404)
            order = dict(row)
            try:
                order['referenceImages'] = json.loads(order['reference_images'] or '[]')
            except Exception:
                order['referenceImages'] = []
            return self.send_json_response({'success': True, 'order': order})

        # API: Get Enquiries
        if path == '/api/enquiries':
            if not self.require_auth():
                return
            conn = get_db()
            c = conn.cursor()
            c.execute("SELECT * FROM enquiries ORDER BY created_at DESC")
            rows = c.fetchall()
            enquiries = [dict(r) for r in rows]
            conn.close()
            return self.send_json_response({'success': True, 'enquiries': enquiries})

        # Serve uploaded files from uploads/
        if path.startswith('/uploads/'):
            filepath = os.path.join(UPLOAD_DIR, os.path.basename(path))
            if os.path.exists(filepath) and os.path.isfile(filepath):
                mime, _ = mimetypes.guess_type(filepath)
                try:
                    with open(filepath, 'rb') as f:
                        data = f.read()
                    self.send_response(200)
                    self.send_header('Content-Type', mime or 'application/octet-stream')
                    self.send_header('Content-Length', str(len(data)))
                    self.end_headers()
                    self.wfile.write(data)
                    return
                except Exception as e:
                    return self.send_error(500, f"Error reading file: {e}")
            else:
                return self.send_error(404, "File not found")

        # Fallback to standard static files
        return self.serve_static_file(path)

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path
        body = self.read_json_body()

        # API: Login
        if path == '/api/login':
            username = body.get('username', '').strip()
            password = body.get('password', '')
            if verify_admin(username, password):
                token = create_session(username)
                self.send_response(200)
                # Also set cookie for direct browser navigation
                self.send_header('Set-Cookie', f'bhami_admin_token={token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=172800')
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                resp = json.dumps({'success': True, 'token': token, 'username': username}).encode('utf-8')
                self.send_header('Content-Length', str(len(resp)))
                self.end_headers()
                self.wfile.write(resp)
                return
            else:
                return self.send_json_response({'success': False, 'error': 'Invalid owner credentials. Please check your username and password.'}, 401)

        # API: Logout
        if path == '/api/logout':
            token = self.get_auth_token()
            invalidate_session(token)
            self.send_response(200)
            self.send_header('Set-Cookie', 'bhami_admin_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT')
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            resp = json.dumps({'success': True}).encode('utf-8')
            self.send_header('Content-Length', str(len(resp)))
            self.end_headers()
            self.wfile.write(resp)
            return

        # API: Save Customer Order (Public submission from website forms)
        if path == '/api/orders':
            order_id = body.get('id') or body.get('orderId') or f"BCB-{secrets.token_hex(4).upper()}"
            order_type = body.get('type', 'custom')
            title = body.get('title', 'Bespoke Order')
            name = body.get('customerName') or body.get('name', 'Valued Customer')
            phone = body.get('customerPhone') or body.get('phone', '')
            city = body.get('city', '')
            category = body.get('category', title)
            custom_text = body.get('customText', '')
            color = body.get('color', '')
            qty = body.get('quantity', 1)
            event_date = body.get('eventDate', '')
            budget = body.get('budget', '')
            instructions = body.get('instructions', '')
            status = body.get('status', 'Pending')
            created_at = body.get('createdAt') or datetime.now().isoformat()
            updated_at = datetime.now().isoformat()

            # Process images and save to disk
            raw_images = body.get('referenceImages') or []
            saved_images = []
            for idx, img in enumerate(raw_images):
                if isinstance(img, dict):
                    data_url = img.get('dataUrl', '')
                    orig_name = img.get('name', f'photo_{idx+1}.jpg')
                    img_size = img.get('size', 0)
                    saved_url = save_base64_image(data_url, order_id, idx, orig_name)
                    if saved_url:
                        saved_images.append({
                            'id': img.get('id') or f"img_{idx+1}",
                            'name': orig_name,
                            'size': img_size,
                            'url': saved_url,
                            'dataUrl': saved_url # url as fallback
                        })
                    elif img.get('url'):
                        saved_images.append(img)
                    elif data_url:
                        # Fallback small data url if failed to write
                        saved_images.append({
                            'id': img.get('id') or f"img_{idx+1}",
                            'name': orig_name,
                            'size': img_size,
                            'url': data_url,
                            'dataUrl': data_url
                        })

            conn = get_db()
            c = conn.cursor()
            c.execute('''INSERT OR REPLACE INTO orders 
                (id, type, title, customer_name, customer_phone, city, category, custom_text, color, 
                 quantity, event_date, budget, instructions, status, admin_notes, reference_images, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
                (order_id, order_type, title, name, phone, city, category, custom_text, color,
                 qty, event_date, budget, instructions, status, '', json.dumps(saved_images), created_at, updated_at))
            conn.commit()
            conn.close()

            print(f"Saved order #{order_id} ({name}) to SQLite database.")
            return self.send_json_response({'success': True, 'orderId': order_id})

        # API: Save Contact Enquiry
        if path == '/api/enquiries':
            enq_id = f"ENQ-{secrets.token_hex(4).upper()}"
            name = body.get('name', 'Customer')
            email = body.get('email', '')
            phone = body.get('phone', '')
            subject = body.get('subject', 'General Inquiry')
            message = body.get('message', '')
            status = 'New'
            now = datetime.now().isoformat()

            conn = get_db()
            c = conn.cursor()
            c.execute('''INSERT INTO enquiries (id, name, email, phone, subject, message, status, admin_notes, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
                (enq_id, name, email, phone, subject, message, status, '', now, now))
            conn.commit()
            conn.close()

            print(f"Saved customer enquiry #{enq_id} from {name}.")
            return self.send_json_response({'success': True, 'enquiryId': enq_id})

        return self.send_error(404, "Endpoint not found")

    def do_PATCH(self):
        parsed = urlparse(self.path)
        path = parsed.path
        body = self.read_json_body()

        if not self.require_auth():
            return

        # Update order status or admin notes
        if path.startswith('/api/orders/'):
            order_id = path[len('/api/orders/'):]
            status = body.get('status')
            admin_notes = body.get('admin_notes')
            now = datetime.now().isoformat()

            conn = get_db()
            c = conn.cursor()
            if status is not None and admin_notes is not None:
                c.execute("UPDATE orders SET status = ?, admin_notes = ?, updated_at = ? WHERE id = ?", (status, admin_notes, now, order_id))
            elif status is not None:
                c.execute("UPDATE orders SET status = ?, updated_at = ? WHERE id = ?", (status, now, order_id))
            elif admin_notes is not None:
                c.execute("UPDATE orders SET admin_notes = ?, updated_at = ? WHERE id = ?", (admin_notes, now, order_id))
            conn.commit()
            conn.close()
            return self.send_json_response({'success': True, 'orderId': order_id})

        # Update enquiry
        if path.startswith('/api/enquiries/'):
            enq_id = path[len('/api/enquiries/'):]
            status = body.get('status')
            admin_notes = body.get('admin_notes')
            now = datetime.now().isoformat()

            conn = get_db()
            c = conn.cursor()
            if status is not None and admin_notes is not None:
                c.execute("UPDATE enquiries SET status = ?, admin_notes = ?, updated_at = ? WHERE id = ?", (status, admin_notes, now, enq_id))
            elif status is not None:
                c.execute("UPDATE enquiries SET status = ?, updated_at = ? WHERE id = ?", (status, now, enq_id))
            elif admin_notes is not None:
                c.execute("UPDATE enquiries SET admin_notes = ?, updated_at = ? WHERE id = ?", (admin_notes, now, enq_id))
            conn.commit()
            conn.close()
            return self.send_json_response({'success': True, 'enquiryId': enq_id})

        return self.send_error(404, "Endpoint not found")

    def do_DELETE(self):
        parsed = urlparse(self.path)
        path = parsed.path

        if not self.require_auth():
            return

        if path.startswith('/api/orders/'):
            order_id = path[len('/api/orders/'):]
            conn = get_db()
            c = conn.cursor()
            c.execute("DELETE FROM orders WHERE id = ?", (order_id,))
            conn.commit()
            conn.close()
            return self.send_json_response({'success': True, 'deleted': order_id})

        if path.startswith('/api/enquiries/'):
            enq_id = path[len('/api/enquiries/'):]
            conn = get_db()
            c = conn.cursor()
            c.execute("DELETE FROM enquiries WHERE id = ?", (enq_id,))
            conn.commit()
            conn.close()
            return self.send_json_response({'success': True, 'deleted': enq_id})

        return self.send_error(404, "Endpoint not found")

class ThreadingServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    allow_reuse_address = True
    daemon_threads = True

if __name__ == '__main__':
    init_db()
    with ThreadingServer(("", PORT), BoutiqueHandler) as httpd:
        print(f"Bhami Craft Boutique Server running on http://localhost:{PORT}/", flush=True)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass
