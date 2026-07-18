---
title: "Building a RAG Pipeline with LangChain, Bedrock, and pgvector"
date: 2026-06-02
slug: rag-pipeline-bedrock-langchain
excerpt: "Notes from building a Retrieval-Augmented Generation system over enterprise knowledge bases — what worked, what didn't, and why pgvector on Supabase turned out to be the right call."
tags: [GenAI, RAG, AWS Bedrock, LangChain]
---

One of the more satisfying proof-of-concepts I've shipped recently is a Retrieval-Augmented Generation (RAG) tool for surfacing policy and documentation content from unstructured enterprise sources. Here's a rundown of how it's put together and a few lessons learned along the way.

## The problem

Enterprise knowledge bases are usually a mess — PDFs, Confluence exports, scanned policy documents, and the occasional Word doc from 2014 that nobody wants to touch. Keyword search over that corpus gets you partial matches at best. What teams actually want is: *ask a question in plain English, get an answer grounded in the actual source documents*.

That's the RAG pattern in a nutshell: retrieve the most relevant chunks of source material, then hand them to an LLM as context so it can generate a grounded answer instead of hallucinating one.

## The stack

- **AWS Bedrock** for the embedding and generation models — keeps everything inside existing AWS governance boundaries, which matters a lot in regulated environments.
- **LangChain** to orchestrate the retrieval and generation chain.
- **Supabase (pgvector)** as the vector store. I evaluated a couple of managed vector databases, but pgvector on Supabase won on simplicity — it's just Postgres, which means the rest of the platform team already knows how to operate, back up, and monitor it.

## What actually mattered

A few things made a bigger difference than I expected going in:

1. **Chunking strategy over model choice.** Swapping embedding models moved the needle less than getting chunk size and overlap right for the source documents. Policy documents with deeply nested headings need different chunking than flat FAQ-style content.
2. **Metadata filtering.** Storing document source, section, and last-updated date alongside each chunk made it possible to filter before the similarity search ran, not just after — which mattered a lot once the corpus grew past a few thousand chunks.
3. **Grounding the answer, not just the retrieval.** It's not enough to retrieve the right chunks — the prompt template needs to explicitly instruct the model to only answer from the provided context and to say so when it can't, otherwise you're back to hallucination with extra steps.

## Where it's headed

The next iteration is about tightening the feedback loop — capturing which answers users found useful and using that signal to tune retrieval, not just prompt wording. I'll write more about that once there's something worth sharing.

If you're working through something similar, particularly around governance for RAG in a regulated environment, [get in touch](/#contact) — always happy to compare notes.
