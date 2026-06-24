const fs = require('fs');

let content = fs.readFileSync('d:/pp/index.html', 'utf8');

const filterStart = content.indexOf('<!-- Portfolio Filters -->');
const aboutStart = content.indexOf('<!-- ==================== ABOUT ==================== -->');

if (filterStart !== -1 && aboutStart !== -1) {
  const newPortfolioContent = `<!-- Portfolio Filters -->
        <div class="portfolio__filters reveal-up" role="tablist" aria-label="Portfolio categories">
          <button class="portfolio__filter active" data-filter="all" role="tab" aria-selected="true" id="filter-all">All</button>
          <button class="portfolio__filter" data-filter="street" role="tab" aria-selected="false" id="filter-street">Street</button>
          <button class="portfolio__filter" data-filter="portrait" role="tab" aria-selected="false" id="filter-portrait">Portrait</button>
          <button class="portfolio__filter" data-filter="event" role="tab" aria-selected="false" id="filter-event">Event</button>
          <button class="portfolio__filter" data-filter="travel" role="tab" aria-selected="false" id="filter-travel">Travel</button>
        </div>

        <!-- Portfolio Grid -->
        <div class="portfolio__grid" id="portfolioGrid" role="tabpanel">
          
          <div class="portfolio__item" data-category="street" data-size="large">
            <div class="portfolio__item-img">
              <img src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=75&auto=format"
                   alt="Street photography in Paris"
                   loading="lazy" width="800" height="1000">
            </div>
            <div class="portfolio__item-overlay">
              <span class="portfolio__item-cat">Street</span>
              <h3 class="portfolio__item-title">Parisian Nights</h3>
              <p class="portfolio__item-desc">Paris, France</p>
            </div>
          </div>

          <div class="portfolio__item" data-category="portrait" data-size="small">
            <div class="portfolio__item-img">
              <img src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=75&auto=format"
                   alt="Artistic portrait with dramatic studio lighting"
                   loading="lazy" width="600" height="750">
            </div>
            <div class="portfolio__item-overlay">
              <span class="portfolio__item-cat">Portrait</span>
              <h3 class="portfolio__item-title">Inner Light</h3>
              <p class="portfolio__item-desc">Studio Session</p>
            </div>
          </div>

          <div class="portfolio__item" data-category="event" data-size="small">
            <div class="portfolio__item-img">
              <img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=75&auto=format"
                   alt="Elegant event ceremony in golden hour light"
                   loading="lazy" width="600" height="750">
            </div>
            <div class="portfolio__item-overlay">
              <span class="portfolio__item-cat">Event</span>
              <h3 class="portfolio__item-title">Golden Celebration</h3>
              <p class="portfolio__item-desc">Tuscany, Italy</p>
            </div>
          </div>

          <div class="portfolio__item" data-category="travel" data-size="medium">
            <div class="portfolio__item-img">
              <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=75&auto=format"
                   alt="Breathtaking mountain landscape at sunrise"
                   loading="lazy" width="800" height="600">
            </div>
            <div class="portfolio__item-overlay">
              <span class="portfolio__item-cat">Travel</span>
              <h3 class="portfolio__item-title">Alpine Dawn</h3>
              <p class="portfolio__item-desc">Swiss Alps</p>
            </div>
          </div>

          <div class="portfolio__item" data-category="street" data-size="small">
            <div class="portfolio__item-img">
              <img src="https://images.unsplash.com/photo-1517650862521-d580d5348145?w=600&q=75&auto=format"
                   alt="Urban street scene at night"
                   loading="lazy" width="600" height="750">
            </div>
            <div class="portfolio__item-overlay">
              <span class="portfolio__item-cat">Street</span>
              <h3 class="portfolio__item-title">Neon Shadows</h3>
              <p class="portfolio__item-desc">Tokyo, Japan</p>
            </div>
          </div>

          <div class="portfolio__item" data-category="event" data-size="medium">
            <div class="portfolio__item-img">
              <img src="https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&q=75&auto=format"
                   alt="Event details with flowers"
                   loading="lazy" width="800" height="600">
            </div>
            <div class="portfolio__item-overlay">
              <span class="portfolio__item-cat">Event</span>
              <h3 class="portfolio__item-title">Elegant Details</h3>
              <p class="portfolio__item-desc">Gala Dinner</p>
            </div>
          </div>

          <div class="portfolio__item" data-category="portrait" data-size="small">
            <div class="portfolio__item-img">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=75&auto=format"
                   alt="Natural beauty portrait in soft window light"
                   loading="lazy" width="600" height="750">
            </div>
            <div class="portfolio__item-overlay">
              <span class="portfolio__item-cat">Portrait</span>
              <h3 class="portfolio__item-title">Golden Hour</h3>
              <p class="portfolio__item-desc">Natural Light Series</p>
            </div>
          </div>

          <div class="portfolio__item" data-category="travel" data-size="medium">
            <div class="portfolio__item-img">
              <img src="https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800&q=75&auto=format"
                   alt="Serene lake with mountain reflections at dawn"
                   loading="lazy" width="800" height="600">
            </div>
            <div class="portfolio__item-overlay">
              <span class="portfolio__item-cat">Travel</span>
              <h3 class="portfolio__item-title">Mirror Lake</h3>
              <p class="portfolio__item-desc">Patagonia</p>
            </div>
          </div>

        </div>
      </div>
    </section>

    `;
  content = content.substring(0, filterStart) + newPortfolioContent + content.substring(aboutStart);
  fs.writeFileSync('d:/pp/index.html', content);
} else {
  console.log("Could not find start/end markers");
}
