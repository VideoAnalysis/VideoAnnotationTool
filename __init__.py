from flask import Flask

app = Flask(__name__,static_url_path='')

from views import *
#from config import *
import os
portSetting = int(os.environ.get('PORT', 5000))

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=portSetting)
    # app.run(debug=True)