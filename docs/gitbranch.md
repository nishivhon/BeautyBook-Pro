# Git Branch Guide

## Branch Overview

### main
- Production-ready code
- Stable releases only
- Protected branch - requires pull request reviews
- Latest deployed version

### development
- Active development branch
- Staging for new features
- Code is tested but may not be production-ready
- Where new features are merged before final release

## Switching to Development Branch

### First Time Setup

If the development branch doesn't exist locally, fetch it from remote:

```
git fetch origin development
```

Then switch to the development branch:

```
git checkout development
```

Or use the shorthand:

```
git checkout -b development origin/development
```

### Switching Between Branches

Switch from main to development:

```
git checkout development
```

Switch from development back to main:

```
git checkout main
```

### View All Available Branches

```
git branch -a
```

Local branches will be listed without prefix. Remote branches will have "remotes/origin/" prefix.

## Key Differences

| Aspect | main | development |
|--------|------|-------------|
| Status | Production-ready | In active development |
| Stability | Stable and tested | May have experimental code |
| Deployment | Deployed to production | Deployed to staging |
| Merge Requirements | Requires PR review | Requires PR review |
| Usage | End users | Developers and QA |

## Workflow

1. Start on development branch for new features
2. Create feature branches from development
3. Submit pull requests to development for review
4. Once stable, create PR from development to main
5. main branch is used for production releases

## Common Commands

Push current branch to remote:
```
git push origin [branch-name]
```

Pull latest changes:
```
git pull origin [branch-name]
```

Create and switch to new branch:
```
git checkout -b [new-branch-name]
```
