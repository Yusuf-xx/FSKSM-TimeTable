
	
	// Register controller 
	
	var app = angular.module("ttapp", ["ngRoute"]);
	
    app.controller(
        'lecturer',
        function ($scope, $http) {
            $scope.data; // JSON array instance from JSON Web service
            $scope.page_data; // current page array data sliced from $scope.data 
            $scope.page_no = 1; // current page number
            $scope.page_rows = 10; // number of rows per-page
            $scope.page_total; // number of available pages
            $scope.pages; // number of page array

            $scope.search;
            $scope.data_filtered;
            
            var session_id_admin = sessionStorage.getItem("session_id_admin");

            var ajax = $http({
                method: "GET",
                url: "http://web.fc.utm.my/ttms/web_man_webservice_json.cgi?entity=pensyarah&session_id=" + session_id_admin + "&sesi=2021/2022&semester=1"
            });

            ajax.then(
                function success(res) { ajaxSuccess(res) },
                function error(res) { ajaxError(res) }
            );

            function ajaxSuccess(res) {
                //console.log(res.data);
                $scope.data = res.data;
                $scope.applyFilter();
            }

            function ajaxError(res) {
                //console.log(res);
                alert("AJAX connection error!");
            }

            // Watch and react on page_rows value changes
            $scope.$watch('page_rows', function () {
                if ($scope.page_rows < 1) { $scope.page_rows = 1; }

                if ($scope.data && $scope.page_rows > 0) {
                    console.log("watch - " + $scope.page_rows);
                    countPage();
                    $scope.goPage($scope.page_no);
                    //$scope.goPage($scope.page_no);
                }
            });
            
            // Call goPage() function to view previous page
            $scope.prevPage = function () {
                if ($scope.page_no > 1) {
                    console.log("prevPage()");
                    $scope.page_no--;
                    $scope.goPage($scope.page_no);
                }
            }
            
            // Call goPage() function to view next page
            $scope.nextPage = function () {
                if ($scope.page_no < $scope.page_total) {
                    console.log("nextPage()");
                    $scope.page_no++
                    $scope.goPage($scope.page_no);
                }
            }

            // Function to handle pagination number click
            $scope.goPage = function (pnumber) {
                console.log("Go to page " + pnumber);

                $scope.page_no = pnumber;

                // 1st page with 10 items per-page: idx_start = 0, idx_end = 9
                // 2nd page with 10 items per-page: idx_start = 10, idx_end = 19
                // 3rd page with 10 items per-page: idx_start = 20, idx_end = 29
                var idx_start = $scope.page_rows * ($scope.page_no - 1);
                var idx_end = idx_start + parseInt($scope.page_rows) - 1;
                console.log("index range = " + idx_start + " - " + idx_end);

                if ($scope.search != "") {
                    console.log("Need to filter list first! - goPage");
                    $scope.page_data = $scope.data_filtered.slice(idx_start, idx_end + 1);
                } else {
                    $scope.page_data = $scope.data.slice(idx_start, idx_end + 1);
                }

                //console.log($("#p" + pnumber).css('color')); // #0056b3
                $(".pnumber").css('color', '#63aaf7');
                $("#p" + pnumber).css('color', 'orange')
            }

            // Count total pages ($scope.pages) needed based on  
            // number of item per-page ($scope.page_rows)
            function countPage() {
                // Number of pages required to display each sub-list
                if ($scope.search != "") {
                    console.log("Need to filter list first! - countPage");
                    $scope.page_total = Math.ceil($scope.data_filtered.length / $scope.page_rows);
                } else { 
                    $scope.page_total = Math.ceil($scope.data.length / $scope.page_rows);
                }
                
                console.log("page_total = " + $scope.page_total);

                // Generate array to list & display pagination numbers
                $scope.pages = [];
                for (var i = 0; i < $scope.page_total; i++) {
                    $scope.pages.push(i + 1);
                }
            }
            
            $scope.applyFilter = function () {
                console.log("Apply filter");
                const regex = new RegExp($scope.search, 'i');
                
                $scope.data_filtered = $scope.data.filter(function (el) {
                         //return el.sesi == $scope.search;
                         //return el.sesi.search($scope.search);
                        
                        if (el.nama.match(regex)) { return true; }
                        
                        return false;
                });
                console.log($scope.data);
                console.log($scope.data_filtered);
                
                countPage();
                $scope.goPage($scope.page_no);
            }
        }
    );
	
