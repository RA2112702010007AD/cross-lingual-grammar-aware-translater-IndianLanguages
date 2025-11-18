## Made By Anurag

## ABSTRACT
Cross-Lingual Grammar-Aware Machine Translation for Indian Languages is a rapidly advancing 
field in Natural Language Processing (NLP), aiming to create intelligent translation systems that 
respect the grammatical and syntactic nuances across linguistically diverse languages. In the Indian 
context, where languages such as Hindi, Tamil, and English coexist and frequently intermingle in 
digital communication, the task becomes uniquely complex. Code-mixing, informal usage, and 
morphological variations present formidable challenges to achieving accurate, context-aware 
translation. This project focuses on developing a grammar-sensitive, cross-lingual translation 
framework tailored for Indian languages, leveraging recent advances in linguistic modeling, 
grammar-aware neural architectures, and machine learning. 
A multilingual parallel corpus is constructed, comprising balanced samples of text across Hindi, 
Tamil, and English. To enhance linguistic and grammatical diversity, systematic data augmentation 
through back-translation and syntactic paraphrasing is employed. The preprocessing pipeline 
integrates sentence segmentation, tokenization, part-of-speech tagging, dependency parsing, 
lemmatization, and grammar normalization to ensure structural consistency across languages. The 
cleaned and standardized text data is vectorized using word embeddings and transformer-based 
encoders, optimized for grammatical alignment and translation fidelity. 
Multiple translation architectures and hybrid models are evaluated, including Statistical Machine 
Translation (SMT), Neural Machine Translation (NMT), and Grammar-Aware Transformer models. 
Performance evaluation is guided by BLEU, ROUGE, and METEOR scores, alongside grammar 
accuracy metrics and human evaluation. The Grammar-Aware Transformer demonstrates the highest 
BLEU score (0.6421), surpassing standard NMT baselines, and exhibits enhanced syntactic 
consistency and grammatical correctness across translation outputs. Incorporating grammar 
constraints and linguistic rules within attention mechanisms results in improved coherence, especially 
for morphologically rich and code-mixed sentences. 
The final translation pipeline delivers robust performance across all three languages, accurately 
handling grammatical structures, idiomatic expressions, and mixed-language inputs that typify Indian 
digital communication. It addresses significant research gaps, particularly the scarcity of grammar
aligned bilingual datasets and the limitations of existing translation systems in capturing syntactic 
subtleties. 

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
