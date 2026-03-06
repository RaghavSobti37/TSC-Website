# Quick Commands - ngrok Sharing

## 🚀 Start Sharing in 2 Steps

### Terminal 1: Start Dev Server
```powershell
cd c:\Users\ragha\OneDrive\Desktop\TSC-Website\TSC-Website
npm run dev
```
Wait for: `ready - started server on 0.0.0.0:3003`

### Terminal 2: Start ngrok Tunnel
```powershell
& "$env:temp\ngrok.exe" http 3003
```

## 📋 Copy the Public URL
Look for this line in ngrok output:
```
Forwarding    https://xxxx-xx-xxx-xxx.ngrok-free.app
```

Share that URL! ✅

---

## If ngrok is Not Found

Use full path explicitly:
```powershell
$env:temp\ngrok.exe http 3003
```

## Stop Sharing
Press `Ctrl+C` in the ngrok terminal

---

## Troubleshooting in 30 Seconds

| Problem | Fix |
|---------|-----|
| Port in use | `taskkill /PID XXXX /F` then restart |
| "1 session limit" | Stop ngrok then restart it |
| URLs keep changing | It's free plan - that's normal |
| Can't see URL | Scroll up in ngrok terminal |

---

📖 Full guide: See `NGROK_SHARING_GUIDE.md`
