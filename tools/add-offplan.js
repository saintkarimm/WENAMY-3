const fs = require('fs');
const path = require('path');
const { ask, askNumber, askList, askChoice, confirm, close } = require('./lib/prompts');
const { incrementCacheBusters } = require('./lib/cache-buster');
const { generateFunctionBase, checkExists } = require('./lib/validators');

const OFFPLAN_HTML = path.join(__dirname, '..', 'offplan.html');
const EXCHANGE_RATE = 11.01;

const CATEGORIES = [
  'family-homes',
  'townhouses',
  'vacation-homes',
  'duplexes',
  'triplexes',
  'bungalows',
  'villa',
  'mansions',
  'cabins',
  'environmentalists',
  'retirement-homes',
  'add-ons'
];

function buildImageSlides(folder, count, title) {
  const ordinals = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th', '13th', '14th', '15th', '16th', '17th', '18th', '19th', '20th'];
  let slides = '';
  for (let i = 0; i < count; i++) {
    const img = ordinals[i] || `${i + 1}th`;
    const active = i === 0 ? ' active' : '';
    slides += `          <img src="images/offplan/${folder}/${img}.webp" alt="${title} - Image ${i + 1}" class="carousel-slide${active}" onclick="openLightbox(this.src, event)" style="cursor: zoom-in;">\n`;
  }
  return slides;
}

function buildFeaturesList(features) {
  return features.map(f => `            <li>${f}</li>`).join('\n');
}

function buildAmenitiesList(amenities) {
  return amenities.map(a => `            <li>${a}</li>`).join('\n');
}

function buildCard(data) {
  return `      <!-- ${data.title} - ${data.folder} -->
      <article class="offplan-luxury-card scroll-animate" data-category="${data.category}" onclick="try { open${data.funcBaseUpper}Modal(); } catch(e) { console.error('Card click error:', e.message); }" style="cursor: pointer;">
        <div class="offplan-luxury-image">
          <img src="images/offplan/${data.folder}/1st.webp" alt="${data.title}" loading="lazy" decoding="async" width="400" height="300">
        </div>
        <div class="offplan-luxury-content">
          <h3 class="offplan-luxury-name">${data.title}</h3>
          <p class="offplan-luxury-desc" style="font-size: 0.9rem; color: #64748b; margin: 0.75rem 0; line-height: 1.5;">${data.shortDesc}</p>
          <p class="offplan-luxury-location">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            ${data.location}
          </p>
          <div class="offplan-luxury-price" data-usd="${data.usdPrice}">GH₵ ${data.ghsPrice.toLocaleString()}</div>
          <button class="offplan-luxury-btn" onclick="event.stopPropagation(); try { open${data.funcBaseUpper}Modal(); } catch(e) { console.error('Button click error:', e.message); }">View Details</button>
        </div>
      </article>

`;
}

function buildModal(data) {
  const slides = buildImageSlides(data.folder, data.imageCount, data.title);
  const featuresList = buildFeaturesList(data.features);
  const amenitiesHtml = data.amenities.length ? `
        <div class="offplan-modal-highlights">
          <h4>Amenities</h4>
          <ul>
${buildAmenitiesList(data.amenities)}
          </ul>
        </div>
` : '';

  return `  <!-- ${data.title} - ${data.folder} Modal -->
  <div class="offplan-modal" id="${data.modalId}">
    <div class="offplan-modal-overlay" onclick="close${data.funcBaseUpper}Modal()"></div>
    <div class="offplan-modal-content">
      <button class="offplan-modal-close" onclick="close${data.funcBaseUpper}Modal()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
      
      <div class="offplan-modal-carousel">
        <div class="carousel-container" id="${data.carouselId}">
${slides}        </div>
        <button class="carousel-btn carousel-prev" onclick="move${data.funcBaseUpper}Carousel(-1)">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <button class="carousel-btn carousel-next" onclick="move${data.funcBaseUpper}Carousel(1)">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
        <div class="carousel-dots" id="${data.dotsId}"></div>
      </div>
      
      <div class="offplan-modal-details">
        <h2 class="offplan-modal-title">${data.title}</h2>
        <p class="offplan-modal-location">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          ${data.location}
        </p>
        
        <div class="offplan-modal-features">
          <div class="feature-item"><span class="feature-label">Type</span><span class="feature-value">${data.categoryLabel}</span></div>
          <div class="feature-item"><span class="feature-label">Bedrooms</span><span class="feature-value">${data.bedrooms}</span></div>
          <div class="feature-item"><span class="feature-label">Bathrooms</span><span class="feature-value">${data.bathrooms}</span></div>
          <div class="feature-item"><span class="feature-label">Size</span><span class="feature-value">${data.size} sqm</span></div>
          <div class="feature-item"><span class="feature-label">Price</span><span class="feature-value">GH₵ ${data.ghsPrice.toLocaleString()}</span></div>
        </div>
        
        <div class="offplan-modal-description">
          <p>${data.fullDesc}</p>
        </div>
        
        <div class="offplan-modal-highlights">
          <h4>Key Features</h4>
          <ul>
${featuresList}
          </ul>
        </div>
${amenitiesHtml}        
        <div class="offplan-modal-actions">
          <a href="tel:+233243817969" class="offplan-modal-btn secondary">Call Us</a>
        </div>
      </div>
    </div>
  </div>

`;
}

function buildJS(data) {
  return `    // ${data.title} Modal Functions (${data.folder})
    let ${data.varPrefix}CurrentSlide = 0;
    const ${data.varPrefix}Slides = document.querySelectorAll('#${data.carouselId} .carousel-slide');
    const ${data.varPrefix}TotalSlides = ${data.varPrefix}Slides.length;

    function open${data.funcBaseUpper}Modal() {
      document.getElementById('${data.modalId}').classList.add('active');
      document.body.style.overflow = 'hidden';
      create${data.funcBaseUpper}CarouselDots();
      update${data.funcBaseUpper}Carousel();
    }

    function close${data.funcBaseUpper}Modal() {
      document.getElementById('${data.modalId}').classList.remove('active');
      document.body.style.overflow = '';
    }

    function create${data.funcBaseUpper}CarouselDots() {
      const dotsContainer = document.getElementById('${data.dotsId}');
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      for (let i = 0; i < ${data.varPrefix}TotalSlides; i++) {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        dot.onclick = () => goTo${data.funcBaseUpper}Slide(i);
        dotsContainer.appendChild(dot);
      }
    }

    function update${data.funcBaseUpper}Carousel() {
      ${data.varPrefix}Slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === ${data.varPrefix}CurrentSlide);
      });
      const dots = document.querySelectorAll('#${data.dotsId} .carousel-dot');
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === ${data.varPrefix}CurrentSlide);
      });
    }

    function move${data.funcBaseUpper}Carousel(direction) {
      ${data.varPrefix}CurrentSlide = (${data.varPrefix}CurrentSlide + direction + ${data.varPrefix}TotalSlides) % ${data.varPrefix}TotalSlides;
      update${data.funcBaseUpper}Carousel();
    }

    function goTo${data.funcBaseUpper}Slide(index) {
      ${data.varPrefix}CurrentSlide = index;
      update${data.funcBaseUpper}Carousel();
    }

`;
}

function insertAtLineAfter(html, targetText, insertText) {
  const idx = html.indexOf(targetText);
  if (idx === -1) throw new Error(`Target not found: ${targetText.slice(0, 40)}...`);
  const lineEnd = html.indexOf('\n', idx);
  const insertPos = lineEnd !== -1 ? lineEnd + 1 : idx + targetText.length;
  return html.slice(0, insertPos) + insertText + html.slice(insertPos);
}

function insertBeforeTarget(html, targetText, insertText) {
  const idx = html.indexOf(targetText);
  if (idx === -1) throw new Error(`Target not found: ${targetText.slice(0, 40)}...`);
  return html.slice(0, idx) + insertText + html.slice(idx);
}

function insertCard(html, cardHtml) {
  return insertAtLineAfter(html, '    <div class="offplan-luxury-grid">', cardHtml);
}

function insertModal(html, modalHtml) {
  return insertBeforeTarget(html, '<!-- Benefits Section -->', modalHtml);
}

function insertJS(html, jsHtml) {
  return insertBeforeTarget(html, '    // Bungalow 32 Modal Functions', jsHtml);
}

function insertURLParam(html, param, funcBaseUpper) {
  const target = '      // Add WhatsApp buttons to all offplan modals';
  const idx = html.indexOf(target);
  if (idx === -1) throw new Error('URL param target not found');

  // Find the last '}' before the comment (closes the previous else-if in the chain)
  const beforeComment = html.slice(0, idx);
  const lastBraceIdx = beforeComment.lastIndexOf('}');
  if (lastBraceIdx === -1) throw new Error('Could not find closing brace before comment');

  const insertBlock = ` else if (projectParam === '${param}') {\n        setTimeout(() => { open${funcBaseUpper}Modal(); }, 500);\n      }`;

  return html.slice(0, lastBraceIdx + 1) + insertBlock + html.slice(lastBraceIdx + 1);
}

function insertParamMap(html, modalId, param) {
  const regex = /'\w+Modal': '\w+',\r?\n/g;
  const matches = [...html.matchAll(regex)];
  if (!matches.length) throw new Error('projectParamMap entries not found');
  const lastMatch = matches[matches.length - 1];
  const newEntry = `        '${modalId}': '${param}',\n`;
  const pos = lastMatch.index + lastMatch[0].length;
  return html.slice(0, pos) + newEntry + html.slice(pos);
}

function insertEscapeHandler(html, funcBaseUpper) {
  const regex = /close\w+Modal\(\);\r?\n/g;
  const matches = [...html.matchAll(regex)];
  if (!matches.length) throw new Error('Escape handler close calls not found');
  const lastMatch = matches[matches.length - 1];
  const insertText = `          close${funcBaseUpper}Modal();\n`;
  const pos = lastMatch.index + lastMatch[0].length;
  return html.slice(0, pos) + insertText + html.slice(pos);
}

function insertLightboxConst(html, modalId, varPrefix) {
  const regex = /const \w+Modal = document\.getElementById\('\w+Modal'\);\r?\n/g;
  const matches = [...html.matchAll(regex)];
  if (!matches.length) throw new Error('Lightbox const declarations not found');
  const lastMatch = matches[matches.length - 1];
  const insertText = `      const ${varPrefix}Modal = document.getElementById('${modalId}');\n`;
  const pos = lastMatch.index + lastMatch[0].length;
  return html.slice(0, pos) + insertText + html.slice(pos);
}

function insertLightboxCheck(html, varPrefix, funcBaseUpper) {
  const regex = /lightboxCurrentIndex = \w+CurrentSlide;\r?\n/g;
  const matches = [...html.matchAll(regex)];
  if (!matches.length) throw new Error('Lightbox checks not found');
  const lastMatch = matches[matches.length - 1];
  const paramValue = funcBaseUpper.charAt(0).toLowerCase() + funcBaseUpper.slice(1);
  const insertText = `      } else if (${varPrefix}Modal.classList.contains('active')) {\n        lightboxCurrentModal = '${paramValue}';\n        lightboxImages = Array.from(document.querySelectorAll('#${varPrefix}CarouselContainer .carousel-slide')).map(img => img.src);\n        lightboxCurrentIndex = ${varPrefix}CurrentSlide;\n`;
  const pos = lastMatch.index + lastMatch[0].length;
  return html.slice(0, pos) + insertText + html.slice(pos);
}

async function main() {
  const isDryRun = process.argv.includes('--dry-run');

  console.log('=== Add Off-Plan Property ===');
  if (isDryRun) console.log('(DRY RUN - no files will be modified)');

  const title = await ask('Property title', 'New Property');
  const shortDesc = await ask('Short description (for card)');
  const fullDesc = await ask('Full description (for modal)');
  const location = await ask('Location', 'Accra');
  const size = await askNumber('Size in sqm', '300');
  const usdPrice = await askNumber('Price in USD', '150000');
  const category = await askChoice('Category', CATEGORIES);
  const bedrooms = await askNumber('Bedrooms', '3');
  const bathrooms = await askNumber('Bathrooms', '3');
  const folder = await ask('Image folder name (e.g., OFFPLAN49)', 'OFFPLAN49');
  const imageCount = await askNumber('Number of images', '5');
  const features = await askList('Key features (comma-separated)');

  const hasAmenities = await confirm('Does this property have amenities?');
  let amenities = [];
  if (hasAmenities) {
    amenities = await askList('Amenities (comma-separated)');
  }

  const funcBase = generateFunctionBase(title, folder);
  if (!funcBase || !/^[a-z]/.test(funcBase)) {
    console.error('ERROR: Could not generate a valid function base from title and folder.');
    console.error('Please use a title that starts with a letter.');
    close();
    process.exit(1);
  }

  const funcBaseUpper = funcBase.charAt(0).toUpperCase() + funcBase.slice(1);
  const modalId = `${funcBase}Modal`;
  const carouselId = `${funcBase}CarouselContainer`;
  const dotsId = `${funcBase}CarouselDots`;
  const varPrefix = funcBase;
  const param = funcBase.toLowerCase();
  const ghsPrice = Math.round(usdPrice * EXCHANGE_RATE);
  const categoryLabel = category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const data = {
    title, shortDesc, fullDesc, location, size, usdPrice, ghsPrice, category, categoryLabel,
    bedrooms, bathrooms, folder, imageCount, features, amenities,
    funcBase, funcBaseUpper, modalId, carouselId, dotsId, varPrefix, param
  };

  console.log('\n--- Summary ---');
  console.log(`Title: ${title}`);
  console.log(`Folder: ${folder}`);
  console.log(`Modal ID: ${modalId}`);
  console.log(`URL Param: ${param}`);
  console.log(`Price: $${usdPrice.toLocaleString()} (GH₵ ${ghsPrice.toLocaleString()})`);
  console.log(`Images: ${imageCount}`);
  console.log(`Features: ${features.length}`);
  console.log(`Amenities: ${amenities.length}`);
  console.log(`Category: ${category}`);

  const html = fs.readFileSync(OFFPLAN_HTML, 'utf8');
  const issues = checkExists(html, modalId, funcBase);
  if (issues.length) {
    console.log('\nWARNINGS:');
    issues.forEach(i => console.log(`  - ${i}`));
  }

  const proceed = await confirm('\nApply changes?');
  if (!proceed) {
    console.log('Cancelled.');
    close();
    return;
  }

  let newHtml = html;
  const steps = [];

  try {
    newHtml = insertCard(newHtml, buildCard(data));
    steps.push('Card inserted');

    newHtml = insertModal(newHtml, buildModal(data));
    steps.push('Modal inserted');

    newHtml = insertJS(newHtml, buildJS(data));
    steps.push('JS functions inserted');

    newHtml = insertURLParam(newHtml, param, funcBaseUpper);
    steps.push('URL param inserted');

    newHtml = insertParamMap(newHtml, modalId, param);
    steps.push('projectParamMap inserted');

    newHtml = insertEscapeHandler(newHtml, funcBaseUpper);
    steps.push('Escape handler inserted');

    newHtml = insertLightboxConst(newHtml, modalId, varPrefix);
    steps.push('Lightbox const inserted');

    newHtml = insertLightboxCheck(newHtml, varPrefix, funcBaseUpper);
    steps.push('Lightbox check inserted');
  } catch (err) {
    console.error(`Insertion failed: ${err.message}`);
    close();
    process.exit(1);
  }

  if (isDryRun) {
    console.log('\n(DRY RUN) Changes that would be applied:');
    steps.forEach(s => console.log(`  + ${s}`));
    console.log('\nFile NOT modified.');
  } else {
    fs.writeFileSync(OFFPLAN_HTML, newHtml);
    const cbUpdated = incrementCacheBusters(OFFPLAN_HTML);
    console.log('\nChanges applied:');
    steps.forEach(s => console.log(`  + ${s}`));
    if (cbUpdated) console.log('  + Cache busters updated');
    console.log(`\n${OFFPLAN_HTML} updated successfully.`);
  }

  close();
}

main().catch(err => {
  console.error(err);
  close();
  process.exit(1);
});
