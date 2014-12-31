'use strict';

/**
 * @name lenninlasd@gmail.com 
 */
 angular.module('marcado')
 .controller('ListaCtrl', ['$scope', '$http', '$location', '$routeParams' ,function ($scope, $http, $location, $routeParams) {

 	$scope.listas = [];
 	$scope.spin = 1;
 	$scope.paginacion = parseInt($routeParams.paginacion);
 		//--------- Valida la Sesion --------------------
 	
	var checkSession = JSON.parse(localStorage.getItem("checkData"));

	if (checkSession !== null ) {

		$scope.loginData = checkSession;		
		
		$http.get(location.origin + '/code-dev/analytics/keyValidate/' + checkSession.USU_SDSTRCLAVE).
			success(function(data, status, headers, config) {
				//console.log(data);
				if (data != "true") {
					$location.path('/');
					return;
				}
			
				$http.post(location.origin + '/code-dev/analytics/getCheckListCDE/' + $scope.paginacion, $scope.loginData).
					success(function(data, status, headers, config) {
						console.log(data);
						$scope.listas = data;
						$scope.spin = 0;
						// Varifica si se realizó el checkList
						if ($scope.listas.length) {
							if ($scope.listas[0]['ch_log'].slice(0, 10) == moment().format("YYYY-MM-DD") && $scope.listas[0]['ch_estado'] >= 1) {
								localStorage.setItem("enviado", 1);
							}else{
								localStorage.setItem("enviado", 0);
							}
						}
					}).
					error(function(data, status, headers, config) {});



			}).
			error(function(data, status, headers, config) {

			});
	}else{
		$location.path('/');
		//console.log($location);
	}


	$scope.logOut = function(){
		localStorage.removeItem("checkData");
		$location.path('/');
	};

	// $scope.getChecklistCDE = function(){
	// 	$http.post(location.origin + '/code-dev/analytics/logingChecklist', $scope.formulario).
	// 		success(function(data, status, headers, config) {

	// 			if (typeof(data) === "object") {
	// 				$scope.loginData = data;
	// 				localStorage.setItem("checkData", JSON.stringify(data));
	// 				$scope.session = false;
	// 				console.log($scope.loginData);

	// 			}else{
	// 				console.log(typeof(data));
	// 			}
	// 		}).
	// 		error(function(data, status, headers, config) {});
	// }

	$scope.setPaginacionSiguiente = function(){
		$scope.paginacion = $scope.paginacion + 1;
		$location.path('/lista/' + $scope.paginacion);
	};
	$scope.setPaginacionAnterior  = function(){		
		if ($scope.paginacion > 0) {
			$scope.paginacion = $scope.paginacion - 1;
		}else {
			$scope.paginacion = 0;
		}
		$location.path('/lista/' + $scope.paginacion);
	};

 }]);
