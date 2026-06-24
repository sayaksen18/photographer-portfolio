const fs = require('fs');

// ==== CSS Mod ====
let cssContent = fs.readFileSync('d:/pp/style.css', 'utf8');

const servicesStart = cssContent.indexOf('/* ==================== SERVICES ==================== */');
const testimonialsStart = cssContent.indexOf('/* ==================== TESTIMONIALS ==================== */');
if (servicesStart !== -1 && testimonialsStart !== -1) {
    cssContent = cssContent.substring(0, servicesStart) + cssContent.substring(testimonialsStart);
}

const processStart = cssContent.indexOf('/* ==================== PROCESS ==================== */');
const instagramStart = cssContent.indexOf('/* ==================== INSTAGRAM ==================== */');
if (processStart !== -1 && instagramStart !== -1) {
    cssContent = cssContent.substring(0, processStart) + cssContent.substring(instagramStart);
}

// Fix footer grid
cssContent = cssContent.replace(
    /\.footer__links-group\s*\{\s*display:\s*grid;\s*grid-template-columns:\s*repeat\(3,\s*1fr\);\s*gap:\s*var\(--space-lg\);\s*\}/,
    '.footer__links-group {\n  display: grid;\n  grid-template-columns: repeat(2, 1fr);\n  gap: var(--space-lg);\n}'
);

// Remove mobile process block
cssContent = cssContent.replace(/\s*\.process__step\s*\{\s*gap:\s*var\(--space-md\);\s*\}\s*\.process__line\s*\{\s*left:\s*20px;\s*\}\s*\.process__step-number\s*\{\s*min-width:\s*40px;\s*height:\s*40px;\s*font-size:\s*0\.85rem;\s*\}/, '');

// Remove service grid references in media queries
cssContent = cssContent.replace(/\s*\.services__grid\s*\{\s*grid-template-columns:\s*repeat\(2,\s*1fr\);\s*\}/g, '');
cssContent = cssContent.replace(/\s*\.services__grid\s*\{\s*grid-template-columns:\s*1fr;\s*\}/g, '');

fs.writeFileSync('d:/pp/style.css', cssContent);

// ==== JS Mod ====
let jsContent = fs.readFileSync('d:/pp/script.js', 'utf8');

// remove call
jsContent = jsContent.replace(/\s*this\.setupProcessTimeline\(\);/, '');

// remove function definition
const setupStart = jsContent.indexOf('setupProcessTimeline() {');
if (setupStart !== -1) {
    const nextSetupStart = jsContent.indexOf('setupPortfolioReveal() {');
    if (nextSetupStart !== -1) {
        // the function is between these two, with a comma perhaps. Let's just find the end of setupProcessTimeline
        // It ends just before `setupPortfolioReveal`
        let beforeNext = jsContent.substring(0, nextSetupStart).trimEnd();
        // remove trailing comma if present
        if (beforeNext.endsWith(',')) {
            beforeNext = beforeNext.substring(0, beforeNext.length - 1).trimEnd();
        }
        
        jsContent = jsContent.substring(0, setupStart) + jsContent.substring(nextSetupStart);
    }
}

// remove .service-card from hover targets
jsContent = jsContent.replace(', .service-card', '');

fs.writeFileSync('d:/pp/script.js', jsContent);
