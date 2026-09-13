---
title: How I got NEXUS to 96% accuracy on natural-language SQL
date: 2026-09-13
summary: What Chain-of-Thought and Tree-of-Thought reasoning actually changed when users ask a database questions in plain English.
tags: [genai, fastapi, postgresql]
draft: true
---

> This is a scaffold, not a finished post. Fill in the sections below and set
> `draft: false` in the frontmatter to publish it. Delete this blockquote first.

## The problem

Analysts who cannot write SQL still need answers from SQL databases.

<!-- What was the actual situation? Who was blocked, and by what? -->

## Why the naive approach fails

<!-- What did the first version do, and where did it fall over?
     Concrete failure cases are the most interesting part of a post like this. -->

## Adding structured reasoning

<!-- What CoT and ToT actually do here. A short code sample goes a long way: -->

```python
# Example — replace with the real thing
def plan_query(question: str, schema: Schema) -> QueryPlan:
    ...
```

## Measuring it

<!-- How was 96% measured? How many queries, what kind, what counted as correct?
     Being specific here is what makes the number credible. -->

| Approach | Accuracy |
| --- | --- |
| Direct prompt | — |
| + Chain-of-Thought | — |
| + Tree-of-Thought | 96% |

## What I would do differently

<!-- The most valuable section for a reader, and the one most people skip. -->
