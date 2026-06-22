#!/bin/bash
# Telegram Bot Manager - CLI for managing all 4 bots

WORKSPACE="/home/openclaw/.psychvid"
LOG_DIR="$WORKSPACE/logs"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Print header
print_header() {
    echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║     Telegram Bot Manager               ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
}

# Print status
print_status() {
    echo ""
    echo -e "${YELLOW}📊 Bot Status:${NC}"
    
    for bot in "Psyche:approval_bot.py" "Scout:scout.py" "Pulse:pulse.py" "Finch:financial_analyst.py"; do
        IFS=':' read -r name file <<< "$bot"
        if pgrep -f "$file" > /dev/null; then
            pid=$(pgrep -f "$file")
            echo -e "   ${GREEN}✓${NC} $name (PID: $pid)"
        else
            echo -e "   ${RED}✗${NC} $name"
        fi
    done
    echo ""
}

# Show help
show_help() {
    cat << EOF

Usage: telegram_manager.sh <command>

Commands:
    start       Start all Telegram bots
    stop        Stop all Telegram bots gracefully
    restart     Restart all Telegram bots
    status      Show status of all bots
    logs        Show logs (follow mode)
    monitor     Monitor bots with auto-restart
    help        Show this help message

Examples:
    ./telegram_manager.sh start
    ./telegram_manager.sh status
    ./telegram_manager.sh logs
    ./telegram_manager.sh monitor

Log locations:
    $LOG_DIR/Psyche.log
    $LOG_DIR/Scout.log
    $LOG_DIR/Pulse.log
    $LOG_DIR/Finch.log

EOF
}

# Main commands
case "${1:-help}" in
    start)
        print_header
        echo -e "${GREEN}Starting all bots...${NC}"
        $WORKSPACE/start_telegram_bots.sh
        ;;
    
    stop)
        print_header
        echo -e "${YELLOW}Stopping all bots...${NC}"
        $WORKSPACE/stop_telegram_bots.sh
        ;;
    
    restart)
        print_header
        echo -e "${YELLOW}Restarting all bots...${NC}"
        $WORKSPACE/stop_telegram_bots.sh
        sleep 2
        $WORKSPACE/start_telegram_bots.sh
        ;;
    
    status)
        print_header
        print_status
        ;;
    
    logs)
        print_header
        echo -e "${GREEN}Showing logs (press Ctrl+C to stop)...${NC}"
        echo ""
        # Monitor all logs at once using tail
        tail -f $LOG_DIR/*.log 2>/dev/null || echo -e "${RED}No logs found. Did you start the bots?${NC}"
        ;;
    
    monitor)
        print_header
        echo -e "${GREEN}Starting monitoring service...${NC}"
        $WORKSPACE/monitor_telegram_bots.sh
        ;;
    
    help|--help|-h)
        print_header
        show_help
        ;;
    
    *)
        print_header
        echo -e "${RED}Unknown command: $1${NC}"
        show_help
        exit 1
        ;;
esac
