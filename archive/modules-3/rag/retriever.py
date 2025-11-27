from typing import List, Dict, Optional
from .vector_store import VectorStore

class Retriever:
    def __init__(self, vector_store: Optional[VectorStore] = None):
        self.vector_store = vector_store or VectorStore()
    
    def retrieve_product_facts(
        self,
        query: str,
        n_results: int = 5,
        sku_filter: Optional[str] = None
    ) -> List[Dict]:
        where = {"sku": sku_filter} if sku_filter else None
        
        results = self.vector_store.query(
            collection_name="product_master",
            query_text=query,
            n_results=n_results,
            where=where
        )
        
        facts = []
        if results['documents'] and len(results['documents']) > 0:
            for i, doc in enumerate(results['documents'][0]):
                metadata = results['metadatas'][0][i] if results['metadatas'] else {}
                distance = results['distances'][0][i] if results['distances'] else None
                
                facts.append({
                    'text': doc,
                    'metadata': metadata,
                    'relevance_score': 1 - distance if distance is not None else 0.0,
                    'source': 'Product_Master',
                    'citation': f"{metadata.get('sku', 'N/A')} - {metadata.get('product_name', 'N/A')}"
                })
        
        return facts
    
    def retrieve_knowledge(
        self,
        query: str,
        n_results: int = 3
    ) -> List[Dict]:
        results = self.vector_store.query(
            collection_name="knowledge_base",
            query_text=query,
            n_results=n_results
        )
        
        knowledge = []
        if results['documents'] and len(results['documents']) > 0:
            for i, doc in enumerate(results['documents'][0]):
                metadata = results['metadatas'][0][i] if results['metadatas'] else {}
                distance = results['distances'][0][i] if results['distances'] else None
                
                knowledge.append({
                    'text': doc,
                    'metadata': metadata,
                    'relevance_score': 1 - distance if distance is not None else 0.0,
                    'source': 'Knowledge_Base',
                    'citation': metadata.get('filename', 'N/A')
                })
        
        return knowledge
    
    def retrieve_all(
        self,
        query: str,
        n_product_facts: int = 3,
        n_knowledge: int = 2
    ) -> Dict[str, List[Dict]]:
        return {
            'product_facts': self.retrieve_product_facts(query, n_product_facts),
            'knowledge': self.retrieve_knowledge(query, n_knowledge)
        }
