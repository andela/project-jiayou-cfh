angular.module('mean.directives', [])
  .directive('player', function() {
    return {
      restrict: 'EA',
      templateUrl: '/views/player.html',
      link(scope, elem, attr) {
        scope.colors = ['#7CE4E8', '#FFFFa5', '#FC575E', '#F2ADFF', '#398EC4', '#8CFF95'];
      }
    };
  }).directive('answers', function() {
    return {
      restrict: 'EA',
      templateUrl: '/views/answers.html',
      link(scope, elem, attr) {
        scope.$watch('game.state', function() {
          if (scope.game.state === 'winner has been chosen') {
            var curQ = scope.game.curQuestion;
            var curQuestionArr = curQ.text.split('_');
            var startStyle = `<span style='color: ${scope.colors[scope.game.players[scope.game.winningCardPlayer].color]}'>`;
            var endStyle = '</span>';
            var shouldRemoveQuestionPunctuation = false;
            var removePunctuation = function(cardIndex) {
              var cardText = scope.game.table[scope.game.winningCard].card[cardIndex].text;
              if (cardText.indexOf('.', cardText.length - 2) === cardText.length - 1) {
                cardText = cardText.slice(0, cardText.length - 1);
              } else if ((cardText.indexOf('!', cardText.length - 2) === cardText.length - 1 ||
                  cardText.indexOf('?', cardText.length - 2) === cardText.length - 1) &&
                cardIndex === curQ.numAnswers - 1) {
                shouldRemoveQuestionPunctuation = true;
              }
              return cardText;
            };
            if (curQuestionArr.length > 1) {
              var cardText = removePunctuation(0);
              curQuestionArr.splice(1, 0, startStyle + cardText + endStyle);
              if (curQ.numAnswers === 2) {
                cardText = removePunctuation(1);
                curQuestionArr.splice(3, 0, startStyle + cardText + endStyle);
              }
              curQ.text = curQuestionArr.join('');
              // Clean up the last punctuation mark in the question if there already is one in the answer
              if (shouldRemoveQuestionPunctuation) {
                if (curQ.text.indexOf('.', curQ.text.length - 2) === curQ.text.length - 1) {
                  curQ.text = curQ.text.slice(0, curQ.text.length - 2);
                }
              }
            } else {
              curQ.text += ` ${startStyle}${scope.game.table[scope.game.winningCard].card[0].text}${endStyle}`;
            }
          }
        });
      }
    };
  }).directive('question', function() {
    return {
      restrict: 'EA',
      templateUrl: '/views/question.html',
      link(scope, elem, attr) {}
    };
  })
  .directive('timer', function() {
    return {
      restrict: 'EA',
      templateUrl: '/views/timer.html',
      link(scope, elem, attr) {}
    };
  })
  .directive('chat', function() {
    return {
      restrict: 'EA',
      templateUrl: '/views/chat.html',
      link: function(scope, elem, attr) {
        $('#post').on('click', function() {
          const database = firebase.database();
          const gameID = sessionStorage.getItem('gameID');
          const usernameInput = sessionStorage.getItem('Username');
          const avatarInput = sessionStorage.getItem('Avatar');
          const textInput = document.querySelector('#text');
          var msgUser = usernameInput;
          var msgAvatar = avatarInput;
          var msgText = textInput.value;
          // replace myFirebase.set(...); with the next line
          database.ref('msg').push({ avatar: msgAvatar, username: msgUser, text: msgText });
          textInput.value = '';
        });

        /** Function to add a data listener **/
        var startListening = function() {
          firebase.database().ref('msg').on('child_added', function(snapshot) {
            var msg = snapshot.val();
            var msgAvatarElement = $("<img />");
            msgAvatarElement.attr('src', msg.avatar);
            var msgUsernameElement = $('<b />');
            msgUsernameElement.html(msg.username);
            var msgTextElement = $('<p />');
            // msgTextElement.append(`${msgUsernameElement.text()}: `);
            msgTextElement.append(msg.text);

            var msgElement = document.createElement('div');

            msgElement.className = 'msg';
            $('#results').append(msgAvatarElement).append(msgUsernameElement).append(msgTextElement);
          });
        };

        var removeChatHistory = function () {
          firebase.database().ref('msg').remove();
        };

        // Begin listening for data
        startListening();
        removeChatHistory();
      }
    };
  })
  .directive('landing', function($timeout, $http) {
    return {
      restrict: 'EA',
      link(scope, elem, attr) {
        scope.showOptions = true;
        scope.showNavBar = true;
        scope.signOut = false;

        if ((localStorage.getItem('JWT') && localStorage.getItem('Email')) || localStorage.getItem('jwtToken') || localStorage.getItem('sign_in')) {
          scope.showNavBar = false;
          scope.signOut = true;
        }

        if (sessionStorage.getItem('socialPlayer')) {
          // when user logs in with social media, hide sign in button
          scope.showNavBar = false;
          scope.signOut = true;
        } else if (sessionStorage.getItem('guestPlayer')) {
          scope.showNavBar = true;
        }
        scope.playAsGuest = function() {
          sessionStorage.setItem('guestPlayer', 'true');
        };

        /**
         * function that gets called when a user signs in with a social
         * media account
         * @returns {undefined}
         */
        scope.socialPlayer = function() {
          sessionStorage.setItem('socialPlayer', 'true');
        };

        if (localStorage.getItem('JWT')) {
          // Fix ??
          // set alert message to true for 4000ms
          $timeout(function() {
            scope.signOut = false;
          }, 4000);
        }
        scope.userLogout = function() {
          // remove the JWT, email and expDate on logout
          localStorage.clear();
          sessionStorage.removeItem('socialPlayer');
        };
      }
    };
  })
  .directive('alertMessage', function($timeout) {
    // this direction display an alert for a particular time
    var linkFunction = function(scope) {
      scope.showAlert = true;
      $timeout(function() {
        scope.showAlert = false;
      }, 4000);
    };
    return {
      restrict: 'A',
      link: linkFunction
    };
  });
