package actions;

import play.mvc.Action;
import play.mvc.Http;
import play.mvc.Result;
import services.TokenService;
import utils.Security;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionStage;

public class AuthenticatedAction extends Action.Simple {

    @Override
    public CompletionStage<Result> call(Http.Request request) {
            
        String token = request.headers().get("Authorization").orElse(null);
        if (token != null && !token.isEmpty()) {
            try {
                String user = TokenService.validateToken(token.replace("Bearer ", ""));
                Http.Request updatedRequest = request.addAttr(Security.USERNAME, user);
                return delegate.call(updatedRequest);
            } catch (Exception e) {
                return CompletableFuture.completedFuture(unauthorized("Invalid token"));
            }
        }
        return CompletableFuture.completedFuture(unauthorized("Missing token"));
    }
}