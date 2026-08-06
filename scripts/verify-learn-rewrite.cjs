const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..', 'public');
const comps = fs.readFileSync(path.join(root, 'js', 'tsc-components.js'), 'utf8');
const heart = fs.readFileSync(path.join(root, 'pages', 'the-heart-of-composition.html'), 'utf8');
const learn = fs.readFileSync(path.join(root, 'pages', 'learn-with-tsc.html'), 'utf8');
console.log({
  aliasMap: comps.includes("'/learn-with-tsc': '/academy'"),
  navCourses: comps.includes("'/academy#courses'"),
  compsHrefLearn: (comps.match(/href="\/learn-with-tsc"/g) || []).length,
  heartHrefLearn: (heart.match(/href="\/learn-with-tsc"/g) || []).length,
  heartBlank31: (heart.match(/blank-3-1/g) || []).length,
  learnRedirect: /learn-with-tsc/i.test(learn.slice(0, 500)),
});
