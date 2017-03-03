angular.module('mean.system')
  .controller('GameController', ['$scope', 'game', '$timeout', '$location', 'MakeAWishFactsService', '$http', '$dialog', 'gameModals', '$window', 'jwtHelper', function ($scope, game, $timeout, $location, MakeAWishFactsService, $http, $dialog, gameModals, $window, jwtHelper) {
    Materialize.toast('Welcome!', 4000);
    $scope.hasPickedCards = false;
    $scope.winningCardPicked = false;
    $scope.showTable = false;
    $scope.modalShown = false;

    $scope.game = game;
    $timeout(function () {
      $window.sessionStorage.setItem('gameID', game.gameID);
    }, 500);

    $scope.friendList = [];
    $scope.notifications = [];

    var sendNotification = function (friendId, userId, mess) {
      var privateSocket = io.connect(`/${friendId}`);
      privateSocket.emit('message', { friend_Id: friendId, user_Id: userId, message: mess });
    };

    $scope.sendInvite2 = (friend) => {
      array = [];
      var currentUser = localStorage.getItem('Email');
      if (currentUser !== friend) {
        array.push({ email: friend });
        if ($scope.sentEmails.indexOf(friend) === -1) {
          $scope.sentEmails.push(friend);
        } else {
          $scope.cantSend.push(friend);
        }
        if ($scope.sentEmails.length > 11) {
          $scope.canSend = false;
        } else {
          $scope.canSend = true;
        }
        if ($scope.canSend) {
          $http.post('/api/search/users', { emailArray: array, link: document.URL, senderEmail: localStorage.getItem('Email') }).success(function (res) {
            if (res.statusCode === 202) {
              Materialize.toast('Invite Sent', 4000);
            } else {
              Materialize.toast('Invite not Sent', 4000);
            }
          });
          $http({
            method: 'GET',
            url: `/api/get/friend/email?friend_email=${friend}`
          }).then(function successCallback(response) {
            $scope.friendId = response.data;
            var user = localStorage.getItem('JWT');
            var email = localStorage.getItem('Email');
            var tokenDec = jwtHelper.decodeToken(user);
            var linkStr = 'link';
            var link = linkStr.link(document.URL);
            $http({
              method: 'GET',
              url: `/api/username?email=${email}`
            }).then(function successCallback2(response2) {
              var username = response2.data;
              var message = `${username} would like to invite you to join cards for humanity game. Kindly click this ${link} to join`;
              $http.post('/api/saveNotifications', { friend_Id: $scope.friendId, user_Id: tokenDec._doc._id, mess: message }).success(function (res) {
              });
              sendNotification($scope.friendId, tokenDec._doc._id, message);
            }, function errorCallback(response2) {
            });
          }, function errorCallback(response) {
          });
        } else {
          Materialize.toast('You cannot invite more than 11', 4000);
        }
      } else {
        Materialize.toast('You cannot invite yourself', 4000);
      }
    };

    if (!sessionStorage.getItem('guestPlayer') || !sessionStorage.getItem('socialPlayer')) {
      var id = jwtHelper.decodeToken(localStorage.getItem('JWT'))._doc._id;
      $http({
        method: 'GET',
        url: `/api/notifications?id=${id}`
      }).then(function successCallback(response) {
        var data = response.data;
        data.forEach((message) => {
          $scope.notifications.push(`${message.date} - ${message.message}`);
        });
      }, function errorCallback(response) {
      });
      var myPrivateSocket = io.connect(`/${id}`);
      myPrivateSocket.on('notify', function (message) {
        $scope.notifications.push(`${message.date} - ${message.mess}`);
      });
    } else {
      $scope.guestPlayer = true;
    }

    $scope.readNotifications = function () {

    };

    $scope.pickedCards = [];
    var makeAWishFacts = MakeAWishFactsService.getMakeAWishFacts();
    $scope.makeAWishFact = makeAWishFacts.pop();
    $scope.pickCard = function (card) {
      if (!$scope.hasPickedCards) {
        if ($scope.pickedCards.indexOf(card.id) < 0) {
          $scope.pickedCards.push(card.id);
          if (game.curQuestion.numAnswers === 1) {
            $scope.sendPickedCards();
            $scope.hasPickedCards = true;
          } else if (game.curQuestion.numAnswers === 2 &&
            $scope.pickedCards.length === 2) {
            // delay and send
            $scope.hasPickedCards = true;
            $timeout($scope.sendPickedCards, 300);
          }
        } else {
          $scope.pickedCards.pop();
        }
      }
    };

    $scope.pointerCursorStyle = function () {
      if ($scope.isCzar() && $scope.game.state === 'waiting for czar to decide') {
        return { cursor: 'pointer' };
      }
      return {};
    };

    $scope.getFriendsEmail = function () {
      var user = localStorage.getItem('JWT');
      var tokenDec = jwtHelper.decodeToken(user);
      $http({
        method: 'GET',
        url: `/api/get/friendsEmail?user_id=${tokenDec._doc._id}`
      }).then(function successCallback(response) {
        var data = response.data;
        $scope.friendList = data;
      }, function errorCallback(response) {
      });
    };

    $scope.display = function () {
      document.getElementById('friend').style.display = 'block';
    };

    $scope.addFriend = function () {
      var user = localStorage.getItem('JWT');
      var tokenDec = jwtHelper.decodeToken(user);
      var friend = document.getElementById('newFriend').value;
      document.getElementById('newFriend').value = '';
      $http.post('/api/friends', { email: friend, user_id: tokenDec._doc._id }).success(function (res) {
        if (res.succ) {
          setTimeout(() => {
            $scope.$apply(() => {
              $scope.friendList.push(res.email);
            });
          }, 1000);
        }
      });
    };

    $scope.getEmail = function () {
      $scope.canSend = false;
      $http({
        method: 'GET',
        url: '/api/userEmail'
      }).then(function successCallback(response) {
        var data = response.data;
        $scope.emails = data;
      }, function errorCallback(response) {});
    };

    $scope.sentEmails = [];
    $scope.canSend = false;
    $scope.cantSend = [];
    $scope.sendInvite = function () {
      array = [];
      var selectedEmail = document.getElementById('select').value;
      var currentUser = localStorage.getItem('Email');
      if (currentUser !== selectedEmail) {
        array.push({ email: selectedEmail });
        if ($scope.sentEmails.indexOf(selectedEmail) === -1) {
          $scope.sentEmails.push(selectedEmail);
        } else {
          $scope.cantSend.push(selectedEmail);
        }
        if ($scope.sentEmails.length > 11) {
          $scope.canSend = false;
        } else {
          $scope.canSend = true;
        }
        if ($scope.canSend) {
          $http.post('/api/search/users', { emailArray: array }).success(function (res) {
            if (res.statusCode === 202) {
              $scope.showSuccessAlert = true;
              $scope.timer(5000);
            } else {
              $location.path('/#!/signup');
            }
          });
        } else {
          $scope.showAlert2 = true;
          $scope.timer(4000);
        }
      } else {
        $scope.showWarningAlert = true;
        $scope.timer(5000);
      }
      document.getElementById('select').value = '';
    };


    $scope.timer = function (howLong) {
      $timeout(function () {
        $scope.showSuccessAlert = false;
        $scope.showWarningAlert = false;
        $scope.showAlert2 = false;
      }, howLong);
    };
    $scope.checkFirst = function () {
      $scope.user.emails.splice(0, $scope.user.roles.length);
      $scope.user.emails.push('guest');
    };

    $scope.sendPickedCards = function () {
      game.pickCards($scope.pickedCards);
      $scope.showTable = true;
    };

    $scope.cardIsFirstSelected = function (card) {
      if (game.curQuestion.numAnswers > 1) {
        return card === $scope.pickedCards[0];
      }
      return false;
    };

    $scope.cardIsSecondSelected = function (card) {
      if (game.curQuestion.numAnswers > 1) {
        return card === $scope.pickedCards[1];
      }
      return false;
    };

    $scope.firstAnswer = function ($index) {
      if ($index % 2 === 0 && game.curQuestion.numAnswers > 1) {
        return true;
      }
      return false;
    };

    $scope.secondAnswer = function ($index) {
      if ($index % 2 === 1 && game.curQuestion.numAnswers > 1) {
        return true;
      }
      return false;
    };

    $scope.showFirst = function (card) {
      return game.curQuestion.numAnswers > 1 && $scope.pickedCards[0] === card.id;
    };

    $scope.showSecond = function (card) {
      return game.curQuestion.numAnswers > 1 && $scope.pickedCards[1] === card.id;
    };

    $scope.isPlayer = function ($index) {
      $window.sessionStorage.setItem('Username', game.players[game.playerIndex].username);
      $window.sessionStorage.setItem('Avatar', game.players[game.playerIndex].avatar);
      return $index === game.playerIndex;
    };

    $scope.showSecond = function (card) {
      return game.curQuestion.numAnswers > 1 && $scope.pickedCards[1] === card.id;
    };

    $scope.isCustomGame = function () {
      return !(/^\d+$/).test(game.gameID) && game.state === 'awaiting players';
    };

    $scope.currentCzar = function ($index) {
      return $index === game.czar;
    };

    $scope.winningColor = function ($index) {
      if (game.winningCardPlayer !== -1 && $index === game.winningCard) {
        return $scope.colors[game.players[game.winningCardPlayer].color];
      }
      return '#f9f9f9';
    };

    $scope.isCzar = function () {
      return game.czar === game.playerIndex;
    };
    $scope.pickWinning = function (winningSet) {
      if ($scope.isCzar()) {
        game.pickWinning(winningSet.card[0]);
        $scope.winningCardPicked = true;
      }
    };

    $scope.abandonGame = function (event) {
      var dialogDetails = {
        title: 'Exit Game',
        content: 'Do you really want to abandon the game?',
        label: 'Abandon Game',
        okTitle: 'Yes',
        cancelTitle: 'No'
      };
      gameModals.showConfirm($scope.event, dialogDetails).then(function () {
        sessionStorage.clear();
        game.leaveGame();
        $location.path('/').search({});
      });
      /* call function to update the
      database record with new gameId if
      remaining players are just two
      and then route user to
      $location.path('/');
      */
      // $scope.updateGameId(gameDetails);
    };

    $scope.winnerPicked = function () {
      return game.winningCard !== -1;
    };

    $scope.startGame = function () {
      game.startGame();
    };

    $scope.gameState = {
      awaitingPlayers() {
        return $scope.game.state === 'awaiting players';
      },
      ended() {
        return $scope.game.state === 'game ended';
      },
      dissolved() {
        return $scope.game.state === 'game dissolved';
      },
      awaitingCzar() {
        return $scope.game.state === 'waiting for czar to decide';
      },
      winnerChosen() {
        return $scope.game.state === 'winner has been chosen';
      },
      noWinner() {
        return game.gameWinner === -1;
      },
      userWon() {
        return game.gameWinner === game.playerIndex;
      },
      userLost() {
        return game.gameWinner !== game.playerIndex;
      },
      awaitingDrawCard() {
        return $scope.game.state === 'waiting for czar to draw cards';
      }
    };

    // Catches changes to round to update when no players pick card
    // (because game.state remains the same)
    $scope.$watch('game.round', function () {
      $scope.hasPickedCards = false;
      $scope.showTable = false;
      $scope.winningCardPicked = false;
      $scope.makeAWishFact = makeAWishFacts.pop();
      if (!makeAWishFacts.length) {
        makeAWishFacts = MakeAWishFactsService.getMakeAWishFacts();
      }
      $scope.pickedCards = [];
    });

    // In case player doesn't pick a card in time, show the table
    $scope.$watch('game.state', function () {
      if (game.state === 'waiting for czar to decide' && $scope.showTable === false) {
        $scope.showTable = true;
      }
    });


    $scope.$watch('game.gameID', function () {
      if (game.gameID && game.state === 'awaiting players') {
        if (!$scope.isCustomGame() && $location.search().game) {
          // If the player didn't successfully enter the request room,
          // reset the URL so they don't think they're in the requested room.
          $location.search({});
        } else if ($scope.isCustomGame() && !$location.search().game) {
          // Once the game ID is set, update the URL if this is a game with friends,
          // where the link is meant to be shared.

          $location.search({ game: game.gameID });
          if (!$scope.modalShown) {
            setTimeout(function () {
              var link = document.URL;
              var txt = 'Give the following link to your friends so they can join your game: ';
              $('#lobby-how-to-play').text(txt);
              $('#oh-el').css({ 'text-align': 'center', 'font-size': '22px', background: 'white', color: 'black' }).text(link);
            }, 200);
            $scope.modalShown = true;
          }
        }
      }
    });

    $scope.drawCard = () => {
      if (game.state === 'waiting for czar to draw cards' && !$scope.isCzar()) {
        Materialize.toast('You are not the czar!');
      } else if (game.state === 'waiting for czar to draw cards' && $scope.isCzar()) {
        // Ensure only card czar choose question for next round
        game.drawCard();
        /**
         * Flip cards. First set cardDeckClicked to true only when czar clicks
         * the card deck
         */
        $scope.cardDeckClicked = true;
      } else {
        Materialize.toast('Wait for czar to choose next question!', 4000);
      }
    };

    if ($location.search().game && !(/^\d+$/).test($location.search().game)) {
      game.joinGame('joinGame', $location.search().game);
    } else if ($location.search().custom) {
      var gameDBId = localStorage.getItem('gameDBId');
      game.joinGame('joinGame', null, gameDBId, true);
    } else {
      game.joinGame();
    }
  }]);
