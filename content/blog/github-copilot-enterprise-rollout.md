---
title: "Rolling Out GitHub Copilot Across an Enterprise: What Actually Matters"
date: 2026-07-10
slug: github-copilot-enterprise-rollout
excerpt: "Leading the enterprise-wide GitHub Copilot rollout at Verizon taught me that adoption programmes live or die on governance and onboarding, not on the tool itself."
tags: [DevEx, Enterprise AI, Change Management]
---

Leading the enterprise-wide rollout of GitHub Copilot across engineering teams at Verizon was less about the tool and more about everything around it. A few things stood out that I think apply to any large-scale AI tooling rollout, not just Copilot.

## Governance first, adoption second

The instinct with a tool like Copilot is to just turn it on and let engineers go. That approach works for a ten-person startup. It does not work at enterprise scale, where security, legal, and compliance all have legitimate questions before code-suggestion tooling touches a proprietary codebase.

Getting governance settled early — data retention, license scanning for suggested code, and clear usage policy — meant the rollout itself moved faster later, not slower. Teams trust a tool more when they can see the guardrails are already in place.

## Onboarding is the actual product

Handing someone a licence and a "getting started" doc is not onboarding. What moved usage numbers was:

- Short, role-specific walkthroughs (a backend engineer and a QA automation engineer get value from Copilot in very different ways)
- A visible internal champion in each team, not just a central platform team sending emails
- Making it socially normal to say "I didn't know Copilot could do that" in a team channel

## Measuring the right things

Lines of code suggested is a vanity metric. What we tracked instead:

- Suggestion acceptance rate over time, by team
- Time-to-first-PR for new starters (this moved the most)
- Qualitative feedback pulled from short retros, not just a survey

## The takeaway

Enterprise AI tooling rollouts succeed or fail on the change management, not the AI. If you're planning something similar, spend real time on the governance and onboarding motion before you worry about which model or plan tier to buy — the tooling decision is the easy part.

Happy to swap notes if you're running a similar programme — [reach out](/#contact).
