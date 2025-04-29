package models;

import io.ebean.Model;
import io.ebean.Finder;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.time.LocalDateTime;
import jakarta.persistence.Table;

@Entity
@Table(name = "Betting_Odds")
public class BettingOdds extends Model {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    public int oddsId;

    @ManyToOne
    @JoinColumn(name="game_id", referencedColumnName="game_id")
    public Game game;
    
    public double team1Moneyline;
    public double team2Moneyline;
    public double team1Spread;
    public double team2Spread;
    public String team1Total;
    public String team2Total;
    public LocalDateTime oddsTimestamp;
    
    public static final Finder<Integer, BettingOdds> find = new Finder<>(BettingOdds.class);
}
