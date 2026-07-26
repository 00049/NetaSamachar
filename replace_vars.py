import re

with open('app/globals.css', 'r') as f:
    content = f.read()

replacements = {
    '--color-bg-base': '--bg-base',
    '--color-bg-subtle': '--bg-base',  # mapped to bg-base
    '--color-bg-elevated': '--bg-raised',
    '--color-bg-surface': '--bg-raised',
    
    '--color-border': '--border-subtle',
    '--color-border-mid': '--border-default',
    '--color-border-subtle': '--border-subtle',

    '--color-text-main': '--text-primary',
    '--color-text-secondary': '--text-secondary',
    '--color-text-muted': '--text-tertiary',
    '--color-text-subtle': '--text-tertiary',

    '--color-verified': '--accent-positive',
    '--color-verified-dim': 'rgba(52,211,153,0.12)', # hex equivalent wrapper manually below
    '--color-caution': '--accent-warning',
    '--color-caution-dim': 'rgba(251,191,36,0.12)',
    '--color-risk': '--accent-negative',
    '--color-risk-dim': 'rgba(248,113,113,0.12)',
    '--color-info': '--accent-info',
    '--color-info-dim': 'rgba(96,165,250,0.12)',
}

for old, new in replacements.items():
    if not '-dim' in old:
        content = content.replace(old, new)
    else:
        # replace var(--color-x-dim) with the raw rgba
        content = content.replace(f'var({old})', new)

with open('app/globals.css', 'w') as f:
    f.write(content)
