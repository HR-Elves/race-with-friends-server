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
    console.log('LiveRace.js: addParticipantToLobby called');    
    if (this.participants[participantID] !== undefined) {
      this.participants[participantID].inLobby = true;
      this.participants[participantID].ws = participantWS;
    }
    this.sendLobbyStatus();    
  }

  removeParticipantFromLobby(participantID, participantWS) {
    console.log('LiveRace.js: removeParticipantFromLobby called'); 
    if (this.participants[participantID] !== undefined) {
      this.participants[participantID].inLobby = false;
      this.participants[participantID].isReady = false;      
      this.participants[participantID].ws = undefined;
    }
    this.sendLobbyStatus();    
  }

  setParticipantIsReady(participantID) {
    console.log('LiveRace.js: setParticipantIsReady called');        
    if (this.participants[participantID] !== undefined) {
      this.participants[participantID].isReady = true;      
    }
    this.sendLobbyStatus();    
  }

  unsetParticipantIsReady(participantID) {
    console.log('LiveRace.js: unsetParticipantIsReady called');        
    if (this.participants[participantID] !== undefined) {
      this.participants[participantID].isReady = false;      
    }
    this.sendLobbyStatus();
  }

  broadcastPosition(originatorID, positionMessage) {
    for (let participantID in this.participants) {
      let participant = this.participants[participantID];
      if (participant.ws !== undefined && participant.id !== originatorID) {
        participant.ws.send(JSON.stringify(['position-update', positionMessage]));
      }
    }
  }

  broadcast(message) {
    for (let participantID in this.participants) {
      if (participant.ws !== undefined) {
        participant.ws.send(JSON.stringify(message));
      }
    }
  }

  sendLobbyStatus() {
    console.log('LiveRace.js: sendLobbyStatus called');
    for (let participantID in this.participants) {
      let participant = this.participants[participantID];
      let lobbyStatusUpdateMessage = ['lobbystatus', this.getLobbyStatusAsJSON()];
      if (participant.ws !== undefined) {
        participant.ws.send(JSON.stringify(lobbyStatusUpdateMessage));
      }
    }
  }

  getLobbyStatusAsJSON() {
    let statusMessage = {};
    statusMessage.name = this.name;
    statusMessage.organiserID = this.organiserID;
    statusMessage.participants = [];

    for (let participantID in this.participants) {
      let participant = this.participants[participantID];
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

    return statusMessage;
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