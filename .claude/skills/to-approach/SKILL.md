---
name: to-approach
description: Plan an implementation approach in approved chunks before coding; use when the user wants to review each part, verify reuse of existing code (like setup packages), and request changes before implementation.
disable-model-invocation: true
---

# To Approach

An approach is a proposed route to implementation. It is not the implementation.

You plan it as a sequence of **parts**, presenting **one part at a time** and getting explicit approval on each before moving to the next. The whole point is that the user reviews each decision — so the phases are not optional and must not be collapsed.

## Invariants

These hold for the entire run. Breaking any of them defeats the skill:

- **Never skip the reuse audit.** It is always the first part presented, every time.
- **Never present more than one unapproved part at a time.** No dumping the full plan.
- **Never move to the next part until the current one is explicitly approved.** A new question, a tangent, or silence is not approval. Only an explicit "yes / approved / looks good / go on" advances the phase.
- **Never start implementation** until every part is approved. Hand off to `/implement` only after that.

If you catch yourself about to break one of these, stop and return to the phase you were on.

## Process

### 1. Ground the work

Read the conversation and the codebase enough to understand the target, constraints, and unknowns. If an important fact is missing, ask before drafting the approach.

### 2. Build the part list, then track it

Split the work into a short sequence of decision-rich parts. Each part must be small enough for the user to approve, reject, or revise on its own.

The **first part is always the reuse audit** (see below). The remaining parts are the real decisions, in dependency order.

Good parts are things like:

- module or seam choice
- data or contract changes
- test strategy
- rollout or risk handling

Bad parts are:

- a long implementation checklist
- file-by-file instructions
- multiple unrelated decisions bundled together

Record the parts and their approval state so you never lose your place across turns. Use the session todo list (one todo per part, in order) or an explicit checklist you keep at the top of each message:

```
Approach parts:
  1. Reuse audit — [pending | in review | approved]
  2. <decision> — [pending | in review | approved]
  3. <decision> — [pending | in review | approved]
```

Present this list once so the user sees the whole roadmap, then walk it one part at a time.

### 3. The reuse audit (always part 1)

Before proposing any new code, inspect the repo for existing packages, helpers, adapters, or setup code that already solves part of the job. Name the reusable code, and explain how the approach will use it instead of rebuilding it.

If the repo contains a setup package such as `platform/nextjs-effect`, call it out explicitly and say what role it plays.

If no existing code is a fit, say that plainly and explain why.

Present the reuse audit as the first part and get its approval before any other part.

### 4. Present one part at a time

Show only the next unapproved part. Each part must answer:

- what decision this part makes
- what you recommend
- why that choice is best
- which existing code or package this part intends to reuse
- what changes if the user wants a different path

End every part with a direct approval question so the user can:

- approve it
- ask for changes
- reject it and ask for a rework

Then **stop and wait**. Do not draft, preview, or hint at the next part in the same message.

When the user responds:

- **Approved** → mark the part approved in your tracking, then present the next part.
- **Changes requested** → revise that part and re-present it. Do not advance until the revised part is approved.

### 5. Respect dependencies

Later parts may depend on earlier approvals. If an earlier choice changes, revisit any dependent later parts and re-approve them before continuing.

### 6. Stop before implementation

When every part is approved, summarize the approved approach and stop. Do not write code or start implementation. Hand off to `/implement` only after approval.
