class LiveRace {
  constructor(liveRaceID, raceName, raceDescription, organiserID, opponentIDs) {
    this.id = liveRaceID;
    this.organiserID = organiserID;
    this.participants = {};

    this.participantsIDs = opponentIDs.slice();
    this.participantsIDs.push(organiserID);

    // Populate the participants collection
    this.participantsIDs.forEach((participantID) => {
      this.participants[participantID] = {
        id: participantID,
        name: '',
        inLobby: false,
        isReady: false,
        ws: undefined
      };
    });

    this.duration = undefined;
    this.length = undefined;
    this.startTime = undefined;
    this.createdOn = new Date().toISOString();
  }
  
  isPartOfRace(userid) {
    return participantsIDs.includes(userid);
  }

  addParticipantToLobby(participantID, participantWS) {
    if (participants[participantID] !== undefined) {
      participants[participantID].inLobby = true;
      participants[participantID].ws = participantWS;
    }
    this.sendLobbyStatus();    
  }

  removeParticipantFromLobby(participantID, participantWS) {
    if (participants[participantID] !== undefined) {
      participants[participantID].inLobby = false;
      participants[participantID].isReady = false;      
      participants[participantID].ws = undefined;
    }
    this.sendLobbyStatus();    
  }

  setParticipantIsReady(participantID) {
    if (participants[participantID] !== undefined) {
      participants[participantID].isReady = false;      
    }
    this.sendLobbyStatus();    
  }

  unsetParticipantIsReady(participantID) {
    if (participants[participantID] !== undefined) {
      participants[participantID].isReady = false;      
    }
    this.sendLobbyStatus();
  }

  broadcastPosition(originatorID, positionMessage) {
    this.participants.forEach(participant => {
      lobbyStatusUpdateMessage = ['lobbystatus', this.getLobbyStatusAsJSON()];
      if (participant.ws !== undefined && participant.id !== originatorID) {
        participant.ws.send('position-update', positionMessage);
      }
    });
  }

  sendLobbyStatus() {
    this.participants.forEach(participant => {
      lobbyStatusUpdateMessage = ['lobbystatus', this.getLobbyStatusAsJSON()];
      if (participant.ws !== undefined) {
        participant.ws.send(JSON.stringify(lobbyStatusUpdateMessage));
      }
    });
  }

  getLobbyStatusAsJSON() {
    statusMessage = {};
    statusMessage.name = this.name;
    statusMessage.organiserID = this.organiserID;
    statusMessage.participants = [];

    for (participant in this.participants) {
      statusMessage.participants.push({
        id: participant.id,
        name: participant.name,
        inLobby: participant.inLobby,
        isReady: participant.isReady
      });
    }

    statusMessage.duration = this.duration;
    statusMessage.length = this.length;
    statusMessage.startTime = this.startTime;
    statusMessage.createdOn = this.createdOn;
  }

}

Object.defineProperty(LiveRace.prototype, 'isReady', {
  get: function() {
    for (participant in participants) {
      let currentParticipant = participants[participant];
      if (currentParticipant.isReady === false) {
        return false;
      }
    }
    return true;
  }

});

module.exports = LiveRace;