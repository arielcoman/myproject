#imports
from flask import Flask, render_template, request
from chat import get_response, bot_name






app = Flask(__name__)
#define app routes
@app.route("/")
def index():
    return render_template("index.html")

@app.route("/get")
#function for the bot response
def get_bot_response():
    usertext = request.args.get('msg')
    return str(get_response(usertext))

if __name__ == "__main__":
    app.run()