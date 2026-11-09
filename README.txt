CODING-AGENT INTERACTION REVIEWER
=================================

A rubric for evaluating coding-agent interactions on four dimensions:
preamble quality, reasoning soundness, engineering judgment, and trust
calibration. The unit of evaluation is a (prompt, agent response) pair, not
a solution.

THE ARGUMENT
------------

The shortcut verdict says "strong" when the code runs. That is not the
question the role asks. The role asks whether the response reflects how a
strong engineer would think. A response can produce correct code and still be
a weak interaction, and a response can produce broken code and still be a
strong one because the reasoning is honest.

The rubric scores each dimension 0-2. The verdict is derived from the scores:

  strong       every dimension at least 1, and at least three at 2
  misleading   any dimension at 0
  weak         everything else

The discrimination matrix shows that the rubric rejects the shortcut verdict
on every interaction where the shortcut is wrong.

THE FOUR INTERACTIONS
---------------------

I1  The confident refactor that silently changes behaviour
    Tempting: strong (the code is syntactically fine).
    Measured: misleading (the "drop-in replacement" claim is unverified).

I2  The honest "I do not know" with a concrete next step
    Tempting: weak (there is no fix in the response).
    Measured: strong (narrowing the cause is the tasteful answer).

I3  The plausible fix that would break in production
    Tempting: strong (the diagnosis is correct).
    Measured: misleading (trust proxy: true trusts every hop).

I4  The over-explained answer to a simple question
    Tempting: strong (the answer is factually correct).
    Measured: misleading (the answer is disproportionate to the question).

RUN IT
------

    npm ci
    npm run review
    npm run build
    npm run preview

The review script writes src/generated/matrix.json for the app and
public/matrix.json for direct download.

TEST IT
-------

    npx playwright install chromium
    npx playwright test

Visual baselines must be generated inside the pinned Playwright image.
The verify workflow runs in mcr.microsoft.com/playwright, version pinned by
the scaffold script to match @playwright/test.

KNOWN LIMITS
------------

- Four interactions is a demonstration of the rubric, not a benchmark.
- The scores are authored, not measured. A production version needs
  inter-rater agreement data.
- The verdict thresholds are choices, stated so they can be argued with.
- No Codex, Claude Code, or Cursor transcript is included. The interactions
  are representative of the class, not captured from a live tool.
