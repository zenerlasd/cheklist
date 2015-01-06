'use strict';

/**
 * @name lenninlasd@gmail.com 
 */



 angular.module('marcado')
 .controller('CheckCtrl', ['$scope', '$http', '$location', '$routeParams' ,function ($scope, $http, $location, $routeParams) {

	$http.get('json/asesor.json').success(function(data) {
		$scope.datas = data;
		//console.log(data);
	});

	//--------- Valida la Sesion --------------------
	var checkSession = JSON.parse(localStorage.getItem("checkData"));
	$scope.enviado = localStorage.getItem("enviado");

	if (checkSession !== null) {

		$scope.loginData = checkSession;				
		
		$http.get(location.origin + '/code-dev/analytics/keyValidate/' + checkSession.USU_SDSTRCLAVE).
			success(function(data, status, headers, config) {
				if (data == "true") {$scope.session = false;} else{$scope.session = true;}
			}).error(function(data, status, headers, config) {});

	}else{
		$scope.session = true;
	}

	//***********************************************************************
	$scope.buttonClass = 'btn-default';
	$scope.buttonClass2 = 'btn-default';
	$scope.showForm = 1;
	$scope.alert = {};
	$scope.alert.cde = 0;
	$scope.alert.datosMal = 0;
	$scope.checkData = {};
	
	$scope.otraData = {};

	$scope.checkDataCopia = {};
	$scope.disableBotonSubmit = 0;
	$scope.showBackdrop = 1;

	$scope.asesores = {
		eventos: [{label: "Compensatorios"},
				  {label:"Incapacitados"}, 
				  {label: "Prestados"},
				  {label:"Ausentes"}, 
				  {label:"Entrenamiento"},
				  {label:"Capacitacion"}, 
				  {label: "Vacio Lab"},
				  {label: "Vacaciones"},
				  {label: "Venta externa"},
				  {label: "Retiros"}, 
				  {label:"AseApoyos"}],
		
		modelo: [{label: "Orientador"},
				 {label:"L1"},
				 {label: "L2"},
				 {label: "DM"},
				 {label: "GB"},
				 {label: "LZ"}],
		
		distribucion: [{label: "Apertura"},
					   {label:"Seg Turno"},
					   {label:"Ter Turno"}]
	};
	
	$scope.asesores.atencionDist = 0;
	$scope.asesores.modeloManual = 0;
	var eventualidades = 0;

	//****************** Obtenemos el objeto de checklist, y eliminamos la id y el log 
	//****************** y luego lo copiamos para validar si se realizaron cambios.
	$scope.getCheckListId = function(){
		$http.post(location.origin + '/code-dev/analytics/getCheckListCDEid/' 
								   + $scope.loginData.ACC_PFKSTROFICINA + '/' + $scope.id).
			success(function(data, status, headers, config) {			
				if (_.size(data) > 0) {
					$scope.checkData = data;
					delete  $scope.checkData.cd_id; delete  $scope.checkData.ch_log;
					$scope.checkDataCopia = _.clone($scope.checkData);

					$scope.otraData =  JSON.parse($scope.checkData.ch_otro);

					console.log($scope.checkData);
					// $scope.showBackdrop = $scope.showBackdrop + 2;
					// console.log($scope.showBackdrop);

				}else{					
					$location.path('/');
				}
			}).
			error(function(data, status, headers, config) {
				$location.reload();
			});
	};

	//***** DATA ******
	$scope.id = parseInt(Number($routeParams.id));
	
	if ($scope.id) {
		limpiarValores();
		$scope.getCheckListId();

	}else{
		$location.path('/');
		limpiarValores();
		$scope.showBackdrop = 0;
	}

	 
	function limpiarValores(){
		$scope.checkData.ch_contratados = 0;

		$scope.checkData.ch_compensatorio = 0;
		$scope.checkData.ch_incapacitados = 0;
		$scope.checkData.ch_prestados = 0;
		$scope.checkData.ch_ausentes = 0;
		$scope.checkData.ch_entrenamiento = 0;
		$scope.checkData.ch_capacitacion = 0;
		$scope.checkData.ch_vacioLab = 0;
		$scope.checkData.ch_vacaciones = 0;
		$scope.checkData.ch_ventaExterna = 0;
		$scope.checkData.ch_retiros = 0;
		$scope.checkData.ch_aseApoyos = 0;

		$scope.checkData.ch_orientador = 0;
		$scope.checkData.ch_PL = 0;
		$scope.checkData.ch_SL = 0;
		$scope.checkData.ch_DM = 0;
		$scope.checkData.ch_GB = 0;
		$scope.checkData.ch_LZ = 0;

		$scope.checkData.ch_apertura = 0;
		$scope.checkData.ch_segTurno = 0;
		$scope.checkData.ch_terTurno = 0;

		$scope.checkData.ch_observaciones = "";
	}

	//***********************************************************************

	$scope.logOut = function(){
		localStorage.removeItem("checkData");
		window.location.reload();
	};

	$scope.setLoginForm = function(){
		console.log($scope.formulario);

		if (!$scope.formulario.cde) {
			$scope.alert.cde = 1;
			$scope.alert.datosMal = 0;
			return;
		}else{
			$scope.alert.cde = 0;
		}
		$scope.disableBotonSubmit = 1;

		$http.post(location.origin + '/code-dev/analytics/logingChecklist', $scope.formulario).
			success(function(data, status, headers, config) {

				if (typeof(data) === "object") {
					$scope.loginData = data;
					localStorage.setItem("checkData", JSON.stringify(data));
					$scope.session = false;

					$location.path('/lista/0');
					//console.log($scope.loginData);

				}else{
					console.log(typeof(data));
					$scope.alert.datosMal = 1;
				}
			}).
			error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
			});
	};

	$scope.eventos = function(num){
		num = num || 0;
		if (num) {$scope.showForm = num; console.log($scope.showForm);}

		//eventualidades = _.reduce(_.pluck($scope.asesores.eventos, 'cant'), function(memo, num){ return memo + num; });

		eventualidades = $scope.checkData.ch_compensatorio
						+ $scope.checkData.ch_incapacitados
						+ $scope.checkData.ch_prestados
						+ $scope.checkData.ch_ausentes
						+ $scope.checkData.ch_entrenamiento
						+ $scope.checkData.ch_capacitacion
						+ $scope.checkData.ch_vacioLab
						+ $scope.checkData.ch_vacaciones
						+ $scope.checkData.ch_ventaExterna
						+ $scope.checkData.ch_retiros;

		$scope.asesores.enCDE = $scope.checkData.ch_contratados + $scope.checkData.ch_aseApoyos - eventualidades;
		
		$scope.asesores.enAtencion = $scope.checkData.ch_PL + $scope.checkData.ch_SL;

		$scope.asesores.modeloManual =	$scope.checkData.ch_orientador
										+ $scope.checkData.ch_PL
										+ $scope.checkData.ch_SL
										+ $scope.checkData.ch_DM
										+ $scope.checkData.ch_GB
										+ $scope.checkData.ch_LZ;
	};

	$scope.modeloFunction = function(){
		$scope.eventos();

		if ($scope.asesores.enCDE === $scope.asesores.modeloManual) {
			$scope.buttonClass = 'btn-success';
			return false;
		}else{
			$scope.buttonClass = 'btn-default';
			return true;
		}
	};

	$scope.distribucionFunction = function(){
		$scope.eventos();

		$scope.asesores.atencionDist = $scope.checkData.ch_apertura 
									   + $scope.checkData.ch_segTurno + $scope.checkData.ch_terTurno;

		if ($scope.asesores.enAtencion === $scope.asesores.atencionDist 
			&& $scope.asesores.enCDE === $scope.asesores.modeloManual 
			&& $scope.asesores.atencionDist > 0
			&& !_.isEqual($scope.checkDataCopia, $scope.checkData)) { 			
			
			$scope.buttonClass2 = 'btn-success';
			return false;
		}else{
			$scope.buttonClass2 = 'btn-default';
			return true;
		}
	};

	$scope.setChecklistForm = function(){
		
		var checkData = $scope.checkData;
		
		checkData.ch_codPos = $scope.loginData.ACC_PFKSTROFICINA;
		checkData.ch_usuario = $scope.loginData.ACC_PFKSTRUSUARIO;
		checkData.ch_nombre  = $scope.loginData.USU_SDSTRNOMBRE;

		checkData.ch_otro = JSON.stringify($scope.otraData);

	    console.log(checkData);

	   	$http.post(location.origin + '/code-dev/analytics/insertChecklist', checkData).
			success(function(data, status, headers, config) {
				$scope.enviado = 1;
				localStorage.setItem("enviado", 1);
				$location.path('/lista/0');
			}).
			error(function(data, status, headers, config) {
			});

	};

	
	$scope.eventos();

 }]);
