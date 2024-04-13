# Semanttuli

Available at [semanttuli.fly.dev](https://semanttuli.fly.dev/)

---

## Setup development

Two ways to run locally:

### **Pipenv**

1. Run `pipenv install` (install pipenv with `pip install pipenv` if necessary)
2. Run `pipenv run python wsgi.py`
   - If no MongoDB connection string is provided as env variable, backend will connect to a read-only development database
3. App should now be running in http://localhost:8080

### **Docker**

1. Build Docker image with `docker build -t semanttuli:latest .`
2. Start container from the image with `docker run -p 8080:8080 semanttuli:latest`
   - If no MongoDB connection string is provided as env variable, backend will connect to a read-only development database
3. App should now be running in http://localhost:8080

---

## Deployment

- Deployment to production (fly.io) happens automatically when pushing to master branch -->
