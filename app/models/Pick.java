package models;

import io.ebean.Model;
import io.ebean.Finder;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;

@Entity
@Table(name="Picks")  // Ensures the model maps to the "Picks" table
public class Pick extends Model {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    public int pickId;

    @ManyToOne
    @JoinColumn(name = "user_id") // maps the User relationship to the 'user_id' column
    public User user;

    @ManyToOne
    @JoinColumn(name = "game_id") // maps the Game relationship to the 'game_id' column
    public Game game;
    
    public String predictedOutcome;
    public double betAmount;

    public void setPredictedOutcome(String o) {
        this.predictedOutcome = o;
    }
    public void setBetAmount(double amt) {
        this.betAmount = amt;
    }

    public static final Finder<Integer, Pick> find = new Finder<>(Pick.class);
}
