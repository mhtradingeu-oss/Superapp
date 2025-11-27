import pandas as pd
import os
from typing import Optional
from .vector_store import VectorStore
from .chunker import chunk_with_metadata

def index_product_master(
    csv_path: str = "catalog/Product_Master.csv",
    vector_store: Optional[VectorStore] = None
) -> int:
    if vector_store is None:
        vector_store = VectorStore()
    
    vector_store.reset_collection("product_master")
    
    if not os.path.exists(csv_path):
        return 0
    
    df = pd.read_csv(csv_path)
    
    documents = []
    metadatas = []
    ids = []
    
    for idx, row in df.iterrows():
        sku = str(row.get('SKU', ''))
        cnpn = str(row.get('CNPN', ''))
        name = str(row.get('Product_Name', ''))
        claims = str(row.get('Allowed_Claims', ''))
        category = str(row.get('Category', ''))
        
        text = f"Product: {name}\nSKU: {sku}\nCNPN: {cnpn}\nCategory: {category}\nClaims: {claims}"
        
        metadata = {
            'source': 'product_master',
            'sku': sku,
            'cnpn': cnpn,
            'product_name': name,
            'category': category
        }
        
        documents.append(text)
        metadatas.append(metadata)
        ids.append(f"product_{idx}")
    
    if documents:
        vector_store.add_documents(
            collection_name="product_master",
            documents=documents,
            metadatas=metadatas,
            ids=ids
        )
    
    return len(documents)

def index_knowledge_base(
    knowledge_dir: str = "knowledge_base",
    vector_store: Optional[VectorStore] = None
) -> int:
    if vector_store is None:
        vector_store = VectorStore()
    
    vector_store.reset_collection("knowledge_base")
    
    if not os.path.exists(knowledge_dir):
        os.makedirs(knowledge_dir, exist_ok=True)
        return 0
    
    documents = []
    metadatas = []
    ids = []
    
    for filename in os.listdir(knowledge_dir):
        if not filename.endswith(('.txt', '.md')):
            continue
        
        filepath = os.path.join(knowledge_dir, filename)
        
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            chunked = chunk_with_metadata(
                content,
                metadata={
                    'source': 'knowledge_base',
                    'filename': filename,
                    'filepath': filepath
                },
                chunk_size=500,
                overlap=50
            )
            
            for i, item in enumerate(chunked):
                documents.append(item['text'])
                metadatas.append(item['metadata'])
                ids.append(f"kb_{filename}_{i}")
        
        except Exception as e:
            print(f"Error indexing {filename}: {e}")
            continue
    
    if documents:
        vector_store.add_documents(
            collection_name="knowledge_base",
            documents=documents,
            metadatas=metadatas,
            ids=ids
        )
    
    return len(documents)
