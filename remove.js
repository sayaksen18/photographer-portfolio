const fs = require('fs');
let content = fs.readFileSync('d:/pp/index.html', 'utf8');

// Remove nav links
content = content.replace(/\s*<li role="none"><a href="#services" class="nav__link" role="menuitem">Services<\/a><\/li>/g, '');
content = content.replace(/\s*<li role="none"><a href="#process" class="nav__link" role="menuitem">Process<\/a><\/li>/g, '');
content = content.replace(/\s*<li><a href="#services" class="mobile-menu__link">Services<\/a><\/li>/g, '');
content = content.replace(/\s*<li><a href="#process" class="mobile-menu__link">Process<\/a><\/li>/g, '');
content = content.replace(/\s*<li><a href="#services">Services<\/a><\/li>/g, '');

// Remove Services section
const servicesStart = content.indexOf('<!-- ==================== SERVICES ==================== -->');
const testimonialsStart = content.indexOf('<!-- ==================== TESTIMONIALS ==================== -->');
if (servicesStart !== -1 && testimonialsStart !== -1) {
  content = content.substring(0, servicesStart) + content.substring(testimonialsStart);
}

// Remove Process section
const processStart = content.indexOf('<!-- ==================== PROCESS ==================== -->');
const instagramStart = content.indexOf('<!-- ==================== INSTAGRAM ==================== -->');
if (processStart !== -1 && instagramStart !== -1) {
  content = content.substring(0, processStart) + content.substring(instagramStart);
}

// Remove footer services column
const footerServicesStart = content.indexOf('<div class="footer__column">\r\n            <h4 class="footer__column-title">Services</h4>');
if (footerServicesStart === -1) {
    // try with \n
    const altStart = content.indexOf('<div class="footer__column">\n            <h4 class="footer__column-title">Services</h4>');
    if (altStart !== -1) {
        const altEnd = content.indexOf('<div class="footer__column">\n            <h4 class="footer__column-title">Newsletter</h4>');
        content = content.substring(0, altStart) + content.substring(altEnd);
    }
} else {
    const footerNewsletterStart = content.indexOf('<div class="footer__column">\r\n            <h4 class="footer__column-title">Newsletter</h4>');
    content = content.substring(0, footerServicesStart) + content.substring(footerNewsletterStart);
}

fs.writeFileSync('d:/pp/index.html', content);
