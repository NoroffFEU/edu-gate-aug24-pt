# Development Standard for Agency AUG24PT

This document is a set of rules, guidelines and procedures for AGC1: edu-gate-aug24-pt. To follow this development standard ensures that we as a team; maintain a high-quality, stable codebase, minimize unnecessary back-and-forth during the review process, and clearly define the steps required to move features from idea to deployment.

## Github Repository and Workflow

### Branching Strategy

All work begins from the develop branch; this branch represents the latest, stable, and deployable version of the application. Developers must not commit directly to develop. When adding a new features or changes the work must happen in separate branches.

### Branch Naming Convention

All branches should be clearly linked to a Github Issue ID; this is the ticket you have been assigned in Github Project Board.
Here are some examples:

- feat/ : for new functionality
- fix/ : for bug fixes
- refactor/ : for code cleanup

## Code Quality and Standards

All developers are encouraged to use the following tools and scripts to maintain consistency and prevent style conflicts:

### Tooling and Setup

- ESLint : For catching syntax errors and poor practices.
- Prettier : Code formatter.

### Script Codes

Developers should run these scripts locally before pushing code and opening a
Pull Request (PR):

- npm run code-format : This runs Prettier to auto-format all files according to project settings
- npm run lint : This runs ESLint to check for code quality and potential errors.
- npm run start : This starts the server for local development (http://127.0.0.1:8181)

### Commit Messages

Commit messages should be concise and informative. For example, focusing on what was changed. You should also commit as often as possible.

- “feat: added styling for search button” - good commit message
- “added styling” - bad commit message

### Error Handling and Logging

- Avoid console.log() statements in code. Use proper error logging.
- All functions handling asynchronous code (for example, API calls) must use try…catch blocks to prevent application crashes and provide graceful failure messages to the user.
- When catching an error, the logged or displayed message should be descriptive and include context (“Failed to fetch data”)

### Naming Conventions

Naming conventions is crucial for code readability:

- Variables and Functions: Must use camelCase.
- Kebab Case: All words in lowercase and separated by hyphens.

### Design and UI/UX

All UI development should follow the official project design. The developer is responsible for following the design mock-ups.
In the docs/ you can find:
Style Guide : docs/style-guide.md
Figma file: docs/process.md

## Pull Requests (PR) and QA

The purpose of the PR is to ensure quality, security, and stability before changes reach develop. Please keep the PR below 200 lines of new/changed code to make the review process faster.

### Definition of Done (DoD)

A feature is only complete and ready for a Pull Request if all of these criteria are met:

- The code meets all Acceptance Criteria (AC) defined in the Github Issue/Ticket.
- The code adheres to all best practices, including DRY (Don’t Repeat Yourself) principles, semantic structure, and is built to be fully responsive and accessible (WCAG).
- The developer has locally tested the feature and verified it works.
- All CI (Continuous Integration) status checks on the PR (Linter, Tests) are green.

### PR Template

Every developer should use the pull_request_template.md. This will automatically show when doing a Pull Request. This is a template to provide necessary context and information for code reviews.

### Review and Merging Process

- A Pull Request must receive final approval from the QA.
- When a PR gets approval it will be merged.

## QA Responsibilities and Testing

The QA’s primary responsibility is to ensure the product’s quality and delivery consistently align with the project specification. The QA will use the Acceptance Criteria (AC) from the Github Issues to perform testing.

### Code Review

- Verifying all standards (naming, formatting, DoD).
- Identifying missing input validation, error handling, or logical gaps that could lead to bugs.

### UI/UX Accessibility Testing

- Google Lighthouse (Performance, Accessibility)
- WAVE (Accessibility)
- Ensure readability and responsiveness

### Handling Bugs

If a bug is found during testing, the QA will comment on the Github Issue/ticket, documenting the actions taken and contrasting the expected and actual outcomes. The issue will be labeled bug and assigned back to the developer.
