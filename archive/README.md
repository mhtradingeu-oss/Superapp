# HAIROTICMEN Editorial Pipeline (Replit Starter)

## 1) Quick Start
1. Create a new **Python** Repl.
2. Upload this project (or unzip it) into the Repl root.
3. Run: `pip install -r requirements.txt`
4. Create `.env` using `.env.example` and add your `OPENAI_API_KEY`.
5. Open `catalog/hairoticmen_document_manifest.csv`, fill `Source_Files` with paths or Drive-mounted paths.
6. Run a test: `python main.py HM-DOC-001 EN`

## 2) Flow
INGEST -> NORMALIZE -> DEDUPE -> REWRITE -> QA -> EXPORT

- **INGEST**: Reads PDF/DOCX/CSV/XLSX and merges text.
- **NORMALIZE**: Unifies whitespace, numbers, dates.
- **DEDUPE**: Embeddings remove near-duplicates.
- **REWRITE**: Calls an OpenAI-compatible API using your `.env`.
- **QA**: Applies rules from `configs/qa_rules.yaml` and `configs/tone.yaml`.
- **EXPORT**: Writes Markdown and DOCX outputs.

## 3) Customize
- Edit voice/claims in `configs/tone.yaml`.
- Add product facts into `catalog/Product_Master.csv`.
- Tweak thresholds in `modules/dedupe/dedupe.py` and rules in `configs/qa_rules.yaml`.
