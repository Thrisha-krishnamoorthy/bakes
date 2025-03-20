from flask import Flask, request, jsonify
import mysql.connector
from mysql.connector import Error
import bcrypt  # For password hashing

app = Flask(__name__)

# Database configuration
db_config = {
    'host': 'localhost',
    'user': 'root',  # Replace with your MySQL username
    'password': 'Thrisha',  # Replace with your MySQL password
    'database': 'bakes_db'  # Ensure this database exists
}

# Function to establish a database connection
def get_db_connection():
    try:
        connection = mysql.connector.connect(**db_config)
        return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

# Route to register a new user
@app.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()
    print("Received data:", data)  # Debug: Print received data

    # Validate required fields
    required_fields = ['name', 'email', 'phone', 'password']
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    name = data.get('name')
    email = data.get('email')
    phone = data.get('phone')
    address = data.get('address', '')  # Optional field
    role = data.get('role', 'user')  # Default role is 'user'
    password = data.get('password')

    # Hash the password
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)

    # Check if the email already exists
    connection = get_db_connection()
    if not connection:
        return jsonify({"error": "Database connection failed"}), 500

    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT email FROM users WHERE email = %s", (email,))
    existing_user = cursor.fetchone()

    if existing_user:
        cursor.close()
        connection.close()
        return jsonify({"error": f"User with email {email} already exists"}), 400

    # Insert the new user
    query = "INSERT INTO users (name, email, phone, address, role, password_hash) VALUES (%s, %s, %s, %s, %s, %s)"
    values = (name, email, phone, address, role, hashed_password.decode('utf-8'))  # Store the hashed password

    try:
        cursor.execute(query, values)
        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({"message": "User registered successfully"}), 201
    except Error as e:
        return jsonify({"error": str(e)}), 500

# Route to register a new admin
@app.route('/register-admin', methods=['POST'])
def register_admin():
    data = request.get_json()
    print("Received data:", data)  # Debug: Print received data

    # Validate required fields
    required_fields = ['name', 'email', 'password']
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    # Hash the password
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)

    # Check if the email already exists
    connection = get_db_connection()
    if not connection:
        return jsonify({"error": "Database connection failed"}), 500

    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT email FROM admins WHERE email = %s", (email,))
    existing_admin = cursor.fetchone()

    if existing_admin:
        cursor.close()
        connection.close()
        return jsonify({"error": f"Admin with email {email} already exists"}), 400

    # Insert the new admin
    query = "INSERT INTO admins (name, email, password_hash) VALUES (%s, %s, %s)"
    values = (name, email, hashed_password.decode('utf-8'))  # Store the hashed password

    try:
        cursor.execute(query, values)
        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({"message": "Admin registered successfully"}), 201
    except Error as e:
        return jsonify({"error": str(e)}), 500

# Route to login as a user
@app.route('/login', methods=['POST'])
def login_user():
    data = request.get_json()
    print("Received data:", data)  # Debug: Print received data

    # Validate required fields
    required_fields = ['email', 'password']
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    email = data.get('email')
    password = data.get('password')

    # Fetch the user from the database
    connection = get_db_connection()
    if not connection:
        return jsonify({"error": "Database connection failed"}), 500

    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()

    if not user:
        cursor.close()
        connection.close()
        return jsonify({"error": "User not found"}), 404

    # Verify the password
    stored_hashed_password = user['password_hash'].encode('utf-8')
    if bcrypt.checkpw(password.encode('utf-8'), stored_hashed_password):
        cursor.close()
        connection.close()
        return jsonify({"message": "User login successful"}), 200
    else:
        cursor.close()
        connection.close()
        return jsonify({"error": "Invalid password"}), 401

# Route to login as an admin
@app.route('/login-admin', methods=['POST'])
def login_admin():
    data = request.get_json()
    print("Received data:", data)  # Debug: Print received data

    # Validate required fields
    required_fields = ['email', 'password']
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    email = data.get('email')
    password = data.get('password')

    # Fetch the admin from the database
    connection = get_db_connection()
    if not connection:
        return jsonify({"error": "Database connection failed"}), 500

    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM admins WHERE email = %s", (email,))
    admin = cursor.fetchone()

    if not admin:
        cursor.close()
        connection.close()
        return jsonify({"error": "Admin not found"}), 404

    # Verify the password
    stored_hashed_password = admin['password_hash'].encode('utf-8')
    if bcrypt.checkpw(password.encode('utf-8'), stored_hashed_password):
        cursor.close()
        connection.close()
        return jsonify({"message": "Admin login successful"}), 200
    else:
        cursor.close()
        connection.close()
        return jsonify({"error": "Invalid password"}), 401

# Route to place a new order
@app.route('/orders', methods=['POST'])
def place_order():
    data = request.get_json()
    print("Received data:", data)  # Debug: Print received data

    # Validate required fields
    required_fields = ['user_id', 'items']
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    user_id = data.get('user_id')
    items = data.get('items')  # List of items in the order

    # Check if the user exists
    connection = get_db_connection()
    if not connection:
        return jsonify({"error": "Database connection failed"}), 500

    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT user_id FROM users WHERE user_id = %s", (user_id,))
    user = cursor.fetchone()

    if not user:
        cursor.close()
        connection.close()
        return jsonify({"error": f"User with ID {user_id} does not exist"}), 400

    # Check if all items are in stock and have sufficient quantity
    for item in items:
        product_id = item.get('product_id')
        quantity = item.get('quantity')

        cursor.execute("SELECT quantity, status FROM products WHERE product_id = %s", (product_id,))
        product = cursor.fetchone()

        if not product:
            cursor.close()
            connection.close()
            return jsonify({"error": f"Product with ID {product_id} does not exist"}), 400

        if product['status'] == 'out_of_stock':
            cursor.close()
            connection.close()
            return jsonify({"error": f"Product with ID {product_id} is out of stock"}), 400

        if product['quantity'] < quantity:
            cursor.close()
            connection.close()
            return jsonify({"error": f"Insufficient quantity for product ID {product_id}"}), 400

    # Insert the order
    total_price = sum(item['price'] * item['quantity'] for item in items)
    delivery_type = data.get('delivery_type', 'delivery')  # Default to 'delivery'
    delivery_address = data.get('delivery_address', '')  # Optional field

    try:
        # Insert the order
        query = "INSERT INTO orders (user_id, total_price, delivery_type, delivery_address) VALUES (%s, %s, %s, %s)"
        values = (user_id, total_price, delivery_type, delivery_address)
        cursor.execute(query, values)
        order_id = cursor.lastrowid  # Get the ID of the newly inserted order

        # Insert order items and update product quantities
        for item in items:
            product_id = item.get('product_id')
            quantity = item.get('quantity')
            price = item.get('price')

            # Insert order item
            query = "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (%s, %s, %s, %s)"
            values = (order_id, product_id, quantity, price)
            cursor.execute(query, values)

            # Update product quantity
            query = "UPDATE products SET quantity = quantity - %s WHERE product_id = %s"
            values = (quantity, product_id)
            cursor.execute(query, values)

            # Check if the product is out of stock after the update
            cursor.execute("SELECT quantity FROM products WHERE product_id = %s", (product_id,))
            updated_product = cursor.fetchone()

            if updated_product['quantity'] == 0:
                # Mark the product as out of stock
                query = "UPDATE products SET status = 'out_of_stock' WHERE product_id = %s"
                values = (product_id,)
                cursor.execute(query, values)

        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({"message": "Order placed successfully", "order_id": order_id}), 201
    except Error as e:
        return jsonify({"error": str(e)}), 500

# Route to add a new product
@app.route('/products', methods=['POST'])
def add_product():
    data = request.get_json()
    print("Received data:", data)  # Debug: Print received data

    # Validate required fields
    required_fields = ['name', 'description', 'price', 'category', 'quantity']
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    name = data.get('name')
    description = data.get('description')
    price = data.get('price')
    image_url = data.get('image_url', '')  # Optional field
    category = data.get('category')
    quantity = data.get('quantity')

    # Insert the new product
    connection = get_db_connection()
    if not connection:
        return jsonify({"error": "Database connection failed"}), 500

    cursor = connection.cursor()
    query = "INSERT INTO products (name, description, price, image_url, category, quantity, status) VALUES (%s, %s, %s, %s, %s, %s, %s)"
    values = (name, description, price, image_url, category, quantity, 'in_stock' if quantity > 0 else 'out_of_stock')

    try:
        cursor.execute(query, values)
        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({"message": "Product added successfully"}), 201
    except Error as e:
        return jsonify({"error": str(e)}), 500

# Route to get all products
@app.route('/products', methods=['GET'])
def get_products():
    connection = get_db_connection()
    if not connection:
        return jsonify({"error": "Database connection failed"}), 500

    cursor = connection.cursor(dictionary=True)
    query = "SELECT * FROM products"
    cursor.execute(query)
    products = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify(products)

# Route to update product quantity (Admin)
@app.route('/update-product-quantity', methods=['POST'])
def update_product_quantity():
    data = request.get_json()
    print("Received data:", data)  # Debug: Print received data

    # Validate required fields
    required_fields = ['product_id', 'quantity']
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    product_id = data.get('product_id')
    quantity = data.get('quantity')

    # Update the product quantity and status
    connection = get_db_connection()
    if not connection:
        return jsonify({"error": "Database connection failed"}), 500

    cursor = connection.cursor()
    query = "UPDATE products SET quantity = %s, status = CASE WHEN %s = 0 THEN 'out_of_stock' ELSE 'in_stock' END WHERE product_id = %s"
    values = (quantity, quantity, product_id)

    try:
        cursor.execute(query, values)
        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({"message": "Product quantity updated successfully"}), 200
    except Error as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)