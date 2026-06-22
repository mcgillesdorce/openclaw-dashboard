# 🚀 TELEGRAM BOTS — READY FOR PRODUCTION DEPLOYMENT

**Date:** 2026-06-22 20:00 EDT  
**Status:** ✅ FULLY CONFIGURED & READY TO DEPLOY  
**Bots:** 4 (Psyche, Scout, Pulse, Finch)  

---

## ✅ WHAT'S READY

### Configuration
- ✅ All bot tokens in `.env`
- ✅ Chat ID configured
- ✅ All tokens verified working
- ✅ Environment ready

### Deployment Scripts
- ✅ `telegram_manager.sh` — CLI manager (recommended)
- ✅ `start_telegram_bots.sh` — Start all bots
- ✅ `stop_telegram_bots.sh` — Stop all bots
- ✅ `monitor_telegram_bots.sh` — Auto-restart if crashed
- ✅ `setup_systemd.sh` — Install systemd services

### Systemd Services (Optional)
- ✅ `telegram-psyche.service`
- ✅ `telegram-scout.service`
- ✅ `telegram-pulse.service`
- ✅ `telegram-finch.service`

### Documentation
- ✅ `TELEGRAM_DEPLOYMENT_GUIDE.md` — Complete guide
- ✅ `TELEGRAM_READY_FOR_DEPLOYMENT.md` — This file

---

## 🎯 QUICK START (CHOOSE ONE)

### 🟢 OPTION A: Simple Startup (Easiest - Recommended for Testing)

```bash
cd /home/openclaw/.psychvid

# Start all bots
./telegram_manager.sh start

# Check status
./telegram_manager.sh status

# View logs
./telegram_manager.sh logs

# Stop bots
./telegram_manager.sh stop
```

**Advantages:**
- Simple, no sudo needed
- Easy to debug
- Good for development
- Portable (works anywhere)

**Disadvantages:**
- Manual restart needed if system reboots
- Need to keep terminal window open (unless backgrounded)
- Manual monitoring required

---

### 🔵 OPTION B: Systemd Services (Recommended for Production)

#### Step 1: Install services (one-time)
```bash
sudo /home/openclaw/.psychvid/setup_systemd.sh
```

#### Step 2: Start all bots
```bash
sudo systemctl start telegram-psyche telegram-scout telegram-pulse telegram-finch
```

#### Step 3: Verify running
```bash
sudo systemctl status telegram-psyche
```

#### Step 4: Check logs
```bash
sudo journalctl -u telegram-psyche -f
```

**Advantages:**
- Auto-restart on crash
- Auto-start on reboot
- Integrated logging
- Perfect for production
- Managed by system

**Disadvantages:**
- Requires sudo
- Slightly more complex setup
- Less flexible debugging

---

## 🎮 TELEGRAM_MANAGER.SH COMMANDS

The manager CLI is the easiest way to control bots:

```bash
./telegram_manager.sh start      # Start all 4 bots
./telegram_manager.sh stop       # Stop all 4 bots
./telegram_manager.sh restart    # Restart all 4 bots
./telegram_manager.sh status     # Show status of all bots
./telegram_manager.sh logs       # Follow logs from all bots
./telegram_manager.sh monitor    # Monitor and auto-restart
./telegram_manager.sh help       # Show help
```

---

## 📊 EXPECTED BOT BEHAVIOR

Once started, each bot:

1. **Connects to Telegram API**
   - Uses bot token to authenticate
   - Enters polling loop

2. **Receives messages from chat**
   - Monitors `/start`, `/help`, commands
   - Processes requests from Telegram

3. **Sends responses**
   - Returns results to chat
   - Logs all interactions

4. **Continues running**
   - Until manually stopped
   - Until systemd restarts it
   - Or until crash (if not using systemd)

---

## 🔍 HOW TO VERIFY BOTS ARE WORKING

### Quick Check
```bash
# Check all bots running
ps aux | grep -E "approval_bot|scout.py|pulse.py|financial_analyst"

# Check specific bot
ps aux | grep approval_bot.py

# Using manager
./telegram_manager.sh status
```

### Message a Bot
1. Open Telegram
2. Find @Gilly_pipeline_bot (or other bot)
3. Send: `/start`
4. Bot should respond with help message

### Check Logs
```bash
# Follow all logs
./telegram_manager.sh logs

# Or specific bot
tail -f /home/openclaw/.psychvid/logs/Psyche.log
```

---

## 📋 BOT INFORMATION

| Bot | Username | Token (ends with) | Purpose |
|-----|----------|-------------------|---------|
| 🎬 Psyche | @Gilly_pipeline_bot | ...eOBk | Pipeline orchestration |
| 📖 Scout | @Scout_psychology_bot | ...KaJ4 | Topic research |
| 📊 Pulse | @Pulse_psychology_bot | ...w5A4 | Performance analytics |
| 💰 Finch | @Financial_psychology_bot | ...S-aY | Financial analysis |

**Chat ID:** `8939048581`

---

## 🛑 TROUBLESHOOTING

### Bots not starting
```bash
# Check for errors
tail -50 /home/openclaw/.psychvid/logs/Psyche.log

# Check .env
cat /home/openclaw/.psychvid/.env | grep BOT_TOKEN

# Verify tokens
./telegram_manager.sh status
```

### Bots not receiving messages
```bash
# Verify chat ID
grep TELEGRAM_CHAT_ID /home/openclaw/.psychvid/.env

# Check Telegram API connection
# Try sending a message manually using curl:
curl -X POST \
  https://api.telegram.org/botYOUR_TOKEN/sendMessage \
  -d chat_id=8939048581 \
  -d text="Test message"
```

### Bot crashes frequently
```bash
# Check logs for errors
tail -100 /home/openclaw/.psychvid/logs/Psyche.log | grep -i error

# Check system resources
free -h      # Memory
df -h        # Disk space
top -b -n 1  # Processes

# If using systemd, check journal
sudo journalctl -u telegram-psyche -n 50
```

---

## 📝 FILES CREATED

```
/home/openclaw/.psychvid/
├── telegram_manager.sh              ✅ Main CLI (use this!)
├── start_telegram_bots.sh           ✅ Start all bots
├── stop_telegram_bots.sh            ✅ Stop all bots
├── monitor_telegram_bots.sh         ✅ Monitor + auto-restart
├── setup_systemd.sh                 ✅ Install systemd
├── telegram-psyche.service          ✅ Psyche systemd service
├── telegram-scout.service           ✅ Scout systemd service
├── telegram-pulse.service           ✅ Pulse systemd service
├── telegram-finch.service           ✅ Finch systemd service
├── TELEGRAM_DEPLOYMENT_GUIDE.md     ✅ Full documentation
└── TELEGRAM_READY_FOR_DEPLOYMENT.md ✅ This file

logs/ (created by start script)
├── Psyche.log
├── Scout.log
├── Pulse.log
└── Finch.log
```

---

## 🚀 DEPLOYMENT CHECKLIST

- [x] Bot tokens configured in `.env`
- [x] Tokens verified working
- [x] Deployment scripts created
- [x] Scripts made executable
- [x] Systemd service files created
- [x] Documentation complete
- [ ] **Ready to deploy!**

---

## 🎯 NEXT STEPS

### Now (Test with simple scripts)
```bash
cd /home/openclaw/.psychvid
./telegram_manager.sh start
./telegram_manager.sh status
# Test in Telegram: message @Gilly_pipeline_bot
./telegram_manager.sh stop
```

### Later (Deploy to production)
```bash
sudo ./setup_systemd.sh
sudo systemctl start telegram-psyche telegram-scout telegram-pulse telegram-finch
sudo systemctl enable telegram-psyche telegram-scout telegram-pulse telegram-finch
```

---

## 📞 QUICK REFERENCE

**Start bots:**
```bash
./telegram_manager.sh start
```

**Check status:**
```bash
./telegram_manager.sh status
```

**View logs:**
```bash
./telegram_manager.sh logs
```

**Stop bots:**
```bash
./telegram_manager.sh stop
```

**Install systemd (one-time):**
```bash
sudo ./setup_systemd.sh
```

---

## ✨ YOU'RE READY!

All scripts are in `/home/openclaw/.psychvid/` and ready to use.

**Want to start now?**
```bash
cd /home/openclaw/.psychvid
./telegram_manager.sh start
```

**Want to deploy to production?**
```bash
sudo ./setup_systemd.sh
sudo systemctl start telegram-psyche telegram-scout telegram-pulse telegram-finch
```

---

**Status: ✅ READY FOR DEPLOYMENT**

All 4 Telegram bots are configured, tested, and ready to start serving! 🎉
