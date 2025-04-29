package controllers;

import play.mvc.*;
import models.User;
import play.libs.Json;
import com.fasterxml.jackson.databind.JsonNode;
import services.TokenService;

public class AuthController extends Controller {

    /**
     * Registration endpoint.
     * Expects JSON:
     * {
     *    "username": "yourusername",
     *    "email": "youremail@example.com"
     * }
     */
    public Result save(Http.Request request) {
        JsonNode json = request.body().asJson();
        if (json == null) {
            return badRequest("Invalid JSON");
        }
        String username = json.get("username").asText();
        String email = json.get("email").asText();
        
        // Creating a new user (password is not used)
        User user = new User();
        user.username = username;
        user.email = email;
        // Optionally, you can set user.password = ""; if the column exists,
        // or simply leave it null if that's acceptable.
        user.save();
        return ok(Json.newObject().put("status", "success"));
    }

    /**
     * Authentication endpoint.
     * Expects JSON:
     * {
     *    "username": "yourusername",
     *    "email": "youremail@example.com"
     * }
     */
    public Result authenticate(Http.Request request) {
        JsonNode json = request.body().asJson();
        if (json == null) {
            return badRequest("Invalid JSON");
        }
        String username = json.get("username").asText();
        String email = json.get("email").asText();
        
        // Query the user by username and email
        User user = User.find.query().where()
                        .eq("username", username)
                        .eq("email", email)
                        .findOne();
        if (user == null) {
            return unauthorized("Invalid credentials");
        }
        // Generate a JWT token using the username
        String token = TokenService.generateToken(username);
        return ok(Json.newObject().put("status", "success").put("token", token));
    }

    /**
     * Logout endpoint.
     * For JWT-based systems, logout is typically handled on the client side.
     */
    public Result logout(Http.Request request) {
        return ok(Json.newObject().put("status", "success").put("message", "Logged out"));
    }
}
