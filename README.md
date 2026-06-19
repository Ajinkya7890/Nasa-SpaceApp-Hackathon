# 🚀 NASA Hackathon - Space Exploration Web Application

A full-stack web application for exploring planets, the solar system, and space data with user authentication and 3D visualizations.

## 📋 Project Overview

This NASA Hackathon project provides:
- **User Authentication**: Secure login/registration with bcrypt password hashing
- **Solar System Visualization**: Interactive 3D orrery (planetary motion)
- **Educational Content**: Information about planets, asteroids, and celestial bodies
- **Responsive Design**: Modern UI with smooth animations
- **Database Integration**: MySQL backend for user management

## 🛠️ Tech Stack

- **Backend**: Node.js with Express.js
- **Database**: MySQL
- **Frontend**: HTML5, CSS3, JavaScript
- **3D Visualization**: Three.js
- **Security**: bcrypt for password hashing

## ⚙️ Prerequisites

1. **Node.js** (v14 or higher)
2. **MySQL Server** (v5.7 or higher)
3. npm (comes with Node.js)

## 🚀 Installation & Setup

### Step 1: Install Dependencies
```bash
cd loginsystem
npm install
```

### Step 2: Configure MySQL (if needed)
**Note**: The application will auto-create the database and table on first run.

To manually set up if you prefer:
1. Start MySQL Server
2. Run the setup script:
```bash
npm run setup
```

The setup script will:
- Create the `nodejs` database
- Create the `loginuser` table with columns:
  - `id`: Auto-increment primary key
  - `user_name`: Username (unique)
  - `user_pass`: Hashed password
  - `created_at`: Registration timestamp
- Create a demo user:
  - Username: `demo`
  - Password: `demo123`

### Step 3: Start the Server
```bash
npm start
```

The server will start on: **http://localhost:4000**

You should see:
```
✅ Connected to MySQL server
✅ Database 'nodejs' ready
✅ Table 'loginuser' ready
✅ Server is running on http://localhost:4000
```

## 📝 Usage

### Login/Registration
1. Open http://localhost:4000 in your browser
2. **New User**: Click "Register here" to create an account
3. **Existing User**: Enter credentials and click "Login"

### After Login
You'll be directed to the Welcome page where you can:
- **Explore Orrery**: View the 3D solar system
- **Learn More**: Read about planets and space
- **Contact Us**: Get in touch with questions

### Available Routes
| Route | Description |
|-------|-------------|
| `/` | Login page |
| `/register` | Registration page |
| `/welcome` | Dashboard (after login) |
| `/orrery` | 3D Solar System Visualizer |
| `/earth/about.html` | About the project |
| `/earth/contactus.html` | Contact information |

## 📂 Project Structure

```
loginsystem/
├── login.js              # Main server file
├── index.html            # Login page
├── register.html         # Registration page
├── welcome.html          # Welcome/dashboard
├── setup.js              # Database setup script
├── package.json          # Dependencies
├── assets/
│   ├── style.css
│   ├── register.css
│   └── welcome.css
├── earth/                # Educational content
│   ├── about.html
│   ├── contactus.html
│   ├── planets.html
│   └── (other pages)
├── Orrery-Web-App-main/  # 3D visualization
│   ├── solar_system.html
│   ├── solar_system.js
│   └── (3D assets)
├── hackathon 3D model/   # 3D models of planets
├── media/                # Videos and media
└── image_planets/        # Planet images
```

## 🔧 Troubleshooting

### Issue: "Can't connect to MySQL server"
**Solution**:
1. Start MySQL Server
   - **Windows**: Run `mysql.exe` or use services manager
   - **Mac**: `brew services start mysql`
   - **Linux**: `sudo systemctl start mysql`

2. Verify credentials in `login.js`:
   - Host: `localhost`
   - User: `root`
   - Password: `NORDOP777@m`

### Issue: "database doesn't exist"
**Solution**: The app will auto-create it on startup. If not:
```bash
npm run setup
```

### Issue: "Port 4000 is already in use"
**Solution**: Either:
1. Kill the process using port 4000
2. Change the port in `login.js` line ~130:
   ```javascript
   app.listen(3000, function() { ... })
   ```

### Issue: "ENOENT: no such file or directory"
**Solution**: Make sure you're in the correct directory:
```bash
cd "d:\Nasa Hackathon\loginsystem"
npm start
```

## 🔐 Security Notes

- ⚠️ **IMPORTANT**: Database credentials are hardcoded for development only
- For production, use environment variables:
  ```javascript
  const dbConfig = {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
  };
  ```

## 📚 Available Demo Credentials

After setup, you can log in with:
- **Username**: `demo`
- **Password**: `demo123`

Or create your own account through registration.

## 🌟 Features

✅ User Registration with validation
✅ Secure Password Hashing
✅ Auto-database initialization
✅ Responsive Design
✅ 3D Solar System Visualization
✅ Educational Content
✅ Contact Form
✅ Error Handling & Logging

## 🤝 Contributing

This project is part of NASA Hackathon. For improvements, submit a PR with:
1. Feature description
2. Code changes
3. Testing results

## 📞 Support

For issues or questions:
1. Check the Troubleshooting section above
2. Review error messages in the console
3. Contact the development team

## 📄 License

ISC License

---

**Ready to explore the cosmos? Start the server and begin your journey! 🚀🌍**

Last Updated: 2026-06-19
