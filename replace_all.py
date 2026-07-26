import os

replacements = {
    'var(--color-bg-base)': 'var(--bg-base)',
    'var(--color-bg-subtle)': 'var(--bg-base)',
    'var(--color-bg-elevated)': 'var(--bg-raised)',
    'var(--color-bg-surface)': 'var(--bg-raised)',
    
    'var(--color-border)': 'var(--border-subtle)',
    'var(--color-border-mid)': 'var(--border-default)',
    'var(--color-border-subtle)': 'var(--border-subtle)',

    'var(--color-text-main)': 'var(--text-primary)',
    'var(--color-text-secondary)': 'var(--text-secondary)',
    'var(--color-text-muted)': 'var(--text-tertiary)',
    'var(--color-text-subtle)': 'var(--text-tertiary)',

    'var(--color-verified)': 'var(--accent-positive)',
    'var(--color-caution)': 'var(--accent-warning)',
    'var(--color-risk)': 'var(--accent-negative)',
    'var(--color-info)': 'var(--accent-info)',
}

def process_file(path):
    with open(path, 'r') as f:
        content = f.read()
    
    original = content
    for old, new in replacements.items():
        content = content.replace(old, new)
        
    if original != content:
        with open(path, 'w') as f:
            f.write(content)
        print(f"Updated {path}")

for root, _, files in os.walk('.'):
    if 'node_modules' in root or '.next' in root or '.git' in root:
        continue
    for file in files:
        if file.endswith(('.tsx', '.ts', '.css')):
            process_file(os.path.join(root, file))
