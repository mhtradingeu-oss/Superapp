from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

def remove_near_duplicates_tfidf(chunks: list, threshold: float = 0.92) -> list:
    """
    TF-IDF based deduplication (lightweight alternative to embeddings).
    
    Uses scikit-learn's TF-IDF vectorizer instead of sentence-transformers,
    making it suitable for Autoscale environments where PyTorch is not available.
    
    Args:
        chunks: List of text chunks to deduplicate
        threshold: Similarity threshold (0-1). Chunks above this are considered duplicates.
    
    Returns:
        List of unique chunks with duplicates removed
    """
    if len(chunks) <= 1:
        return chunks
    
    vectorizer = TfidfVectorizer(
        max_features=1000,
        ngram_range=(1, 2),
        min_df=1,
        max_df=0.95,
        sublinear_tf=True
    )
    
    try:
        tfidf_matrix = vectorizer.fit_transform(chunks)
    except ValueError:
        return chunks
    
    similarities = cosine_similarity(tfidf_matrix)
    
    keep_mask = np.ones(len(chunks), dtype=bool)
    
    for i in range(len(chunks)):
        if not keep_mask[i]:
            continue
        
        for j in range(i + 1, len(chunks)):
            if not keep_mask[j]:
                continue
            
            if similarities[i, j] >= threshold:
                shorter_idx = i if len(chunks[i]) < len(chunks[j]) else j
                keep_mask[shorter_idx] = False
    
    unique_chunks = [chunk for idx, chunk in enumerate(chunks) if keep_mask[idx]]
    
    print(f"[DEDUPE TF-IDF] Reduced from {len(chunks)} to {len(unique_chunks)} chunks ({threshold*100:.0f}% threshold)")
    
    return unique_chunks
