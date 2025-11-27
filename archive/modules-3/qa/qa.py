import re, yaml, pandas as pd
from typing import Dict, List

def load_yaml(path: str) -> Dict:
    with open(path, 'r', encoding='utf-8') as fp:
        return yaml.safe_load(fp)

def numbers_consistency_check(text: str) -> Dict:
    nums = re.findall(r'\b\d+[\.,]?\d*%?', text)
    return {"id":"numbers_consistency", "ok": True, "detail": f"found_numbers={nums}"}

def banned_phrases_check(text: str, banned: List[str]) -> Dict:
    pattern = r'(' + r'|'.join(map(re.escape,banned)) + r')'
    hit = re.search(pattern, text, flags=re.IGNORECASE)
    return {"id":"banned_claims","ok": not bool(hit),"detail": f"hit={hit.group(0) if hit else None}"}

def require_disclaimer(text: str, disclaimer: str) -> Dict:
    ok = disclaimer.lower() in text.lower()
    return {"id":"mandatory_disclaimer","ok": ok, "detail": "present" if ok else "missing"}

def require_fact_mapping(text: str, product_master_csv: str) -> Dict:
    try:
        df = pd.read_csv(product_master_csv)
        skus = set(df['SKU'].astype(str).tolist())
        hits = [s for s in skus if s in text]
        return {"id":"sku_cnpn_mapping","ok": True, "detail": f"skus_mentioned={hits}"}
    except Exception as e:
        return {"id":"sku_cnpn_mapping","ok": False, "detail": f"error:{e}"}

def run_qa(text: str, qa_rules_path: str, tone_path: str, lang: str = 'EN') -> List[Dict]:
    rules = load_yaml(qa_rules_path)
    tone = load_yaml(tone_path)
    out = []
    out.append(numbers_consistency_check(text))
    banned = tone['claims']['prohibited_keywords']
    out.append(banned_phrases_check(text, banned))
    # Use language-specific disclaimer for validation
    lang_key = lang.lower()[:2]  # 'en', 'ar', 'de'
    disc = tone['claims']['mandatory_disclaimers']['cosmetics'].get(lang_key, 
                tone['claims']['mandatory_disclaimers']['cosmetics']['en'])
    out.append(require_disclaimer(text, disc))
    for c in rules['checks']:
        if c['type'] == 'require_fact_mapping':
            out.append(require_fact_mapping(text, c['file']))
    return out
