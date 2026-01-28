# Instructions pour pousser vers GitHub

Le dépôt Git est initialisé. Ouvrez un terminal **dans la racine du projet** (PowerShell ou CMD) et exécutez :

```powershell
# 1. Supprimer le lock si présent (en cas d'erreur "Another git process...")
Remove-Item -Path ".git\index.lock" -Force -ErrorAction SilentlyContinue

# 2. Ajouter tous les fichiers
git add .

# 3. Commit initial (ou commit des derniers changements)
git commit -m "Initial commit: Portfolio animé avec Next.js, TypeScript et GSAP"

# 4. Renommer la branche en main si nécessaire
git branch -M main

# 5. Ajouter le remote GitHub
git remote add origin https://github.com/Webacte/CvNonIdentifie.git
# Si origin existe déjà : git remote set-url origin https://github.com/Webacte/CvNonIdentifie.git

# 6. Pousser vers GitHub
git push -u origin main
```

Après le premier push, vous pouvez supprimer ce fichier : `GIT_PUSH_INSTRUCTIONS.md`
