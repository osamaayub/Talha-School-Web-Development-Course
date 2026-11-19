# Web Development Course

A hands-on web development course repository: HTML, CSS and JavaScript fundamentals taught through real, deployable projects, from a first tribute page to an animated portfolio and a car showroom with a finance calculator.

**Live demo:** https://talh-webdevelopmentcourse.netlify.app/

## 🌐 Live Projects (GitHub Pages)

Every push to `main` is published automatically (see [Deployment](#-deployment)). Base URL:
`https://osamaayub.github.io/Talha-School-Web-Development-Course/`

| Project | Path | What it shows |
| --- | --- | --- |
| 🚗 **Car Showroom** | [`/CSS/CarWebsite/`](https://osamaayub.github.io/Talha-School-Web-Development-Course/CSS/CarWebsite/) | Inline-SVG cars with live recoloring, filters, finance calculator, test-drive booking |
| 👨‍💻 **Animated Portfolio** | [`/CSS/Portfolio/`](https://osamaayub.github.io/Talha-School-Web-Development-Course/CSS/Portfolio/) | MERN developer portfolio, light/dark themes, scroll reveals, project filter |
| ✨ **CSS Animations** | [`/CSS/animations/`](https://osamaayub.github.io/Talha-School-Web-Development-Course/CSS/animations/) | 12 documented animation examples (keyframes, transitions, 3D, scroll-driven) |
| 🛍️ **Shopping Cards** | [`/CSS/ShopCards/`](https://osamaayub.github.io/Talha-School-Web-Development-Course/CSS/ShopCards/) | Product card grid design (the site root redirects here) |
| 🧭 **Orbit Navbar** | [`/CSS/Navbar/`](https://osamaayub.github.io/Talha-School-Web-Development-Course/CSS/Navbar/) | Responsive navigation with smooth menu close |
| 👗 **StyleHub** | [`/CSS/LandingPage/`](https://osamaayub.github.io/Talha-School-Web-Development-Course/CSS/LandingPage/) | Fashion e-commerce landing page |
| 📦 **Flexbox MasterClass** | [`/CSS/flexbox/`](https://osamaayub.github.io/Talha-School-Web-Development-Course/CSS/flexbox/) | Flexbox layout experiments |

## 🗂️ Project Structure

```
WebDevelopmentCourse/
├── README.md                          # Main project documentation
├── index.html                         # Site root: redirects to CSS/ShopCards/
├── vercel.json                        # Vercel config (serves CSS/ShopCards)
├── netlify.toml                       # Netlify config (publishes CSS/ShopCards)
├── .github/workflows/deploy.yml       # GitHub Pages deployment workflow
├── .prettierrc                        # Code formatting configuration
├── HTML/                              # HTML module
│   ├── README.md                      # HTML module documentation
│   └── projects/
│       ├── introduction/              # Introduction to HTML
│       ├── tribute-page/              # Tribute page for Dr. Norman Borlaug
│       ├── personal-portfolio/        # First (plain HTML) personal portfolio
│       └── ShoeWebsite/               # Multi-page shoe site with form validation
├── CSS/                               # CSS module
│   ├── index.html                     # CSS basics / box model intro
│   ├── styles/                        # Shared intro styles
│   ├── flexbox/                       # Flexbox MasterClass
│   ├── LandingPage/                   # StyleHub fashion landing page (HTML/CSS/JS)
│   ├── Navbar/                        # Orbit responsive navbar (HTML/CSS/JS)
│   ├── ShopCards/                     # Shopping cards design (HTML/CSS/JS)
│   ├── animations/                    # 12 CSS animation examples
│   ├── Portfolio/                     # Animated MERN developer portfolio
│   └── CarWebsite/                    # Velocity Motors car showroom
└── docs/                              # Course documentation
    ├── README.md                      # Documentation overview and guide
    ├── course-notes.md                # Course notes and learning materials
    ├── resources.md                   # External learning resources
    ├── tribute-page-guide.md          # Tribute page project guide
    ├── StyleHub-README.md             # StyleHub project overview
    ├── StyleHub-Technical-Docs.md     # StyleHub technical documentation
    ├── StyleHub-User-Guide.md         # StyleHub user guide
    ├── SneakerHub-README.md           # Shoe website (SneakerHub) documentation
    ├── ebooks/                        # Ebooks and learning materials
    ├── slides/                        # Presentation slides
    └── templates/                     # Templates and reference materials
```

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Edge, Firefox or Safari)
- A code editor (VS Code recommended)
- Node.js (optional, only for a local dev server)

### Run a project locally
1. Clone the repository:
   ```bash
   git clone https://github.com/osamaayub/Talha-School-Web-Development-Course.git
   cd Talha-School-Web-Development-Course
   ```
2. Open any project folder, for example the car showroom:
   ```bash
   cd CSS/CarWebsite
   ```
3. Open `index.html` in your browser, or serve it locally:
   ```bash
   npx serve .
   ```

No build step or dependencies are required: every project is plain HTML, CSS and vanilla JavaScript.

## 📖 Modules

### HTML Module
- **Introduction**: basic HTML structure and concepts
- **Tribute Page**: a semantic, accessible tribute to Dr. Norman Borlaug ([guide](docs/tribute-page-guide.md))
- **Personal Portfolio**: a first, plain-HTML portfolio page
- **Shoe Website**: multi-page sneaker site with sign-in / sign-up forms and client-side validation ([docs](docs/SneakerHub-README.md))

### CSS Module
- **Flexbox MasterClass**: alignment, direction, wrapping and spacing
- **StyleHub Landing Page**: fashion e-commerce landing page ([overview](docs/StyleHub-README.md), [technical docs](docs/StyleHub-Technical-Docs.md), [user guide](docs/StyleHub-User-Guide.md))
- **Orbit Navbar**: responsive navigation with a polished contact section
- **Shopping Cards**: product card grid with badges and hover effects
- **CSS Animations**: `@keyframes`, transitions, 3D transforms, staggered delays, skeleton loaders and scroll-driven animation, each with its code shown
- **Animated Portfolio**: dark and light themes, word-by-word hero reveal, sliding nav indicator, filterable project cards with 3D tilt, validated contact form
- **Car Showroom (Velocity Motors)**: see below

### Featured project: Car Showroom (`CSS/CarWebsite`)
A fictional dealership site built to practice layout, animation and JavaScript state together.

- **Hero**: a drive-in animation, scrolling road, speed lines and spinning wheels; the car recolors automatically or from the swatches
- **Showroom**: six models rendered as inline SVG, filterable by SUV / Sedan / Sport / Electric, each recolorable with a color swatch
- **Finance calculator**: pick a car or enter a price, then adjust down payment, APR and term for the monthly payment, total interest and total cost (handles 0% APR)
- **Test-drive booking**: inline field validation (including a no-past-dates check) and an animated confirmation
- **Quality**: keyboard accessible, responsive down to phone width, respects `prefers-reduced-motion`
- *Brand, models, prices and specs are fictional demo data, and the booking form does not send anything.*

### JavaScript
JavaScript is used throughout the CSS projects (DOM manipulation, events, `IntersectionObserver`, form validation, `localStorage`-backed theme). A dedicated JavaScript module with standalone exercises is planned.

## 🛠️ Technologies Used

- **HTML5**: semantic markup, accessible forms
- **CSS3**: Flexbox, Grid, custom properties, `@keyframes`, transitions, 3D transforms, `prefers-reduced-motion`
- **JavaScript (ES6+)**: DOM APIs, `IntersectionObserver`, `requestAnimationFrame`, event delegation
- **Tooling**: Git and GitHub, GitHub Actions (Pages), Prettier

## 🚢 Deployment

The repository root is deployed three ways:

| Host | Config | Notes |
| --- | --- | --- |
| **GitHub Pages** | [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) | Runs on every push to `main` and publishes the whole repository, so each project is reachable at its folder path. If a fresh fork shows 404, enable *Settings → Pages → Source: GitHub Actions*. |
| **Netlify** | [`netlify.toml`](netlify.toml) | Publishes `CSS/ShopCards` as the site root. |
| **Vercel** | [`vercel.json`](vercel.json) | Rewrites the site root to `CSS/ShopCards`. |

To make a different project the homepage, point the redirect in the root `index.html` (and the paths in `netlify.toml` / `vercel.json`) at its folder.

## 📝 Code Formatting

This project uses Prettier. Configuration lives in `.prettierrc`:
- Tab width: 2 spaces
- Use tabs: false

## 🤝 Contributing

This is a learning project, but contributions are welcome. Feel free to:
- Fix typos or errors
- Improve code structure or accessibility
- Add new examples
- Enhance documentation

## 📚 Learning Resources

- [MDN Web Docs](https://developer.mozilla.org/)
- [freeCodeCamp](https://www.freecodecamp.org/)
- [W3Schools](https://www.w3schools.com/)
- [web.dev Learn](https://web.dev/learn)

## 📄 License

This project is for educational purposes. Feel free to use it for learning and reference.

## 👨‍💻 Author

**Osama Ayub**: MERN stack Software Engineer, Lahore, Pakistan
- GitHub: [@osamaayub](https://github.com/osamaayub)
- Portfolio: https://osama-ayubpersonal.vercel.app/

## 🎯 Learning Outcomes

By working through this repository you will:
- Write semantic, accessible HTML
- Build responsive layouts with Flexbox and Grid
- Create smooth, performant CSS animations and respect reduced-motion settings
- Add interactivity with vanilla JavaScript (filters, calculators, validation, themes)
- Deploy static sites to GitHub Pages, Netlify and Vercel

## 📞 Support

For questions or issues, refer to the module-specific README files in `docs/` or open an issue on GitHub.

---

**Happy Coding! 🚀**
