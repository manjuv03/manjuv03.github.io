# manjuv03.github.io

My personal portfolio. Live at **https://manjuv03.github.io**

I'm Manju, an MSc Data Science student at Queen Mary University of London. Before coming to London I spent just over two years at EY, building and validating data pipelines and machine learning models for compliance work, and before that I interned at Amazon and Village Company. I wanted one place where recruiters (and anyone else who's curious) can see what I've worked on, so I built this.

## What's on the site

- About me, and what I'm working on at the moment
- My skills, grouped by area
- Projects, including my two published papers (IEEE Xplore and Springer)
- Work experience at EY, Village Company and Amazon
- Education, certifications and achievements
- My resume, which you can view in the page or download as a PDF
- A small assistant that answers common questions about my background

## How it's built

Plain HTML, CSS and JavaScript. There's no framework and no build step, so GitHub Pages serves the files exactly as they are in this repo.

A few things I enjoyed working on:

- Light and dark themes that follow your system setting, with a toggle in the header
- A slow-moving gradient background, and cards that light up where your cursor is
- A layout that works on everything from a phone to a wide desktop screen
- The assistant matches your question against my profile right in the browser, so it doesn't need a server or an API key

## Project structure

```
index.html            page layout and content
css/style.css         styles, themes and animations
js/main.js            navigation, theme toggle, resume viewer and the assistant
assets/               profile photo, resume PDF and resume preview
favicon.svg           site icon
```

## Running it locally

```bash
git clone https://github.com/manjuv03/manjuv03.github.io.git
cd manjuv03.github.io
python3 -m http.server 8000
```

Then open http://localhost:8000 in your browser.

## Get in touch

- Email: manjuswaroop03@gmail.com
- LinkedIn: [Manju Swaroop V](https://www.linkedin.com/in/manju-swaroop-v)
- GitHub: [@manjuv03](https://github.com/manjuv03)

Feel free to look through the code. If something looks broken, open an issue or send me an email.
