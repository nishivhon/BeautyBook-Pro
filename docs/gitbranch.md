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