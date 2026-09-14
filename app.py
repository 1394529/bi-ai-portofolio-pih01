from flask import Flask, render_template, request, redirect, url_for, session, jsonify, flash
from functools import wraps
import json
import os

app = Flask(__name__)
app.secret_key = 'portfolio_secret_key_2024'

DATA_FILE = os.path.join(os.path.dirname(__file__), 'instance', 'content.json')

ADMIN_USERNAME = 'admin'
ADMIN_PASSWORD = 'Nitrebuh0512'


def load_data():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return get_default_data()


def save_data(data):
    os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def get_default_data():
    return {
        "hero": {
            "fr": {
                "title": "Pierre Hubertin ANDRIANIRINA",
                "subtitle": "Spécialiste BI & AI",
                "tagline": "Transformer vos données en décisions stratégiques",
                "cta": "Découvrir mon profil"
            },
            "en": {
                "title": "Pierre Hubertin ANDRIANIRINA",
                "subtitle": "BI & AI Specialist",
                "tagline": "Turning your data into strategic decisions",
                "cta": "Discover my profile"
            }
        },
        "about": {
            "fr": {
                "heading": "À propos",
                "description": "Passionné par la data et l'intelligence artificielle, je conçois des solutions BI & AI sur mesure qui permettent aux organisations de prendre des décisions éclairées. Avec plus de 7 ans d'expérience dans l'analyse de données, la visualisation et le machine learning, j'accompagne les entreprises dans leur transformation digitale.",
                "value": "Mon objectif : extraire la valeur cachée dans vos données et la rendre actionnable.",
                "experience": "7+ ans d'expérience",
                "projects_done": "50+ projets livrés",
                "clients": "30+ clients satisfaits"
            },
            "en": {
                "heading": "About",
                "description": "Passionate about data and artificial intelligence, I design custom BI & AI solutions that enable organizations to make informed decisions. With over 7 years of experience in data analysis, visualization and machine learning, I support companies in their digital transformation.",
                "value": "My goal: extract the hidden value in your data and make it actionable.",
                "experience": "7+ years of experience",
                "projects_done": "50+ projects delivered",
                "clients": "30+ satisfied clients"
            }
        },
        "skills": {
            "fr": {"heading": "Compétences"},
            "en": {"heading": "Skills"},
            "categories": [
                {
                    "icon": "📊",
                    "name_fr": "Outils BI",
                    "name_en": "BI Tools",
                    "items": ["Power BI", "Tableau", "Looker", "Qlik Sense", "Metabase"]
                },
                {
                    "icon": "🤖",
                    "name_fr": "AI / ML",
                    "name_en": "AI / ML",
                    "items": ["Python", "TensorFlow", "scikit-learn", "PyTorch", "Hugging Face"]
                },
                {
                    "icon": "🗄️",
                    "name_fr": "Bases de données",
                    "name_en": "Databases",
                    "items": ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Snowflake"]
                },
                {
                    "icon": "☁️",
                    "name_fr": "Cloud",
                    "name_en": "Cloud",
                    "items": ["Azure", "AWS", "GCP", "Databricks", "dbt"]
                }
            ]
        },
        "services": {
            "fr": {"heading": "Services"},
            "en": {"heading": "Services"},
            "items": [
                {
                    "icon": "📈",
                    "title_fr": "Dashboards BI",
                    "title_en": "BI Dashboards",
                    "desc_fr": "Conception de tableaux de bord interactifs et visuels pour suivre vos KPIs en temps réel.",
                    "desc_en": "Design of interactive and visual dashboards to track your KPIs in real time."
                },
                {
                    "icon": "🧠",
                    "title_fr": "Modèles ML",
                    "title_en": "ML Models",
                    "desc_fr": "Développement de modèles de machine learning pour la prédiction, classification et clustering.",
                    "desc_en": "Development of machine learning models for prediction, classification and clustering."
                },
                {
                    "icon": "🗺️",
                    "title_fr": "Stratégie Data",
                    "title_en": "Data Strategy",
                    "desc_fr": "Audit et définition de votre gouvernance des données et roadmap analytique.",
                    "desc_en": "Audit and definition of your data governance and analytics roadmap."
                },
                {
                    "icon": "⚙️",
                    "title_fr": "Automatisation",
                    "title_en": "Automation",
                    "desc_fr": "Automatisation des pipelines ETL, rapports et workflows pour gagner en efficacité.",
                    "desc_en": "Automation of ETL pipelines, reports and workflows for greater efficiency."
                }
            ]
        },
        "projects": [
            {
                "id": 1,
                "title_fr": "Plateforme de prévision des ventes retail",
                "title_en": "Retail Sales Forecasting Platform",
                "desc_fr": "Développement d'un modèle ML de prévision des ventes pour une chaîne de distribution de 200+ magasins, intégré dans un dashboard Power BI temps réel.",
                "desc_en": "Development of an ML sales forecasting model for a distribution chain of 200+ stores, integrated into a real-time Power BI dashboard.",
                "tech": ["Python", "scikit-learn", "Power BI", "Azure ML", "SQL Server"],
                "result_fr": "+34% de précision vs méthodes traditionnelles, économie de 2M€/an",
                "result_en": "+34% accuracy vs traditional methods, saving €2M/year"
            },
            {
                "id": 2,
                "title_fr": "Système de détection de fraude bancaire",
                "title_en": "Banking Fraud Detection System",
                "desc_fr": "Implémentation d'un système de détection d'anomalies en temps réel pour une institution financière, utilisant des algorithmes d'apprentissage non supervisé.",
                "desc_en": "Implementation of a real-time anomaly detection system for a financial institution using unsupervised learning algorithms.",
                "tech": ["Python", "TensorFlow", "Kafka", "AWS", "MongoDB"],
                "result_fr": "Réduction de 78% des fraudes non détectées, traitement de 10K transactions/sec",
                "result_en": "78% reduction in undetected fraud, processing 10K transactions/sec"
            },
            {
                "id": 3,
                "title_fr": "Tableau de bord ESG pour fonds d'investissement",
                "title_en": "ESG Dashboard for Investment Fund",
                "desc_fr": "Création d'un outil d'analyse et de reporting ESG permettant d'évaluer les critères environnementaux, sociaux et de gouvernance d'un portefeuille de 150 entreprises.",
                "desc_en": "Creation of an ESG analysis and reporting tool to evaluate environmental, social and governance criteria for a portfolio of 150 companies.",
                "tech": ["Tableau", "Python", "GCP BigQuery", "Looker", "dbt"],
                "result_fr": "Adoption par 12 gestionnaires de fonds, couverture de 150+ actifs",
                "result_en": "Adoption by 12 fund managers, coverage of 150+ assets"
            }
        ],
        "contact": {
            "fr": {
                "heading": "Contact",
                "subtitle": "Prêt à transformer vos données ?",
                "name_label": "Nom",
                "email_label": "Email",
                "message_label": "Message",
                "submit_label": "Envoyer",
                "email": "ai.novacrew@gmail.com",
                "linkedin": "https://linkedin.com/in/pierre-hubertin",
                "github": "https://github.com/pierre-hubertin"
            },
            "en": {
                "heading": "Contact",
                "subtitle": "Ready to transform your data?",
                "name_label": "Name",
                "email_label": "Email",
                "message_label": "Message",
                "submit_label": "Send",
                "email": "ai.novacrew@gmail.com",
                "linkedin": "https://linkedin.com/in/phubertin",
                "github": "https://github.com/phubertin"
            }
        },
        "nav": {
            "fr": {
                "about": "À propos",
                "skills": "Compétences",
                "services": "Services",
                "projects": "Projets",
                "contact": "Contact"
            },
            "en": {
                "about": "About",
                "skills": "Skills",
                "services": "Services",
                "projects": "Projects",
                "contact": "Contact"
            }
        }
    }


def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if not session.get('logged_in'):
            return redirect(url_for('admin_login'))
        return f(*args, **kwargs)
    return decorated


@app.route('/')
def index():
    data = load_data()
    return render_template('index.html', data=data)


@app.route('/api/content')
def api_content():
    return jsonify(load_data())


# ─── ADMIN ───────────────────────────────────────────────────────────────────

@app.route('/admin/login', methods=['GET', 'POST'])
def admin_login():
    error = None
    if request.method == 'POST':
        if (request.form.get('username') == ADMIN_USERNAME and
                request.form.get('password') == ADMIN_PASSWORD):
            session['logged_in'] = True
            return redirect(url_for('admin_dashboard'))
        error = "Identifiants incorrects."
    return render_template('admin/login.html', error=error)


@app.route('/admin/logout')
def admin_logout():
    session.clear()
    return redirect(url_for('admin_login'))


@app.route('/admin')
@login_required
def admin_dashboard():
    data = load_data()
    return render_template('admin/dashboard.html', data=data)


@app.route('/admin/save/hero', methods=['POST'])
@login_required
def admin_save_hero():
    data = load_data()
    for lang in ['fr', 'en']:
        for field in ['title', 'subtitle', 'tagline', 'cta']:
            key = f"{lang}_{field}"
            if key in request.form:
                data['hero'][lang][field] = request.form[key]
    save_data(data)
    flash('Section Hero sauvegardée ✓', 'success')
    return redirect(url_for('admin_dashboard') + '#hero')


@app.route('/admin/save/about', methods=['POST'])
@login_required
def admin_save_about():
    data = load_data()
    for lang in ['fr', 'en']:
        for field in ['heading', 'description', 'value', 'experience', 'projects_done', 'clients']:
            key = f"{lang}_{field}"
            if key in request.form:
                data['about'][lang][field] = request.form[key]
    save_data(data)
    flash('Section À propos sauvegardée ✓', 'success')
    return redirect(url_for('admin_dashboard') + '#about')


@app.route('/admin/save/skills', methods=['POST'])
@login_required
def admin_save_skills():
    data = load_data()
    data['skills']['fr']['heading'] = request.form.get('fr_heading', '')
    data['skills']['en']['heading'] = request.form.get('en_heading', '')
    categories = []
    i = 0
    while f'cat_icon_{i}' in request.form:
        categories.append({
            "icon": request.form.get(f'cat_icon_{i}', ''),
            "name_fr": request.form.get(f'cat_name_fr_{i}', ''),
            "name_en": request.form.get(f'cat_name_en_{i}', ''),
            "items": [x.strip() for x in request.form.get(f'cat_items_{i}', '').split(',') if x.strip()]
        })
        i += 1
    data['skills']['categories'] = categories
    save_data(data)
    flash('Section Compétences sauvegardée ✓', 'success')
    return redirect(url_for('admin_dashboard') + '#skills')


@app.route('/admin/save/services', methods=['POST'])
@login_required
def admin_save_services():
    data = load_data()
    data['services']['fr']['heading'] = request.form.get('fr_heading', '')
    data['services']['en']['heading'] = request.form.get('en_heading', '')
    items = []
    i = 0
    while f'svc_icon_{i}' in request.form:
        items.append({
            "icon": request.form.get(f'svc_icon_{i}', ''),
            "title_fr": request.form.get(f'svc_title_fr_{i}', ''),
            "title_en": request.form.get(f'svc_title_en_{i}', ''),
            "desc_fr": request.form.get(f'svc_desc_fr_{i}', ''),
            "desc_en": request.form.get(f'svc_desc_en_{i}', '')
        })
        i += 1
    data['services']['items'] = items
    save_data(data)
    flash('Section Services sauvegardée ✓', 'success')
    return redirect(url_for('admin_dashboard') + '#services')


@app.route('/admin/save/projects', methods=['POST'])
@login_required
def admin_save_projects():
    data = load_data()
    projects = []
    i = 0
    while f'proj_title_fr_{i}' in request.form:
        tech_raw = request.form.get(f'proj_tech_{i}', '')
        projects.append({
            "id": i + 1,
            "title_fr": request.form.get(f'proj_title_fr_{i}', ''),
            "title_en": request.form.get(f'proj_title_en_{i}', ''),
            "desc_fr": request.form.get(f'proj_desc_fr_{i}', ''),
            "desc_en": request.form.get(f'proj_desc_en_{i}', ''),
            "tech": [x.strip() for x in tech_raw.split(',') if x.strip()],
            "result_fr": request.form.get(f'proj_result_fr_{i}', ''),
            "result_en": request.form.get(f'proj_result_en_{i}', '')
        })
        i += 1
    data['projects'] = projects
    save_data(data)
    flash('Projets sauvegardés ✓', 'success')
    return redirect(url_for('admin_dashboard') + '#projects')


@app.route('/admin/save/contact', methods=['POST'])
@login_required
def admin_save_contact():
    data = load_data()
    for lang in ['fr', 'en']:
        for field in ['heading', 'subtitle', 'name_label', 'email_label', 'message_label', 'submit_label', 'email', 'linkedin', 'github']:
            key = f"{lang}_{field}"
            if key in request.form:
                data['contact'][lang][field] = request.form[key]
    save_data(data)
    flash('Section Contact sauvegardée ✓', 'success')
    return redirect(url_for('admin_dashboard') + '#contact')


@app.route('/admin/project/add', methods=['POST'])
@login_required
def admin_add_project():
    data = load_data()
    tech_raw = request.form.get('tech', '')
    new_project = {
        "id": (max([p['id'] for p in data['projects']], default=0) + 1),
        "title_fr": request.form.get('title_fr', 'Nouveau projet'),
        "title_en": request.form.get('title_en', 'New project'),
        "desc_fr": request.form.get('desc_fr', ''),
        "desc_en": request.form.get('desc_en', ''),
        "tech": [x.strip() for x in tech_raw.split(',') if x.strip()],
        "result_fr": request.form.get('result_fr', ''),
        "result_en": request.form.get('result_en', '')
    }
    data['projects'].append(new_project)
    save_data(data)
    flash('Projet ajouté ✓', 'success')
    return redirect(url_for('admin_dashboard') + '#projects')


@app.route('/admin/project/delete/<int:project_id>', methods=['POST'])
@login_required
def admin_delete_project(project_id):
    data = load_data()
    data['projects'] = [p for p in data['projects'] if p['id'] != project_id]
    save_data(data)
    flash('Projet supprimé ✓', 'success')
    return redirect(url_for('admin_dashboard') + '#projects')


if __name__ == '__main__':
    # Initialize data file on first run
    if not os.path.exists(DATA_FILE):
        os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
        save_data(get_default_data())
    app.run(debug=True, port=5000)
