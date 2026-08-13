# AI Signal Pipeline Documentation

The AI Signal Processing Pipeline processes citizen voice transcripts, photos, and text messages.

1. **Tanglish & Tamil Phonetic Parser:**
   - Detects code-switched language patterns ("thanni nikkuthu", "water stagnated near bus stop").
   - Maps local vernacular terms to standardized problem taxonomies.
2. **Computer Vision Image Quality Checker:**
   - Evaluates contrast, exposure, and motion blur.
   - Rejects corrupted or irrelevant uploads.
3. **Structured Entity Extraction:**
   - Uses server-side Gemini 3.6 Flash to output validated JSON schema matching problem category, severity, and landmark location entities.
