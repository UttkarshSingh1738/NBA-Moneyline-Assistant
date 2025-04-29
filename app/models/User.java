package models;

import io.ebean.Model;
import io.ebean.Finder;
import io.ebean.annotation.WhenCreated;
import io.ebean.annotation.WhenModified;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table;

@Entity
@Table(name="Users")  // Ensures the model maps to the "Users" table
public class User extends Model {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    public int userId;

    public String username;
    public String email;

    public static final Finder<Integer, User> find = new Finder<>(User.class);

}
