from flask import (
    Flask,
    request,
    jsonify,
    send_file,
    send_from_directory,
    render_template,
)

import pymongo, struct, base64, os
from pymongo import MongoClient
import numpy as np
from functools import lru_cache
from dotenv import load_dotenv

app = Flask(__name__)

db_name = "semanttuli_prod"
load_dotenv()
DB_CONNECTION_STRING = os.getenv("MONGO_CONNECTION_STRING")

if not DB_CONNECTION_STRING:
    print("No MongoDB connection string provided as env variable.")
    print("Connecting to a read-only development database...\n")

    DB_CONNECTION_STRING = "mongodb+srv://semanttuli_dev_user:semanttuli_dev_password@cluster0.0hgj1rz.mongodb.net/?retryWrites=true&w=majority"
    db_name = "semanttuli_dev"


try:
    client = MongoClient(DB_CONNECTION_STRING)
    db = client[db_name]
    print(f'Successfully connected to MongoDB: "{db_name}"')

    w2v = db["word2vec"]
    nearby_collection = db["nearby"]
    similarity_range = db["similarity_range"]


except Exception as e:
    print("Something went wrong when connecting to MongoDB:\n")
    print(e)


def decode_secret(base64_secret):
    secret = base64_secret.encode("ascii")
    secret = base64.b64decode(secret)
    secret = secret.decode("utf-8")

    return secret


@app.route("/")
def send_index():
    return send_file("static/index.html")


@app.route("/offline.html")
def offline():
    return send_file("static/offline.html")


@app.route("/yksityisyyskaytanto")
def privacy_policy():
    return send_file("static/privacy_policy.html")


@app.route("/manifest.json")
def manifest():
    return send_file("static/manifest.json")


@app.route("/sw.js")
def sw():
    return send_file("static/sw.js")


@app.route("/favicon.ico")
def send_favicon():
    return send_file("static/assets/favicon.ico")


@app.route("/.well-known/<path:path>")
def assetlinks(path):
    return send_from_directory("static/.well-known", "assetlinks.json")


@app.route("/assets/<path:path>")
def send_static(path):
    return send_from_directory("static/assets", path)


@lru_cache(maxsize=100000)
def get_model(secret, word):

    secret = decode_secret(secret)

    no_vec_result_obj = nearby_collection.find_one({"word": secret, "neighbor": word})

    if no_vec_result_obj and word != secret:  # in top 1000 but not the secret word
        return jsonify(no_vec_result_obj)

    vec_result_obj = w2v.find_one({"word": word})

    if not vec_result_obj:  # word has no vector in db
        return ""

    result_obj = no_vec_result_obj if no_vec_result_obj else {}
    float32_vector = list(np.frombuffer(vec_result_obj["vec"], dtype="float32"))
    vec = [str(elem) for elem in float32_vector]
    result_obj["vec"] = vec

    return jsonify(result_obj)


def get_secret(secret):
    res_obj = w2v.find_one({"word": secret})
    float32_vector = list(np.frombuffer(res_obj["vec"], dtype="float32"))
    vec = [str(elem) for elem in float32_vector]

    return jsonify({"vec": vec})


def get_hint(b64_secret, percentile):
    secret = decode_secret(b64_secret)
    result_obj = nearby_collection.find_one({"word": secret, "percentile": percentile})

    return jsonify(result_obj)


@app.route("/model/<string:secret>/<string:word>")
def model(secret, word):
    try:
        return get_model(secret, word)
    except Exception as e:
        print(e)
        return jsonify(e)


@app.route("/getSecret/<string:b64_word>")
def secret(b64_word):

    secret = decode_secret(b64_word)

    try:
        return get_secret(secret)
    except Exception as e:
        print(e)
        return jsonify(e)


@app.route("/hint/<string:secret>/<int:percentile>")
def hint(secret, percentile):
    try:
        return get_hint(secret, percentile)
    except Exception as e:
        print(e)
        return jsonify(e)


@app.route("/similarity/<string:word_b64>")
def similarity(word_b64):

    word = decode_secret(word_b64)
    try:
        result_obj = similarity_range.find_one({"word": word})

        if not result_obj:
            return ""

        return jsonify(
            {
                "top": result_obj["top"],
                "top10": result_obj["top10"],
                "top1000": result_obj["rest"],
            }
        )

    except Exception as e:
        print(e)
        return jsonify(e)


@app.route("/nearby/<string:word>")
def nearby(word):

    try:
        result_obj = (
            nearby_collection.find({"word": word}, {"neighbor": 1})
            .sort([("percentile", pymongo.DESCENDING)])
            .skip(1)
            .limit(10)
        )

        if not result_obj:
            return ""

        return jsonify([obj["neighbor"] for obj in list(result_obj)])

    except Exception as e:
        print(e)
        return jsonify(e)


@app.route("/nearby_1k/<string:word_b64>")
def nearby_1k(word_b64):

    try:
        word = base64.b64decode(word_b64).decode("utf-8")
        result_obj = (
            nearby_collection.find(
                {"word": word}, {"neighbor": 1, "percentile": 1, "similarity": 1}
            )
            .sort([("percentile", pymongo.DESCENDING)])
            .skip(1)
            .limit(1000)
        )

        if not result_obj:
            return ""

        words = [
            {
                "neighbor": obj["neighbor"],
                "percentile": obj["percentile"],
                "similarity": "%0.2f" % (100 * obj["similarity"]),
            }
            for obj in list(result_obj)
        ]

        return render_template("top1k.html", word=word, words=words)

    except Exception as e:
        import traceback

        traceback.print_exc()
        return "Voi ei"


@app.errorhandler(404)
def not_found(error):
    return "Sivua ei löydy"


@app.errorhandler(500)
def error_handler(error):
    return error


@app.after_request
def add_header(response):
    response.headers["Cache-Control"] = "no-store"
    return response
