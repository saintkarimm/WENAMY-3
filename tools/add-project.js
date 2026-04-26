const fs = require('fs');
const path = require('path');
const { ask, askNumber, askList, askChoice, confirm, close } = require('./lib/prompts');
const { incrementCacheBusters } = require('./lib/cache-buster');
const { toKebabCase, ordinal } = require('./lib/validators');

const PROJECTS_HTML = path.join(__dirname, '..', 'projects.html');
const PROJECTS_DATA = path.join(__dirname, '..', 'js', 'projects-data.js');

function buildProjectsCard(data) {
  const priceAttr = data.price === 'Contact for Pricing' ? 'data-usd="contact"' : '';
  const priceText = data.price === 'Contact for Pricing' ? 'Contact for Pricing' : data.price;
  const imgPrefix = '';

  return `          <!-- ${data.title} -->
          <article class="project-luxury-card" data-category="${data.category}" data-project-id="${data.slug}" data-project-title="${data.title}" data-project-location="${data.location}" data-project-price="${priceText}" data-project-image="${imgPrefix}images/properties/${data.folder}/1st.webp" onclick="window.location.href='project-detail.html#id=${data.slug}'" style="cursor: pointer;">
            <div class="project-luxury-image-wrap">
              <img src="${imgPrefix}images/properties/${data.folder}/1st.webp" alt="${data.title}" loading="lazy" decoding="async" width="400" height="300">
              <span class="project-status-badge ${data.status}">${data.status.charAt(0).toUpperCase() + data.status.slice(1)}</span>
            </div>
            <div class="project-luxury-content">
              <div class="project-luxury-meta">
                <span class="project-luxury-type">${data.type}</span>
                <span class="project-luxury-price" ${priceAttr}>${priceText}</span>
              </div>
              <h3 class="project-luxury-name">${data.title}</h3>
              <div class="project-luxury-location">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                ${data.location}
              </div>
              <div class="project-card-actions">
                <a href="project-detail.html#id=${data.slug}" class="project-luxury-cta">View Details</a>
                <button class="project-save-btn" data-property-id="${data.slug}" aria-label="Save property" onclick="event.stopPropagation()">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="heart-icon">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </button>
              </div>
            </div>
          </article>

`;
}

function buildSubpageCard(data) {
  const priceAttr = data.price === 'Contact for Pricing' ? '' : '';
  const priceText = data.price === 'Contact for Pricing' ? 'Contact for Pricing' : data.price;
  const imgPrefix = '../';
  const ctaClass = data.status === 'completed' ? ' completed' : '';
  const descriptionPara = data.shortDesc ? `              <p class="project-luxury-description">${data.shortDesc}</p>\n` : '';

  return `          <!-- ${data.title} -->
          <article class="project-luxury-card" data-project-id="${data.slug}" onclick="window.location.href='${imgPrefix}project-detail.html#id=${data.slug}'" style="cursor: pointer;">
            <div class="project-luxury-image-wrap">
              <img src="${imgPrefix}images/properties/${data.folder}/1st.webp" alt="${data.title}" width="400" height="300">
              <span class="project-status-badge ${data.status}">${data.status.charAt(0).toUpperCase() + data.status.slice(1)}</span>
            </div>
            <div class="project-luxury-content">
              <div class="project-luxury-meta">
                <span class="project-luxury-type">${data.type}</span>
                <span class="project-luxury-price">${priceText}</span>
              </div>
              <h3 class="project-luxury-name">${data.title}</h3>
              <div class="project-luxury-location">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                ${data.location}
              </div>
${descriptionPara}              <div class="project-card-actions">
                <a href="${imgPrefix}project-detail.html#id=${data.slug}" class="project-luxury-cta${ctaClass}">View Project</a>
                <button class="project-save-btn" data-property-id="${data.slug}" aria-label="Save property" onclick="event.stopPropagation()">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="heart-icon">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </button>
              </div>
            </div>
          </article>

`;
}

function buildProjectsDataEntry(data) {
  const ordinals = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th', '13th', '14th', '15th', '16th', '17th', '18th', '19th', '20th'];
  const images = [];
  for (let i = 0; i < data.imageCount; i++) {
    const img = ordinals[i] || `${i + 1}th`;
    if (img === '1st') continue; // 1st is the card thumbnail, not in detail gallery
    images.push(`      "images/properties/${data.folder}/${img}.webp"`);
  }
  const imagesStr = images.join(',\n');

  const amenitiesStr = data.amenities.length
    ? data.amenities.map(a => `      "${a}"`).join(',\n')
    : '';
  const featuresStr = data.features.length
    ? data.features.map(f => `      "${f}"`).join(',\n')
    : '';

  return `  // ${data.title}
  "${data.slug}": {
    name: "${data.title}",
    location: "${data.location}",
    type: "${data.type}",
    status: "${data.status}",
    price: "${data.price}",
    bedrooms: "${data.bedrooms}",
    bathrooms: "${data.bathrooms}",
    sqft: "${data.sqft}",
    parking: "${data.parking}",
    description: "${data.description}",
    tagline: "${data.tagline}",
    images: [
${imagesStr}
    ],
    amenities: [
${amenitiesStr}
    ],
    features: [
${featuresStr}
    ]
  },`;
}

function insertIntoGrid(html, cardHtml) {
  const target = '<div class="projects-grid">';
  const idx = html.indexOf(target);
  if (idx === -1) throw new Error('projects-grid target not found');
  const lineEnd = html.indexOf('\n', idx);
  const insertPos = lineEnd !== -1 ? lineEnd + 1 : idx + target.length;
  return html.slice(0, insertPos) + cardHtml + html.slice(insertPos);
}

function insertProjectsData(html, entry) {
  const target = /};\r?\n\r?\n\/\/ Export for use in other files/;
  const match = html.match(target);
  if (!match) throw new Error('projects-data closing target not found');

  // Ensure the previous last entry has a trailing comma before inserting the new one
  const beforeMatch = html.slice(0, match.index);
  const trimmed = beforeMatch.trimEnd();
  let fixedBefore = beforeMatch;
  if (!trimmed.endsWith(',')) {
    const insertPos = trimmed.length;
    fixedBefore = trimmed.slice(0, insertPos) + ',' + beforeMatch.slice(insertPos);
  }

  return fixedBefore + entry + '\n' + match[0];
}

async function main() {
  const isDryRun = process.argv.includes('--dry-run');

  console.log('=== Add Project (Completed / Ongoing / Upcoming) ===');
  if (isDryRun) console.log('(DRY RUN - no files will be modified)');

  const pageType = await askChoice('Page type', ['completed', 'ongoing', 'upcoming']);
  const title = await ask('Project title', 'New Project');
  const slug = await ask('Project slug (URL identifier)', toKebabCase(title));
  const location = await ask('Location', 'Accra');
  const type = await ask('Property type', 'House');
  const category = await ask('Category (for filter)', 'houses');
  const price = await ask('Price (e.g., $83,000+ or "Contact for Pricing")', 'Contact for Pricing');
  const bedrooms = await ask('Bedrooms', '3');
  const bathrooms = await ask('Bathrooms', '3');
  const sqft = await ask('Size (sqft)', '2,200');
  const parking = await ask('Parking', '2 Spaces');
  const description = await ask('Full description');
  const tagline = await ask('Short tagline');
  const shortDesc = await ask('Short description (for completed page card, optional)');
  const folder = await ask('Image folder name (e.g., PROJECT 24)', 'PROJECT 24');
  const imageCount = await askNumber('Number of images', '5');
  const amenities = await askList('Amenities (comma-separated)');
  const features = await askList('Features (comma-separated)');

  const status = pageType;
  const subpagePath = path.join(__dirname, '..', 'projects', `${pageType}.html`);

  const data = {
    title, slug, location, type, category, price, bedrooms, bathrooms,
    sqft, parking, description, tagline, shortDesc, folder, imageCount,
    amenities, features, status
  };

  console.log('\n--- Summary ---');
  console.log(`Title: ${title}`);
  console.log(`Slug: ${slug}`);
  console.log(`Type: ${pageType}`);
  console.log(`Folder: ${folder}`);
  console.log(`Images: ${imageCount}`);

  const proceed = await confirm('\nApply changes?');
  if (!proceed) {
    console.log('Cancelled.');
    close();
    return;
  }

  const steps = [];

  try {
    // Update projects.html
    let projectsHtml = fs.readFileSync(PROJECTS_HTML, 'utf8');
    projectsHtml = insertIntoGrid(projectsHtml, buildProjectsCard(data));
    if (!isDryRun) fs.writeFileSync(PROJECTS_HTML, projectsHtml);
    steps.push('Card inserted into projects.html');

    // Update subpage (completed.html or ongoing.html)
    let subpageHtml = fs.readFileSync(subpagePath, 'utf8');
    subpageHtml = insertIntoGrid(subpageHtml, buildSubpageCard(data));
    if (!isDryRun) fs.writeFileSync(subpagePath, subpageHtml);
    steps.push(`Card inserted into projects/${pageType}.html`);

    // Update projects-data.js
    let dataJs = fs.readFileSync(PROJECTS_DATA, 'utf8');
    dataJs = insertProjectsData(dataJs, buildProjectsDataEntry(data));
    if (!isDryRun) fs.writeFileSync(PROJECTS_DATA, dataJs);
    steps.push('Entry inserted into projects-data.js');

    // Cache busters
    if (!isDryRun) {
      const cb1 = incrementCacheBusters(PROJECTS_HTML);
      const cb2 = incrementCacheBusters(subpagePath);
      if (cb1 || cb2) steps.push('Cache busters updated');
    }
  } catch (err) {
    console.error(`Insertion failed: ${err.message}`);
    close();
    process.exit(1);
  }

  if (isDryRun) {
    console.log('\n(DRY RUN) Changes that would be applied:');
    steps.forEach(s => console.log(`  ✓ ${s}`));
    console.log('\nFiles NOT modified.');
  } else {
    console.log('\nChanges applied:');
    steps.forEach(s => console.log(`  ✓ ${s}`));
    console.log('\nDone.');
  }

  close();
}

main().catch(err => {
  console.error(err);
  close();
  process.exit(1);
});
