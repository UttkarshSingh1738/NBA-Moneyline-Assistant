package services;

import models.User;
import java.util.List;

public class UserService {

    /**
     * Retrieves a user by username.
     * @param username the username to search for.
     * @return the User if found, otherwise null.
     */
    public User getUserByUsername(String username) {
        return User.find.query().where().eq("username", username).findOne();
    }

    /**
     * Retrieves all users.
     * @return a list of all Users.
     */
    public List<User> getAllUsers() {
        return User.find.all();
    }

    /**
     * Saves a new user to the database.
     * @param user the user to save.
     */
    public void saveUser(User user) {
        user.save();
    }
}
