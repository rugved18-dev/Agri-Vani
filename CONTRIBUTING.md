# Contributing to Agri-Vani

Thank you for your interest in contributing to Agri-Vani! We welcome contributions from the community.

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- MongoDB (local or Atlas)
- Python 3.8+ (for AI engine)
- Expo CLI

### Setup Development Environment

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Agri-Vani
   ```

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Setup Server**
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm run dev  # Start with nodemon in development
   ```

4. **Setup Client**
   ```bash
   cd ../client
   npm install
   cp .env.example .env
   # Edit .env with your API URL and configuration
   npm start  # Start Expo development server
   ```

5. **Setup AI Engine** (Optional)
   ```bash
   cd ../ai-engine
   python -m venv venv
   # Activate virtual environment:
   # Windows: venv\Scripts\activate
   # Mac/Linux: source venv/bin/activate
   pip install -r requirements.txt
   python app.py
   ```

## Development Workflow

1. Create a feature branch
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes
3. Test your changes
4. Commit with clear messages
   ```bash
   git commit -m "feat: add new feature description"
   ```

5. Push to your branch
   ```bash
   git push origin feature/your-feature-name
   ```

6. Create a Pull Request

## Code Style

- Use 2-space indentation
- Follow existing code patterns
- Add comments for complex logic
- Test your code before submitting PR

## Reporting Issues

- Use GitHub Issues to report bugs
- Provide clear description and steps to reproduce
- Include error messages and screenshots

## Project Structure

```
Agri-Vani/
├── client/           # React Native mobile app
├── server/           # Node.js/Express backend
├── ai-engine/        # Python ML models
└── README.md         # Project documentation
```

## Branch Naming Convention

- `feature/` - New features
- `bugfix/` - Bug fixes
- `docs/` - Documentation updates
- `test/` - Test additions

## Commit Message Convention

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test additions

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing! 🌾
