EDGE-CASE SOLUTION REVIEWER
===========================

A reviewer that runs candidate code solutions against the visible test suite,
then against hidden cases derived from the problem's stated constraints. A
candidate that passes the first and fails the second is reported as edge-case
broken.

THE VERDICTS
------------

  correct            passes visible and hidden
  edge-case-broken   passes visible, fails hidden
  incorrect          fails visible with a wrong answer
  throws             crashes on some case

SANDBOX BOUNDARY
----------------

The reviewer executes candidates in node:vm. The Node.js documentation states
plainly: "The node:vm module is not a security mechanism. Do not use it to run
untrusted code." https://nodejs.org/api/vm.html

The candidates in solutions/index.mjs are authored and committed. A production
reviewer running model-generated candidates would need a subprocess boundary.

RUN IT
------

    npm ci
    npm run review
    npm run build
    npm run preview

TEST IT
-------

    npx playwright install chromium
    npx playwright test

Visual baselines must be generated inside the pinned Playwright image.
https://playwright.dev/docs/test-snapshots
The verify workflow runs in mcr.microsoft.com/playwright, version pinned by the
scaffold script to match @playwright/test.

MATRIX PROVENANCE
-----------------

The committed matrix contains two non-deterministic fields:

  generatedAt   wall-clock time of the run that produced the matrix
  buildId       GITHUB_SHA on CI, null locally

The deploy workflow's staleness check compares everything except those two, so
a commit produced by a local run and a matrix regenerated in CI agree on the
semantic content even though their timestamps differ.

PAGES BUILD RECORD
------------------

The /repos/{owner}/{repo}/pages/builds/latest endpoint returns 404 for a site
whose Pages was enabled with build_type=workflow. That endpoint reports the
legacy branch-build state; workflow builds deploy an artefact via
actions/deploy-pages@v4 and never produce a record there. The scaffold script
treats the 404 as expected and relies on the site probe, which fetches the
served HTML, the hashed bundle, and the matrix data to confirm the deployment.

KNOWN LIMITS
------------

- JavaScript only.
- Hidden cases are not exhaustive.
- node:vm is not a security boundary.
- No style, complexity or explanation judgement.
