// config.js — data source URLs for the dashboard
// Data is pushed to the `data` branch by sync_dashboard.py after each pipeline run.
// These are public raw GitHub URLs — no secrets here.

window.__DATA_URL__    = "https://raw.githubusercontent.com/mcgillesdorce/openclaw-dashboard/data/dashboard_data.json";
window.__BILLING_URL__ = "https://raw.githubusercontent.com/mcgillesdorce/openclaw-dashboard/data/billing_data.json";
window.__CREDITS_URL__ = "https://raw.githubusercontent.com/mcgillesdorce/openclaw-dashboard/data/credits_data.json";
