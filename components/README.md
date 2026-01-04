# Component Structure

This directory contains reusable React components for the application.

## Organization

Components are organized by feature/function:

```
components/
├── intake/              # Intake form components
├── workout/             # Workout display components
├── auth/                # Authentication components
├── ui/                  # Reusable UI components (buttons, inputs, etc.)
└── layout/              # Layout components (header, footer, etc.)
```

## Best Practices

1. **File Naming**: Use PascalCase for component files (e.g., `IntakeForm.tsx`)
2. **One Component Per File**: Keep components focused and maintainable
3. **Props Interface**: Always define TypeScript interfaces for props
4. **Composition**: Prefer composition over complex components
5. **Server vs Client**: Mark client components with `'use client'` directive

## Example Component Structure

```tsx
'use client'

import { useState } from 'react'

interface MyComponentProps {
  title: string
  onSubmit: (data: any) => void
}

export function MyComponent({ title, onSubmit }: MyComponentProps) {
  const [state, setState] = useState('')

  return (
    <div>
      <h2>{title}</h2>
      {/* Component JSX */}
    </div>
  )
}
```
