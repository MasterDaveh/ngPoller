angular.module('poemApp', ['pollerSrvc'])

.run((poller) => {
  const srv = 'http://localhost:8001'
  poller.listeners({
    'poemRowUpdate': { url: `${ srv }/row`, frequency: 1000 }
  });

})

.controller('poemCtrl', ($scope, poller) => {
  $scope.poem = [];

  poller.listen('poemRowUpdate', (data) => {
    $scope.poem.push(data);
  });
});