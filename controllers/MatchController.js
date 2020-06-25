// Model classes
SessionData = require('../models/classes/SessionData');

// Service instances
const MatchService = require('../services/MatchService');

//
exports.indexParams = async function(req, res) {
    let sessionData = SessionData.fromObject(req.session.userData);

    let match = await MatchService.getMatchById(req.params.matchId);

    if(match.users.some((user) => { return user.id == sessionData.id; }))
    {
        sessionData.currentMatchId = match.id;

        req.session.userData = sessionData;
        res.render("../views/match.html");
    }
    else
    {
        res.sendStatus(404);
    }
};

exports.index = async function(req, res){
    let sessionData = SessionData.fromObject(req.session.userData);

    if(!sessionData.currentMatchId){
        res.sendStatus(404);
        return false;
    }

    let match = await MatchService.getMatchById(sessionData.currentMatchId);

    if(!match){
        res.sendStatus(404);
        return false;
    }

    if(match.users.some((user) => { return user.id == sessionData.id; }))
    {
        sessionData.currentMatchId = match.id;

        req.session.userData = sessionData;
        res.render("../views/match.html");
    }
    else
    {
        res.sendStatus(404);
    }
}