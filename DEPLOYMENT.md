# GitHub and Domain Setup

## 1. GitHub Repository

Create a new GitHub repository, then connect this local folder to it:

```bash
git remote add origin git@github.com:USERNAME/REPOSITORY.git
git push -u origin main
```

Replace `USERNAME/REPOSITORY` with the real GitHub repository path.

## 2. GitHub Pages

This project includes a GitHub Actions workflow at `.github/workflows/deploy-site.yml`.

After pushing to GitHub:

1. Open the repository on GitHub.
2. Go to `Settings` → `Pages`.
3. Set `Source` to `GitHub Actions`.
4. Push to `main`; the workflow will publish the `site` folder.

## 3. Custom Domain

When the real domain is known:

1. Copy `site/CNAME.example` to `site/CNAME`.
2. Replace the value with the actual domain, for example `atelier-sveta.fr`.
3. In the domain DNS settings, add the records required by GitHub Pages.

For an apex domain like `atelier-sveta.fr`, use GitHub Pages `A` records.
For a subdomain like `www.atelier-sveta.fr`, use a `CNAME` record pointing to `USERNAME.github.io`.

After DNS is active, open GitHub repository `Settings` → `Pages`, enter the custom domain, and enable HTTPS.

