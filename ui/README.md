# NBA Moneyline Assistant

**A web-based assistant for data-driven NBA moneyline betting, featuring interactive dashboards, raw-SQL analytics, and a full CRUD front-end.**

---

## 🚀 Features

- **User Authentication**  
  JWT-based signup/login (no passwords stored on client, secure endpoints via custom `AuthenticatedAction`).

- **Place & Manage Bets (CRUD)**  
  - **Create**: place real bets against historical or live odds.  
  - **Read**: view “My Bets” with edit/delete actions.  
  - **Update**: adjust bet amount & predicted outcome.  
  - **Delete**: remove a bet.  

- **Simulated Bets**  
  “Dry-run” mode uses the same UI but doesn’t commit to the database—perfect for strategy testing.

- **Advanced Analytics (Raw SQL)**  
  - **Upsets Leaderboard**: teams most often winning as underdogs.  
  - **Win Rates**: teams ranked by actual win percentage + average pre-game moneyline.  
  - **Underdog Wins**: list of games where the underdog prevailed.  
  - **Most Active Bettors**: real-time leaderboard of users by number of bets.  

- **Interactive Data Visualization**  
  - **Line Charts** (via `react-chartjs-2` & Chart.js) on Dashboard:  
    - User’s historical bet performance (spending vs returns over time).  
    - Hover tooltips for per-bet details (game, stake, outcome).  

- **Keyword Search & Pagination**  
  - Filter games by team name.  
  - Infinite scroll / “Load more” for the most recent 10 games.  

- **Database-Backed Triggers & Stored Procedures**  
  - **`PickAudit` trigger** logs every new bet for auditing & “Most Active Bettors”.  
  - **`PlaceBet_SAFE`** stored procedure wraps insert + audit in a transaction (ACID guarantees).

---

## 🛠 Technology Stack

| Layer           | Tech / Libs                                              |
| --------------- | -------------------------------------------------------- |
| **Backend**     | Play Framework (Java 2.8), Ebean ORM (for model mapping), raw-SQL via `io.ebean.DB.sqlQuery` & `CallableSql` |
| **Database**    | MySQL (on Google Cloud SQL) with: <br> • Tables: `Users`, `Games`, `Betting_Odds`, `Picks`, `PickAudit` <br> • Stored procedures, transactions, triggers for audit & safety |
| **Frontend**    | React 17+, React Router v6, Axios for HTTP, Bootstrap 5, Chart.js / react-chartjs-2 for graphs |
| **Auth**        | JWT (`TokenService`) + custom Play `AuthenticatedAction` |
| **Deployment**  | Backend: `sbt run` (→ `localhost:9000`) <br> Frontend: `npm start` in `ui/` (→ `localhost:3000`) |

---

## 📦 Installation & Setup

1. **Clone & configure**  
   ```bash
   git clone https://github.com/yourusername/nba-moneyline-assistant.git
   cd nba-moneyline-assistant
    ```

2. **Backend**

Ensure your `conf/application.conf` points to your Google Cloud SQL instance:

```properties
db.default.driver = "com.mysql.cj.jdbc.Driver"
db.default.url = "jdbc:mysql://<GCP_HOST>:3306/your_db"
db.default.username = "bolt_dev"
db.default.password = "bolt123"
```

> **Note:** Run evolutions only if you need local migrations; otherwise, your GCP schema must already contain all tables, procedures, and triggers.

Start the server:

```bash
sbt run
```

The backend listens on [http://localhost:9000](http://localhost:9000).

3. **Frontend**

Navigate to the `ui` directory, install dependencies, and start the React development server:

```bash
cd ui
npm install
npm start
```

The React dev server runs on [http://localhost:3000](http://localhost:3000) and proxies `/api/**` calls to Play.

## ⚙️ Configuration

### CORS & Proxy
The `ui/package.json` file has the following proxy configuration:
```json
"proxy": "http://localhost:9000"
```

### JWT Secret
Set the `play.http.secret.key` in `application.conf` (or as an environment variable) for production.

### Environments
Adjust `db.default.url` in `application.conf` for development vs production environments.

---

## 🧩 Database Overview

### Users & Profiles
```sql
CREATE TABLE Users (
  user_id       INT AUTO_INCREMENT PRIMARY KEY,
  username      VARCHAR(50) NOT NULL UNIQUE,
  email         VARCHAR(100) NOT NULL UNIQUE,
  created_time  DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Games & Odds
```sql
CREATE TABLE Games (
  game_id          INT PRIMARY KEY,
  team1_id         INT,
  team2_id         INT,
  winning_team_id  INT,
  game_date        DATETIME
);

CREATE TABLE Betting_Odds (
  odds_id          INT AUTO_INCREMENT PRIMARY KEY,
  game_id          INT,
  team1_moneyline  DECIMAL(6,2),
  team2_moneyline  DECIMAL(6,2),
  team1_spread     DECIMAL(4,2),
  team2_spread     DECIMAL(4,2),
  team1_total      VARCHAR(10),
  team2_total      VARCHAR(10),
  FOREIGN KEY (game_id) REFERENCES Games(game_id)
);
```

### Bets & Audit
```sql
CREATE TABLE Picks (
  pick_id           INT AUTO_INCREMENT PRIMARY KEY,
  user_id           INT,
  game_id           INT,
  predicted_outcome VARCHAR(64),
  bet_amount        DECIMAL(10,2),
  FOREIGN KEY (user_id) REFERENCES Users(user_id),
  FOREIGN KEY (game_id) REFERENCES Games(game_id)
);

CREATE TABLE PickAudit (
  audit_id    INT AUTO_INCREMENT PRIMARY KEY,
  pick_id     INT,
  user_id     INT,
  game_id     INT,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

> **Note:** A trigger fires on `INSERT` into `Picks` to log into `PickAudit`.

---

## 🔄 Advanced SQL

### Upsets
```sql
SELECT t.team_name, COUNT(*) AS upsets
  FROM Games g
  JOIN Betting_Odds bo ON g.game_id = bo.game_id
  JOIN Teams t ON g.winning_team_id = t.team_id
 WHERE (g.winning_team_id = g.team1_id AND bo.team1_moneyline > bo.team2_moneyline)
    OR (g.winning_team_id = g.team2_id AND bo.team2_moneyline > bo.team1_moneyline)
 GROUP BY t.team_name
 ORDER BY upsets DESC;
```

### Stored Procedure: PlaceBet_SAFE
```sql
DELIMITER $$
CREATE PROCEDURE PlaceBet_SAFE(
  IN  p_user_id INT,
  IN  p_game_id INT,
  IN  p_outcome VARCHAR(64),
  IN  p_amount DECIMAL(10,2),
  OUT p_new_pick INT
)
BEGIN
  START TRANSACTION;
  INSERT INTO Picks(user_id, game_id, predicted_outcome, bet_amount)
    VALUES (p_user_id, p_game_id, p_outcome, p_amount);
  SET p_new_pick = LAST_INSERT_ID();
  -- audit trigger will fire automatically
  COMMIT;
END $$
DELIMITER ;
```

---

© 2024 NBA Moneyline Assistant | All rights reserved