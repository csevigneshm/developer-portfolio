# Developer Portfolio

Personal portfolio site built with React.

**Live:** https://vignesh-dev.in | https://portfolio.vignesh-dev.in

---

## Workflow

```
1. Edit code locally     →  src/, data/
2. Test on localhost     →  npm start
3. Deploy to live server →  npm run deploy
4. View live site        →  vignesh-dev.in
```

---

## Local development

```bash
npm install
npm start
```

App runs at **http://localhost:3000**

### Edit site content

Update files in `src/data/`:

| File | Content |
|------|---------|
| `headerData.js` | Name, title, resume link |
| `aboutData.js` | About section |
| `experienceData.js` | Work experience |
| `educationData.js` | Education |
| `projectsData.js` | Projects |
| `skillsData.js` | Skills |
| `contactsData.js` | Contact info |
| `socialsData.js` | Social links |

---

## Deployment

Builds the app and uploads only the `build/` folder to the live server.

```bash
npm run deploy
```

Upload without rebuilding:

```bash
npm run deploy:upload
```

### First-time setup

```bash
chmod +x deploy.sh
cp deploy.config.example deploy.config.local
```

Add your SSH password in `deploy.config.local` (gitignored).

Optional — skip password prompt:

```bash
brew install hudochenkov/sshpass/sshpass
```

### Server details

| Setting | Value |
|---------|-------|
| Host | `199.192.19.46` |
| User | `vignesh` |
| Remote path | `~/react-projects/developer-portfolio` |

After deploy, Nginx serves the updated files automatically. No server restart needed.

---

## Server setup (reference)

Nginx config: `/etc/nginx/conf.d/portfolio.conf`

```nginx
server {
    listen 80;
    server_name portfolio.vignesh-dev.in vignesh-dev.in www.vignesh-dev.in;

    root /home/vignesh/react-projects/developer-portfolio;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

SSL:

```bash
sudo certbot --nginx -d portfolio.vignesh-dev.in -d vignesh-dev.in -d www.vignesh-dev.in
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Deploy fails (SSH) | Check `deploy.config.local` or test `ssh vignesh@199.192.19.46` |
| Live site shows old content | Run `npm run deploy` again |
| `/blog` or `/projects` gives 404 | Check Nginx `try_files` config |
| 403 Forbidden | `chmod 755 ~ ~/react-projects ~/react-projects/developer-portfolio` on server |
