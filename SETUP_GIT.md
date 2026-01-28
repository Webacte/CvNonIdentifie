# Configuration Git - Commandes à exécuter

Exécutez ces commandes **dans l'ordre** depuis la racine du projet (`c:\Projets\CvNonIdentifié`) :

## 1. Supprimer le lock Git (si présent)
```powershell
Remove-Item -Path ".git\index.lock" -Force -ErrorAction SilentlyContinue
```

## 2. Ajouter tous les changements
```powershell
git add .
```

## 3. Créer un commit avec les dernières modifications
```powershell
git commit -m "Nettoyage final: suppression fichiers temporaires et constantes inutilisées"
```

## 4. Configurer le remote GitHub
```powershell
git remote add origin https://github.com/Webacte/CvNonIdentifie.git
```

Si le remote existe déjà :
```powershell
git remote set-url origin https://github.com/Webacte/CvNonIdentifie.git
```

## 5. Renommer la branche en 'main' (si vous êtes sur 'master')
```powershell
git branch -M main
```

## 6. Pousser vers GitHub
```powershell
git push -u origin main
```

Si vous avez déjà des commits sur GitHub et que vous voulez forcer :
```powershell
git push -u origin main --force
```

⚠️ **Attention** : `--force` écrase l'historique distant. Utilisez-le seulement si vous êtes sûr.

---

## Vérifications optionnelles

### Vérifier la configuration Git utilisateur
```powershell
git config user.name
git config user.email
```

### Configurer si nécessaire
```powershell
git config user.name "Votre Nom"
git config user.email "votre.email@example.com"
```

### Vérifier l'état final
```powershell
git status
git remote -v
git branch
```
