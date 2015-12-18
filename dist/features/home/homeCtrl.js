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
	HomeCtrl.$inject = ["$scope"];
})(); 
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZlYXR1cmVzL2hvbWUvaG9tZUN0cmwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsQ0FBQyxZQUFZO0NBQ1o7O0NBRUE7R0FDRSxPQUFPO0dBQ1AsV0FBVyxZQUFZOztDQUV6QixTQUFTLFNBQVMsUUFBUTtFQUN6QixPQUFPLFVBQVU7O0VBRWpCLElBQUksY0FBYyxPQUFPLE9BQU87RUFDaEMsSUFBSSxZQUFZO0VBQ2hCLElBQUksY0FBYyxNQUFNO0dBQ3ZCLFlBQVk7SUFDWCxFQUFFLElBQUksT0FBTyxHQUFHLFFBQVEsR0FBRztJQUMzQixFQUFFLElBQUksT0FBTyxHQUFHLFFBQVEsR0FBRztJQUMzQixFQUFFLElBQUksVUFBVSxHQUFHLEtBQUssR0FBRztJQUMzQixFQUFFLElBQUksYUFBYSxHQUFHLE9BQU8sR0FBRztJQUNoQyxFQUFFLElBQUksTUFBTSxHQUFHLFFBQVEsR0FBRztJQUMxQixFQUFFLElBQUksT0FBTyxHQUFHLE9BQU8sR0FBRztJQUMxQixFQUFFLElBQUksTUFBTSxHQUFHLE9BQU8sR0FBRztJQUN6QixFQUFFLElBQUksTUFBTSxHQUFHLE9BQU8sR0FBRztJQUN6QixFQUFFLElBQUksTUFBTSxHQUFHLFFBQVEsR0FBRztJQUMxQixFQUFFLElBQUksT0FBTyxHQUFHLFFBQVEsR0FBRztJQUMzQixFQUFFLElBQUksUUFBUSxHQUFHLFFBQVEsR0FBRzs7O09BR3pCO0dBQ0osWUFBWTtJQUNYLEVBQUUsSUFBSSxPQUFPLEdBQUcsS0FBSyxHQUFHO0lBQ3hCLEVBQUUsSUFBSSxPQUFPLEdBQUcsS0FBSyxHQUFHO0lBQ3hCLEVBQUUsSUFBSSxVQUFVLEdBQUcsS0FBSyxHQUFHO0lBQzNCLEVBQUUsSUFBSSxhQUFhLEdBQUcsS0FBSyxHQUFHO0lBQzlCLEVBQUUsSUFBSSxNQUFNLEdBQUcsS0FBSyxHQUFHO0lBQ3ZCLEVBQUUsSUFBSSxPQUFPLEdBQUcsS0FBSyxHQUFHO0lBQ3hCLEVBQUUsSUFBSSxNQUFNLEdBQUcsS0FBSyxHQUFHO0lBQ3ZCLEVBQUUsSUFBSSxNQUFNLEdBQUcsS0FBSyxHQUFHO0lBQ3ZCLEVBQUUsSUFBSSxNQUFNLEdBQUcsS0FBSyxHQUFHO0lBQ3ZCLEVBQUUsSUFBSSxPQUFPLEdBQUcsS0FBSyxHQUFHO0lBQ3hCLEVBQUUsSUFBSSxRQUFRLEdBQUcsS0FBSyxHQUFHOzs7OztFQUszQixPQUFPLGNBQWMsU0FBUyxjQUFjO0dBQzNDLElBQUksT0FBTyxTQUFTO0lBQ25CLE9BQU8sVUFBVTtJQUNqQixJQUFJLFdBQVcsU0FBUyx1QkFBdUI7O0lBRS9DLEtBQUssSUFBSSxJQUFJLEdBQUcsSUFBSSxTQUFTLFFBQVEsS0FBSztLQUN6QyxLQUFLLFNBQVM7T0FDWixJQUFJLGNBQWM7T0FDbEIsR0FBRyxVQUFVLEdBQUcsR0FBRyxVQUFVLEdBQUc7T0FDaEMsS0FBSztPQUNMOzs7UUFHQztJQUNKLE9BQU8sVUFBVTtJQUNqQixJQUFJLFdBQVcsU0FBUyx1QkFBdUI7O0lBRS9DLEtBQUssSUFBSSxJQUFJLEdBQUcsSUFBSSxTQUFTLFFBQVEsS0FBSztLQUN6QyxLQUFLLFNBQVM7T0FDWixJQUFJLGNBQWM7T0FDbEIsR0FBRyxDQUFDLEtBQUs7T0FDVCxLQUFLO09BQ0w7Ozs7Ozs7O01BT0QiLCJmaWxlIjoiZmVhdHVyZXMvaG9tZS9ob21lQ3RybC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiAoKSB7XHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHRhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAnKVxyXG5cdFx0LmNvbnRyb2xsZXIoJ0hvbWVDdHJsJywgSG9tZUN0cmwpO1xyXG5cclxuXHRmdW5jdGlvbiBIb21lQ3RybCgkc2NvcGUpIHtcclxuXHRcdCRzY29wZS5mb2xkT3V0ID0gdHJ1ZTtcclxuXHJcblx0XHR2YXIgc2NyZWVuV2lkdGggPSB3aW5kb3cuc2NyZWVuLmF2YWlsV2lkdGg7XHJcblx0XHR2YXIgcG9zaXRpb25zID0gW107XHJcblx0XHRpZiAoc2NyZWVuV2lkdGggPiAxMjI0KSB7XHJcblx0XHRcdHBvc2l0aW9ucyA9IFtcclxuXHRcdFx0XHR7IGlkOiAnbmV0JywgeDogJy00MDAnLCB5OiAnMCcgfSxcclxuXHRcdFx0XHR7IGlkOiAnZ2l0JywgeDogJy00NTAnLCB5OiAnMTAwJyB9LFxyXG5cdFx0XHRcdHsgaWQ6ICd3ZWJhcGknLCB4OiAnMCcsIHk6ICcyMDAnIH0sXHJcblx0XHRcdFx0eyBpZDogJ3NxbHNlcnZlcicsIHg6ICcxMDAnLCB5OiAnMTAwJyB9LFxyXG5cdFx0XHRcdHsgaWQ6ICdjIycsIHg6ICctMTUwJywgeTogJy0yNScgfSxcclxuXHRcdFx0XHR7IGlkOiAndGZzJywgeDogJzE1MCcsIHk6ICcwJyB9LFxyXG5cdFx0XHRcdHsgaWQ6ICdlcycsIHg6ICctNTAnLCB5OiAnNzUnIH0sXHJcblx0XHRcdFx0eyBpZDogJ2VmJywgeDogJzMwMCcsIHk6ICcwJyB9LFxyXG5cdFx0XHRcdHsgaWQ6ICduZycsIHg6ICctMzAwJywgeTogJzE3NScgfSxcclxuXHRcdFx0XHR7IGlkOiAnbXZjJywgeDogJy0yMDAnLCB5OiAnMTI1JyB9LFxyXG5cdFx0XHRcdHsgaWQ6ICdjcXJzJywgeDogJy0yNTAnLCB5OiAnNzUnIH1cclxuXHRcdFx0XVxyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHBvc2l0aW9ucyA9IFtcclxuXHRcdFx0XHR7IGlkOiAnbmV0JywgeDogJzAnLCB5OiAnMCcgfSxcclxuXHRcdFx0XHR7IGlkOiAnZ2l0JywgeDogJzAnLCB5OiAnMTAwJyB9LFxyXG5cdFx0XHRcdHsgaWQ6ICd3ZWJhcGknLCB4OiAnMCcsIHk6ICcyMDAnIH0sXHJcblx0XHRcdFx0eyBpZDogJ3NxbHNlcnZlcicsIHg6ICcwJywgeTogJzMwMCcgfSxcclxuXHRcdFx0XHR7IGlkOiAnYyMnLCB4OiAnMCcsIHk6ICc0MDAnIH0sXHJcblx0XHRcdFx0eyBpZDogJ3RmcycsIHg6ICcwJywgeTogJzUwMCcgfSxcclxuXHRcdFx0XHR7IGlkOiAnZXMnLCB4OiAnMCcsIHk6ICc2MDAnIH0sXHJcblx0XHRcdFx0eyBpZDogJ2VmJywgeDogJzAnLCB5OiAnNzAwJyB9LFxyXG5cdFx0XHRcdHsgaWQ6ICduZycsIHg6ICcwJywgeTogJzgwMCcgfSxcclxuXHRcdFx0XHR7IGlkOiAnbXZjJywgeDogJzAnLCB5OiAnOTAwJyB9LFxyXG5cdFx0XHRcdHsgaWQ6ICdjcXJzJywgeDogJzAnLCB5OiAnMTAwMCcgfVxyXG5cdFx0XHRdXHJcblx0XHR9XHJcblxyXG5cclxuXHRcdCRzY29wZS5zaG93VG9vbGJveCA9IGZ1bmN0aW9uIHNob3dUb29sYm94KCkge1xyXG5cdFx0XHRpZiAoJHNjb3BlLmZvbGRPdXQpIHtcclxuXHRcdFx0XHQkc2NvcGUuZm9sZE91dCA9IGZhbHNlO1xyXG5cdFx0XHRcdHZhciBlbGVtZW50cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3RhZycpO1xyXG5cclxuXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0XHRtb3ZlKGVsZW1lbnRzW2ldKVxyXG5cdFx0XHRcdFx0XHQuc2V0KCd2aXNpYmlsaXR5JywgJ3Zpc2libGUnKVxyXG5cdFx0XHRcdFx0XHQudG8ocG9zaXRpb25zW2ldLngsIHBvc2l0aW9uc1tpXS55KVxyXG5cdFx0XHRcdFx0XHQuZWFzZSgnaW4nKVxyXG5cdFx0XHRcdFx0XHQuZW5kKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdCRzY29wZS5mb2xkT3V0ID0gdHJ1ZTtcclxuXHRcdFx0XHR2YXIgZWxlbWVudHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd0YWcnKTtcclxuXHJcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBlbGVtZW50cy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdFx0bW92ZShlbGVtZW50c1tpXSlcclxuXHRcdFx0XHRcdFx0LnNldCgndmlzaWJpbGl0eScsICdoaWRkZW4nKVxyXG5cdFx0XHRcdFx0XHQudG8oLTEwMCwgMClcclxuXHRcdFx0XHRcdFx0LmVhc2UoJ291dCcpXHJcblx0XHRcdFx0XHRcdC5lbmQoKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdH1cclxufSkoKTsgIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
