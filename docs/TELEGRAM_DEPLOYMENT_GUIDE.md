# Telegram Bot Deployment Guide

**Status:** Production-Ready  
**Date:** 2026-06-22 20:00 EDT  
**Bots:** 4 (Psyche, Scout, Pulse, Finch)

---

## 🎯 DEPLOYMENT OPTIONS

### Option 1: Simple Startup Scripts (Recommended for Now)

**Best for:** Development, testing, quick deployment

```bash
# Start all bots
cd /home/openclaw/.psychvid
./start_telegram_bots.sh

# Stop all bots
./stop_telegram_bots.sh

# Monitor with auto-restart
./monitor_telegram_bots.sh
```

**Files:**
- `start_telegram_bots.sh` — Start all 4 bots
- `stop_telegram_bots.sh` — Stop all 4 bots gracefully
- `monitor_telegram_bots.sh` — Monitor and auto-restart

---

### Option 2: Systemd Services (Recommended for Production)

**Best for:** Production deployment, permanent services, auto-startup on reboot

#### Step 1: Install service files
```bash
cd /home/openclaw/.psychvid

sudo cp telegram-psyche.service /etc/systemd/system/
sudo cp telegram-scout.service /etc/systemd/system/
sudo cp telegram-pulse.service /etc/systemd/system/
sudo cp telegram-finch.service /etc/systemd/system/

sudo systemctl daemon-reload
```

#### Step 2: Start services
```bash
# Start individual services
sudo systemctl start telegram-psyche
sudo systemctl start telegram-scout
sudo systemctl start telegram-pulse
sudo systemctl start telegram-finch

# Or start all at once (if you create telegram-all.service)
sudo systemctl start telegram-psyche telegram-scout telegram-pulse telegram-finch
```

#### Step 3: Enable auto-startup
```bash
# Enable services to start on reboot
sudo systemctl enable telegram-psyche
sudo systemctl enable telegram-scout
sudo systemctl enable telegram-pulse
sudo systemctl enable telegram-finch
```

#### Step 4: Manage services
```bash
# Check status
sudo systemctl status telegram-psyche
sudo systemctl status telegram-scout
sudo systemctl status telegram-pulse
sudo systemctl status telegram-finch

# View logs
sudo journalctl -u telegram-psyche -f
sudo journalctl -u telegram-scout -f
sudo journalctl -u telegram-pulse -f
sudo journalctl -u telegram-finch -f

# Stop services
sudo systemctl stop telegram-psyche
sudo systemctl stop telegram-scout
sudo systemctl stop telegram-pulse
sudo systemctl stop telegram-finch

# Restart services
sudo systemctl restart telegram-psyche
sudo systemctl restart telegram-scout
sudo systemctl restart telegram-pulse
sudo systemctl restart telegram-finch
```

---

## 📋 SCRIPT DESCRIPTIONS

### start_telegram_bots.sh
- Activates virtual environment
- Creates log directory
- Starts all 4 bots with nohup
- Verifies each bot started successfully
- Shows process IDs and log locations

**Usage:**
```bash
./start_telegram_bots.sh
```

**Output:**
```
🚀 Starting Telegram Agent Bots
================================

🤖 Starting Psyche...
✅ Started (PID: 12345)
   Log: ./logs/Psyche.log
   Status: Running ✓

🤖 Starting Scout...
✅ Started (PID: 12346)
   Status: Running ✓

... (Pulse, Finch)

✅ All bots started!

View logs:
   Psyche:  tail -f ./logs/Psyche.log
   Scout:   tail -f ./logs/Scout.log
```

### stop_telegram_bots.sh
- Gracefully stops all 4 bots
- Waits for processes to terminate
- Force kills if necessary

**Usage:**
```bash
./stop_telegram_bots.sh
```

### monitor_telegram_bots.sh
- Runs in continuous loop (30-second intervals)
- Checks if each bot is still running
- Automatically restarts if process dies
- Logs all actions with timestamps

**Usage:**
```bash
./monitor_telegram_bots.sh

# Press Ctrl+C to stop monitoring
```

---

## 🔧 SYSTEMD SERVICE FILES

All service files follow this pattern:

```ini
[Unit]
Description=...
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=openclaw
WorkingDirectory=/home/openclaw/.psychvid
ExecStart=/path/to/python/bot.py
Restart=always          # Auto-restart on failure
RestartSec=10           # Wait 10s before restart
StandardOutput=journal  # Log to systemd journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

**Key Features:**
- ✅ Auto-restart on crash
- ✅ Auto-startup on reboot (with `enable`)
- ✅ Integrated logging (journalctl)
- ✅ Proper service dependencies
- ✅ Resource management

---

## 📊 LOG MANAGEMENT

### Simple Scripts
```bash
# View logs (follow in real-time)
tail -f /home/openclaw/.psychvid/logs/Psyche.log
tail -f /home/openclaw/.psychvid/logs/Scout.log
tail -f /home/openclaw/.psychvid/logs/Pulse.log
tail -f /home/openclaw/.psychvid/logs/Finch.log

# View last 50 lines
tail -50 /home/openclaw/.psychvid/logs/Psyche.log

# View with timestamps
grep "error\|Error\|ERROR" /home/openclaw/.psychvid/logs/Psyche.log
```

### Systemd Services
```bash
# View journal logs (follow)
sudo journalctl -u telegram-psyche -f

# View last 50 lines
sudo journalctl -u telegram-psyche -n 50

# View since specific time
sudo journalctl -u telegram-psyche --since "2 hours ago"

# View with verbose output
sudo journalctl -u telegram-psyche -o verbose
```

---

## 🔍 MONITORING & TROUBLESHOOTING

### Check if bots are running

```bash
# Check all bots
ps aux | grep -E "approval_bot|scout.py|pulse.py|financial_analyst"

# Check specific bot
ps aux | grep approval_bot.py

# Or with systemd
sudo systemctl status telegram-psyche
sudo systemctl status telegram-scout
```

### Common Issues

**Issue: Bot not starting**
```bash
# Check logs
tail -50 /home/openclaw/.psychvid/logs/Psyche.log

# Check .env file
cat /home/openclaw/.psychvid/.env | grep -i bot_token

# Test bot token manually
python3 << 'EOF'
import os
import requests

os.environ['PSYCHE_BOT_TOKEN'] = "YOUR_TOKEN_HERE"
token = os.getenv('PSYCHE_BOT_TOKEN')

response = requests.get(f"https://api.telegram.org/bot{token}/getMe")
print(response.json())
EOF
```

**Issue: Bot crashed after starting**
```bash
# Check for recent errors
tail -100 /home/openclaw/.psychvid/logs/Psyche.log | grep -i error

# Check system resources
df -h          # Disk space
free -h        # Memory
top -b -n 1    # Process usage
```

**Issue: Bots not receiving messages**
```bash
# Verify chat ID is correct
grep TELEGRAM_CHAT_ID /home/openclaw/.psychvid/.env

# Test with manual message
python3 << 'EOF'
import requests
import os

os.environ.update({
    'PSYCHE_BOT_TOKEN': 'YOUR_TOKEN',
    'TELEGRAM_CHAT_ID': 'YOUR_CHAT_ID'
})

token = os.getenv('PSYCHE_BOT_TOKEN')
chat_id = os.getenv('TELEGRAM_CHAT_ID')

response = requests.post(
    f"https://api.telegram.org/bot{token}/sendMessage",
    json={"chat_id": chat_id, "text": "Test message"}
)
print(response.json())
EOF
```

---

## 🚀 QUICK START (PRODUCTION)

### Recommended Setup

1. **Install systemd services:**
```bash
cd /home/openclaw/.psychvid
sudo cp telegram-*.service /etc/systemd/system/
sudo systemctl daemon-reload
```

2. **Start all bots:**
```bash
sudo systemctl start telegram-psyche telegram-scout telegram-pulse telegram-finch
```

3. **Enable auto-startup:**
```bash
sudo systemctl enable telegram-psyche telegram-scout telegram-pulse telegram-finch
```

4. **Verify running:**
```bash
sudo systemctl status telegram-psyche
sudo systemctl status telegram-scout
sudo systemctl status telegram-pulse
sudo systemctl status telegram-finch
```

5. **Monitor logs:**
```bash
sudo journalctl -u telegram-psyche -f
```

---

## 📋 CHECKLIST

Before deploying:

- [ ] Bot tokens in `.env` file
- [ ] Bot tokens verified working
- [ ] Log directory exists
- [ ] Scripts are executable: `chmod +x *.sh`
- [ ] Virtual environment configured (if using venv)
- [ ] .env file is gitignored
- [ ] All 4 bot files exist

For systemd deployment:

- [ ] Service files copied to `/etc/systemd/system/`
- [ ] Daemon reloaded: `sudo systemctl daemon-reload`
- [ ] Services enabled: `sudo systemctl enable ...`
- [ ] Services started: `sudo systemctl start ...`
- [ ] Services status checked: `sudo systemctl status ...`

---

## 🎯 NEXT STEPS

**Option A: Test with simple scripts (now)**
```bash
cd /home/openclaw/.psychvid
chmod +x start_telegram_bots.sh stop_telegram_bots.sh monitor_telegram_bots.sh
./start_telegram_bots.sh
```

**Option B: Deploy with systemd (production)**
```bash
sudo cp /home/openclaw/.psychvid/telegram-*.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl start telegram-psyche telegram-scout telegram-pulse telegram-finch
sudo systemctl enable telegram-psyche telegram-scout telegram-pulse telegram-finch
```

---

## 📞 SUPPORT

If bots aren't running:
1. Check logs: `tail -50 ./logs/Psyche.log`
2. Verify tokens: `grep BOT_TOKEN .env`
3. Test connection: See "Troubleshooting" section above
4. Check system resources: `free -h` and `df -h`

All scripts are in `/home/openclaw/.psychvid/` — ready to deploy! 🚀
