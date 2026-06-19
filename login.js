const mysql = require("mysql2"); // Use mysql2 for compatibility
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt"); // Import bcrypt for password hashing
const app = express();
// const login=require("./login.css")
const encoder = bodyParser.urlencoded({ extended: true }); // Use extended option for better parsing
const path = require('path');
app.use("/assets",express.static("assets")); 
app.use("/earth",express.static("earth")); 

// MySQL connection configuration
const dbConfig = {
    host: "localhost", 
    user: "root", 
    password: "NORDOP777@m"
};

// Create connection to MySQL server (without database initially)
let connection = mysql.createConnection(dbConfig);

// Initialize database
function initializeDatabase() {
    connection.connect(function(error) {
        if (error) {
            console.error("❌ Database connection failed:", error.message);
            console.log("⚠️  Retrying in 5 seconds...");
            setTimeout(initializeDatabase, 5000);
            return;
        }
        console.log("✅ Connected to MySQL server");

        // Create database if it doesn't exist
        connection.query("CREATE DATABASE IF NOT EXISTS nodejs", function(error) {
            if (error) {
                console.error("❌ Error creating database:", error.message);
                return;
            }
            console.log("✅ Database 'nodejs' ready");

            // Switch to the database
            connection.query("USE nodejs", function(error) {
                if (error) {
                    console.error("❌ Error selecting database:", error.message);
                    return;
                }

                // Create table if it doesn't exist
                const createTableQuery = `
                    CREATE TABLE IF NOT EXISTS loginuser (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        user_name VARCHAR(255) UNIQUE NOT NULL,
                        user_pass VARCHAR(255) NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                `;

                connection.query(createTableQuery, function(error) {
                    if (error) {
                        console.error("❌ Error creating table:", error.message);
                        return;
                    }
                    console.log("✅ Table 'loginuser' ready");
                });
            });
        });
    });
}

// Initialize database on startup
initializeDatabase();

// Handle connection errors
connection.on('error', function(err) {
    console.error("❌ Database error:", err.message);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log("⚠️  Connection lost. Reconnecting...");
        initializeDatabase();
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
        console.log("⚠️  Database has too many connections.");
    }
    if (err.code === 'ECONNREFUSED') {
        console.log("⚠️  Database connection was refused.");
    }
});
 
app.get('/earth/about.html', (req, res) => {
    res.sendFile(path.join(__dirname,  'earth', 'about.html'));
});

app.get('/earth/contactus.html', (req, res) => {
    res.sendFile(path.join(__dirname,  'earth', 'contactus.html'));
});

// Add orrery routes
app.use("/orrery-assets", express.static("Orrery-Web-App-main"));
app.get("/orrery", (req, res) => {
    res.sendFile(path.join(__dirname, "Orrery-Web-App-main", "solar_system.html"));
});

// Serve static 3D models and images
app.use("/media", express.static("media"));
app.use("/image", express.static("image"));
app.use("/image_planets", express.static("image_planets"));
app.use("/public", express.static("hackathon 3D model"));

// Serve the main login page
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

// Serve the registration page
app.get("/register", function(req, res) {
    res.sendFile(__dirname + "/register.html"); // Serve your registration form
});

// Input validation middleware
function validateUsername(username) {
    if (!username || typeof username !== 'string') return false;
    if (username.length < 3 || username.length > 50) return false;
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) return false;
    return true;
}

function validatePassword(password) {
    if (!password || typeof password !== 'string') return false;
    if (password.length < 6 || password.length > 100) return false;
    return true;
}

// Sanitize input
function sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    return input.trim().replace(/[<>\"']/g, '');
}

// Handle user registration
app.post("/register", encoder, function(req, res) {
    let username = sanitizeInput(req.body.username || '');
    const password = req.body.password || '';

    // Validate inputs
    if (!validateUsername(username)) {
        return res.status(400).send("Invalid username. Must be 3-50 characters (alphanumeric, underscore, hyphen only).");
    }
    if (!validatePassword(password)) {
        return res.status(400).send("Invalid password. Must be 6-100 characters.");
    }

    // Hash the password before storing it
    bcrypt.hash(password, 10, function(err, hash) {
        if (err) {
            console.error(err);
            return res.status(500).send("An error occurred while hashing the password.");
        }

        // Store the new user in the database
        connection.query("INSERT INTO loginuser (user_name, user_pass) VALUES (?, ?)", [username, hash], function(error, results) {
            if (error) {
                console.error(error);
                if (error.code === 'ER_DUP_ENTRY') {
                    return res.status(409).send("Username already exists. Please choose another.");
                }
                return res.status(500).send("An error occurred while creating your account.");
            }
            res.sendFile(__dirname + "/index.html"); // Inform the user of successful registration
        });
    });
});

// Handle login form submission
app.post("/", encoder, function(req, res) {
    let username = sanitizeInput(req.body.username || '');
    const password = req.body.password || '';

    // Validate inputs
    if (!validateUsername(username)) {
        return res.status(400).send("Invalid username format.");
    }
    if (!validatePassword(password)) {
        return res.status(400).send("Invalid password format.");
    }

    // Query the database to find the user
    connection.query("SELECT * FROM loginuser WHERE user_name = ?", [username], function(error, results) {
        if (error) {
            console.error(error);
            return res.status(500).send("An error occurred while querying the database.");
        }

        if (results.length > 0) {
            const user = results[0];
            // Compare the entered password with the stored hash
            bcrypt.compare(password, user.user_pass, function(err, match) {
                if (err) {
                    console.error(err);
                    return res.status(500).send("An error occurred during password comparison.");
                }

                if (match) {
                    res.redirect("/welcome"); // Redirect to welcome route if passwords match
                } else {
                    res.redirect("/"); // Redirect back to login if passwords do not match
                }
            });
        } else {
            res.redirect("/"); // Redirect back to login if user not found
        }
    });
});

// Handle user details update
app.post("/update", encoder, function(req, res) {
    const username = req.body.username; // Assuming the username is sent in the form
    const newPassword = req.body.newPassword; // New password entered by the user

    // Hash the new password before updating it
    bcrypt.hash(newPassword, 10, function(err, hash) {
        if (err) {
            console.error(err);
            return res.status(500).send("An error occurred while hashing the new password.");
        }

        // Update the user in the database
        connection.query("UPDATE loginuser SET user_pass = ? WHERE user_name = ?", [hash, username], function(error, results) {
            if (error) {
                console.error(error);
                return res.status(500).send("An error occurred while updating the user.");
            }
            res.send("User details updated successfully!"); // Inform the user of successful update
        });
    });
});

// Serve the welcome page
app.get("/welcome", function(req, res) {
    res.sendFile(__dirname + "/welcome.html");
});

// 404 Error Handler - Must be last
app.use(function(req, res) {
    res.status(404).sendFile(__dirname + "/404.html");
});

// Start the server
app.listen(4000, function() {
    console.log("Server is running on http://localhost:4000");
});
