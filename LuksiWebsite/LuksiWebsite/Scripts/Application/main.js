var mainApp = angular.module('main', ["ngAnimate", "ngRoute"]);

var readyStateCheckInterval = setInterval(function () {
    if (document.readyState === "complete") {
        clearInterval(readyStateCheckInterval);
        $('.main-app').removeClass('loading');

        if (IsIE()) {
            $('body').css({ 'font-family': 'Arial' });
        }
    }
}, 10);


function getWindowWidth() {
    var myWidth = 0;

    if (typeof (window.innerWidth) == 'number') {
        //Non-IE
        myWidth = window.innerWidth;
    } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
        //IE 6+ in 'standards compliant mode'
        myWidth = document.documentElement.clientWidth;
    } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
        //IE 4 compatible
        myWidth = document.body.clientWidth;
    }
    return myWidth;
}

function IsIE() {
    return ($.browser.msie);
}

mainApp.controller('route-controller', function ($scope, $location, $http) {

    $scope.isLoading = true;
    $scope.setRoute = function (routePath) {
        $location.path(routePath);
    };

    var watchPath = function () { return $location.path(); };
    $scope.$watch(watchPath, function (newVal, oldVal) {
        if (newVal === "") {
            $scope.route = '/game';
        } else {
            $scope.route = newVal;
        }
    });
});

var blogData, missionData;

mainApp.controller('blog-controller', function ($scope, $http) {
    $scope.displayType = 'loading';

    var loadData = function (data) {
        blogData = data;
        $scope.displayType = 'content';
        $scope.posts = data.response.posts;

        for (var i = 0; i < $scope.posts.length; i++) {
            $scope.posts[i].date = moment($scope.posts[i].date).format('LL')
        }

        setTimeout(function () {
            updateIframeSizes();
        }, 10);
    }

    if (blogData) {
        loadData(blogData);
    } else {
        $http({
            url: '/api/blog',
            method: "GET"
        }).success(loadData)
          .error(function (data) {
              $scope.displayType = 'error';
              console.log('error', data);
          });
    }
});

mainApp.controller('mission-controller', function ($scope, $http) {
    $scope.displayType = 'loading';

    var loadData = function (data) {
        missionData = data;
        $scope.displayType = 'error';

        $scope.todoMissions = data[0].cards;
        $scope.doneMissions = data[1].cards;

        $scope.displayType = 'content';
    }

    if (missionData) {
        loadData(missionData);
    } else {
        $http({
            url: 'https://api.trello.com/1/board/52a4891d6003cc492a003ced/lists?cards=open&key=fa0895bff84a850712c20d84d9ba9c20',
            method: "GET"
        }).success(loadData)
          .error(function (data) {
              $scope.displayType = 'error';
              console.log('error', data);
          });
    }
});

mainApp.controller('subscribe-controller', function ($scope, $http) {
    $scope.subscribeSuccessful = $scope.subscribeFailed = false;

    $scope.submitEmail = function () {
        $scope.subscribeSuccessful = $scope.subscribeFailed = false;

        if (!$scope.email) {
            $scope.subscribeFailed = true;
            $scope.errorMessage = "Email field cannot be empty.";
        } else {
            $http({
                url: '/api/subscribe',
                method: "POST",
                data: { email: $scope.email },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function (data, status, headers, config) {
                $scope.subscribeSuccessful = true;
            }).error(function (data, status, headers, config) {
                $scope.subscribeFailed = true;
                $scope.errorMessage = data;
            });
        }
    };
});

mainApp.directive('customHtmlBind', function ($compile) {
    return {
        scope: { html: '=customHtmlBind' },
        compile: function () {
            return function (scope, tElement) {
                var renderHtml = function () {
                    if (scope.html) {
                        tElement.html(scope.html);
                        $compile(tElement.contents())(scope);
                    }
                }

                renderHtml();

                scope.$watch('html', function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        renderHtml();
                    }
                });
            }
        }
    }
});

var updateIframeSizes = function () {
    var $postBody = $('.blog-module .post .body');
    var $iframes = $postBody.find('iframe');

    var width = $postBody.width();
    var height = $postBody.height();
    var percantage = $iframes.height() / $iframes.width();

    $iframes.css({
        'max-width': width,
        'max-height': width * percantage
    });
};

$(window).resize(updateIframeSizes);
