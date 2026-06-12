# Arundel House of Pizza — Static Website

This is a GitHub Pages-ready static website redesign for Arundel House of Pizza.

## Preview locally

Open `index.html` in a web browser. No build process, database, or server is required.

## Upload to GitHub Pages

1. Create a GitHub repository or open the repository you want to use.
2. Upload everything in this folder to the root of the repository.
3. In GitHub, open **Settings → Pages**.
4. Set the source to **Deploy from a branch**.
5. Choose the `main` branch and the root `/` folder.
6. Save the setting.

## Updating the menu

Edit `menu-data.js`. This is the only file that needs to be changed when menu items, descriptions, or prices are updated. The on-page menu and the PDF download are both generated from that file.

## Updating business information

Edit `index.html` to update:

- Hours
- Address
- Phone number
- Clover online-ordering link
- Facebook link
- Local SEO metadata and structured data

## Images

Existing AHOP logo and restaurant photography are organized in `assets/images/`.

## Menu PDF

The **Download Menu PDF** button creates a current printable PDF directly from `menu-data.js`. There is no separate PDF file to update.

## Custom domain

The included `CNAME` file is set to `arundelhop.com`. When the site is ready to go live, configure the domain's DNS records for GitHub Pages and verify the custom domain under **Settings → Pages**.
