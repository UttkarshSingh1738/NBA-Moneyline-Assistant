// app/controllers/BettingController.java
package controllers;

import play.mvc.*;
import play.libs.Json;
import com.fasterxml.jackson.databind.JsonNode;
import play.db.Database;                 // <-- use Play’s Database
import javax.inject.Inject;
import java.sql.CallableStatement;
import io.ebean.DB;
import io.ebean.Transaction;
import java.sql.Connection;
import java.sql.Types;

import models.Pick;
import models.User;
import models.Game;

import actions.AuthenticatedAction;

@With(AuthenticatedAction.class)
public class BettingController extends Controller {

  private final Database db;

  @Inject
  public BettingController(Database db) {
    this.db = db;
  }

  public Result placeBetSafe(Http.Request req) {
    JsonNode body = req.body().asJson();
    if (body == null) {
      return badRequest("Expecting JSON");
    }

    int    userId  = body.get("user_id").asInt();
    int    gameId  = body.get("game_id").asInt();
    String outcome = body.get("predicted_outcome").asText();
    double amount  = body.get("bet_amount").asDouble();

    try (Connection conn = db.getConnection()) {
      // Call your stored procedure with 4 IN params, 1 OUT param:
      CallableStatement stmt = conn.prepareCall("{ CALL PlaceBet_SAFE(?, ?, ?, ?, ?) }");

      stmt.setInt   (1, userId);
      stmt.setInt   (2, gameId);
      stmt.setString(3, outcome);
      stmt.setDouble(4, amount);

      // register 5th as OUT int
      stmt.registerOutParameter(5, Types.INTEGER);

      stmt.execute();

      int newPickId = stmt.getInt(5);
      return ok(Json.newObject().put("pickId", newPickId));

    } catch (Exception e) {
      e.printStackTrace();
      return internalServerError("Error placing bet: " + e.getMessage());
    }
  }

    public Result placeBet(Http.Request request) { // NOT SAFE
        JsonNode json = request.body().asJson();
        if (json == null) {
            return badRequest("Expecting JSON data");
        }

        int userId = json.get("user_id").asInt();
        int gameId = json.get("game_id").asInt();
        String predictedOutcome = json.get("predicted_outcome").asText();
        double betAmount = json.get("bet_amount").asDouble();

        User u = User.find.byId(userId);
        if (u == null) {
            return badRequest("Invalid user_id");
        }

        Game g = Game.find.byId(gameId);
        if (g == null) {
            return badRequest("Invalid game_id");
        }

        Pick pick = new Pick();
        pick.user = u;
        pick.game = g;
        pick.predictedOutcome = predictedOutcome;
        pick.betAmount = betAmount;
        pick.save();

        return ok(Json.toJson(pick));
    }

    public Result simulateBet(Http.Request req) {
        JsonNode j = req.body().asJson();
        if (j == null) return badRequest("Expecting JSON");

        int userId = j.get("user_id").asInt();
        int gameId = j.get("game_id").asInt();
        String predictedOutcome = j.get("predicted_outcome").asText();
        double betAmount = j.get("bet_amount").asDouble();

        User u = User.find.byId(userId);
        Game g = Game.find.byId(gameId);
        if (u == null || g == null) {
        return badRequest("Invalid user or game");
        }

        Transaction txn = DB.beginTransaction();
        try {
        // 1) save the would-be pick
        Pick p = new Pick();
        p.user = u;
        p.game = g;
        p.predictedOutcome = predictedOutcome;
        p.betAmount = betAmount;
        p.save();

        // 2) compute the new total volume
        Double total = DB.sqlQuery(
            "SELECT SUM(bet_amount) AS sumAmt FROM Picks WHERE user_id = :uid")
            .setParameter("uid", userId)
            .findOne()
            .getDouble("sumAmt");

        // 3) rollback so nothing persists
        txn.rollback();

        // 4) return simulated total
        return ok(Json.newObject()
            .put("simulatedTotal", total));
        } catch (Exception e) {
        txn.rollback();
        return internalServerError("Simulation error");
        } finally {
        txn.end();
        }
    }
}
