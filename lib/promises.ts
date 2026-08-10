export const getCompletionPercentage = (status: string): number => {
  switch (status) {
    case 'completed':
    case 'operational': return 100;
    case 'mostly_completed': return 75;
    case 'partially_completed': return 50;
    case 'in_progress':
    case 'construction_started':
    case 'implementation_started': return 25;
    case 'tender_issued': return 10;
    case 'planning': return 5;
    case 'delayed': return 25;
    default: return 0;
  }
};

export const getCompletionColor = (percent: number): string => {
  if (percent >= 66) return 'var(--color-accent-positive)';
  if (percent >= 34) return 'var(--color-accent-warning)';
  return 'var(--color-accent-negative)';
};

export const getStatusMeta = (status: string): { color: string; bg: string; border: string; label: string; tailwind: string } => {
  const formattedLabel = status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  switch (status) {
    case 'completed':
    case 'operational':
      return { 
        color: 'var(--color-accent-positive)', 
        bg: 'var(--color-accent-positive-dim)', 
        border: 'rgba(52, 211, 153, 0.2)',
        label: formattedLabel,
        tailwind: 'text-[var(--color-accent-positive)] bg-[var(--color-accent-positive)]/10 border-[var(--color-accent-positive)]/20'
      };
    case 'in_progress':
    case 'construction_started':
    case 'implementation_started':
    case 'tender_issued':
    case 'planning':
      return { 
        color: '#EAB308',
        bg: 'rgba(234, 179, 8, 0.1)', 
        border: 'rgba(234, 179, 8, 0.2)',
        label: formattedLabel,
        tailwind: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20'
      };
    case 'delayed':
    case 'no_verified_progress':
      return { 
        color: '#F97316',
        bg: 'rgba(249, 115, 22, 0.1)', 
        border: 'rgba(249, 115, 22, 0.2)',
        label: formattedLabel,
        tailwind: 'text-orange-500 bg-orange-500/10 border-orange-500/20'
      };
    case 'partially_completed':
    case 'mostly_completed':
      return {
        color: '#3B82F6',
        bg: 'rgba(59, 130, 246, 0.1)',
        border: 'rgba(59, 130, 246, 0.2)',
        label: formattedLabel,
        tailwind: 'text-blue-500 bg-blue-500/10 border-blue-500/20'
      };
    case 'cancelled':
    case 'insufficient_evidence':
    case 'unable_to_verify':
      return { 
        color: 'var(--color-accent-negative)', 
        bg: 'var(--color-accent-negative-dim)', 
        border: 'rgba(248, 113, 113, 0.2)',
        label: formattedLabel,
        tailwind: 'text-[var(--color-accent-negative)] bg-[var(--color-accent-negative)]/10 border-[var(--color-accent-negative)]/20'
      };
    default:
      return { 
        color: '#A1A1AA', 
        bg: 'rgba(255, 255, 255, 0.05)', 
        border: 'rgba(255, 255, 255, 0.1)',
        label: formattedLabel,
        tailwind: 'text-[#A1A1AA] bg-white/5 border-white/10'
      };
  }
};
