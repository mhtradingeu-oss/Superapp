import os, json, re
from typing import Dict, Optional, Tuple
import yaml

def _load_yaml(path: str) -> Dict:
    with open(path, 'r', encoding='utf-8') as fp:
        return yaml.safe_load(fp)

def build_system_prompt(tone_cfg: Dict, lang: str) -> str:
    brand = tone_cfg['brand']['name']
    style = tone_cfg['brand']['voice'][lang.lower()]['style']
    dos = tone_cfg['brand']['voice'][lang.lower()]['do']
    donts = tone_cfg['brand']['voice'][lang.lower()]['dont']
    disclaimers = tone_cfg['claims']['mandatory_disclaimers']['cosmetics'][lang.lower()[:2]]
    return f"""You are a senior editorial AI for {brand}.
Write in {lang}. Style: {style}.
DO: {dos}. DON'T: {donts}.
Always include this disclaimer at the end: {disclaimers}.
Keep claims cosmetic, avoid medical promises. Standardize numbers/dates.
"""

def call_llm(prompt: str, text: str, model: str = None, max_retries: int = 3) -> str:
    # Generic OpenAI-compatible REST call with retry logic for rate limits
    import requests
    import time
    
    api_key = os.getenv('OPENAI_API_KEY')
    base = os.getenv('OPENAI_BASE_URL','https://api.openai.com/v1')
    model = model or os.getenv('MODEL_NAME','gpt-4o-mini')
    headers = {'Authorization': f'Bearer {api_key}', 'Content-Type': 'application/json'}
    payload = {
        "model": model,
        "messages": [
            {"role":"system","content": prompt},
            {"role":"user","content": text}
        ],
        "temperature": 0.2
    }
    
    for attempt in range(max_retries):
        try:
            r = requests.post(f"{base}/chat/completions", headers=headers, 
                            data=json.dumps(payload), timeout=120)
            r.raise_for_status()
            data = r.json()
            return data['choices'][0]['message']['content']
        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 429 and attempt < max_retries - 1:
                # Rate limited, wait with exponential backoff + jitter
                import random
                base_wait = (2 ** attempt) * 5  # 5s, 10s, 20s
                jitter = random.uniform(0, 2)  # Add 0-2s random jitter
                wait_time = base_wait + jitter
                print(f"Rate limited, retrying in {wait_time:.1f}s... (attempt {attempt + 1}/{max_retries})")
                time.sleep(wait_time)
            else:
                raise
    
    # Should never reach here, but satisfies type checker
    raise RuntimeError("LLM call failed after all retries")

def rewrite_text(text: str, lang: str, tone_path: str) -> str:
    tone = _load_yaml(tone_path)
    system = build_system_prompt(tone, lang=lang)
    return call_llm(system, text)

def rewrite_with_rag(
    text: str,
    lang: str,
    doc_type: str = "Document",
    tone_path: str = "configs/tone.yaml",
    prompts_path: str = "configs/prompts.yaml",
    use_rag: bool = True
) -> Tuple[str, Optional[Dict]]:
    """
    Rewrite text with RAG facts injection and structured output.
    
    Returns:
        Tuple of (rewritten_text, metadata_json)
    """
    from modules.rag import Retriever
    
    tone = _load_yaml(tone_path)
    prompts = _load_yaml(prompts_path) if os.path.exists(prompts_path) else {}
    
    brand = tone['brand']['name']
    style = tone['brand']['voice'][lang.lower()]['style']
    
    facts_text = ""
    knowledge_text = ""
    citations = []
    
    if use_rag and os.getenv('RAG_ENABLED', 'false').lower() == 'true':
        try:
            retriever = Retriever()
            
            rag_results = retriever.retrieve_all(
                query=text[:1000],
                n_product_facts=3,
                n_knowledge=2
            )
            
            if rag_results['product_facts']:
                facts_list = [f"- {fact['text'][:200]}" for fact in rag_results['product_facts'][:3]]
                facts_text = "\n".join(facts_list)
                citations.extend([
                    {"source": "Product_Master", "reference": fact['citation']}
                    for fact in rag_results['product_facts']
                ])
            
            if rag_results['knowledge']:
                knowledge_list = [f"- {kb['text'][:200]}" for kb in rag_results['knowledge'][:2]]
                knowledge_text = "\n".join(knowledge_list)
                citations.extend([
                    {"source": "Knowledge_Base", "reference": kb['citation']}
                    for kb in rag_results['knowledge']
                ])
        except Exception as e:
            print(f"RAG retrieval failed: {e}, continuing without RAG")
            facts_text = ""
            knowledge_text = ""
    
    prompt_template = prompts.get('user_prompt_rewrite', '')
    
    if prompt_template:
        user_prompt = prompt_template.format(
            language=lang,
            document_type=doc_type,
            tone=style,
            facts=facts_text or "No specific product facts retrieved.",
            knowledge=knowledge_text or "No additional knowledge available.",
            source_text=text
        )
        system_prompt = prompts.get('system_prompt', '').format(
            brand=brand,
            document_type=doc_type,
            language=lang
        )
    else:
        system_prompt = build_system_prompt(tone, lang=lang)
        user_prompt = f"Rewrite this text:\n\n{text}"
    
    response = call_llm(system_prompt, user_prompt)
    
    text_part, metadata = _extract_structured_output(response, citations)
    
    return text_part, metadata

def _extract_structured_output(response: str, citations: list) -> Tuple[str, Optional[Dict]]:
    """
    Extract text and JSON metadata from LLM response.
    Looks for JSON block in response.
    """
    json_pattern = r'```json\s*(\{.*?\})\s*```'
    json_match = re.search(json_pattern, response, re.DOTALL)
    
    if json_match:
        try:
            metadata = json.loads(json_match.group(1))
            text_part = re.sub(json_pattern, '', response, flags=re.DOTALL).strip()
            
            if citations:
                metadata.setdefault('citations', []).extend(citations)
            
            return text_part, metadata
        except json.JSONDecodeError:
            pass
    
    json_start = response.rfind('{')
    json_end = response.rfind('}')
    
    if json_start != -1 and json_end != -1 and json_start < json_end:
        try:
            json_str = response[json_start:json_end+1]
            metadata = json.loads(json_str)
            text_part = response[:json_start].strip()
            
            if citations:
                metadata.setdefault('citations', []).extend(citations)
            
            return text_part, metadata
        except json.JSONDecodeError:
            pass
    
    metadata = {
        "headings": [],
        "claims": [],
        "numbers": [],
        "warnings": [],
        "citations": citations
    }
    
    return response, metadata
