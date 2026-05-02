const fs = require('fs');
let content = fs.readFileSync('pages/artist-path.tsx', 'utf8');

content = content.replace(
  /<div className="flex items-center gap-3 sm:gap-4 mb-2">\s*<span className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-pumpkin text-cream flex items-center justify-center text-lg sm:text-xl font-bold shrink-0 font-signika shadow-lg">\s*(\d+)\s*<\/span>\s*<h3 className="text-2xl sm:text-3xl font-bold text-cream font-alan-sans">\s*([\s\S]+?)\s*<\/h3>\s*<\/div>/g,
  `<div className="flex items-center gap-3 sm:gap-4 mb-2">
                      <span className="w-7 h-7 min-[380px]:w-8 min-[380px]:h-8 sm:w-10 sm:h-10 rounded-full bg-pumpkin text-cream flex items-center justify-center text-base sm:text-xl font-bold shrink-0 font-signika shadow-lg">
                        $1
                      </span>
                      <h3 className="text-lg min-[380px]:text-xl sm:text-2xl md:text-3xl font-bold text-cream font-alan-sans leading-tight">
                        $2
                      </h3>
                    </div>`
);

fs.writeFileSync('pages/artist-path.tsx', content);
