# SneakerHub - Modern E-commerce Website

A modern, responsive e-commerce website for sneakers with contemporary design, accessibility features, and smooth user interactions.

## 🚀 Project Overview

SneakerHub is a fully responsive web application featuring a modern design system with gradient backgrounds, glassmorphism effects, and premium user interactions. The project focuses on accessibility, performance, and contemporary UI/UX patterns.

## ✨ Key Features

### Design System
- **Modern Gradient Theme**: Purple-blue gradient color scheme (#667eea to #764ba2)
- **Glassmorphism Effects**: Frosted glass UI elements with backdrop blur
- **Smooth Animations**: CSS transitions and cubic-bezier timing functions
- **Responsive Design**: Mobile-first approach with responsive breakpoints
- **Premium Typography**: Optimized font weights and spacing

### User Interface
- **Floating Labels**: Animated form labels with smooth transitions
- **Input Icons**: SVG icons for visual feedback in form fields
- **Password Toggle**: Show/hide password functionality
- **Social Login**: Google and Facebook authentication buttons
- **Modern Buttons**: Pill-shaped buttons with hover effects and shadows

### Accessibility
- **WCAG Compliant**: High contrast ratios for better readability
- **Keyboard Navigation**: Proper focus states and tab order
- **Screen Reader Friendly**: Semantic HTML and ARIA labels
- **Error Handling**: Clear error messages with visual indicators
- **Color Blind Safe**: Color combinations that work for various vision types

## 🛠 Technologies Used

### Frontend
- **HTML5**: Semantic markup and modern features
- **CSS3**: Advanced styling with gradients, animations, and flexbox
- **JavaScript (ES6+)**: Form validation and interactive elements
- **SVG**: Scalable vector graphics for icons

### External Resources
- **Unsplash**: High-quality shoe images via CDN
- **Google Fonts**: Segoe UI (system font stack)

## 📁 Project Structure

```
ShoeWebsite/
├── css/
│   └── index.css          # Main stylesheet with design system
├── js/
│   └── validation.js      # Form validation logic
├── images/                # Image assets (currently using CDN)
├── docs/
│   └── README.md          # Additional documentation
├── SneakerHub-README.md   # Main project documentation
├── index.html             # Homepage with featured shoes
├── signin.html            # Sign in authentication page
└── signup.html            # Sign up authentication page
```

## 🎨 Design System

### Color Palette
```css
/* Primary Colors */
--primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
--primary-light: #667eea;
--primary-dark: #764ba2;

/* Text Colors */
--text-primary: #1a202c;
--text-secondary: #4a5568;
--text-muted: #9ca3af;

/* Background Colors */
--bg-primary: #f7fafc;
--bg-secondary: #edf2f7;
--bg-glass: rgba(255, 255, 255, 0.98);

/* Error Colors */
--error-primary: #e53e3e;
--error-bg: #fff5f5;
```

### Typography
```css
/* Font Stack */
font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

/* Font Weights */
--font-light: 400;
--font-regular: 500;
--font-medium: 600;
--font-bold: 700;
--font-heavy: 800;
```

### Spacing Scale
```css
--spacing-xs: 0.5rem;
--spacing-sm: 0.75rem;
--spacing-md: 1rem;
--spacing-lg: 1.5rem;
--spacing-xl: 2rem;
--spacing-2xl: 2.5rem;
```

### Border Radius
```css
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-xl: 20px;
--radius-full: 50px;
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (optional, for development)
- Text editor or IDE

### Installation

1. **Clone or Download the Project**
   ```bash
   cd WebDevelopmentCourse/HTML/projects/ShoeWebsite
   ```

2. **Open the Project**
   - Simply open `index.html` in your web browser
   - Or use a local server for development:
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js
     npx serve
     ```

3. **File Organization**
   - CSS files are in the `css/` directory
   - JavaScript files are in the `js/` directory
   - Images are loaded from Unsplash CDN

## 📱 Responsive Breakpoints

```css
/* Mobile First Approach */
/* Default: Mobile styles */
@media (min-width: 768px) {
  /* Tablet styles */
}

@media (min-width: 1024px) {
  /* Desktop styles */
}
```

## ♿ Accessibility Features

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Proper tab order for form fields
- Visible focus states on all interactive elements

### Screen Reader Support
- Semantic HTML structure
- ARIA labels where needed
- Descriptive alt text for images
- Clear error messages

### Color Contrast
- WCAG AA compliant contrast ratios (4.5:1 minimum)
- High contrast for text (dark on light, light on dark)
- Color-blind friendly color combinations

### Form Accessibility
- Clear labels for all form inputs
- Error messages with visual and text indicators
- Required field indicators
- Password visibility toggle

## 🔧 Customization Guide

### Changing Colors
Edit the CSS variables in `css/index.css`:
```css
/* Update primary gradient */
.btn-signup {
    background: linear-gradient(135deg, #your-color-1 0%, #your-color-2 100%);
}
```

### Modifying Typography
```css
/* Change font family */
body {
    font-family: 'Your Font', sans-serif;
}

/* Adjust font sizes */
.auth-box h2 {
    font-size: 2.5rem; /* Adjust as needed */
}
```

### Customizing Animations
```css
/* Adjust animation timing */
.btn-signup {
    transition: all 0.3s ease; /* Change duration and timing */
}

/* Modify hover effects */
.btn-signup:hover {
    transform: translateY(-2px); /* Adjust lift amount */
}
```

## 🌐 Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

### Features Used
- CSS Grid & Flexbox
- CSS Custom Properties
- CSS Backdrop Filter
- CSS Transitions & Animations
- ES6+ JavaScript Features

## 📄 Pages Overview

### Homepage (`index.html`)
- Hero section with call-to-action
- Featured shoes grid with product cards
- Responsive product layout
- Image error handling

### Sign In (`signin.html`)
- Email and password authentication
- Password visibility toggle
- Remember me functionality
- Social login options
- Form validation

### Sign Up (`signup.html`)
- Full registration form
- Password confirmation
- Real-time validation
- Social authentication options
- Password strength indicators

## 🔒 Security Considerations

- **Form Validation**: Client-side validation for user input
- **Password Security**: Password fields with toggle visibility
- **XSS Prevention**: Proper input sanitization
- **HTTPS Ready**: Designed for secure connections

## 🚧 Future Enhancements

### Planned Features
- [ ] Backend integration for user authentication
- [ ] Shopping cart functionality
- [ ] Product filtering and search
- [ ] User profile management
- [ ] Order tracking system
- [ ] Payment gateway integration
- [ ] Admin dashboard
- [ ] Product reviews and ratings

### Performance Optimizations
- [ ] Image lazy loading
- [ ] CSS/JS minification
- [ ] Service worker for offline support
- [ ] CDN integration for static assets

## 📝 Development Notes

### Form Validation
The JavaScript validation in `js/validation.js` provides:
- Real-time input validation
- Password matching verification
- Email format validation
- Custom error messages
- Clear field error states

### Image Handling
- Uses Unsplash CDN for high-quality images
- Fallback system for broken images
- Responsive image sizing
- Alt text for accessibility

### CSS Architecture
- BEM-like naming convention
- Component-based styling
- Mobile-first approach
- CSS custom properties for theming

## 🤝 Contributing

This is a learning project. For improvements:
1. Follow the existing code style
2. Test across different browsers
3. Ensure accessibility compliance
4. Document your changes

## 📄 License

This project is for educational purposes. Images are from Unsplash and follow their usage guidelines.

## 📞 Support

For questions or issues:
- Check the documentation in `docs/`
- Review the code comments
- Test in different browsers

## 🎯 Learning Objectives

This project demonstrates:
- Modern CSS techniques (gradients, glassmorphism, animations)
- Responsive web design principles
- Form validation and user feedback
- Accessibility best practices
- Clean code organization
- Progressive enhancement

---

**Project Name**: SneakerHub  
**Last Updated**: September 14, 2026  
**Version**: 1.0.0  
**Status**: Development/Learning Project