/**
 * Agent Avatar Components
 * Unique character designs for each autonomous agent
 */

interface AgentAvatarProps {
  agent: string;
  status?: 'idle' | 'working' | 'awaiting_approval';
  size?: 'sm' | 'md' | 'lg';
}

const AvatarStyles = {
  finch: {
    name: 'Finch',
    emoji: '💰',
    color: '#10b981',
    role: 'Financial Guardian',
    description: 'Precision number-cruncher'
  },
  scout: {
    name: 'Scout',
    emoji: '📖',
    color: '#3b82f6',
    role: 'Topic Researcher',
    description: 'Intelligence gatherer'
  },
  pulse: {
    name: 'Pulse',
    emoji: '📊',
    color: '#f59e0b',
    role: 'Performance Analyst',
    description: 'Metrics & trends'
  },
  psyche: {
    name: 'Psyche',
    emoji: '🧠',
    color: '#a855f7',
    role: 'Head of Operations',
    description: 'Command authority'
  }
};

const StatusIndicators = {
  idle: { dot: '⚪', label: 'Idle', color: '#606070' },
  working: { dot: '🟢', label: 'Working', color: '#00ff88' },
  awaiting_approval: { dot: '🟡', label: 'Awaiting Approval', color: '#ffaa00' }
};

const sizeMap = {
  sm: { size: 40, fontSize: 16 },
  md: { size: 60, fontSize: 28 },
  lg: { size: 100, fontSize: 48 }
};

export function AgentAvatar({ agent, status = 'idle', size = 'md' }: AgentAvatarProps) {
  const agentLower = agent.toLowerCase();
  const style = AvatarStyles[agentLower as keyof typeof AvatarStyles] || AvatarStyles.psyche;
  const dims = sizeMap[size];
  const statusIcon = StatusIndicators[status];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      {/* Avatar Circle */}
      <div
        style={{
          position: 'relative',
          width: dims.size,
          height: dims.size,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${style.color}22, ${style.color}11)`,
          border: `2px solid ${style.color}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: dims.fontSize,
          fontWeight: '700',
          boxShadow: `0 0 20px ${style.color}33, inset 0 0 20px ${style.color}22`,
          transition: 'all 0.3s ease'
        }}
      >
        {style.emoji}

        {/* Status Dot */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: dims.size * 0.3,
            height: dims.size * 0.3,
            background: statusIcon.color,
            borderRadius: '50%',
            border: `2px solid ${style.color}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: dims.size * 0.15,
            boxShadow: `0 0 12px ${statusIcon.color}66`
          }}
        >
          {statusIcon.dot.charAt(0)}
        </div>
      </div>

      {/* Name & Role */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontWeight: '700', color: style.color, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>
          {style.name}
        </div>
        <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
          {style.role}
        </div>
        <div style={{ fontSize: '9px', color: 'var(--text-dim)', marginTop: '2px' }}>
          {statusIcon.label}
        </div>
      </div>
    </div>
  );
}

/**
 * Mini Avatar (for headers, nav, etc.)
 */
export function AgentAvatarMini({ agent, status = 'idle' }: Omit<AgentAvatarProps, 'size'>) {
  const agentLower = agent.toLowerCase();
  const style = AvatarStyles[agentLower as keyof typeof AvatarStyles] || AvatarStyles.psyche;
  const statusIcon = StatusIndicators[status];

  return (
    <div
      style={{
        position: 'relative',
        width: 28,
        height: 28,
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${style.color}33, ${style.color}11)`,
        border: `1.5px solid ${style.color}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        boxShadow: `0 0 12px ${style.color}33`,
        cursor: 'pointer',
        transition: 'all 0.2s ease'
      }}
      title={`${agent} - ${statusIcon.label}`}
    >
      {style.emoji.charAt(0)}
      <div
        style={{
          position: 'absolute',
          bottom: -2,
          right: -2,
          width: 8,
          height: 8,
          background: statusIcon.color,
          borderRadius: '50%',
          border: `1px solid ${style.color}`,
          boxShadow: `0 0 6px ${statusIcon.color}99`
        }}
      />
    </div>
  );
}

/**
 * Agent Grid (displays all agents)
 */
export function AgentGrid({ statuses }: { statuses: Record<string, 'idle' | 'working' | 'awaiting_approval'> }) {
  const agents = ['Finch', 'Scout', 'Pulse', 'Psyche'];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '24px', justifyItems: 'center' }}>
      {agents.map(agent => (
        <AgentAvatar
          key={agent}
          agent={agent}
          status={statuses[agent.toLowerCase()] || 'idle'}
          size="md"
        />
      ))}
    </div>
  );
}
