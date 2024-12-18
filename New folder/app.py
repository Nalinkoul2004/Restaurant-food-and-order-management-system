from flask import Flask, render_template, request, jsonify, redirect, send_from_directory, url_for, session
import sqlite3
from datetime import datetime
import os

app = Flask(__name__)
app.secret_key = os.urandom(24)  # Set a secret key for session management

# Database initialization
def init_db():
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS menu
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  name TEXT NOT NULL,
                  description TEXT NOT NULL,
                  price REAL NOT NULL,
                  category TEXT NOT NULL)''')
    c.execute('''CREATE TABLE IF NOT EXISTS orders
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  user_id INTEGER NOT NULL,
                  items TEXT NOT NULL,
                  total REAL NOT NULL,
                  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)''')
    c.execute('''CREATE TABLE IF NOT EXISTS users
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  username TEXT UNIQUE NOT NULL,
                  password TEXT NOT NULL)''') # Added users table
    conn.commit()
    conn.close()

init_db()

# Helper function to get database connection
def get_db():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/menu')
def menu():
    db = get_db()
    menu_items = db.execute('SELECT * FROM menu').fetchall()
    db.close()
    return render_template('menu.html', menu_items=menu_items)

@app.route('/cart')
def cart():
    return render_template('cart.html')

@app.route('/orders')
def orders():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    db = get_db()
    orders = db.execute('SELECT * FROM orders WHERE user_id = ? ORDER BY timestamp DESC', (session['user_id'],)).fetchall()
    db.close()
    return render_template('orders.html', orders=orders)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        db = get_db()
        user = db.execute('SELECT * FROM users WHERE username = ? AND password = ?', (username, password)).fetchone()
        db.close()
        if user:
            session['user_id'] = user['id']
            return redirect(url_for('menu'))
        else:
            return render_template('login.html', error='Invalid username or password')
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('user_id', None)
    return redirect(url_for('index'))

@app.route('/api/menu')
def api_menu():
    db = get_db()
    menu_items = db.execute('SELECT * FROM menu').fetchall()
    db.close()
    return jsonify([dict(item) for item in menu_items])

@app.route('/api/order', methods=['POST'])
def api_order():
    if 'user_id' not in session:
        return jsonify({'error': 'User not logged in'}), 401

    if not request.json or 'items' not in request.json or 'total' not in request.json:
        return jsonify({'error': 'Bad request'}), 400
    
    db = get_db()
    db.execute('INSERT INTO orders (user_id, items, total) VALUES (?, ?, ?)',
               (session['user_id'], str(request.json['items']), request.json['total']))
    db.commit()
    db.close()
    return jsonify({'success': True, 'message': 'Order placed successfully'})

@app.route('/api/orders')
def api_orders():
    if 'user_id' not in session:
        return jsonify({'error': 'User not logged in'}), 401

    db = get_db()
    orders = db.execute('SELECT * FROM orders WHERE user_id = ? ORDER BY timestamp DESC', (session['user_id'],)).fetchall()
    db.close()
    return jsonify([dict(order) for order in orders])

# Sample data insertion (you can remove this in production)
@app.route('/init_sample_data')
def init_sample_data():
    db = get_db()
    db.executemany('INSERT INTO menu (name, description, price, category) VALUES (?, ?, ?, ?)', [
        ('Crispy Calamari', 'Lightly battered and served with zesty aioli.', 12.99, 'Appetizers'),
        ('Bruschetta Trio', 'Classic tomato, mushroom, and olive tapenade.', 9.99, 'Appetizers'),
        ('Grilled Salmon', 'With lemon butter sauce and asparagus.', 24.99, 'Main Courses'),
        ('Beef Tenderloin', 'Served with truffle mashed potatoes.', 29.99, 'Main Courses'),
        ('Chocolate Lava Cake', 'With vanilla ice cream and berry compote.', 8.99, 'Desserts'),
        ('Crème Brûlée', 'Classic French dessert with a caramelized top.', 7.99, 'Desserts')
    ])
    db.commit()
    db.close()
    return jsonify({'success': True, 'message': 'Sample data inserted successfully'})

@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory('static', path)

if __name__ == '__main__':
    app.run(debug=True)

