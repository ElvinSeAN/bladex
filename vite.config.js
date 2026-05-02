import { defineConfig } from 'vite';

// In GitHub Actions, GITHUB_REPOSITORY is "owner/repo".
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1];

export default defineConfig({
  base: repo ? `/${repo}/` : '/',
});

