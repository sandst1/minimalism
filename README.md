# AI Experiments: Minimalism in LLM-Generated Software

## What is this?

This repository demonstrates an experiment in how Large Language Models (LLMs) create software when given different philosophical constraints. Specifically, it compares the same projects built:

1. **Without constraints** - Allowing the LLM to use its default assumptions about "good" software
2. **With minimalist principles** - Following the strict guidelines defined in `minimalism.md`

## The Experiment

Each project is implemented twice:
- A standard version where the LLM follows typical software development practices
- A minimalist version where the LLM adheres to extreme minimalism principles

## Projects

### 01-webshop vs 01-webshop-with-minimalism
A simple web shop implementation showing the dramatic difference in complexity and feature set between unconstrained and minimalist approaches.

### 02-backend vs 02-backend-with-minimalism  
A backend API demonstrating how minimalism affects server architecture, error handling, and feature scope.

## Key Findings

The experiments reveal how LLMs tend to over-engineer solutions by default, adding features like:
- Error handling and validation
- Loading states and animations
- Comprehensive logging
- Design patterns and abstractions
- "Nice-to-have" features never requested

When constrained by minimalist principles, the same LLM produces significantly simpler, more focused code that does exactly what was asked - nothing more, nothing less.

## The Minimalist Prompt

See `minimalism.md` for the complete principles used to guide the LLM toward minimal implementations.

## Purpose

This repository serves as a practical demonstration of how philosophical constraints in prompts can dramatically affect LLM output, potentially leading to simpler, more maintainable software that avoids premature optimization and feature creep.
