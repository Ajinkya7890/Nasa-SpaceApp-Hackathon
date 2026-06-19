# 🚀 Quick Start Guide - NASA Hackathon

## Step 1: Start the Server (One Command!)
```bash
cd "d:\Nasa Hackathon\loginsystem"
npm start
```

Expected output:
```
Server is running on http://localhost:4000
✅ Connected to MySQL server
✅ Database 'nodejs' ready
✅ Table 'loginuser' ready
```

## Step 2: Open in Browser
Visit: **http://localhost:4000**

## Step 3: Login or Register
- **New User**: Click "Register here" → Create account → Auto-redirects to login
- **Demo User**: 
  - Username: `demo`
  - Password: `demo123`

## Step 4: Explore Features
After login, you'll see the Welcome page with:
- 🌍 **Explore Orrery** - Interactive 3D Solar System
- ℹ️ **Learn More** - About the team and project
- 📞 **Contact Us** - Get in touch

---

## 🔧 If Server Won't Start

### Issue 1: "Port 4000 already in use"
```bash
# Kill the existing process
netstat -ano | findstr :4000
taskkill /PID <PID> /F
```

### Issue 2: "Can't connect to MySQL"
1. Open Windows Services (services.msc)
2. Find "MySQL80" or "MySQL" 
3. Click "Start"

Or from PowerShell (as Admin):
```bash
Start-Service MySQL80
```

### Issue 3: "Database errors"
Run the setup again:
```bash
npm run setup
```

---

## 📱 Available Routes

| URL | Purpose |
|-----|---------|
| `/` | Login/Home |
| `/register` | Register new account |
| `/welcome` | Dashboard (after login) |
| `/orrery` | 3D Solar System Viewer |
| `/earth/about.html` | About Us |
| `/earth/contactus.html` | Contact Form |

---

## 💡 Test Credentials

After setup, these accounts are available:

**Demo Account:**
- Username: `demo`
- Password: `demo123`

**Or create your own:**
1. Go to http://localhost:4000
2. Click "Register here"
3. Enter any username/password
4. Login with those credentials

---

## 📂 Project Structure (Important Files)

```
loginsystem/
├── login.js              ← Main server file
├── package.json          ← Dependencies
├── index.html            ← Login page
├── register.html         ← Registration page
├── welcome.html          ← Dashboard
├── README.md             ← Full documentation
├── setup.js              ← Database initializer
└── assets/               ← CSS files
```

---

## 🆘 Troubleshooting

**"ReferenceError: mysql is not defined"**
→ Run: `npm install`

**"Connection refused"**
→ MySQL not running. Start MySQL service.

**Page not loading CSS**
→ Check browser console for 404 errors. Likely static path issue.

**"EADDRINUSE: address already in use"**
→ Another app using port 4000. Kill it or change port in `login.js`

---

## 🎯 What to Try Next

1. **Register a new user** - Test the authentication system
2. **Explore the Orrery** - Check out 3D solar system (may need JavaScript enabled)
3. **Visit About page** - Read about Team Omicron
4. **Test Contact page** - See the feedback form
5. **Check browser console** - Look for any errors to debug

---

## ✅ Everything Working?

If you can:
✅ See login page at http://localhost:4000
✅ Register a new account
✅ Login successfully
✅ See welcome dashboard with buttons
✅ Navigate to other pages

**🎉 Then your project is fully set up and running!**

---

## 📞 Quick Command Reference

```bash
# Install dependencies
npm install

# Setup database
npm run setup

# Start the server
npm start

# Check if MySQL is running
netstat -ano | findstr :3306

# Kill process on port 4000
taskkill /F /PIM node.exe
```

---

**Happy exploring! 🌌**

For full documentation, see: [README.md](README.md)
