import sys
import os
from flask import Flask, render_template, url_for
from flask_flatpages import FlatPages
from flask_frozen import Freezer
import json

app = Flask(__name__)
app.config.from_pyfile('settings.py')
pages = FlatPages(app)
freezer = Freezer(app)