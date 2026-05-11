const fs = require('fs');
const pdf = require('pdf-parse');

console.log('pdf type:', typeof pdf);
console.log('pdf keys:', Object.keys(pdf));

let dataBuffer = fs.readFileSync('c:\\Users\\ragha\\OneDrive\\Desktop\\TSC-Website\\Purple and Black Bold and Bright Music Presentation_20260418_133627_0000.pdf');

if (typeof pdf === 'function') {
    pdf(dataBuffer).then(function(data) {
        console.log(data.text);
    });
} else if (pdf.default && typeof pdf.default === 'function') {
    pdf.default(dataBuffer).then(function(data) {
        console.log(data.text);
    });
} else {
    console.log('Could not find pdf function');
}
