# Portfolio BI & AI — Pierre Hubertin ANDRIANIRINA

Site vitrine one-page bilingue (FR/EN) avec gestionnaire de contenus intégré.

## Stack
- **Backend** : Python 3.10+ / Flask 3.x
- **Stockage** : JSON (instance/content.json)
- **Frontend** : HTML + CSS + Vanilla JS (aucune dépendance frontend)
- **Polices** : Google Fonts (Inter, JetBrains Mono)

## Démarrage rapide

```bash
# 1. Créer un environnement virtuel
python -m venv venv
source venv/bin/activate        # Linux/macOS
# venv\Scripts\activate         # Windows

# 2. Installer les dépendances
pip install -r requirements.txt

# 3. Lancer l'application
python app.py
```

Ouvrir http://localhost:5000

## Interface d'administration

URL : http://localhost:5000/admin/login

| Champ    | Valeur          |
|----------|-----------------|
| Username | `admin`         |
| Password | `Nitrebub0512`  |

### Fonctionnalités du CMS
- Édition de **toutes les sections** (Hero, À propos, Compétences, Services, Projets, Contact)
- **Bilingue** : chaque texte éditable en FR et EN
- **Gestion des projets** : ajout, modification, suppression
- **Sauvegarde JSON** sans redémarrage du serveur

## Structure du projet

```
portfolio/
├── app.py                    # Application Flask (routes + CMS)
├── requirements.txt
├── README.md
├── instance/
│   └── content.json          # Contenu éditable (auto-créé au 1er lancement)
├── static/
│   ├── css/
│   │   ├── style.css         # Styles du portfolio (dark theme)
│   │   └── admin.css         # Styles de l'administration
│   └── js/
│       └── main.js           # JS portfolio (bilingue, animations, API)
└── templates/
    ├── index.html            # Page portfolio principale
    └── admin/
        ├── login.html        # Page connexion admin
        └── dashboard.html    # CMS complet
```

## Bilinguisme

Le sélecteur FR/EN dans la navbar bascule instantanément **sans rechargement**.
La langue choisie est mémorisée dans `localStorage`.

## Personnalisation

Tout le contenu est modifiable via l'interface `/admin` sans toucher au code.
Pour un déploiement production, remplacer `app.secret_key` par une valeur sécurisée
et définir `FLASK_ENV=production`.
