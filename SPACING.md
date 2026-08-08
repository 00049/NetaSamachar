# Spacing Convention

## The 8pt Grid

All spacing values in Neta Samachar follow an **8-point grid** system. The tokens are defined in `app/globals.css` under `@theme`:

| Token | Value | Use for |
|-------|-------|---------|
| `--spacing-1` | 4px | Micro gaps (icon + label, badge padding) |
| `--spacing-2` | 8px | Tight gaps (related elements) |
| `--spacing-3` | 12px | Default input padding, compact gaps |
| `--spacing-4` | 16px | Standard element padding |
| `--spacing-5` | 24px | Card internal padding |
| `--spacing-6` | 32px | Section sub-spacing |
| `--spacing-7` | 40px | Section padding |
| `--spacing-8` | 48px | Large card padding |
| `--spacing-10` | 64px | Section separation |
| `--spacing-12` | 80px | Large section gaps |
| `--spacing-16` | 96px | Page section spacing |
| `--spacing-20` | 128px | Hero/top spacing |
| `--spacing-24` | 160px | Max hero padding |

## Rules

### ✅ DO
- Use Tailwind's built-in spacing scale (`p-4`, `gap-6`, `mb-8`) which maps to multiples of 4px
- For component-level spacing: use Tailwind utilities (`p-6`, `gap-4`, `mt-8`)
- For page-level horizontal padding: use the `.page-px` utility class (responsive 16→24→40→80px)

### ❌ DO NOT
- Add new `p-[Xpx]`, `m-[Xpx]`, or `gap-[Xpx]` arbitrary pixel values
- Use values not on the 4px grid (e.g., `p-[13px]`, `gap-[7px]`)
- Hardcode page padding as fixed `px-[40px]` on all breakpoints — use `.page-px` instead

## ESLint

Until an automated rule is in place, add this comment to PRs that violate the convention:

```
// SPACING: use Tailwind scale or --spacing-* tokens, not arbitrary px values
```

## Border Radius Tokens

| Token | Tailwind class | Value | Use for |
|-------|---------------|-------|---------|
| `--radius-xs` | `rounded-xs` | 8px | Chips, filter buttons, tooltip boxes, small controls |
| `--radius-sm` | `rounded-sm` | 12px | Small cards, icon wrappers |
| `--radius-md` | `rounded-md` | 16px | Standard cards (PoliticianCard, PromiseCard, etc.) |
| `--radius-lg` | `rounded-lg` | 24px | Hero/portrait elements, large panels |
| `--radius-xl` | `rounded-xl` | 16px | (alias for rounded-md, legacy) |

**Do not** use `rounded-[Npx]` arbitrary values — pick the nearest token.

## Page Padding

All top-level page containers should use `.page-px`:

```tsx
<div className="page-px max-w-[1440px] mx-auto">
  {/* content */}
</div>
```

This produces: `16px` (mobile) → `24px` (sm) → `40px` (md) → `80px` (xl)
