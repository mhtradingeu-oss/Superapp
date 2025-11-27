from pathlib import Path
from typing import List, Union
import pdfplumber, re, pandas as pd
from docx import Document
from langdetect import detect
from unidecode import unidecode

def read_text_any(path: Union[str, Path]) -> str:
    p = Path(path)
    if not p.exists():
        raise FileNotFoundError(f"File not found: {p}")
    if p.suffix.lower() == '.pdf':
        return read_pdf(p)
    if p.suffix.lower() in ['.docx', '.doc']:
        return read_docx(p)
    if p.suffix.lower() in ['.csv', '.xlsx', '.xls']:
        return read_table(p)
    return p.read_text(encoding='utf-8', errors='ignore')

def read_pdf(p: Path) -> str:
    out = []
    with pdfplumber.open(p) as pdf:
        for page in pdf.pages:
            out.append(page.extract_text() or '')
    return "\n".join(out)

def read_docx(p: Path) -> str:
    doc = Document(str(p))
    return "\n".join([para.text for para in doc.paragraphs])

def read_table(p: Path) -> str:
    if p.suffix.lower()=='.csv':
        df = pd.read_csv(p)
    else:
        df = pd.read_excel(p)
    return df.to_markdown(index=False)

def detect_lang(text: str) -> str:
    try:
        code = detect(text[:1000])
        return code.upper()
    except Exception:
        return 'EN'

def chunk_text(text: str, max_chars: int = 4000) -> List[str]:
    chunks, cur = [], []
    total = 0
    for line in text.splitlines():
        if total + len(line) + 1 > max_chars:
            chunks.append("\n".join(cur))
            cur, total = [], 0
        cur.append(line)
        total += len(line) + 1
    if cur:
        chunks.append("\n".join(cur))
    return chunks
