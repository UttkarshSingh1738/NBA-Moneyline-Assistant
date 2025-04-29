package models;

import io.ebean.Model;
import io.ebean.Finder;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.ManyToOne;

@Entity
public class Player extends Model {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    public int playerId;
    
    public String playerName;
    
    @ManyToOne
    public Team team;

    public static final Finder<Integer, Player> find = new Finder<>(Player.class);
}
