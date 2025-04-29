package controllers;

import actions.AuthenticatedAction;
import com.fasterxml.jackson.databind.JsonNode;
import models.Pick;
import models.User;
import play.libs.Json;
import play.mvc.*;
import services.UserService;

import javax.inject.Inject;
import java.util.List;

@With(AuthenticatedAction.class)
public class PickController extends Controller {
    private final UserService userService;

    @Inject
    public PickController(UserService userService) {
        this.userService = userService;
    }

    /** READ: list all picks for the current user */
    public Result list(Http.Request request) {

        String username = request.attrs().get(utils.Security.USERNAME);
        User u = userService.getUserByUsername(username);
        if (u == null) {
            return badRequest("User not found");
        }
        List<Pick> picks = Pick.find.query()
                                 .fetch("game")
                                 .where().eq("user.userId", u.userId)
                                 .findList();
        // System.out.println("Found picks for user " + u.userId + ": " + picks.size());
        // System.out.println("picks: " + picks.size());
        return ok(Json.toJson(picks));
    }

    /** UPDATE: change predictedOutcome or betAmount */
    public Result update(Http.Request request) {
        JsonNode j = request.body().asJson();
        int pickId = j.get("pickId").asInt();
        
        Pick p = Pick.find.byId(pickId);
        p.setPredictedOutcome(j.get("predictedOutcome").asText());
        p.setBetAmount(j.get("betAmount").asDouble());
        p.update();
        return ok(Json.toJson(p));
    }

    /** DELETE: remove a pick */
    public Result delete(Http.Request request) {
        int pickId = request.body().asJson().get("pickId").asInt();
        Pick.find.byId(pickId).delete();
        return ok();
    }
}
