package controllers;

import play.mvc.*;
import play.libs.Json;
import io.ebean.DB;
import io.ebean.SqlQuery;
import io.ebean.SqlRow;
import io.ebean.Transaction;
import java.util.List;
import actions.AuthenticatedAction;

@With(AuthenticatedAction.class)
public class AdvancedQueryController extends Controller {

    public Result getUpsetTeams(Http.Request request) {
        String sql = "SELECT t.team_name, COUNT(g.game_id) AS upsets " +
                     "FROM Games g " +
                     "JOIN Betting_Odds bo ON g.game_id = bo.game_id " +
                     "JOIN Teams t ON g.winning_team_id = t.team_id " +
                     "WHERE (g.winning_team_id = g.team1_id AND bo.team1_moneyline > bo.team2_moneyline) " +
                     "   OR (g.winning_team_id = g.team2_id AND bo.team2_moneyline > bo.team1_moneyline) " +
                     "GROUP BY t.team_name " +
                     "ORDER BY upsets DESC";
        SqlQuery query = DB.sqlQuery(sql);
        List<SqlRow> rows = query.findList();
        return ok(Json.toJson(rows));
    }

    public Result getTeamWinRates(Http.Request request) {
        String sql =
            "SELECT " +
            "  t.team_name, " +
            "  COUNT(g.game_id) AS total_games, " +
            "  SUM(CASE WHEN g.winning_team_id = t.team_id THEN 1 ELSE 0 END) AS total_wins, " +
            "  ROUND(100.0 * SUM(CASE WHEN g.winning_team_id = t.team_id THEN 1 ELSE 0 END) / COUNT(g.game_id), 2) AS actual_win_percentage, " +
            "  ROUND(AVG(CASE WHEN t.team_id = g.team1_id THEN bo.team1_moneyline ELSE bo.team2_moneyline END), 2) AS avg_moneyline " +
            "FROM Teams t " +
            " JOIN Games g ON t.team_id = g.team1_id OR t.team_id = g.team2_id " +
            " JOIN Betting_Odds bo ON g.game_id = bo.game_id " +
            "GROUP BY t.team_name " +
            "ORDER BY actual_win_percentage DESC";
        List<SqlRow> rows = DB.sqlQuery(sql).findList();
        return ok(Json.toJson(rows));
    }

    public Result getUnderdogWins(Http.Request request) {
        String sql =
            "SELECT " +
            "  g.game_id, " +
            "  t1.team_name AS team1, " +
            "  t2.team_name AS team2, " +
            "  tw.team_name AS winner " +
            "FROM Games g " +
            " JOIN Betting_Odds bo ON g.game_id = bo.game_id " +
            " JOIN Teams t1 ON g.team1_id = t1.team_id " +
            " JOIN Teams t2 ON g.team2_id = t2.team_id " +
            " JOIN Teams tw ON g.winning_team_id = tw.team_id " +
            "WHERE (bo.team1_spread > bo.team2_spread AND g.winning_team_id = g.team1_id) " +
            "   OR (bo.team2_spread > bo.team1_spread AND g.winning_team_id = g.team2_id) " +
            "LIMIT 15";
        List<SqlRow> rows = DB.sqlQuery(sql).findList();
        return ok(Json.toJson(rows));
    }

    public Result getActiveBettors(Http.Request request) {
        String sql =
        "SELECT u.username, COUNT(*) AS total_bets       " +
        "FROM PickAudit a                               " +
        "  JOIN Users u ON a.user_id = u.user_id         " +
        "GROUP BY a.user_id, u.username                 " +
        "ORDER BY total_bets DESC                       " +
        "LIMIT 10;                                      ";

        List<SqlRow> rows = DB.sqlQuery(sql).findList();
        return ok(Json.toJson(rows));
    }
    
    public Result getUserBetHistory(Http.Request request) {
        String username = request.attrs().get(utils.Security.USERNAME);

        String sql =
        "SELECT pa.created_at AS ts, p.bet_amount, p.predicted_outcome, " +
        "       g.team1_id, g.team2_id, " +
        "       t1.team_name AS team1_name, t2.team_name AS team2_name " +
        "  FROM PickAudit pa " +
        "  JOIN Picks p        ON pa.pick_id = p.pick_id " +
        "  JOIN Games g        ON p.game_id   = g.game_id " +
        "  JOIN Teams t1       ON g.team1_id  = t1.team_id " +
        "  JOIN Teams t2       ON g.team2_id  = t2.team_id " +
        "  JOIN Users u        ON pa.user_id  = u.user_id " +
        " WHERE u.username = :uname " +
        " ORDER BY pa.created_at";

        List<SqlRow> rows = DB.sqlQuery(sql)
                            .setParameter("uname", username)
                            .findList();

        return ok(Json.toJson(rows));
    }
}
