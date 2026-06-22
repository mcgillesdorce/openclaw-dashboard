'use client';

const agentConfigs: Record<string, {
  skullEmoji: string;
  spookyEmoji: string;
  name: string;
  color: string;
  darkColor: string;
  description: string;
  hauntingPhrase: string;
  glowColor: string;
}> = {
  finch: {
    skullEmoji: '💀',  /* Skull with coins—greed incarnate */
    spookyEmoji: '💸',  /* Haunted money */
    name: 'Finch',
    color: '#8833ff',
    darkColor: '#3d1166',
    description: 'Phantom Auditor',
    hauntingPhrase: 'Counting the Cost of the Damned',
    glowColor: 'rgba(136, 51, 255, 0.6)'
  },
  scout: {
    skullEmoji: '👁️',  /* All-seeing eye of the void */
    spookyEmoji: '🔮',  /* Crystal ball for forbidden knowledge */
    name: 'Scout',
    color: '#003366',
    darkColor: '#001a33',
    description: 'Midnight Seer',
    hauntingPhrase: 'Seeking Truth Beyond the Veil',
    glowColor: 'rgba(0, 51, 102, 0.6)'
  },
  pulse: {
    skullEmoji: '💀',  /* Heartbeat of the dead */
    spookyEmoji: '⚰️',  /* Coffin—the final resting place */
    name: 'Pulse',
    color: '#aa6600',
    darkColor: '#552200',
    description: 'Death Keeper',
    hauntingPhrase: 'Measuring the Heartbeat of Decay',
    glowColor: 'rgba(170, 102, 0, 0.6)'
  },
  psyche: {
    skullEmoji: '🕷️',  /* Spider in the mind—weaver of fates */
    spookyEmoji: '🌑',  /* Dark moon—orchestrator of shadows */
    name: 'Psyche',
    color: '#ff1133',
    darkColor: '#770011',
    description: 'Architect of Nightmares',
    hauntingPhrase: 'Orchestrating the Symphony of Shadows',
    glowColor: 'rgba(255, 17, 51, 0.7)'
  }
};

interface AgentAvatarProps {
  agent: keyof typeof agentConfigs;
  size?: 'sm' | 'md' | 'lg';
  status?: 'idle' | 'working' | 'awaiting_approval';
  showLabel?: boolean;
  pendingCount?: number;
}

export function AgentAvatar({
  agent,
  size = 'md',
  status = 'idle',
  showLabel = true,
  pendingCount = 0
}: AgentAvatarProps) {
  const config = agentConfigs[agent];
  if (!config) return null;

  const sizeMap = {
    sm: { width: '40px', height: '40px', fontSize: '20px', fontSize2: '9px' },
    md: { width: '80px', height: '80px', fontSize: '42px', fontSize2: '11px' },
    lg: { width: '140px', height: '140px', fontSize: '72px', fontSize2: '13px' }
  };

  const sz = sizeMap[size];

  const statusDot = {
    idle: { bg: '#333333', glow: 'none' },
    working: { bg: '#00aa44', glow: '0 0 16px #00aa44, inset 0 0 8px #00aa44' },
    awaiting_approval: { bg: '#ff1133', glow: '0 0 16px #ff1133, inset 0 0 8px #ff1133' }
  }[status];

  const animationStyle = `
    @keyframes haunt-${agent} {
      0%, 100% { transform: translateY(0px); opacity: 1; }
      50% { transform: translateY(-4px); opacity: 0.95; }
    }
    @keyframes ghostGlow-${agent} {
      0%, 100% { box-shadow: 0 0 20px ${config.glowColor}, inset 0 0 20px rgba(0,0,0,0.8), 0 0 40px ${config.glowColor}44; }
      50% { box-shadow: 0 0 32px ${config.glowColor}, inset 0 0 20px rgba(0,0,0,0.8), 0 0 60px ${config.glowColor}66; }
    }
  `;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      <style>{animationStyle}</style>
      
      {/* Main Avatar */}
      <div
        style={{
          position: 'relative',
          width: sz.width,
          height: sz.height,
          background: `linear-gradient(135deg, ${config.darkColor} 0%, rgba(0,0,0,0.8) 100%)`,
          border: `2px solid ${config.color}`,
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: sz.fontSize,
          fontWeight: '700',
          boxShadow: `0 0 20px ${config.glowColor}, inset 0 0 20px rgba(0,0,0,0.8), 0 0 40px ${config.glowColor}44`,
          transition: 'all 300ms ease',
          animation: `haunt-${agent} 3s ease-in-out infinite, ghostGlow-${agent} 4s ease-in-out infinite`,
          filter: 'drop-shadow(0 0 8px ' + config.glowColor + ')'
        }}
      >
        {/* Inner ghostly mist */}
        <div style={{
          position: 'absolute',
          inset: '0',
          background: `radial-gradient(circle at 35% 35%, ${config.glowColor}15 0%, transparent 50%)`,
          borderRadius: '14px',
          pointerEvents: 'none',
          animation: `spin 20s linear infinite`
        }} />
        
        {/* Skull or spooky emoji */}
        <div style={{ 
          position: 'relative', 
          zIndex: 2,
          textShadow: `0 0 12px ${config.glowColor}`
        }}>
          {config.skullEmoji}
        </div>

        {/* Status Dot */}
        <div
          style={{
            position: 'absolute',
            bottom: '-6px',
            right: '-6px',
            width: '18px',
            height: '18px',
            background: statusDot.bg,
            border: `2px solid ${config.darkColor}`,
            borderRadius: '50%',
            boxShadow: statusDot.glow,
            transition: 'all 300ms ease',
            animation: statusDot.bg !== '#333333' ? 'pulse 1.5s ease-in-out infinite' : 'none'
          }}
        />

        {/* Pending Badge */}
        {pendingCount > 0 && (
          <div style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            background: '#ff1133',
            color: '#d0d0d0',
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: '700',
            boxShadow: '0 0 16px #ff1133, inset 0 0 8px #ff1133',
            border: '2px solid #0a0a0a',
            animation: 'pulse 1s ease-in-out infinite'
          }}>
            {pendingCount}
          </div>
        )}
      </div>

      {/* Label (optional) */}
      {showLabel && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: '13px', 
            fontWeight: '700', 
            color: config.color,
            textShadow: `0 0 8px ${config.glowColor}`
          }}>
            {config.name}
          </div>
          <div style={{ 
            fontSize: '9px', 
            color: '#777777', 
            marginTop: '2px',
            fontStyle: 'italic',
            letterSpacing: '0.5px'
          }}>
            {config.description}
          </div>
          <div style={{ 
            fontSize: '8px', 
            color: config.color, 
            marginTop: '4px',
            opacity: 0.7,
            maxWidth: '120px'
          }}>
            "{config.hauntingPhrase}"
          </div>
        </div>
      )}

      {/* Status Label */}
      {status !== 'idle' && (
        <div style={{
          fontSize: '10px',
          color: statusDot.bg === '#333333' ? '#777777' : statusDot.bg,
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          textShadow: statusDot.bg !== '#333333' ? `0 0 8px ${statusDot.bg}` : 'none'
        }}>
          {status === 'working' ? '⚡ Haunting' : '⚠ Cursed'}
        </div>
      )}
    </div>
  );

/* Mini version for nav */
export function AgentAvatarMini({
  agent,
  pendingCount = 0
}: {
  agent: keyof typeof agentConfigs;
  pendingCount?: number;
}) {
  const config = agentConfigs[agent];
  if (!config) return null;

  return (
    <div
      style={{
        position: 'relative',
        width: '32px',
        height: '32px',
        background: `linear-gradient(135deg, ${config.darkColor} 0%, rgba(0,0,0,0.8) 100%)`,
        border: `1.5px solid ${config.color}`,
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
        fontWeight: '700',
        boxShadow: `0 0 12px ${config.glowColor}, inset 0 0 8px rgba(0,0,0,0.8)`,
        cursor: 'pointer',
        transition: 'all 200ms ease',
        animation: 'ghostFlicker 2.5s ease-in-out infinite'
      }}
      title={config.name}
    >
      {config.skullEmoji}
      {pendingCount > 0 && (
        <div style={{
          position: 'absolute',
          top: '-6px',
          right: '-6px',
          background: '#ff1133',
          color: '#d0d0d0',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '10px',
          fontWeight: '700',
          boxShadow: '0 0 12px #ff1133',
          border: '1px solid #0a0a0a'
        }}>
          {pendingCount}
        </div>
      )}
    </div>
  );
}

/* Spooky animations */
if (typeof window !== 'undefined') {
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    @keyframes ghostFlicker {
      0%, 100% { opacity: 1; }
      33% { opacity: 0.8; }
      66% { opacity: 0.9; }
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }
  `;
  if (document.head) {
    document.head.appendChild(styleEl);
  }
}

/* Grid layout helper */
export function AgentAvatarGrid() {
  const agents: Array<keyof typeof agentConfigs> = ['finch', 'scout', 'pulse', 'psyche'];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
      gap: '32px',
      padding: '32px',
      background: 'linear-gradient(135deg, var(--bg-secondary) 0%, rgba(26, 0, 40, 0.5) 100%)',
      borderRadius: '12px',
      border: 'rgba(255, 17, 51, 0.2) 1px',
      boxShadow: 'inset 0 0 32px rgba(0,0,0,0.6), 0 0 32px rgba(255,17,51,0.1)'
    }}>
      {agents.map(agent => (
        <div key={agent} style={{ display: 'flex', justifyContent: 'center' }}>
          <AgentAvatar agent={agent} size="md" showLabel={true} />
        </div>
      ))}
    </div>
  );
