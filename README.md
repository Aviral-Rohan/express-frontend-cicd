# Express Frontend (CI/CD with Jenkins)

A Node.js/Express page with a form. It forwards the form data to the Flask backend.

- `PORT` – port to listen on (default 3000)
- `BACKEND_URL` – address of the Flask backend (default `http://localhost:5000`)

## Run locally
```bash
npm install
npm start     # http://localhost:3000
npm test      # run the tests
```

## CI/CD
The `Jenkinsfile` runs on every push: checkout → install dependencies → test → deploy → health check.
