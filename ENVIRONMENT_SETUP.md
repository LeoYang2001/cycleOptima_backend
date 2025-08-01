# Environment Setup

## 🔐 Environment Variables

This project requires several environment variables to run properly.

### Local Development Setup

1. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

2. Fill in your actual values in `.env`:

   ```properties
   PORT=4000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_actual_mysql_password
   DB_NAME=cycle_optima

   OPENAI_API_KEY=sk-proj-your_actual_openai_api_key
   ```

### Railway Production Setup

Environment variables are configured directly in Railway dashboard:

- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` - Automatically set by Railway MySQL service
- `OPENAI_API_KEY` - Set manually in Railway dashboard
- `PORT` - Automatically set by Railway

## 🔒 Security Notes

- **Never commit `.env` files** - they contain sensitive credentials
- Use `.env.example` as a template for other developers
- Keep your OpenAI API key secure and rotate it if exposed
- Railway environment variables are encrypted and secure

## 🚀 Getting Started

1. Clone the repository
2. Run `npm install`
3. Copy and configure `.env` as described above
4. Start development: `npm start`

For production deployment, see [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md)
