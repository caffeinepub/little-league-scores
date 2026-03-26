import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";

actor {
  /// --- Types and Comparison Functions ---
  type MvpInfo = {
    name : Text;
    team : Text;
    photo : Storage.ExternalBlob;
  };

  type Division = {
    #coEdTeeBall;
    #baseballCoachPitch;
    #softballCoachPitch;
    #baseballMinors;
    #softballMinors;
    #baseballMajors;
    #softballMajors;
  };

  type GameRecord = {
    date : Text;
    homeTeam : Text;
    awayTeam : Text;
    homeScore : Nat;
    awayScore : Nat;
    division : Division;
    mvpInfo : ?MvpInfo;
  };

  type ScheduledGame = {
    date : Text;
    homeTeam : Text;
    awayTeam : Text;
    division : Division;
  };

  public type UserProfile = {
    name : Text;
  };

  module GameRecord {
    public func compare(game1 : GameRecord, game2 : GameRecord) : Order.Order {
      switch (Text.compare(game1.date, game2.date)) {
        case (#equal) { Text.compare(game1.homeTeam, game2.homeTeam) };
        case (order) { order };
      };
    };
  };

  module ScheduledGame {
    public func compare(g1 : ScheduledGame, g2 : ScheduledGame) : Order.Order {
      switch (Text.compare(g1.date, g2.date)) {
        case (#equal) { Text.compare(g1.homeTeam, g2.homeTeam) };
        case (order) { order };
      };
    };
  };

  /// --- State Variables ---
  let gameRecords = Map.empty<Nat, GameRecord>();
  var nextGameId = 0;

  let scheduledGames = Map.empty<Nat, ScheduledGame>();
  var nextScheduledGameId = 0;

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  include MixinStorage();

  let userProfiles = Map.empty<Principal, UserProfile>();

  /// --- User Profile Management ---
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  /// --- Game Management ---
  public shared ({ caller }) func addGame(game : GameRecord) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add games");
    };
    gameRecords.add(nextGameId, game);
    let id = nextGameId;
    nextGameId += 1;
    id;
  };

  public shared ({ caller }) func updateGame(gameId : Nat, game : GameRecord) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update games");
    };
    if (not (gameRecords.containsKey(gameId))) {
      Runtime.trap("Game not found for update");
    };
    gameRecords.add(gameId, game);
  };

  public shared ({ caller }) func deleteGame(gameId : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete games");
    };
    if (not (gameRecords.containsKey(gameId))) {
      Runtime.trap("Game not found for delete");
    };
    gameRecords.remove(gameId);
  };

  /// --- MVP Photo Management ---
  public shared ({ caller }) func createExternalMvpPhoto(blob : Storage.ExternalBlob) : async Storage.ExternalBlob {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can upload MVP photos");
    };
    blob;
  };

  /// --- Query Functions (Public Read Access) ---
  public query func getGame(gameId : Nat) : async GameRecord {
    switch (gameRecords.get(gameId)) {
      case (null) { Runtime.trap("Game not found") };
      case (?game) { game };
    };
  };

  public query func getAllGames() : async [GameRecord] {
    gameRecords.values().toArray().sort();
  };

  public query func getGamesByDivision(division : Division) : async [GameRecord] {
    gameRecords.values().toArray().filter(
      func(g) {
        g.division == division;
      }
    );
  };

  public query func getMvpPhotoByGameId(gameId : Nat) : async Storage.ExternalBlob {
    switch (gameRecords.get(gameId)) {
      case (null) { Runtime.trap("Game not found") };
      case (?game) {
        switch (game.mvpInfo) {
          case (null) { Runtime.trap("MVP photo record not found for this game") };
          case (?mvpInfo) { mvpInfo.photo };
        };
      };
    };
  };

  /// --- Scheduled Game Management ---
  public shared ({ caller }) func addScheduledGame(game : ScheduledGame) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add scheduled games");
    };
    scheduledGames.add(nextScheduledGameId, game);
    let id = nextScheduledGameId;
    nextScheduledGameId += 1;
    id;
  };

  public shared ({ caller }) func updateScheduledGame(gameId : Nat, game : ScheduledGame) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update scheduled games");
    };
    if (not (scheduledGames.containsKey(gameId))) {
      Runtime.trap("Scheduled game not found");
    };
    scheduledGames.add(gameId, game);
  };

  public shared ({ caller }) func deleteScheduledGame(gameId : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete scheduled games");
    };
    if (not (scheduledGames.containsKey(gameId))) {
      Runtime.trap("Scheduled game not found");
    };
    scheduledGames.remove(gameId);
  };

  public query func getAllScheduledGames() : async [ScheduledGame] {
    scheduledGames.values().toArray().sort();
  };

  public query func getScheduledGamesByDivision(division : Division) : async [ScheduledGame] {
    scheduledGames.values().toArray().filter(
      func(g) {
        g.division == division;
      }
    );
  };
};
