# UI Components Documentation

This directory contains reusable UI components used across the application.

## Components

### PageHero
A gradient hero section with title and description, used at the top of pages.

**Props:**
- `title: string` - Main heading text
- `description: string` - Subtitle/description text
- `variant?: 'gradient' | 'solid'` - Background style (default: 'gradient')

**Usage:**
```tsx
import { PageHero } from '@/components/ui';

<PageHero 
  title="Contact Us"
  description="Get in touch with our experts"
/>
```

---

### Button
A customizable button component with multiple variants and sizes.

**Props:**
- `variant?: 'primary' | 'secondary' | 'outline'` - Button style (default: 'primary')
- `size?: 'sm' | 'md' | 'lg'` - Button size (default: 'md')
- `fullWidth?: boolean` - Make button full width (default: false)
- `disabled?: boolean` - Disable button
- `children: ReactNode` - Button content
- All standard button HTML attributes

**Usage:**
```tsx
import { Button } from '@/components/ui';

<Button variant="primary" size="md" onClick={handleClick}>
  Click Me
</Button>
```

---

### Card
A white card container with shadow and optional hover effect.

**Props:**
- `children: ReactNode` - Card content
- `className?: string` - Additional CSS classes
- `hover?: boolean` - Enable hover shadow effect (default: false)
- `padding?: 'none' | 'sm' | 'md' | 'lg'` - Internal padding (default: 'md')

**Usage:**
```tsx
import { Card } from '@/components/ui';

<Card hover padding="lg">
  <h3>Card Title</h3>
  <p>Card content</p>
</Card>
```

---

### LoadingSpinner
A centered loading spinner with customizable size.

**Props:**
- `size?: 'sm' | 'md' | 'lg'` - Spinner size (default: 'md')
- `className?: string` - Additional CSS classes

**Usage:**
```tsx
import { LoadingSpinner } from '@/components/ui';

{loading && <LoadingSpinner size="lg" />}
```

---

### Alert
A colored alert box for messages (success, error, warning, info).

**Props:**
- `type: 'success' | 'error' | 'warning' | 'info'` - Alert type (required)
- `message: string` - Alert message text (required)
- `className?: string` - Additional CSS classes

**Usage:**
```tsx
import { Alert } from '@/components/ui';

{error && <Alert type="error" message={error} />}
{success && <Alert type="success" message="Operation completed!" />}
```

---

### EmptyState
A centered message for empty states (no data available).

**Props:**
- `message: string` - Message to display (required)
- `className?: string` - Additional CSS classes

**Usage:**
```tsx
import { EmptyState } from '@/components/ui';

{items.length === 0 && <EmptyState message="No items found" />}
```

---

## Import Methods

### Named Import (Recommended)
```tsx
import { PageHero, Button, Card } from '@/components/ui';
```

### Individual Import
```tsx
import PageHero from '@/components/ui/PageHero';
import Button from '@/components/ui/Button';
```

---

## Refactored Pages

The following pages have been refactored to use these UI components:

- ✅ `/news` - News & Insights page
- ✅ `/contact` - Contact Us page  
- ✅ `/careers` - Careers page

### Before & After Example

**Before:**
```tsx
<section className="bg-gradient-to-r from-sky-400 to-sky-500 text-white section-padding">
  <div className="container-max">
    <div className="text-center max-w-4xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-bold mb-6">News & Insights</h1>
      <p className="text-xl md:text-2xl text-sky-100">
        Stay updated with the latest tax, legal, and business insights
      </p>
    </div>
  </div>
</section>
```

**After:**
```tsx
<PageHero 
  title="News & Insights"
  description="Stay updated with the latest tax, legal, and business insights"
/>
```

---

## Benefits

- **Consistency:** Uniform UI across the application
- **Maintainability:** Update once, reflect everywhere
- **Type Safety:** Full TypeScript support
- **Flexibility:** Customizable via props and className
- **Performance:** No unnecessary re-renders
- **Developer Experience:** Clear API, easy to use

---

## Future Enhancements

Potential components to add:
- `Container` - Consistent max-width wrapper
- `SectionHeader` - Section title + description
- `Badge` - Status badges (active, inactive, etc.)
- `Input` - Form input with label
- `Textarea` - Form textarea with label
- `Select` - Dropdown select with label
