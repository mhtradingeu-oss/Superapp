import chromadb
from chromadb.config import Settings
import os
from typing import List, Dict, Optional
import hashlib

class VectorStore:
    def __init__(self, persist_directory: str = "export/.cache/chromadb"):
        os.makedirs(persist_directory, exist_ok=True)
        
        self.client = chromadb.Client(Settings(
            persist_directory=persist_directory,
            anonymized_telemetry=False
        ))
        
        self.product_collection = self._get_or_create_collection("product_master")
        self.knowledge_collection = self._get_or_create_collection("knowledge_base")
    
    def _get_or_create_collection(self, name: str):
        try:
            return self.client.get_collection(name)
        except:
            return self.client.create_collection(
                name=name,
                metadata={"hnsw:space": "cosine"}
            )
    
    def add_documents(
        self,
        collection_name: str,
        documents: List[str],
        metadatas: List[Dict],
        ids: Optional[List[str]] = None
    ):
        collection = self.product_collection if collection_name == "product_master" else self.knowledge_collection
        
        if ids is None:
            ids = [hashlib.md5(doc.encode()).hexdigest() for doc in documents]
        
        collection.add(
            documents=documents,
            metadatas=metadatas,
            ids=ids
        )
    
    def query(
        self,
        collection_name: str,
        query_text: str,
        n_results: int = 5,
        where: Optional[Dict] = None
    ) -> Dict:
        collection = self.product_collection if collection_name == "product_master" else self.knowledge_collection
        
        results = collection.query(
            query_texts=[query_text],
            n_results=n_results,
            where=where
        )
        
        return results
    
    def delete_collection(self, collection_name: str):
        try:
            self.client.delete_collection(collection_name)
        except:
            pass
    
    def reset_collection(self, collection_name: str):
        self.delete_collection(collection_name)
        if collection_name == "product_master":
            self.product_collection = self._get_or_create_collection(collection_name)
        else:
            self.knowledge_collection = self._get_or_create_collection(collection_name)
    
    def get_collection_count(self, collection_name: str) -> int:
        collection = self.product_collection if collection_name == "product_master" else self.knowledge_collection
        return collection.count()
