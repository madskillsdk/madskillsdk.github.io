(function () {
	'use strict';

	angular
		.module('app')
		.controller('HomeCtrl', HomeCtrl);

	function HomeCtrl($scope) {
		$scope.foldOut = true;

		var screenWidth = window.screen.availWidth;
		var positions = [];
		if (screenWidth > 1224) {
			positions = [
				{ id: 'net', x: '-400', y: '0' },
				{ id: 'git', x: '-450', y: '100' },
				{ id: 'webapi', x: '0', y: '200' },
				{ id: 'sqlserver', x: '100', y: '100' },
				{ id: 'c#', x: '-150', y: '-25' },
				{ id: 'tfs', x: '150', y: '0' },
				{ id: 'es', x: '-50', y: '75' },
				{ id: 'ef', x: '300', y: '0' },
				{ id: 'ng', x: '-300', y: '175' },
				{ id: 'mvc', x: '-200', y: '125' },
				{ id: 'cqrs', x: '-250', y: '75' }
			]
		}
		else {
			positions = [
				{ id: 'net', x: '0', y: '0' },
				{ id: 'git', x: '0', y: '100' },
				{ id: 'webapi', x: '0', y: '200' },
				{ id: 'sqlserver', x: '0', y: '300' },
				{ id: 'c#', x: '0', y: '400' },
				{ id: 'tfs', x: '0', y: '500' },
				{ id: 'es', x: '0', y: '600' },
				{ id: 'ef', x: '0', y: '700' },
				{ id: 'ng', x: '0', y: '800' },
				{ id: 'mvc', x: '0', y: '900' },
				{ id: 'cqrs', x: '0', y: '1000' }
			]
		}


		$scope.showToolbox = function showToolbox() {
			if ($scope.foldOut) {
				$scope.foldOut = false;
				var elements = document.getElementsByClassName('tag');

				for (var i = 0; i < elements.length; i++) {
					move(elements[i])
						.set('visibility', 'visible')
						.to(positions[i].x, positions[i].y)
						.ease('in')
						.end();
				}
			}
			else {
				$scope.foldOut = true;
				var elements = document.getElementsByClassName('tag');

				for (var i = 0; i < elements.length; i++) {
					move(elements[i])
						.set('visibility', 'hidden')
						.to(-100, 0)
						.ease('out')
						.end();
				}

			}
		}

	}
})(); 