"""Render explicit chapter evidence slots from one maintained DOI catalogue."""
import json
from pathlib import Path
import re
from flask import render_template
from markupsafe import Markup

DATA_PATH = Path(__file__).resolve().parent / 'wiki/data/supporting-data.json'
SLOT = re.compile(r'<!-- SUPPORTING_DATA:([a-z0-9-]+) -->')

def load_datasets():
    return json.loads(DATA_PATH.read_text(encoding='utf-8'))

def install(app):
    @app.context_processor
    def supporting_data_context():
        return {'datasets': load_datasets()}

    @app.template_filter('supporting_data')
    def supporting_data_slots(html):
        records = {item['id']: item for item in load_datasets()}
        def render_slot(match):
            return render_template('components/supporting-data/render_bar.html', item=records[match[1]])
        return Markup(SLOT.sub(render_slot, str(html)))
