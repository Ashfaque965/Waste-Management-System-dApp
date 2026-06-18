# Contributing to Waste Management System

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/waste-management-dapp.git`
3. Create a feature branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Push to your fork: `git push origin feature/your-feature-name`
6. Open a Pull Request

## Development Setup

Follow the setup guide in [docs/SETUP.md](docs/SETUP.md)

## Code Standards

### Solidity
- Use Solidity 0.8.0+
- Follow [OpenZeppelin style guide](https://docs.openzeppelin.com/contracts/4.x/style-guide)
- Add natspec comments for all public functions
- Write tests for all contracts

### JavaScript/Node.js
- Use ES6+ syntax
- Follow [Airbnb JavaScript style guide](https://github.com/airbnb/javascript)
- Use meaningful variable names
- Add error handling

### React
- Use functional components with hooks
- Follow [Airbnb React style guide](https://github.com/airbnb/javascript/tree/master/react)
- Create reusable components
- Use Zustand for state management

## Testing

### Smart Contracts
```bash
cd contracts
npm run test
```

### Backend
```bash
cd backend
npm test
```

### Frontend
```bash
cd frontend
npm test
```

## Commit Messages

Use clear, descriptive commit messages:

```
feat: Add waste collection verification
fix: Resolve IPFS connection timeout
docs: Update API documentation
test: Add tests for collection verification
refactor: Simplify blockchain service
```

Format: `type: description`

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `test`: Tests
- `refactor`: Code refactoring
- `style`: Code style changes
- `perf`: Performance improvements

## Pull Request Process

1. Update documentation if needed
2. Add tests for new features
3. Ensure all tests pass
4. Update CHANGELOG.md
5. Submit PR with clear description
6. Address review comments

## Code Review

All PRs require review before merging. Reviewers look for:

- Code quality
- Test coverage
- Documentation
- Performance implications
- Security concerns

## Reporting Bugs

Use GitHub Issues with:

1. Clear title
2. Detailed description
3. Steps to reproduce
4. Expected vs actual behavior
5. Environment info (OS, Node version, etc.)

## Feature Requests

Suggest new features in [GitHub Discussions](https://github.com/waste-management/discussions)

Include:
- Problem it solves
- Proposed solution
- Alternative solutions
- Additional context

## Documentation

- Write clear, concise documentation
- Use examples where helpful
- Keep README.md updated
- Document API endpoints
- Add comments to complex code

## Community

- Be respectful and inclusive
- Help others in discussions
- Share knowledge and experience
- Report bad behavior to maintainers

## License

By contributing, you agree your code will be licensed under MIT License.

## Questions?

Open an issue or discussion if you have questions.

---

Thank you for making waste management better! ♻️
