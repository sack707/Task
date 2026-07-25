# Contributing Guidelines

Thank you for considering contributing to **TaskPulse (Team Task Manager)**!

## Development Workflow

1. **Fork & Clone** repository locally:
   ```bash
   git clone https://github.com/your-username/team-task-manager.git
   cd team-task-manager
   ```
2. **Install Dependencies**:
   ```bash
   pnpm install
   ```
3. **Branching Convention**:
   - `feature/` for new features (e.g. `feature/subtasks-support`)
   - `fix/` for bug fixes (e.g. `fix/jwt-expiration-handling`)
4. **Code Quality & Verification**:
   Before submitting a Pull Request, ensure that all linting and build checks pass cleanly:
   ```bash
   pnpm lint
   pnpm build
   ```
5. **Commit Message Format**:
   Follow conventional commit style:
   - `feat(modules): add task attachments`
   - `fix(auth): handle expired token error toast`
   - `docs: update deployment instructions`
