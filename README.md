### Backend Setup (Node.js API)

1.  **Clone the Repository:**
    Open your terminal and clone the project:
    ```bash
    git clone https://github.com/Prakash-Bandapalli/charging-station.git
    ```

2.  **Navigate to the Backend Directory:**
    ```bash
    cd charging-station/backend
    ```

3.  **Install Dependencies:**
    ```bash
    npm install
    ```

4.  **Create and Configure Backend Environment Variables:**
    *   In the `charging-station/backend/` directory, create a new file named `.env`.
    *   Paste the following content into this `backend/.env` file. **You must adjust the `MONGO_URI` and `JWT_SECRET` values to match your local setup.**

    ```env
    # charging-station/backend/.env

    PORT=5000
    NODE_ENV=development
    MONGO_URI=mongodb://localhost:27017/ev_charger_db_local
    # If using MongoDB Atlas for local development, replace the above MONGO_URI with your Atlas connection string, for example:
    # MONGO_URI=mongodb+srv://<your_username>:<your_password>@<your_cluster_url>/<your_database_name>?retryWrites=true&w=majority

    JWT_SECRET=REPLACE_THIS_WITH_A_VERY_STRONG_RANDOM_SECRET_KEY_AT_LEAST_32_CHARACTERS
    # (For example, you can generate one using an online tool or a command like `openssl rand -base64 32`)

    JWT_EXPIRES_IN=1d

    # This should be the URL your local Vue.js dev server will run on.
    # Default for Vue CLI is often 8080. Adjust if yours is different (e.g., 8081).
    FRONTEND_URL=http://localhost:8080
    ```
    *   **Critical:**
        *   Replace `REPLACE_THIS_WITH_A_VERY_STRONG_RANDOM_SECRET_KEY_AT_LEAST_32_CHARACTERS` with your own unique, random string.
        *   Update `MONGO_URI` if you are using MongoDB Atlas or a different local database name/setup.
        *   Verify `FRONTEND_URL` matches the port your Vue development server will use (usually `http://localhost:8080` or `http://localhost:8081`).

5.  **Run the Backend Development Server:**
    ```bash
    npm run dev
    ```
    The backend API should now be running, typically on `http://localhost:5000`. Check your terminal for a "MongoDB Connected" message and to ensure there are no startup errors.

---

### Frontend Setup (Vue.js UI)

1.  **Navigate to the Frontend Directory:**
    Open a **new terminal window/tab** (ensure your backend server is still running in its own terminal).
    ```bash
    cd charging-station/frontend
    ```
    *(If you are currently in the `charging-station/backend/` directory, you can use: `cd ../frontend`)*

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Frontend Environment Variables:**
    *   In the `charging-station/frontend/` directory, create a new file named `.env.development`.
    *   Add the following content to this `frontend/.env.development` file, ensuring the URL points to your **locally running backend API**:

    ```env
    # charging-station/frontend/.env.development

    VUE_APP_API_BASE_URL=http://localhost:5000/api
    ```
    *(This tells your local Vue development server where to send API requests. The port `5000` should match the `PORT` in your backend's `.env` file).*

4.  **Run the Frontend Development Server:**
    ```bash
    npm run serve
    ```
    The Vue.js application will compile, and a development server will start. The terminal output will show the URL where the frontend is accessible (commonly `http://localhost:8080` or `http://localhost:8081`). Open this URL in your web browser.

---

You should now have both the backend API and the frontend UI running locally, configured to communicate with each other.
