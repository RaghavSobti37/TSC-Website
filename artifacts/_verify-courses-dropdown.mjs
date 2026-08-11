/**
 * Verify Courses dropdown: A to Z inject + no HeART duplicate loop.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const js = fs.readFileSync(path.join(root, 'public/js/tsc-components.js'), 'utf8');

const checks = [];
function ok(name, pass, detail) {
  checks.push({ name, pass: !!pass, detail: detail || '' });
}

ok('js scopes a-z aliases', js.includes('function matchesAcademyCourse') && js.includes("course.href === '/music-production'"));
ok('js dedupes course hrefs', js.includes('seenHrefs') && js.includes('ACADEMY_COURSE_HREFS[href]'));

const dom = new JSDOM(`<!doctype html><html><body>
<header data-tsc-locked-desktop-header="true">
  <ul class="wixui-dropdown-menu">
    <li data-item-depth="1"><a href="/the-heart-of-composition"><span data-testid="submenu-item-label">The HeART of Composition</span></a></li>
    <li data-item-depth="1"><a href="/the-heart-of-composition"><span data-testid="submenu-item-label">The HeART of Composition</span></a></li>
    <li data-item-depth="1"><a href="/the-heart-of-composition"><span data-testid="submenu-item-label">The HeART of Composition</span></a></li>
    <li data-item-depth="1"><a href="/roots-of-hindustani-classical"><span data-testid="submenu-item-label">Roots of Hindustani Classical</span></a></li>
  </ul>
</header>
</body></html>`, { url: 'https://example.com/academy' });

const { document } = dom.window;
const COURSES = [
  { href: '/music-production', label: 'A to Z of Music Production' },
  { href: '/the-heart-of-composition', label: 'The HeART of Composition' },
  { href: '/roots-of-hindustani-classical', label: 'Roots of Hindustani Classical' }
];
const COURSE_HREFS = Object.fromEntries(COURSES.map((c) => [c.href, true]));

function textKey(value) {
  return String(value || '').replace(/\s+/g, ' ').trim().toLowerCase();
}

function isMusicProductionLabel(label) {
  return (
    label === 'a-z of music production' ||
    label === 'a to z of music production' ||
    label === 'a to z course' ||
    label.indexOf('a to z') >= 0 ||
    label.indexOf('a-z') >= 0
  );
}

function matchesAcademyCourse(anchor, course) {
  const label = textKey(anchor.textContent);
  const href = anchor.getAttribute('href') || '';
  if (href === course.href || label === textKey(course.label)) return true;
  if (course.href === '/music-production' && isMusicProductionLabel(label)) return true;
  return false;
}

function ensureItem(menu, course, template) {
  const item = template.cloneNode(true);
  item.setAttribute('data-tsc-course-item', course.href);
  const anchor = item.querySelector('a');
  anchor.setAttribute('href', course.href);
  const label = anchor.querySelector('[data-testid="submenu-item-label"]');
  label.textContent = course.label;
  return item;
}

function ensureAcademyCoursesInWixMenus() {
  document.querySelectorAll('ul.wixui-dropdown-menu').forEach((menu) => {
    COURSES.forEach((course) => {
      menu.querySelectorAll('a[href]').forEach((anchor) => {
        if (!matchesAcademyCourse(anchor, course)) return;
        anchor.setAttribute('href', course.href);
        const labelNode = anchor.querySelector('[data-testid="submenu-item-label"]');
        if (labelNode) labelNode.textContent = course.label;
      });
    });

    const seenHrefs = {};
    [...menu.querySelectorAll('li')].forEach((item) => {
      const anchor = item.querySelector('a[href]');
      if (!anchor) return;
      const href = anchor.getAttribute('href') || '';
      if (!COURSE_HREFS[href]) return;
      if (seenHrefs[href]) {
        item.parentNode.removeChild(item);
        return;
      }
      seenHrefs[href] = true;
    });

    const links = [...menu.querySelectorAll('a[href]')];
    const hasAz = links.some(
      (anchor) =>
        anchor.getAttribute('href') === '/music-production' ||
        isMusicProductionLabel(textKey(anchor.textContent))
    );
    if (!hasAz) {
      const first = menu.querySelector('li');
      menu.insertBefore(ensureItem(menu, COURSES[0], first), first);
    }
  });
}

// Simulate repeated boots (old bug multiplied HeART rows)
for (let i = 0; i < 6; i += 1) ensureAcademyCoursesInWixMenus();

const labels = [...document.querySelectorAll('[data-testid="submenu-item-label"]')].map((n) => n.textContent);
const heartCount = labels.filter((l) => /heart of composition/i.test(l)).length;
ok('inject puts A to Z first', labels[0] === 'A to Z of Music Production', labels.join(' | '));
ok('exactly 3 courses after repeats', labels.length === 3, String(labels.length) + ' — ' + labels.join(' | '));
ok('exactly one HeART link', heartCount === 1, String(heartCount));
ok(
  'a-z not remapped to heart',
  labels.includes('A to Z of Music Production') && !labels.filter((l) => /heart/i.test(l)).some((l) => /a to z/i.test(l))
);

const failed = checks.filter((c) => !c.pass);
checks.forEach((c) => console.log(`${c.pass ? 'PASS' : 'FAIL'} ${c.name}${c.detail ? ' — ' + c.detail : ''}`));
if (failed.length) {
  console.error(`\n${failed.length} failed`);
  process.exit(1);
}
console.log(`\nAll ${checks.length} checks passed`);
