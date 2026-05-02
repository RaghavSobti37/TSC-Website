const fs = require('fs');
let content = fs.readFileSync('pages/artist-path.tsx', 'utf8');

content = content.replace(
  /<h3 className="text-2xl sm:text-3xl font-bold text-cream font-alan-sans mb-1">\s*(\d+)\.\s*([\s\S]+?)\s*<\/h3>/g,
  `<div className="flex items-center gap-3 sm:gap-4 mb-2">
                      <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-pumpkin text-cream flex items-center justify-center text-lg sm:text-xl font-bold shrink-0 font-signika shadow-lg">
                        $1
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-bold text-cream font-alan-sans">
                        $2
                      </h3>
                    </div>`
);

fs.writeFileSync('pages/artist-path.tsx', content);
