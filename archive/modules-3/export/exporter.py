from docx import Document
from pathlib import Path

def export_docx(text: str, out_path: str):
    doc = Document()
    for para in text.split('\n\n'):
        doc.add_paragraph(para)
    Path(out_path).parent.mkdir(parents=True, exist_ok=True)
    doc.save(out_path)

def export_md(text: str, out_path: str):
    Path(out_path).parent.mkdir(parents=True, exist_ok=True)
    Path(out_path).write_text(text, encoding='utf-8')
