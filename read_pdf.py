import fitz
import sys

# Set stdout to use UTF-8
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def get_text(pdf_path):
    doc = fitz.open(pdf_path)
    for page in doc:
        print(f"--- PAGE {page.number + 1} ---")
        print(page.get_text())

if __name__ == "__main__":
    if len(sys.argv) > 1:
        get_text(sys.argv[1])
    else:
        print("Usage: python read_pdf.py <path_to_pdf>")
