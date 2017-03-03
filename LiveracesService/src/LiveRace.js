class LiveRace {
  constructor(organiserID, opponents) {
    this.id = id;
    this.organiserID = organiserID;
    this.participants = {};

    this.participantsIDs = opponents.slice();
    this.participantsIDs.push(organiserID);

    // Populate the participants collection
    participantsIDs.forEach(function(participantID) {
      this.participants[participantID] = {
        inLobby: false,
        isReady: false,
        ws: undefined
      };
    });

    this.duration = undefined;
    this.length = undefined;
    this.startTime = undefined;
  }
}

module.exports = LiveRace;