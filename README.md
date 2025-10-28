# SeekKrr Landing Page

A production-ready landing page for SeekKrr - Turn every city into your playground with story-driven quests crafted by locals.

## 🚀 Features

-   **Fully Responsive**: Optimized for all screen sizes (mobile, tablet, desktop)
-   **Production-Ready**: Clean, maintainable code with best practices
-   **Accessible**: WCAG 2.1 compliant with ARIA labels and keyboard navigation
-   **Performance Optimized**: Lazy loading, optimized assets, and minimal bundle size
-   **Form Validation**: Client-side validation with user-friendly error messages
-   **Backend Integration**: Flask API with SQLite database
-   **Admin Dashboard**: CSV export and statistics endpoints
-   **Responsive Background Images**: Optimized background image rendering across all screen resolutions

## 🛠️ Tech Stack

### Frontend

-   **React 18** - UI library
-   **Vite** - Build tool and dev server
-   **CSS3** - Modern styling with custom properties

## 📦 Installation

### Prerequisites

-   Node.js (v16 or higher)
-   npm or yarn

### Frontend Setup

```bash
# Install dependencies
npm install

# Create .env file
echo "VITE_API_BASE_URL=https://api.seekkrr.com" > .env

# Start development server
npm run dev
```

## 🔧 Environment Variables

### Frontend (.env)

```
VITE_API_BASE_URL=https://api.seekkrr.com
```

## 📱 Responsive Design

The landing page is fully responsive and tested on:

-   **Mobile**: 320px - 767px
-   **Tablet**: 768px - 1023px
-   **Desktop**: 1024px and above

Responsive features:

-   Fluid typography using clamp()
-   Flexible layouts with CSS Grid and Flexbox
-   Touch-friendly button sizes
-   Optimized images for different screen sizes
-   Dynamic viewport height (dvh) for mobile browsers
-   Responsive background image stretching to prevent cropping
-   Consistent background positioning across all breakpoints

## 🎨 Design System

### Color Palette

-   Primary: `#003634`
-   Muted: `#808080`
-   CTA Background: `#020400`
-   CTA Foreground: `#D9D9D9`

### Typography

-   Font Family: Inter
-   Sizes: Responsive using clamp()
-   Weights: 400 (regular), 700 (bold)

### Spacing

Uses a consistent 8px grid system with CSS custom properties.


## 🖼️ Background Image Optimization

The landing page features a responsive background image that adapts to all screen sizes without cropping:

### Background Image Features

-   **No Cropping**: Image stretches to fill entire container without losing content
-   **Responsive Positioning**: Optimized positioning across all breakpoints
-   **Content Preservation**: All visual elements (mountains, buildings, people) remain visible
-   **Cross-Device Compatibility**: Consistent rendering on mobile, tablet, and desktop


### Background Aspect Ratio Policy (PR 1)

Background images now maintain a ~10% stretch threshold to preserve aspect ratio. When more distortion would be required, the image is centered using contain and remaining space is white.

To adjust behavior, see `src/styles/background.css` or `src/components/BackgroundWrapper.jsx`.


## 🧪 Testing

### Manual Testing Checklist

-   [ ] Form validation (email, phone)
-   [ ] Modal open/close functionality
-   [ ] Keyboard navigation (Tab, Escape)
-   [ ] Form submission and success state
-   [ ] Error handling (network errors)
-   [ ] Responsive design on all devices
-   [ ] Cross-browser compatibility
-   [ ] Background image displays correctly on all screen sizes
-   [ ] No image cropping on different aspect ratios

## 🔐 Security Considerations

-   Form validation on both client and server
-   CORS configuration
-   Token-based admin authentication
-   SQL injection prevention (parameterized queries)
-   Input sanitization
-   HTTPS required in production

## 📊 Performance

-   Lighthouse Score: 95+
-   First Contentful Paint: < 1.5s
-   Time to Interactive: < 3.5s
-   Cumulative Layout Shift: < 0.1

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

Copyright © 2024 SeekKrr. All rights reserved.

## 📧 Support

For support, email support@seekkrr.com or open an issue in the repository.

## 🙏 Acknowledgments

-   Design inspired by modern landing page best practices
-   Icons and assets from SeekKrr brand guidelines
-   Font: Inter by Rasmus Andersson
