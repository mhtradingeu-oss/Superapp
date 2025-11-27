from typing import List, Dict

def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> List[str]:
    words = text.split()
    chunks = []
    
    for i in range(0, len(words), chunk_size - overlap):
        chunk = ' '.join(words[i:i + chunk_size])
        if chunk:
            chunks.append(chunk)
    
    return chunks

def chunk_with_metadata(
    text: str,
    metadata: Dict,
    chunk_size: int = 500,
    overlap: int = 50
) -> List[Dict]:
    chunks = chunk_text(text, chunk_size, overlap)
    
    return [
        {
            'text': chunk,
            'metadata': {**metadata, 'chunk_id': i}
        }
        for i, chunk in enumerate(chunks)
    ]
