package models;

import io.ebean.Model;
import io.ebean.Finder;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "Games") // Explicitly maps to the game table
public class Game extends Model {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    public int gameId;
    
    @ManyToOne
    @JoinColumn(name = "team1_id") // Explicitly maps team1 to column team1_id
    public Team team1;

    @ManyToOne
    @JoinColumn(name = "team2_id") // Explicitly maps team2 to column team2_id
    public Team team2;

    @ManyToOne
    @JoinColumn(name = "winning_team_id") // Explicitly maps winningTeam to column winning_team_id
    public Team winningTeam;

    // Storing the game date as a String (as per your DDL)
    public String gameDate;
    
    public static final Finder<Integer, Game> find = new Finder<>(Game.class);
}
