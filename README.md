# TnC Tax & Consulting Website

A modern, responsive NextJS + TypeScript website for TnC Tax & Consulting services, featuring a comprehensive content management dashboard and API-ready architecture.

## 🚀 Features

### Public Website
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Modern UI/UX** - Clean, professional design suitable for corporate clients
- **SEO Optimized** - Built with Next.js App Router for optimal performance
- **Multiple Pages**:
  - Home (Hero, Memberships, Mission, Vision, Core Values)
  - Services (Accounting, Tax, Legal, HR)
  - News & Insights
  - Careers
  - Contact

### Content Management Dashboard
- **Admin Interface** - Easy-to-use dashboard for content management
- **Real-time Updates** - Manage all website content from one place
- **Content Types**:
  - Company Information
  - Services Management
  - News Articles
  - Job Openings
  - Contact Inquiries
  - Core Values & Memberships

### Technical Features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Modern styling with utility classes
- **Component Architecture** - Reusable, maintainable components
- **API Ready** - Prepared for backend integration
- **Modern Stack** - Next.js 15, React 18, TypeScript 5

## 🛠️ Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Package Manager**: npm
- **Deployment**: Vercel-ready

## 📁 Project Structure

```
src/
├── app/                    # App Router pages
│   ├── page.tsx           # Home page
│   ├── services/          # Services page
│   ├── news/              # News page
│   ├── careers/           # Careers page
│   ├── contact/           # Contact page
│   ├── dashboard/         # Admin dashboard
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── home/              # Home page components
│   ├── services/          # Services components
│   └── layout/            # Layout components
└── docs/                  # Documentation
    └── API_Documentation.md
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TnC
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🎨 Design System

### Color Palette
- **Primary**: Blue shades for professional appearance
- **Secondary**: Gray shades for text and backgrounds
- **Accent**: Custom colors for highlights

### Components
- **Buttons**: Primary and secondary styles
- **Cards**: Shadow-based design with hover effects
- **Forms**: Clean, accessible form elements
- **Navigation**: Responsive header and footer

### Typography
- **Headings**: Bold, hierarchical font sizes
- **Body**: Readable font sizes with proper line height
- **System Font**: Uses system-ui font stack

## 📊 Dashboard Features

### Overview
- Statistics dashboard
- Quick action buttons
- Recent activity summary

### Content Management
- **Company Information**: Edit mission, vision, contact details
- **Services**: Add, edit, delete service offerings
- **News**: Manage blog posts and news articles
- **Jobs**: Post and manage job openings
- **Contacts**: View and manage contact form submissions

### User Experience
- Intuitive tabbed interface
- Real-time form validation
- Responsive design for all devices

## 🔌 API Integration

The frontend is prepared for backend integration with a complete API specification. See [API Documentation](docs/API_Documentation.md) for:

- Data models and TypeScript interfaces
- REST API endpoints
- Authentication requirements
- Error handling patterns
- File upload specifications

### Key Integration Points
- `/api/company/info` - Company information
- `/api/services` - Services data
- `/api/news` - News articles
- `/api/jobs` - Job openings
- `/api/contact` - Contact form submissions

## 🌐 Pages Overview

### Home Page Sections
1. **Hero Section** - Main banner with call-to-action
2. **Memberships** - AmCham, Italian Azerbaijan Chamber, BCCA
3. **Mission** - Company mission statement with visual icons
4. **Vision** - Company vision with professional imagery
5. **Core Values** - 5 key values with detailed descriptions

### Services Page
- **Tax & Accounting**: Comprehensive financial services
- **Legal Services**: Corporate and compliance law
- **HR Services**: Human resources management
- **Advisory**: Strategic business consulting

### Additional Pages
- **News**: Blog-style layout for articles and insights
- **Careers**: Job listings with detailed descriptions
- **Contact**: Contact form with company information
- **Dashboard**: Admin interface for content management

## 🔧 Customization

### Adding New Pages
1. Create new page in `src/app/[page-name]/page.tsx`
2. Add navigation link in `Header.tsx`
3. Create components in appropriate directories

### Styling Changes
- Modify `tailwind.config.ts` for theme changes
- Update `globals.css` for custom CSS
- Use Tailwind classes for component styling

### Component Development
- Follow TypeScript interfaces
- Use consistent naming conventions
- Implement responsive design patterns

## 🚀 Deployment

### Vercel (Recommended)
1. Connect repository to Vercel
2. Set environment variables if needed
3. Deploy automatically on push

### Other Platforms
- Build: `npm run build`
- Start: `npm start`
- Ensure Node.js 18+ is available

## 📈 Performance

- **Next.js App Router** for optimal loading
- **Image Optimization** with Next.js Image component
- **Code Splitting** automatic with Next.js
- **TypeScript** for better development experience

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For questions or support regarding this website:
- **Email**: info@tnc.az
- **Phone**: +994 XX XXX XX XX

## 📄 License

This project is proprietary software developed for TnC Tax & Consulting.

---

**Built with ❤️ for TnC Tax & Consulting**
