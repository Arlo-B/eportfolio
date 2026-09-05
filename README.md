# Arlo Berry - Professional ePortfolio

Static site for 41055 Professional Experience Review, University of Technology Sydney.

Live at: https://<username>.github.io/<repo>/

## Structure

    index.html          landing page
    experience.html     project gallery
    resume.html         filterable resume
    reflection.html     internship reflection
    application.html    role application
    assets/data.js      all content: 43 entries and 147 captioned photos
    assets/site.js      renders every page from data.js
    assets/site.css     styles
    images/             resized photos used on the site

Every page renders from `assets/data.js`, so editing an entry there updates the
resume, the experience gallery and the landing strip at once.

## Running locally

Open `index.html` in a browser, or serve the folder:

    python -m http.server 8000

then visit http://localhost:8000
