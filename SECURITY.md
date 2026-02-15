# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in Agri-Vani, please **do not** open a public issue. Instead, please email us privately with details about the vulnerability.

### What to Include

- Description of the vulnerability
- Steps to reproduce (if applicable)
- Potential impact
- Suggested fix (if available)

We will:
1. Confirm the vulnerability
2. Assess the impact
3. Develop and test a fix
4. Release a patched version
5. Credit you for the discovery (if desired)

## Security Best Practices for Users

### API Security
- **Change default JWT_SECRET** in production
- **Use HTTPS** when deploying to production
- **Implement rate limiting** on API endpoints
- **Validate all user inputs** on both client and server

### Database Security
- **Use MongoDB Atlas** with IP whitelist
- **Enable authentication** on local MongoDB
- **Use strong passwords** for database access
- **Never expose credentials** in code

### Environment Variables
- **Never commit `.env` files** to version control
- **Use different credentials** for development and production
- **Rotate secrets regularly** in production

## Supported Versions

| Version | Status              | End Date |
|---------|---------------------|----------|
| 1.0     | Currently Supported | TBD      |

## Dependencies Security

We regularly update dependencies to patch known vulnerabilities. Run:
```bash
npm audit
npm audit fix
```

## Contact

For security concerns, please contact the maintainers privately rather than using public issue tracking.
