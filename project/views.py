from flask import render_template
from app import app, pages

ctx = app.test_request_context()
ctx.push()
app.preprocess_request()

@app.route('/')
def index():
	return render_template('index.html')

if __name__ == '__main__':
	app.run(debug=True, use_reloader=True)