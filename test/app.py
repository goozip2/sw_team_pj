from flask import Flask, render_template, request
from flask_ngrok import run_with_ngrok
from model import summary_model, emo_model, model_visualization
import numpy as np

app = Flask(__name__)
run_with_ngrok(app)

# @app.route("/")
# def start():
#     return render_template('index.html')

# @app.route("/login")
# def signin():
#     return render_template('login.html')

# @app.route("/register")
# def signup():
#     return render_template('register.html')

@app.route("/")
def home():
    return render_template('home.html')

@app.route("/anl", methods=['POST'])
def analyze_sentence():
    if request.method == 'POST':
        text = request.form.get("diary") # 입력받기
        temp = summary_model(text)
        emo_list = emo_model(temp)
        model_visualization(emo_list)
    else:
        temp = "분석 실패"
    return search_diary(temp)
    
@app.route("/write")
def write_diary():
    return render_template('write.html')

@app.route("/diary")
def search_diary(summ):
    return render_template('diary.html', summary = summ)

# @app.route("/mypage")
# def search_myinfo():
#     return render_template('mypage.html')

# @app.route("/editinfo")
# def update_myinfo():
#     return render_template('editinfo.html')

if __name__ == "__main__":
    app.run()