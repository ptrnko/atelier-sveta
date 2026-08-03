# GitHub and Domain Setup

## 1. GitHub Repository

GitHub repository:

```bash
https://github.com/ptrnko/atelier-sveta
```

Local remote:

```bash
git remote add origin https://github.com/ptrnko/atelier-sveta.git
git push -u origin main
```

## 2. GitHub Pages

This project includes a GitHub Actions workflow at `.github/workflows/deploy-site.yml`.

After pushing to GitHub:

1. Open the repository on GitHub.
2. Go to `Settings` → `Pages`.
3. Set `Source` to `GitHub Actions`.
4. Push to `main`; the workflow will publish the `site` folder.

## 3. Custom Domain

Custom domain:

```text
ateliersveta.com
```

In the domain DNS settings, add the records required by GitHub Pages.

For the apex domain `ateliersveta.com`, add these `A` records:

```text
@  A  185.199.108.153
@  A  185.199.109.153
@  A  185.199.110.153
@  A  185.199.111.153
```

Optional IPv6 records:

```text
@  AAAA  2606:50c0:8000::153
@  AAAA  2606:50c0:8001::153
@  AAAA  2606:50c0:8002::153
@  AAAA  2606:50c0:8003::153
```

Recommended `www` redirect:

```text
www  CNAME  ptrnko.github.io
```

After DNS is active, open GitHub repository `Settings` → `Pages`, enter the custom domain, and enable HTTPS.
