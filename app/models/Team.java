package models;

import io.ebean.Model;
import io.ebean.Finder;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table;

@Entity
@Table(name = "Teams")
public class Team extends Model {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    public int teamId;
    
    public String teamName;
    public double winRate; // corresponds to DECIMAL(5,2)

    public static final Finder<Integer, Team> find = new Finder<>(Team.class);
}
