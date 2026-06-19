/**
 * Setup script for NASA Hackathon Project
 * Run: node setup.js
 * This script initializes the MySQL database and creates necessary tables
 */

const mysql = require("mysql2");
const bcrypt = require("bcrypt");

console.log("🚀 Starting NASA Hackathon Project Setup...\n");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "NORDOP777@m"
});

connection.connect(function(error) {
    if (error) {
        console.error("❌ ERROR: Could not connect to MySQL");
        console.error("   Please ensure:");
        console.error("   1. MySQL Server is running");
        console.error("   2. Username: 'root'");
        console.error("   3. Password: 'NORDOP777@m'");
        console.error("\n   Error details:", error.message);
        process.exit(1);
    }

    console.log("✅ Connected to MySQL Server\n");

    // Create database
    connection.query("CREATE DATABASE IF NOT EXISTS nodejs", function(error) {
        if (error) {
            console.error("❌ Error creating database:", error.message);
            process.exit(1);
        }
        console.log("✅ Database 'nodejs' created/verified");

        // Switch to database
        connection.query("USE nodejs", function(error) {
            if (error) {
                console.error("❌ Error selecting database:", error.message);
                process.exit(1);
            }

            // Create table
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
                    process.exit(1);
                }
                console.log("✅ Table 'loginuser' created/verified");

                // Create demo user
                const demoUsername = "demo";
                const demoPassword = "demo123";

                bcrypt.hash(demoPassword, 10, function(err, hash) {
                    if (err) {
                        console.error("❌ Error hashing password:", err.message);
                        process.exit(1);
                    }

                    connection.query(
                        "INSERT IGNORE INTO loginuser (user_name, user_pass) VALUES (?, ?)",
                        [demoUsername, hash],
                        function(error, results) {
                            if (error && error.code !== 'ER_DUP_ENTRY') {
                                console.error("❌ Error inserting demo user:", error.message);
                                process.exit(1);
                            }
                            console.log("✅ Demo user ready (username: 'demo', password: 'demo123')");

                            console.log("\n" + "=".repeat(60));
                            console.log("✅ Setup Complete! Project is ready to run.");
                            console.log("=".repeat(60));
                            console.log("\n📝 To start the server, run: npm start");
                            console.log("🌐 Access the app at: http://localhost:4000\n");

                            connection.end();
                            process.exit(0);
                        }
                    );
                });
            });
        });
    });
});
