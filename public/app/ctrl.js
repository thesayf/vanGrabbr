// Ctrl For Home
app.controller('HomeCtrl', function($scope) {

})

app.controller('WebsiteCtrl', function($scope) {

})

app.controller('DashProfileCtrl', function($scope) {

})

app.controller('DashMessageCtrl', function($scope) {

})

app.controller('DashPaymentCtrl', function($scope) {

})


app.controller('DashStatusCtrl', function() {

})


// Ctrl For Signup
app.controller('DashSignupCtrl', function($scope, $http, $rootScope, validation) {
    $scope.user = {};
    $scope.user.businesstype = 'Business Type';
    $scope.bizType = {
        availableOptions: [
          {name: 'Business Type', dis: true},
          {name: 'Removal Company'},
          {name: 'Courier'},
          {name: 'Clearance'},
          {name: 'Logistics'}
        ],
    };

    $scope.register = function(){
        $http.post('/api/register', $scope.user)
        .success(function(user){
            $rootScope.currentUser = user;
            console.log(user);
        });

        /*var valiOptions = [
            {eleName: 'userAddress1', type: 'text', msg: 'Please enter your address!'},
            {eleName: 'userDoorNumber', type: 'text', msg: 'Please enter your door number!'},
            {eleName: 'userCity', type: 'text', msg: 'Please enter your city!'},
            {eleName: 'userPostcode', type: 'postcode', msg: 'Please enter a valid from postcode!'},
            {eleName: 'userFirstname', type: 'name', msg: 'Please enter a valid Firstname!'},
            {eleName: 'userLastname', type: 'name', msg: 'Please enter a valid Lastname!'},
            {eleName: 'userMobile', type: 'number', msg: 'Please enter a valid Mobile Number!'},
            {eleName: 'userEmail', type: 'email', msg: 'Please enter a valid email address!'},
            {eleName: 'userUsername', type: 'text', msg: 'Please enter a username!'},
            {eleName: 'userPassword', type: 'password', msg: 'Please enter a password!'},
            {eleName: 'userPassword2', type: 'passwordConfirm', msg: 'Please confirm password!'},
        ]
        validation.checkVal(valiOptions, function(callback) {
            if(callback > 0) {
                return false
            } else {
                $http.post('/api/register', $scope.user)
                .success(function(user){
                    $rootScope.currentUser = user;
                    console.log(user);
                });
            }
        })*/
    };
})

// Ctrl For Signup
app.controller('DashLoginCtrl', function($scope, $http, $rootScope, $location) {
    $scope.login = function(user, $event){
        $event.preventDefault();
        $http.post('/api/login', user).success(function(response){
            $location.url("/dash");
            $rootScope.currentUser = user;
        });
    };
})

app.controller('StaffSigninCtrl', function($scope, $http, $rootScope, $location) {
    $scope.signin = function(staff, $event){
        $event.preventDefault();
        $http.post('/api/signin', staff).success(function(response){
            $location.url("/admin");
            $rootScope.currentStaff = staff;
        });
    };
})

app.controller('DriverSigninCtrl', function($scope, $http, $rootScope, $location) {
    console.log("radio Phone");
    $scope.driversignin = function(driver, $event){
        $event.preventDefault();
        $http.post('/api/driversignin', driver).success(function(response){
            $location.url("/contractor-home");
            $rootScope.currentDriver = driver;
        });
    };
})


app.controller('DashUsersCtrl', function($scope, $http) {
      $scope.displayOneUser = function(id) {
        var temp = $scope.users.filter(function(ele){
            return ele._id == id;
        })
        $scope.username = temp[0]["username"];
        $scope.email = temp[0]["email"];
        $scope.address = temp[0]["address"];
        $scope.city = temp[0]["city"];
        $scope.postcode = temp[0]["postcode"];
        $scope.bank = temp[0]["bank"];
        $scope.acc = temp[0]["acc"];
        $scope.sc = temp[0]["sc"];
    };
    var refresh = function() {
        $http.post('/api/userlist').success(function(response) {
            $scope.users = response.data;
        });
    };
    refresh();
})

app.controller('DashDriversCtrl', function($scope, $http) {
    $scope.displayOneDriver = function(id) {
        var temp = $scope.drivers.filter(function(ele){
            return ele._id == id;
        })
        $scope.username = temp[0]["username"];
        $scope.email = temp[0]["email"];
        $scope.day = temp[0]["day"];
        $scope.month = temp[0]["month"];
        $scope.year = temp[0]["year"];
        $scope.address = temp[0]["address"];
        $scope.city = temp[0]["city"];
        $scope.postcode = temp[0]["postcode"];
        $scope.reg = temp[0]["reg"];
        $scope.bank = temp[0]["bank"];
        $scope.acc = temp[0]["acc"];
        $scope.sc = temp[0]["sc"];
    };
    var refresh = function() {
        $http.post('/api/driverlist').success(function(response) {
            $scope.drivers = response.data;
        });
    };
    refresh();
})

app.controller('DashStaffCtrl', function($scope, staff, $http, $rootScope) {
    $scope.staff = staff;
    $scope.addstaff = function(){
        //todo verify if the passwords are the same
        if(staff.password == staff.password2){
            $http.post('/api/addstaff', staff)
            .success(function(staff){
                $rootScope.currentUser = staff;
            });
        };
    };
    var refresh = function() {
        $http.post('/api/stafflist').success(function(response) {
            $scope.stafflist = response.data;
        });
    };
    refresh();
})

app.controller('ContractorSignupCtrl', function($scope, $http, $rootScope, driver) {
    $scope.driver = driver;
    $scope.signup = function(){
        //todo verify if the passwords are the same
        if(driver.password == driver.password2){
            $http.post('/api/signup', driver).success(function(driver){
                $rootScope.currentUser = driver;
            });
        };
    };
})

app.controller('AdminHomeCtrl', function($scope, $http) {
     var refresh = function() {
        $http.post('/api/driverlist').success(function(response) {
            var driverCount = Object.keys(response.data).length
            $scope.drivers = driverCount;
        });
    };
    var refine = function() {
        $http.post('/api/userlist').success(function(response) {
            var userCount = Object.keys(response.data).length
            $scope.users = userCount;
        });
    };
    refresh();
    refine();
})

// Ctrl For Dash
app.controller('DashHomeCtrl', function($scope) {
})

// Ctrl For Dash
app.controller('DashInstantCtrl', function($scope, $location, dashInstant, dashVans, dashPorters, maps, $http, tdispatch) {

    var realTime = new Date();
    $('#job-date-picker').datetimepicker({
        format: 'dd-mm-yy hh:ii',
        startDate: realTime,
        initialDate: realTime,
        todayHighlight: true,
    });


    $scope.dashInstant = dashInstant;
    $scope.dashVans = dashVans;
    $scope.dashPorters = dashPorters;
    //$scope.dashInstant.jobDate = new Date();
    $scope.tdispatch = tdispatch;

    // Set up autocomplete
    $scope.address = dashInstant.address;

    $scope.autocompleteOptions = {
        componentRestrictions: { country: 'uk' },
        types: ['geocode']
    }
    // Start GMaps
    maps.init();

    $scope.showWaypointField = function(type) {
        var waypointFields = $('[data-address-type="'+type+'"]').length;
        var hiddenWaypointFields = $('[data-address-type="'+type+'"].hide').length;
        var waypointId = (waypointFields - hiddenWaypointFields) + 2;
        $('[data-address-type="'+type+'"][data-address-id="'+waypointId+'"]').removeClass("hide");
    }

    $scope.chooseVan = function(vanType, $event) {
        $scope.dashInstant.vanType = $scope.dashVans[vanType]['tdID'];
        // Mark Chosen Van Box
        $('.panel-borders').removeClass('bord-picked');
        $.each($('.panel-borders'), function(i,v) {
            if($(v).attr('data-van') == vanType) {
                $(v).addClass('bord-picked');
            }
        });
    }

    $scope.choosePorters = function(porterQty, $event) {
        $scope.dashInstant.porterQty = porterQty;
        // Mark Chosen Van Box
        $('.porter-qty').removeClass('bord-picked');
        $.each($('.porter-qty'), function(i,v) {
            if($(v).attr('data-porter') == porterQty) {
                $(v).addClass('bord-picked');
            }
        });
        console.log($scope.dashInstant.porterQty);
    }

    $scope.updateMaps = function() {
        if($scope.dashInstant.address.start_location.name.formatted_address) {
            $scope.dashInstant.address.start_location.lat =
            $scope.dashInstant.address.start_location.name.geometry.location.lat();
            $scope.dashInstant.address.start_location.lng =
            $scope.dashInstant.address.start_location.name.geometry.location.lng();
            $scope.dashInstant.address.start_location.name = $scope.dashInstant.address.start_location.name.formatted_address;
        }
        if($scope.address.end_location.name.formatted_address) {
            $scope.dashInstant.address.end_location.lat =
            $scope.dashInstant.address.end_location.name.geometry.location.lat();
            $scope.dashInstant.address.end_location.lng =
            $scope.dashInstant.address.end_location.name.geometry.location.lng();
            $scope.dashInstant.address.end_location.name = $scope.dashInstant.address.end_location.name.formatted_address;
        }
        if($scope.address.pickup1.formatted_address) {
            $scope.address.pickup1.name = $scope.address.pickup1.formatted_address;
        }
        if($scope.address.dropoff1.formatted_address) {
            $scope.address.dropoff1.name = $scope.address.dropoff1.formatted_address;
        }
        if($scope.address.pickup2.formatted_address) {
            $scope.address.pickup2.name = $scope.address.pickup2.formatted_address;
        }
        if($scope.address.dropoff2.formatted_address) {
            $scope.address.dropoff2.name = $scope.address.dropoff2.formatted_address;
        }
        if($scope.address.start_location.name !== '' && $scope.address.end_location.name !== '') {
            maps.setDirections($scope.address, function(distance) {
                var tempMiles = 0.000621371192237 * distance;
                dashInstant.fuelPrice = Math.round(tempMiles * 0.72);
            });
        }
    }

    // FROM BOOK BUTTON TO SERVER ROUTES (DATA IT SENDS: DASHINSTANT)
    $scope.bookInstantJob = function(){
        // SAVES JOB TO DB
        $http.post('/api/save-instant-job', {data: dashInstant}).then(function(res){
            // IF SAVED TO DB
            if(res.data.success == true) {
                $http.post('/api/tdispatch-book', {data: dashInstant}, function(data) {
                    console.log(data);
                })
            }
        }, function(response){
            // DID NOT SAVE
        });
    }

    // NO SAVE ButTON
    $scope.saveInstantjob = function(){
        $http.post('/api/save-instant-job', {data: dashInstant}).then(function(res){
            // $scope.matchFields(res);
        }, function(response){
            // failure callback
        });
    }

    $scope.calcInstantJob = function() {
        $http.post('/api/tdispatch-calc', {data: dashInstant}).then(function(res){
            $scope.matchFields(res);
        }, function(response){
            // failure callback
        });
    }

    $scope.matchFields = function(res) {
        $scope.dashInstant.waitTime = 'Wait Time: '+res.data.data.fare.time_to_wait / 60+' Mins';
        $scope.dashInstant.suggestedPrice = res.data.data.fare.total_cost;
        dashInstant = $scope.dashInstant;
    }
})

app.controller('DashScheduleCtrl', function($scope, $location, dashInstant) {
    //
})

app.controller('DashRecurringCtrl', function($scope, $location, dashInstant) {
    //
})

app.controller('DashProjectCtrl', function($scope, $location, dashInstant) {
    //
})

app.controller('DashAddressBookCtrl', function($scope, $location, dashInstant) {
    //
})

app.controller('DashdriversearningsCtrl', function($scope, $http) {
    //
})

app.controller('DashAddressBookCtrl', function($scope, $http, $rootScope) {
    var idGrab = function() {
        return $rootScope.currentUser._id;
    }
    var refresh = function() {
        $http.post('/api/contactlist', {data:idGrab()}).success(function(response) {
            $scope.conlist = response.data;
            console.log($scope.conlist);
        });
    };
    refresh();
    $scope.addContact =function() {
        $http.post('/api/add-contact', {
            contact: $scope.contact,
            user: $rootScope.currentUser._id
        }).success(function(response){
            refresh();
        });
     };
})

app.controller('DashJobCompleteCtrl', function($scope, $location, dashInstant) {
    //
})

// Ctrl For Navigation
app.controller('NaviCtrl', function($scope, views, $route, auth, $http) {
    $scope.views = views;
    // Grab appRoute.js Action Param
    views.currentView = $route.current.action;
    views.currentType = $route.current.type;
    views = $scope.views;
    auth.intercept(views);
    $scope.isCardAdded = '';

    $scope.checkCard = function() {
        if($scope.isCardAdded == 'added') {

        } else {
            $http.post('/api/check-card').success(function(res) {
                console.log(res);
                $scope.isCardAdded = res.message;
                console.log($scope.isCardAdded);
                $scope.cardDetails = {};
                $scope.cardDetails.brand = res.data.brand;
                $scope.cardDetails.last4 = res.data.last4;
            })
        }

    }

    $scope.removeCard = function() {
        $http.post('/api/remove-card').success(function(res) {
            if(res.success == true) {
                $scope.isCardAdded = 'none';
            }
        })
    }

    $scope.getCardForm = function() {
        $('#payment-form').submit(function(event) {
            event.preventDefault();
            var $form = $(this);

            Stripe.setPublishableKey('pk_test_GrFP5ytVZ9Df9ZKztAJbiOmc');

            Stripe.card.createToken($form, function(status, res) {
               // console.log(res);
                $http.post("/api/add-card", res).success(function(status){
                    if(status.success == true) {
                        $scope.checkCard();
                    }
                });
            });
        })
    }



    $scope.logout = function(){
        $http.post("/api/logout").success(function(){
            $location.url("/login");
        });
    };

    $scope.openTicketbar = function(){
        var ele = $(".am-right-sidebar:hidden");
        if (ele.hasClass("open-right-sidebar")){
            ele.removeClass("open-right-sidebar");
        }else{
            ele.addClass("open-right-sidebar");
        }
    };
})


// Ctrl For Navigation
app.controller('NaviAdminCtrl', function($scope, views, $route, admin, $route, $http, $location, auth) {
    $scope.admin = admin;
    // Grab appRoute.js Action Param
    admin.currentView = $route.current.action;

//    $scope.views = views;
//    // Grab appRoute.js Action Param
//    views.currentType = $route.current.action.type;
//    views.currentView = $route.current.action.view;
//    views = $scope.views;
//    auth.intercept(views);
})

app.controller('DashDaccountCtrl', function($scope, $location) {
    //
})

app.controller('DashDearningsCtrl', function($scope, $location) {
    //
})

app.controller('DashDnaviCtrl', function($scope, contractor, $route, $http, $location) {
    $scope.contractor = contractor;
    // Grab appRoute.js Action Param
    contractor.currentView = $route.current.action;
})
