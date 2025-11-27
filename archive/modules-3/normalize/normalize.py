import re
from datetime import datetime
from unidecode import unidecode

def normalize_text(s: str) -> str:
    # unify whitespace
    s = re.sub(r'[ \t]+', ' ', s)
    s = re.sub(r'\n{3,}', '\n\n', s)
    # unify punctuation spacing
    s = re.sub(r'\s+([,;:.%])', r'\1', s)
    # unify decimals: replace commas between digits with dot
    s = re.sub(r'(?<=\d),(?=\d)', '.', s)
    # unify percent spacing
    s = re.sub(r'\s*%','%', s)
    # normalize dates like DD/MM/YYYY -> YYYY-MM-DD
    s = re.sub(r'\b(\d{1,2})[\-/](\d{1,2})[\-/](\d{2,4})\b', _date_to_iso, s)
    return s.strip()

def _date_to_iso(m):
    d, mth, y = int(m.group(1)), int(m.group(2)), int(m.group(3))
    if y < 100: y += 2000
    try:
        return datetime(y, mth, d).strftime('%Y-%m-%d')
    except Exception:
        return m.group(0)
