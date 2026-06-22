'use client';

const agentConfigs: Record<string, {
  emoji: string;
  name: string;
  color: string;
  darkColor: string;
  description: string;
  icon: string;
}> = {
  finch: {
    emoji: '💰',
    name: 'Finch',
    color: '#8833ff',
    darkColor: '#4a1a80',
    description: 'Financial Guardian',
    icon: '🖤'
  },
  scout: {
    emoji: '📖',
    name: 'Scout',
    color: '#003366',
    darkColor: '#001a33',
    description: 'Research Oracle',
    icon: '🖤'
  },
  pulse: {
    emoji: '📊',
    name: 'Pulse',
    color: '#884400',
    darkColor: '#442200',
    description: 'Performance Seer',
    icon: '🖤'
  },
  psyche: {
    emoji: '🧠',
    name: 'Psyche',
    color: '#cc0033',
    darkColor: '#660019',
    description: 'Orchestrator Prime',
    icon: '🖤'
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
    sm: { width: '40px', height: '40px', fontSize: '18px', fontSize2: '10px' },
    md: { width: '60px', height: '60px', fontSize: '28px', fontSize2: '12px' },
    lg: { width: '100px', height: '100px', fontSize: '48px', fontSize2: '14px' }
  };

  const sz = sizeMap[size];

  const statusDot = {
    idle: { bg: '#444444', glow: 'none' },
    working: { bg: '#8833ff', glow: '0 0 12px #8833ff' },
    awaiting_approval: { bg: '#cc0033', glow: '0 0 12px #cc0033' }
  }[status];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      {/* Main Avatar */}
      <div
        style={{
          position: 'relative',
          width: sz.width,
          height: sz.height,
          background: `linear-gradient(135deg, ${config.darkColor} 0%, ${config.darkColor}33 100%)`,
          border: `2px solid ${config.color}`,
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: sz.fontSize,
          fontWeight: '700',
          boxShadow: `0 0 16px ${config.color}33, inset 0 0 12px rgba(0,0,0,0.8)`,
          transition: 'all 200ms ease'
        }}
      >
        {/* Dark frame effect */}
        <div style={{
          position: 'absolute',
          inset: '0',
          background: `radial-gradient(circle at 30% 30%, transparent 0%, ${config.darkColor}77 100%)`,
          borderRadius: '6px',
          pointerEvents: 'none'
        }} />
        
        {/* Emoji */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          {config.emoji}
        </div>

        {/* Status Dot */}
        <div
          style={{
            position: 'absolute',
            bottom: '-4px',
            right: '-4px',
            width: '14px',
            height: '14px',
            background: statusDot.bg,
            border: '2px solid #1a1a1a',
            borderRadius: '50%',
            boxShadow: statusDot.glow
          }}
        />

        {/* Pending Badge */}
        {pendingCount > 0 && (
          <div style={{
            position: 'absolute',
            top: '-6px',
            right: '-6px',
            background: '#cc0033',
            color: '#e0e0e0',
            width: '22px',
            height: '22px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: '700',
            boxShadow: '0 0 8px #cc0033'
          }}>
            {pendingCount}
          </div>
        )}
      </div>

      {/* Label (optional) */}
      {showLabel && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: config.color }}>
            {config.name}
          </div>
          <div style={{ fontSize: '10px', color: '#888888', marginTop: '2px' }}>
            {config.description}
          </div>
        </div>
      )}

      {/* Status Label */}
      {status !== 'idle' && (
        <div style={{
          fontSize: '10px',
          color: statusDot.bg === '#444444' ? '#888888' : statusDot.bg,
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          {status === 'working' ? '● Working' : '⚠ Awaiting'}
        </div>
      )}
    </div>
  );
}

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
        width: '28px',
        height: '28px',
        background: `linear-gradient(135deg, ${config.darkColor} 0%, ${config.darkColor}33 100%)`,
        border: `1px solid ${config.color}`,
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        fontWeight: '700',
        boxShadow: `0 0 8px ${config.color}22`,
        cursor: 'pointer',
        transition: 'all 150ms ease'
      }}
      title={config.name}
    >
      {config.emoji}
      {pendingCount > 0 && (
        <div style={{
          position: 'absolute',
          top: '-4px',
          right: '-4px',
          background: '#cc0033',
          color: '#e0e0e0',
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '9px',
          fontWeight: '700',
          boxShadow: '0 0 6px #cc0033'
        }}>
          {pendingCount}
        </div>
      )}
    </div>
  );
}

/* Grid layout helper */
export function AgentAvatarGrid() {
  const agents: Array<keyof typeof agentConfigs> = ['finch', 'scout', 'pulse', 'psyche'];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
      gap: '24px',
      padding: '24px',
      background: 'var(--bg-secondary)',
      borderRadius: '8px',
      border: '1px solid var(--border-secondary)'
    }}>
      {agents.map(agent => (
        <div key={agent} style={{ display: 'flex', justifyContent: 'center' }}>
          <AgentAvatar agent={agent} size="md" showLabel={true} />
        </div>
      ))}
    </div>
  );
}
