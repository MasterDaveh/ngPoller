angular.module('poemApp', ['ngPoller'])

.run((ngPoller) => {
  const srv = 'http://localhost:8001'
  ngPoller.listeners({
    'poemRowUpdate': { url: `${ srv }/row`, frequency: 1000 }
  });

})

.controller('poemCtrl', ($scope, ngPoller) => {
  $scope.poem = [];

  // at first the whole content of the poem will be fetched
  // then only subsequent updates to the file will be received
  ngPoller.listen('poemRowUpdate', (data) => {
    $scope.poem.push(...data);
  });
});