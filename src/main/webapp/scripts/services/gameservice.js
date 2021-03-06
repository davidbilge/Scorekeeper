/**
 * Created with JetBrains WebStorm.
 * User: andre.marbeck
 * Date: 28.05.13
 * Time: 09:47
 * To change this template use File | Settings | File Templates.
 */



angular.module('game.services', ['ngResource'], null)

    .service('GameService', function ($resource, $http) {

        var gameList = null;

        this.getAllGames = function (pageSize, forPage) {
            console.log("get all Games_ " + pageSize + " " + forPage);


            gameList = $resource('rest/games', {pageSize: pageSize, page: forPage}, {query: {method: 'GET', isArray: true}}).query();


            return gameList


        };

        this.calculateGame = function (teamAPlayer1, teamAPlayer2, teamBPlayer1, teamBPlayer2) {
            console.log("calculate Game_ " + teamAPlayer1 + " " + teamAPlayer2+ " " + teamBPlayer1+ " " + teamBPlayer2);


            gameList = $resource('rest/calculate', {teamAPlayer1: teamAPlayer1, teamAPlayer2: teamAPlayer2, teamBPlayer1: teamBPlayer1, teamBPlayer2: teamBPlayer2}, {query: {method: 'GET', isArray: false}}).query();


            return gameList


        };

        this.addNewGame = function (newGame) {
            console.log("add new Game");
            $http({method: 'POST', url: 'rest/games', data: newGame})
                .success(function (response) {

                    gameList.push(newGame);
                    console.log('success: ' + response.data);
                })
                .error(function (response) {
                    console.log('error: ' + response);
                });
        };

        this.deleteLastGame = function () {
            var lastGame = gameList[0];
            console.log("delete last Game: "+lastGame.gameId);


            $http({method: 'POST', url: 'rest/games/delete', data: lastGame})
                .success(function (response) {
                    for (var i = gameList.length - 1; i >= 0; i--) {
                        console.log("current: "+ gameList[i].gameId);
                        if (gameList[i].gameId.toString() === lastGame.gameId.toString()) {
                            console.log("splice list");
                            gameList.splice(i, 1);
                            break;
                        }
                    }

                    console.log('success: ' + response.data);
                })
                .error(function (response) {
                    console.log('error: ' + response);
                });
        };

        this.getScoreTable = function () {
            return  $resource('rest/scoreboard', {}, {query: {method: 'GET', isArray: true}}).query();
        };

        this.getNotRankedBoard = function () {
            console.log("getNotRankedBoard ");
            return  $resource('rest/scoreboard/notranked', {}, {query: {method: 'GET', isArray: true}}).query();
        };

        this.getInactivePlayers = function () {
            console.log("getInactive Players ");
            return  $resource('rest/scoreboard/inactive', {}, {query: {method: 'GET', isArray: true}}).query();
        };

        var currentPlan = {plan: []};
        this.getCurrentGamePlan = function () {
            console.log("getCurrentGamePlan");
            currentPlan.plan = $resource('rest/games/suggested', {}, {query: {method: 'GET', isArray: true}}).query();
            return currentPlan;
        }

        this.createNewGamePlan = function () {
            console.log('create new Game plan');
            $http({method: 'POST', url: 'rest/games/suggested'})
                .success(function (response) {

                    currentPlan.plan = $resource('rest/games/suggested', {}, {query: {method: 'GET', isArray: true}}).query();
                    console.log('success: ' + response.data);
                })
                .error(function (response) {
                    console.log('error: ' + response);
                });
            //this.currentPlan = $resource('rest/games/suggested', {}, {query: {method:'POST', isArray:true}}).query();
        }
    });

