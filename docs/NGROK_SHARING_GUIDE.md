# ngrok Sharing Guide - TSC Website

Quick reference for creating shareable public URLs for the TSC Website across different locations and networks.

## One-Time Setup

### 1. Create ngrok Account
- Visit: https://ngrok.com/sign-up
- Sign up with email (free account)
- Verify email

### 2. Get Your Authtoken
- Go to: https://dashboard.ngrok.com/auth
- Copy your authtoken
- Save it somewhere safe (you'll need it to configure)

### 3. Configure ngrok with Authtoken
Run this command **once** in PowerShell:
```powershell
& "$env:temp\ngrok.exe" authtoken "YOUR_AUTHTOKEN_HERE"
```

For our project, the authtoken is already configured if you've done this before.

---

## Quick Start - Every Time You Want to Share

### Prerequisites
✅ Dev server must be running on port 3003

### Step 1: Start Dev Server (if not already running)
```powershell
cd c:\Users\ragha\OneDrive\Desktop\TSC-Website\TSC-Website
npm run dev
```
Wait for: `ready - started server on 0.0.0.0:3003`

### Step 2: Open New PowerShell Terminal and Start ngrok Tunnel
```powershell
& "$env:temp\ngrok.exe" http 3003
```

### Step 3: Copy Public URL
Look for the line that says:
```
Forwarding    https://xxxx-xx-xxx-xxx.ngrok-free.app
```

That `https://xxxx-xx-xxx-xxx.ngrok-free.app` is your **shareable public URL**

### Step 4: Share with Team
- Send the URL to your distributed team
- They can visit it from anywhere in the world
- URL stays active as long as ngrok process is running

---

## Full Command Reference

### macOS/Linux
```bash
ngrok http 3003
```

### Windows PowerShell (Current Method)
```powershell
& "$env:temp\ngrok.exe" http 3003
```

### Windows Command Prompt
```cmd
%temp%\ngrok.exe http 3003
```

---

## Adding ngrok to PATH (Optional - For Easier Access)

### Windows PowerShell Setup
```powershell
# Create a permanent symlink to ngrok
$ngrokPath = "$env:TEMP\ngrok.exe"
$linkPath = "$env:LOCALAPPDATA\Programs\ngrok.exe"
New-Item -ItemType SymbolicLink -Path $linkPath -Target $ngrokPath -Force
```

After this, you can just run:
```powershell
ngrok http 3003
```

---

## Troubleshooting

### Issue: "Your account is limited to 1 simultaneous ngrok agent sessions"
**Solution:** 
- Stop the current ngrok process (Ctrl+C in the terminal)
- Wait a few seconds
- Start a new ngrok process on the desired port

### Issue: ngrok not found
**Solution:** 
Use the full path: `& "$env:temp\ngrok.exe" http 3003`

### Issue: Port 3003 already in use
**Solution:**
```powershell
netstat -ano | findstr ":3003"
taskkill /PID <PID> /F
npm run dev
```
Then restart ngrok.

### Issue: Dev server shows "port 3003 in use, trying 3004"
**Solution:**
Kill the process on 3003 or use the new port:
```powershell
& "$env:temp\ngrok.exe" http 3004
```

---

## Dashboard & Monitoring

### View Active Sessions
- Visit: https://dashboard.ngrok.com/agents
- See all your active tunnels

### View Traffic Inspection
While ngrok is running, visit:
```
http://localhost:4040
```
This shows all requests/responses flowing through your tunnel in real-time.

---

## URL Persistence

### Default Behavior (Free Plan)
- URL changes every time you restart ngrok
- Previous URL becomes invalid

### Keep Same URL (Premium)
- Upgrade to Pro/Enterprise plan
- Assign custom subdomain or reserved domain
- URL persists across restarts

### For Now (Free)
Just share the new URL with team every time you restart.

---

## Step-by-Step Process for Your Team

1. **You start the dev server:**
   ```powershell
   npm run dev
   ```

2. **You start ngrok in a new terminal:**
   ```powershell
   & "$env:temp\ngrok.exe" http 3003
   ```

3. **You copy the URL** (looks like: `https://1234-56-789-012.ngrok-free.app`)

4. **Share URL with team** via Slack/Email/Messages

5. **Team visits URL** in their browsers - they see live website

6. **Keep ngrok running** while team is reviewing

7. **When done, press Ctrl+C** in ngrok terminal to stop

---

## Pro Tips

### Combine Both Commands (One Terminal)
```powershell
# Start dev server in background, then ngrok
cd c:\Users\ragha\OneDrive\Desktop\TSC-Website\TSC-Website
npm run dev &
Start-Sleep -Seconds 3
& "$env:temp\ngrok.exe" http 3003
```

### Create Batch File for Faster Access
Create file: `C:\start-sharing.bat`
```batch
@echo off
cd c:\Users\ragha\OneDrive\Desktop\TSC-Website\TSC-Website
start npm run dev
timeout /t 3 /nobreak
%temp%\ngrok.exe http 3003
pause
```

Then just run `start-sharing.bat` from desktop.

### Set Ngrok Alias in PowerShell Profile
Edit your profile:
```powershell
notepad $PROFILE
```

Add this line:
```powershell
$alias ngrok = & "$env:temp\ngrok.exe"
```

Then restart PowerShell and just use:
```powershell
ngrok http 3003
```

---

## Current Configuration

**Authtoken:** `3AWdjozAnEKe1VSIfQMCnJONOFz_4Y2eaKRarWXoZtJj7b73S`  
**Dev Server Port:** `3003`  
**Account:** Raghav Raj Sobti (Free Plan)  
**Region:** United States (us)  
**Config File:** `C:\Users\ragha\.ngrok2\ngrok.yml`

---

## Last Public URL

*Will be generated when you run ngrok next*

---

## Resources

- ngrok Docs: https://ngrok.com/docs
- Dashboard: https://dashboard.ngrok.com
- Status: https://status.ngrok.com
