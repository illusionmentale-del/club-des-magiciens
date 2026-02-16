# Design System - Club des Magiciens

## Premium Brand Palette

This design system uses a curated set of colors to ensure a consistent "Premium Magic" aesthetic.

**IMPORTANT:** Always use these CSS variables or Tailwind classes instead of hardcoded hex values.

### Backgrounds & Surfaces

| Token | Tailwind Class | CSS Variable | Description |
| :--- | :--- | :--- | :--- |
| **Deepest Black** | `bg-brand-bg` | `--color-brand-bg` | Main background for pages. Deepest black/blue (#050507). |
| **Card Surface** | `bg-brand-card` | `--color-brand-card` | Background for cards and containers (#0F1014). |
| **Lighter Surface** | `bg-brand-surface` | `--color-brand-surface` | Secondary elements, headers, or active states (#1E293B). |

### Borders

| Token | Tailwind Class | CSS Variable | Description |
| :--- | :--- | :--- | :--- |
| **Subtle Border** | `border-brand-border` | `--color-brand-border` | Default border for cards and dividers (White/10%). |

### Typography

| Token | Tailwind Class | CSS Variable | Description |
| :--- | :--- | :--- | :--- |
| **Primary Text** | `text-brand-text` | `--color-brand-text` | High emphasis text (Slate 50). |
| **Muted Text** | `text-brand-text-muted` | `--color-brand-text-muted` | Medium emphasis, descriptions (Slate 400). |

### Accents (Magic Colors)

| Token | Tailwind Class | CSS Variable | Description |
| :--- | :--- | :--- | :--- |
| **Electric Blue** | `text-brand-blue` / `bg-brand-blue` | `--color-brand-blue` | Primary action or highlight. |
| **Royal Purple** | `text-brand-purple` / `bg-brand-purple` | `--color-brand-purple` | Thematic magic accent. |
| **Premium Gold** | `text-brand-gold` / `bg-brand-gold` | `--color-brand-gold` | Luxury/Premium highlights. |

### Status

| Token | Tailwind Class | CSS Variable | Description |
| :--- | :--- | :--- | :--- |
| **Success** | `text-brand-success` / `bg-brand-success` | `--color-brand-success` | Success messages, "Purchased" states. |
| **Error** | `text-brand-error` / `bg-brand-error` | `--color-brand-error` | Error messages, destructive actions. |

---

## Usage Examples

### Card Component
```tsx
<div className="bg-brand-card border border-brand-border rounded-xl p-6">
  <h2 className="text-brand-text font-bold">Title</h2>
  <p className="text-brand-text-muted">Description goes here.</p>
</div>
```

### Primary Button
```tsx
<button className="bg-brand-purple text-white hover:bg-brand-purple/90 ...">
  Action
</button>
```
