from typing import List, Tuple
from sentence_transformers import SentenceTransformer
import numpy as np

_model = None
def _load_model():
    global _model
    if _model is None:
        _model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
    return _model

def remove_near_duplicates(chunks: List[str], threshold: float = 0.92) -> List[str]:
    if not chunks:
        return []
    model = _load_model()
    emb = model.encode(chunks, normalize_embeddings=True)
    keep = []
    used = set()
    for i in range(len(chunks)):
        if i in used: 
            continue
        keep.append(chunks[i])
        for j in range(i+1, len(chunks)):
            if j in used: 
                continue
            sim = float(np.dot(emb[i], emb[j]))
            if sim >= threshold:
                used.add(j)
    return keep
