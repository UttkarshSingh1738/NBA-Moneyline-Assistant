// app/controllers/GameController.java
package controllers;

import actions.AuthenticatedAction;
import io.ebean.Query;
import io.ebean.DB;
import io.ebean.SqlRow;
import models.Game;
import models.BettingOdds;
import play.libs.Json;
import play.mvc.*;
import java.util.*;


@With(AuthenticatedAction.class)
public class GameController extends Controller {
    
public Result listByGame(Long gameId) {

    String sql = "SELECT "
               + "bo.odds_id, "
               + "bo.team1_moneyline, bo.team2_moneyline, "
               + "bo.team1_spread, bo.team2_spread, "
               + "bo.team1_total, bo.team2_total, "
               + "g.team1_id, "
               + "g.team2_id, "
               + "t1.team_name AS team1_name, "
               + "t2.team_name AS team2_name "
               + "FROM Betting_Odds bo "
               + "JOIN Games g ON bo.game_id = g.game_id "
               + "JOIN Teams t1 ON g.team1_id = t1.team_id "
               + "JOIN Teams t2 ON g.team2_id = t2.team_id "
               + "WHERE bo.game_id = :gid";

    List<SqlRow> rows = DB.sqlQuery(sql)
                         .setParameter("gid", gameId)
                         .findList();

    List<Map<String, Object>> out = new ArrayList<>();
    for (SqlRow r : rows) {
        Map<String, Object> m = new HashMap<>();
        m.put("oddsId", r.getLong("odds_id"));
        m.put("team1Name", r.getString("team1_name"));
        m.put("team2Name", r.getString("team2_name"));
        m.put("team1Moneyline", r.getDouble("team1_moneyline"));
        m.put("team2Moneyline", r.getDouble("team2_moneyline"));
        m.put("team1Spread", r.getDouble("team1_spread"));
        m.put("team2Spread", r.getDouble("team2_spread"));
        m.put("team1Total", r.getString("team1_total"));
        m.put("team2Total", r.getString("team2_total"));
        out.add(m);
    }

    return ok(Json.toJson(out));
}

  /** GET /api/games?q=foo */
  public Result list(Http.Request request) {
  Optional<String> qOpt = request.queryString("q");
  String q = qOpt.orElse(null);

  Query<Game> query = Game.find.query()
                             .fetch("team1")
                             .fetch("team2");

  if (q != null && !q.trim().isEmpty()) {
    String pat = "%" + q.trim() + "%";
    query.where()
         .disjunction()
           .ilike("team1.teamName", pat)
           .ilike("team2.teamName", pat)
         .endJunction();
  } else {
    query.orderBy("gameDate desc")
         .setFirstRow(0)
         .setMaxRows(10);
  }

  List<Game> games = query.findList();
  return ok(Json.toJson(games));
}

}
