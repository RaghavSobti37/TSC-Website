from pathlib import Path
from PyPDF2 import PdfReader

def extract(path):
    print('---', path.name, '---')
    reader = PdfReader(str(path))
    print('pages', len(reader.pages))
    for i, page in enumerate(reader.pages, 1):
        text = page.extract_text() or ''
        print(f'PAGE {i}:')
        print(text[:2500])
        print('======\n')

for path in [Path('YUGM profile .pdf'), Path('Yugm Portfolio.pdf.pdf')]:
    if path.exists():
        extract(path)
    else:
        print('MISSING', path)
