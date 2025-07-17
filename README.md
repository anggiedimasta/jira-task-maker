# Jira Task Maker

A modern, user-friendly web application for creating well-structured Jira tasks with professional formatting and templates.

## Features

### 🎯 **Structured Task Creation**
- Step-by-step form wizard for creating comprehensive Jira tasks
- Guided input with helpful descriptions and examples
- Form validation to ensure quality task descriptions

### 📝 **Professional Templates**
- Pre-built templates for common task types:
  - Feature Development
  - Bug Fix
  - UI/UX Improvement
- Quick preset buttons for each form field
- Customizable template system

### 🎨 **Modern UI/UX**
- Beautiful, responsive design built with Nuxt UI
- Progress indicator showing completion status
- Intuitive navigation with back/forward controls
- Professional gradient backgrounds and card layouts

### 📋 **Enhanced Markdown Generation**
- Proper Jira markdown syntax with headers and code blocks
- Gherkin format for acceptance criteria
- Conditional sections (only includes optional fields if provided)
- Copy to clipboard functionality
- Download as markdown file

### ✅ **Quality Assurance**
- Form validation with helpful error messages
- Minimum character requirements for important fields
- Real-time validation feedback
- Progress tracking and completion status

## Tech Stack

- **Framework**: Nuxt 3
- **UI Library**: Nuxt UI (based on Tailwind CSS)
- **Language**: TypeScript
- **Icons**: Heroicons
- **Package Manager**: Bun

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd jira-task-maker
```

2. Install dependencies:
```bash
bun install
```

3. Start the development server:
```bash
bun run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
bun run build
bun run preview
```

## Usage

### Creating a New Task

1. **Objective**: Describe what needs to be accomplished
   - Be specific and clear about the goal
   - Use action-oriented language

2. **Acceptance Criteria**: Define success criteria using Given-When-Then format
   - Given: The context or precondition
   - When: The action or event
   - Then: The expected outcome

3. **Technical Specification**: Provide implementation details
   - Architecture decisions
   - Technology choices
   - Implementation approach

4. **API Specification** (Optional): Define endpoints and data formats
   - Request/response structures
   - Endpoint URLs and methods
   - Data validation rules

5. **UI Specification** (Optional): Describe UI/UX requirements
   - Layout and design notes
   - User interaction patterns
   - Responsive design considerations

6. **Additional Notes** (Optional): Include extra information
   - Dependencies on other tasks
   - Testing requirements
   - Deployment considerations

### Using Templates

1. Click the "Templates" button in the header
2. Choose from available templates:
   - Feature Development
   - Bug Fix
   - UI/UX Improvement
3. Click "Use Template" to load pre-filled content
4. Customize the content as needed

### Quick Presets

Each form field includes quick preset buttons for common content patterns:
- **Objective**: Feature, Bug Fix, Improvement
- **Acceptance Criteria**: Basic Flow, Error Handling
- **Technical Specification**: Frontend, Backend
- **API Specification**: GET Endpoint, POST Endpoint
- **UI Specification**: Form, List/Table
- **Additional Notes**: Dependencies, Testing

### Exporting Tasks

Once you've completed the form:
1. Review the generated Jira markdown
2. Copy to clipboard for immediate use
3. Download as a markdown file for later use
4. Edit the task if needed

## Project Structure

```
jira-task-maker/
├── components/
│   └── FormWizard.vue          # Main form wizard component
├── pages/
│   └── index.vue               # Main application page
├── public/                     # Static assets
├── nuxt.config.ts              # Nuxt configuration
├── package.json                # Dependencies and scripts
└── README.md                   # This file
```

## Customization

### Adding New Templates

To add new task templates, edit the `taskTemplates` array in `pages/index.vue`:

```typescript
{
  name: 'Your Template Name',
  description: 'Description of when to use this template',
  data: {
    objective: 'Your objective text',
    acceptance: 'Your acceptance criteria',
    tech: 'Your technical specification',
    api: 'Your API specification',
    ui: 'Your UI specification',
    notes: 'Your additional notes'
  }
}
```

### Adding New Presets

To add new quick presets, edit the `presets` array in the corresponding step in `components/FormWizard.vue`:

```typescript
presets: [
  {
    label: 'Your Preset Label',
    content: 'Your preset content'
  }
]
```

### Styling

The application uses Tailwind CSS classes and Nuxt UI components. You can customize the styling by:

1. Modifying the CSS classes in the components
2. Updating the gradient backgrounds in the style sections
3. Customizing the Nuxt UI theme in `nuxt.config.ts`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [Nuxt 3](https://nuxt.com/)
- UI components from [Nuxt UI](https://ui.nuxt.com/)
- Icons from [Heroicons](https://heroicons.com/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)

---

**Happy task creating! 🚀**
