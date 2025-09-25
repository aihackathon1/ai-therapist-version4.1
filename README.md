# AI Therapist Chat – Next.js + TailwindCSS

A calming landing page with a floating AI therapist chat widget. Built with Next.js and Tailwind CSS.

## Features

- 🎨 Clean, modern design with calming pastel gradients
- 📱 Fully responsive (desktop + mobile)
- ⚡ Built with Next.js 14 and Tailwind CSS
- 🎯 Optimized for performance and accessibility
- 🎭 Smooth animations and hover effects
- 🎨 Custom gradient backgrounds and components

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Environment variables:
Create `.env.local` in the project root and add:
```bash
OPENAI_API_KEY=your_openai_api_key_here
```
You can copy the format from `env.example`.

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── globals.css          # Global styles and Tailwind imports
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Home page
├── components/
│   ├── Navigation.tsx       # Navigation bar
│   ├── Hero.tsx            # Hero section
│   ├── Features.tsx        # Features cards
│   ├── Trusted.tsx         # Trusted by section
│   ├── DetailedFeatures.tsx # Detailed features section
│   ├── Community.tsx       # Community cards
│   ├── Stats.tsx           # Statistics section
│   ├── FinalCTA.tsx        # Final call-to-action
│   └── Footer.tsx          # Footer component
├── public/                 # Static assets
├── tailwind.config.js      # Tailwind configuration
├── next.config.js         # Next.js configuration
└── package.json           # Dependencies and scripts
```

## Design System

### Colors
- **AI Purple**: #8B5CF6
- **AI Green**: #10B981  
- **AI Orange**: #F97316
- **AI Red**: #EF4444
- **AI Yellow**: #F59E0B

### Typography
- **Primary Font**: Poppins
- **Secondary Font**: Inter

### Components
- **Buttons**: Rounded pill style with gradients
- **Cards**: Rounded corners with soft shadows
- **Backgrounds**: Soft pastel gradients

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Customization

The design is fully customizable through:
- Tailwind configuration in `tailwind.config.js`
- Component styles in individual component files
- Global styles in `app/globals.css`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is licensed under the MIT License.
