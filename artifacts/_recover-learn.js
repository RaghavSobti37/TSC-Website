const fs = require('fs');
const path = require('path');
const f =
  'C:/Users/ragha/.cursor/projects/c-Users-ragha-OneDrive-Desktop-website-cloner/agent-transcripts/d01cf682-4ecb-42c6-8427-d581a6d2055f/subagents/060f679f-c97d-49e1-9dbc-5d490f4de887.jsonl';
const lines = fs.readFileSync(f, 'utf8').split(/\n/);
for (let i = 0; i < lines.length; i++) {
  const l = lines[i];
  if (!l.includes('learn.css')) continue;
  try {
    const j = JSON.parse(l);
    const c = j.message && j.message.content;
    if (!Array.isArray(c)) continue;
    for (const part of c) {
      if (part.type !== 'tool_use' || !part.input) continue;
      const inp = part.input;
      if (inp.path && String(inp.path).includes('learn.css') && inp.contents) {
        console.log('FOUND Write contents len', inp.contents.length);
        fs.writeFileSync('artifacts/_recovered-learn.css', inp.contents);
      }
      if (
        inp.path &&
        String(inp.path).includes('learn.css') &&
        inp.new_string &&
        inp.new_string.length > 400
      ) {
        console.log('FOUND StrReplace new_string len', inp.new_string.length, 'line', i);
        fs.writeFileSync(
          'artifacts/_recovered-learn-patch-' + i + '.txt',
          inp.new_string
        );
      }
    }
  } catch (e) {
    // ignore
  }
}
console.log('done');
