# Tribute Page Project Guide

Complete guide for understanding and working with the Tribute Page project for Dr. Norman Borlaug.

## 📚 Project Background

### Who was Dr. Norman Borlaug?
Dr. Norman Borlaug (1914-2009) was an American agronomist who led initiatives worldwide that contributed to the extensive increases in agricultural production termed the Green Revolution. He is often called "the father of the Green Revolution" and is credited with saving over a billion lives from starvation.

### Key Achievements
- Developed high-yielding, disease-resistant wheat varieties
- Introduced these varieties to Mexico, India, and Pakistan
- Awarded the Nobel Peace Prize in 1970
- Received the Presidential Medal of Freedom and Congressional Gold Medal
- Saved an estimated 1 billion lives through his work

## 🎯 Project Learning Objectives

### HTML Skills You'll Learn
1. **Semantic HTML Structure**
   - Proper use of semantic elements (`<main>`, `<section>`, `<figure>`, `<figcaption>`)
   - Document structure and hierarchy
   - Accessibility considerations

2. **HTML Elements Mastery**
   - Headings and text formatting
   - Images and figures
   - Lists (ordered and unordered)
   - Blockquotes and citations
   - Links and anchors

3. **Best Practices**
   - DOCTYPE declaration
   - Meta tags for viewport and encoding
   - Alt text for images
   - Proper nesting of elements

### CSS Skills You'll Learn
1. **Layout and Positioning**
   - Centering content
   - Container sizing
   - Responsive spacing

2. **Styling Techniques**
   - Color schemes and gradients
   - Typography and fonts
   - Border and shadow effects
   - Responsive design with media queries

3. **Modern CSS Features**
   - CSS gradients
   - Box shadows
   - Transitions and hover effects
   - Flexbox for layout

## 📖 Step-by-Step Implementation Guide

### Phase 1: HTML Structure

#### 1. Document Setup
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tribute Page For Dr. Norman Borlaug</title>
</head>
<body>
    <!-- Content goes here -->
</body>
</html>
```

#### 2. Main Content Area
```html
<main id="main">
    <h1 id="title">Dr. Norman Borlaug</h1>
    <p>The man who saved a billion lives</p>
</main>
```

#### 3. Image Section
```html
<figure>
    <img src="image-url.jpg" alt="Description of image" />
    <figcaption id="img-caption">
        Caption text explaining the image
    </figcaption>
</figure>
```

#### 4. Timeline Section
```html
<section>
    <h3>Here's a time line of Dr. Borlaug's life:</h3>
    <ul>
        <li><strong>1914</strong> - Event description</li>
        <li><strong>1933</strong> - Another event</li>
        <!-- More timeline items -->
    </ul>
</section>
```

#### 5. Quote Section
```html
<blockquote cite="source-url">
    <p>"Quote text here"</p>
    <cite>-- Attribution</cite>
</blockquote>
```

### Phase 2: CSS Styling

#### 1. Basic Reset and Body Styling
```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #333;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    padding: 20px;
}
```

#### 2. Container Styling
```css
#main {
    max-width: 800px;
    margin: 0 auto;
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    padding: 40px 30px;
}
```

#### 3. Typography
```css
#title {
    text-align: center;
    color: #667eea;
    font-size: 2.5em;
    margin-bottom: 10px;
}
```

#### 4. Responsive Design
```css
@media (max-width: 600px) {
    #main {
        padding: 30px 20px;
    }
    
    #title {
        font-size: 2em;
    }
}
```

## 🔧 Customization Guide

### Changing the Subject
To create a tribute page for a different person:

1. **Update Content**
   - Change the name in `<h1 id="title">`
   - Update the subtitle paragraph
   - Replace the timeline events
   - Update the quote and attribution
   - Change the Wikipedia link

2. **Replace Images**
   - Find an appropriate image
   - Update the `src` attribute
   - Write descriptive alt text
   - Update the caption

3. **Adjust Styling**
   - Change the color scheme in CSS
   - Modify fonts and spacing
   - Adjust container width
   - Update gradient colors

### Color Scheme Customization
```css
/* Primary color */
#title, section h3 {
    color: #your-color;
}

/* Background gradient */
body {
    background: linear-gradient(135deg, #color1 0%, #color2 100%);
}

/* Accent elements */
blockquote {
    border-left: 4px solid #your-accent-color;
}
```

## 🧪 Testing Checklist

### Functionality Testing
- [ ] All links work correctly
- [ ] Images load properly
- [ ] Text is readable on all backgrounds
- [ ] Page scrolls smoothly
- [ ] No console errors

### Responsive Testing
- [ ] Displays correctly on mobile (320px+)
- [ ] Looks good on tablet (768px+)
- [ ] Optimized for desktop (1024px+)
- [ ] Text remains readable at all sizes
- [ ] No horizontal scrolling

### Accessibility Testing
- [ ] Alt text present for all images
- [ ] Proper heading hierarchy (h1 → h2 → h3)
- [ ] Sufficient color contrast (4.5:1 for text)
- [ ] Keyboard navigation works
- [ ] Screen reader friendly

### Browser Compatibility
- [ ] Chrome (latest version)
- [ ] Firefox (latest version)
- [ ] Safari (latest version)
- [ ] Edge (latest version)
- [ ] Mobile browsers

## 📚 Learning Resources

### HTML Resources
- [MDN HTML Elements Reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)
- [Semantic HTML Guide](https://developer.mozilla.org/en-US/docs/Glossary/Semantics)
- [HTML Accessibility Guide](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

### CSS Resources
- [MDN CSS Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference)
- [CSS Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [Flexbox Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)

### Design Resources
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Gradient Generator](https://cssgradient.io/)
- [Font Pairing Guide](https://fonts.google.com/)

## 🎓 Extension Ideas

### Beginner Extensions
1. Add more images to create a gallery
2. Include additional quotes
3. Add a footer with copyright information
4. Create multiple sections for different aspects

### Intermediate Extensions
1. Add smooth scrolling navigation
2. Implement a dark mode toggle
3. Add CSS animations for timeline items
4. Create a printable version

### Advanced Extensions
1. Add JavaScript for interactive features
2. Implement a search function
3. Add social sharing buttons
4. Create multilingual support

## 🐛 Common Issues and Solutions

### Issue: Images Not Loading
**Solution**: Check image URL, ensure proper file path, verify image format

### Issue: Text Not Readable
**Solution**: Improve color contrast, adjust font size, check background

### Issue: Mobile Layout Broken
**Solution**: Review media queries, check container widths, test on actual devices

### Issue: Links Not Working
**Solution**: Verify URL format, check for typos, ensure proper protocol (http/https)

## 📝 Project Requirements Checklist

### HTML Requirements
- [ ] Proper DOCTYPE declaration
- [ ] Language attribute on html tag
- [ ] Meta charset and viewport
- [ ] Semantic HTML elements
- [ ] Proper heading hierarchy
- [ ] Alt text for images
- [ ] Valid HTML structure

### CSS Requirements
- [ ] External stylesheet linked
- [ ] Responsive design implemented
- [ ] Consistent color scheme
- [ ] Readable typography
- [ ] Proper spacing and layout
- [ ] Mobile-first approach

### Content Requirements
- [ ] Accurate biographical information
- [ ] Proper citations for quotes
- [ ] Working external links
- [ ] Grammatically correct text
- [ ] Appropriate image selection

## 🚀 Deployment Guide

### Local Testing
1. Open `index.html` directly in browser
2. Use local server: `npx serve`
3. Test on multiple devices
4. Check browser compatibility

### Online Deployment
1. **GitHub Pages**
   - Create GitHub repository
   - Upload project files
   - Enable GitHub Pages
   - Access via `username.github.io/repo-name`

2. **Netlify**
   - Sign up for Netlify
   - Drag and drop project folder
   - Get instant deployment URL

3. **Vercel**
   - Install Vercel CLI
   - Run `vercel` in project directory
   - Follow deployment prompts

## 📞 Support and Help

### Getting Help
- Check the main project README
- Review HTML module documentation
- Consult learning resources
- Test in browser developer tools

### Common Questions
**Q: How do I change the colors?**
A: Edit the CSS file and modify color values

**Q: Can I add more timeline events?**
A: Yes, add more `<li>` items to the timeline list

**Q: How do I make it responsive?**
A: The CSS already includes media queries for mobile devices

**Q: Where can I find images?**
A: Use free stock photo sites like Unsplash, Pexels, or Pixabay

---

**Happy learning and building! 🌾**
