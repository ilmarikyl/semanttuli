FROM python:3.10.4-buster
  
WORKDIR /usr/src/semanttuli-app

COPY requirements.txt ./

RUN pip install --no-cache-dir -r requirements.txt

COPY wsgi.py .
COPY app ./app

RUN chmod a+x .
RUN useradd -m appuser

USER appuser

ENTRYPOINT [ "python" ]

CMD ["wsgi.py"]
