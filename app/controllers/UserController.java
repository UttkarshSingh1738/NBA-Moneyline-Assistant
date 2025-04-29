package controllers;

import actions.AuthenticatedAction;
import com.fasterxml.jackson.databind.node.ObjectNode;
import models.User;
import services.UserService;
import play.libs.Json;
import play.mvc.*;

import javax.inject.Inject;

@With(AuthenticatedAction.class)
public class UserController extends Controller {
    private final UserService userService;

    @Inject
    public UserController(UserService userService) {
        this.userService = userService;
    }

    /** 
     * GET /api/users/me 
     * Returns the logged‐in user as JSON 
     */
    public Result me(Http.Request request) {
        String username = request.attrs().get(utils.Security.USERNAME);
        User u = userService.getUserByUsername(username);
        if (u == null) {
            ObjectNode err = Json.newObject().put("error", "User not found");
            return notFound(err);
        }
        return ok(Json.toJson(u));
    }
}
