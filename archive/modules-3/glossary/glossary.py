import pandas as pd
import re
from pathlib import Path

def apply_glossary(text: str, lang: str = 'EN', glossary_path: str = 'catalog/Glossary.csv') -> str:
    """
    Apply glossary term replacements to text.
    
    This is a mandatory step after rewriting to ensure consistent terminology
    across all documents in the specified language.
    
    Args:
        text: The text to process
        lang: Language code (AR, EN, or DE)
        glossary_path: Path to glossary CSV file
    
    Returns:
        Text with glossary replacements applied
    
    CSV Format:
        Term,AR,EN,DE,Category
        product,منتج,product,Produkt,general
        hair,شعر,hair,Haar,technical
    """
    if not Path(glossary_path).exists():
        print(f"[GLOSSARY] File not found: {glossary_path}, skipping")
        return text
    
    try:
        df = pd.read_csv(glossary_path)
    except Exception as e:
        print(f"[GLOSSARY] Error reading file: {e}")
        return text
    
    lang_col = lang.upper()[:2]
    
    if 'Term' not in df.columns or lang_col not in df.columns:
        print(f"[GLOSSARY] Missing required columns (Term or {lang_col})")
        return text
    
    replacements_made = 0
    
    for _, row in df.iterrows():
        source_term = str(row['Term']).strip()
        target_term = str(row[lang_col]).strip()
        
        if pd.isna(source_term) or pd.isna(target_term):
            continue
        
        if source_term == target_term:
            continue
        
        pattern = r'\b' + re.escape(source_term) + r'\b'
        
        new_text = re.sub(pattern, target_term, text, flags=re.IGNORECASE)
        
        if new_text != text:
            replacements_made += 1
            text = new_text
    
    print(f"[GLOSSARY] Applied {replacements_made} term replacements for {lang}")
    
    return text
