# HTML Module

This module covers the fundamentals of HTML (HyperText Markup Language), the standard markup language for creating web pages.

## 📚 Module Overview

The HTML module focuses on teaching the building blocks of web development, including semantic HTML, document structure, and best practices for creating accessible and well-organized web content.

## 🗂️ Module Structure

```
HTML/
├── README.md                     # This file
├── projects/                      # Individual HTML projects
│   ├── tribute-page/            # Tribute page for Dr. Norman Borlaug
│   ├── personal-portfolio/      # Personal portfolio website
│   └── introduction/             # Introduction to HTML concepts
└── examples/                     # Learning examples and exercises
```

## 📖 Projects

### 1. Tribute Page
A responsive tribute page honoring Dr. Norman Borlaug, the father of the Green Revolution.

**Features:**
- Semantic HTML5 structure
- Responsive design
- Image with captions
- Timeline of life events
- Quote section
- External references

**Location:** `projects/tribute-page/`

**View:** Open `projects/tribute-page/index.html` in your browser

### 2. Personal Portfolio
A personal portfolio website showcasing professional information and contact form.

**Features:**
- Responsive layout
- CSS styling
- Contact form
- Experience and education sections
- Hobbies and interests display

**Location:** `projects/personal-portfolio/`

**View:** Open `projects/personal-portfolio/index.html` in your browser

### 3. Introduction
Basic HTML introduction demonstrating fundamental concepts.

**Features:**
- Basic HTML structure
- Document setup
- Simple content display

**Location:** `projects/introduction/`

**View:** Open `projects/introduction/index.html` in your browser

## 🎯 Learning Objectives

By completing this HTML module, you will:

- Understand HTML document structure
- Master semantic HTML elements
- Learn proper heading hierarchy
- Implement links and images
- Create lists and tables
- Use forms for user input
- Apply accessibility best practices
- Understand DOCTYPE and meta tags

## 🛠️ Technologies Covered

- **HTML5 Elements**: `<header>`, `<main>`, `<section>`, `<article>`, `<footer>`
- **Text Elements**: `<h1>`-`<h6>`, `<p>`, `<strong>`, `<em>`, `<blockquote>`
- **Media Elements**: `<img>`, `<figure>`, `<figcaption>`
- **Link Elements**: `<a>`, anchor links
- **List Elements**: `<ul>`, `<ol>`, `<li>`
- **Form Elements**: `<form>`, `<input>`, `<textarea>`, `<button>`
- **Meta Elements**: `<meta>`, viewport settings

## 📝 HTML Best Practices

### Document Structure
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Title</title>
</head>
<body>
    <!-- Content goes here -->
</body>
</html>
```

### Semantic HTML
- Use semantic elements (`<header>`, `<main>`, `<section>`) instead of generic `<div>` elements
- Maintain proper heading hierarchy (h1 → h2 → h3)
- Include alt text for images
- Use appropriate link text

### Accessibility
- Ensure sufficient color contrast
- Provide alt text for images
- Use proper heading structure
- Include ARIA labels when necessary
- Make forms keyboard accessible

## 🚀 How to Use

### Running Projects
1. Navigate to the project directory:
   ```bash
   cd HTML/projects/tribute-page
   ```

2. Open `index.html` in your browser, or use a local server:
   ```bash
   npx serve
   ```

### Code Formatting
The module uses Prettier for consistent code formatting. The configuration is in the root `.prettierrc` file.

## 📚 Resources

- [MDN HTML Documentation](https://developer.mozilla.org/en-US/docs/Web/HTML)
- [HTML5 Boilerplate](https://html5boilerplate.com/)
- [W3C HTML Standards](https://www.w3.org/TR/html5/)
- [WebAIM Accessibility Guidelines](https://webaim.org/)

## 🎯 Next Steps

After completing the HTML module, proceed to:
- **CSS Module**: Learn styling and responsive design
- **JavaScript Module**: Add interactivity to your web pages

## 🤝 Contributing

To add new examples or improve existing projects:
1. Create a new folder in `projects/` or `examples/`
2. Follow the existing project structure
3. Include a README.md file
4. Ensure code follows formatting standards

## 📞 Support

For module-specific questions, refer to individual project README files or the main course documentation.

---

**Continue your web development journey! 🚀**
