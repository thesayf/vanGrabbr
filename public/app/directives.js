// Directives Path
var dir = 'app/components/';

app.directive('head', function() {
	return {
		templateUrl: dir+'head.html',
		controller: 'NaviCtrl',
	}
})

app.directive('navi', function() {
	return {
		templateUrl: dir+'navi.html',
		controller: 'NaviCtrl',
	}
})

// DASH PAGES
app.directive('dashHome', function() {
	return {
		templateUrl: dir+'dash/views/dash-home.html',
		controller: 'NaviCtrl',
	}
})

app.directive('dashInstant', function() {
	return {
		templateUrl: dir+'dash/views/dash-instant.html',
		controller: 'DashInstantCtrl',
	}
})

app.directive('dashProfile', function() {
	return {
		templateUrl: dir+'dash/views/dash-profile.html',
		controller: 'DashProfileCtrl',
	}
})

app.directive('dashJobStatus', function() {
	return {
		templateUrl: dir+'dash/views/dash-jobstatus.html',
		controller: 'DashStatusCtrl',
	}
})

app.directive('dashSchedule', function() {
	return {
		templateUrl: dir+'dash/views/dash-schedule.html',
		controller: 'DashScheduleCtrl',
	}
})

app.directive('dashRecurring', function() {
	return {
		templateUrl: dir+'dash/views/dash-recurring.html',
		controller: 'DashRecurringCtrl',
	}
})

app.directive('dashProject', function() {
	return {
		templateUrl: dir+'dash/views/dash-project.html',
		controller: 'DashProjectCtrl',
	}
})

app.directive('dashAddressbook', function() {
	return {
		templateUrl: dir+'dash/views/dash-addressbook.html',
		controller: 'DashAddressBookCtrl',
	}
})

app.directive('dashAddaddress', function() {
	return {
		templateUrl: dir+'dash/views/dash-addaddress.html',
		controller: 'DashAddAddressCtrl',
	}
})

app.directive('dashJobcomplete', function() {
	return {
		templateUrl: dir+'dash/views/dash-jobcomplete.html',
		controller: 'DashJobCompleteCtrl',
	}
})

app.directive('dashPaymentdetails', function() {
	return {
		templateUrl: dir+'dash/views/dash-paymentdetails.html',
		controller: 'DashPaymentCtrl',
	}
})

app.directive('dashProjectjob', function() {
	return {
		templateUrl: dir+'dash/views/dash-projectjob.html',
		controller: 'DashJobCompleteCtrl',
	}
})

app.directive('dashSavedquotes', function() {
	return {
		templateUrl: dir+'dash/views/dash-savedquotes.html',
		controller: 'DashJobCompleteCtrl',
	}
})

app.directive('dashPendingjobs', function() {
	return {
		templateUrl: dir+'dash/views/dash-pendingjobs.html',
		controller: 'DashJobCompleteCtrl',
	}
})

app.directive('dashAllmessages', function() {
	return {
		templateUrl: dir+'dash/views/dash-allmessages.html',
		controller: 'DashMessageCtrl',
	}
})

// Dash Modals
app.directive('dashPorterQty', function() {
	return {
		templateUrl: dir+'dash/views/modals/dash-porter-qty.html',
		controller: 'DashJobCompleteCtrl',
	}
})

app.directive('dashRoutePlan', function() {
	return {
		templateUrl: dir+'dash/views/modals/dash-route-plan.html',
		controller: 'DashJobCompleteCtrl',
	}
})

app.directive('dashVanType', function() {
	return {
		templateUrl: dir+'dash/views/modals/dash-van-type.html',
		controller: 'DashJobCompleteCtrl',
	}
})

app.directive('dashOauth', function() {
	return {
		templateUrl: dir+'dash/views/modals/dash-oauth-window.html',
		controller: 'DashJobCompleteCtrl',
	}
})

app.directive('adminHome', function() {
	return {
		templateUrl: dir+'admin/views/admin-home.html',
		controller: 'NaviCtrl',
	}
})

app.directive('naviAdmin', function() {
	return {
		templateUrl: dir+'navi-admin.html',
		controller: 'NaviAdminCtrl',
	}
})

app.directive('adminUsers', function() {
	return {
		templateUrl: dir+'admin/views/admin-users.html',
		controller: 'DashUsersCtrl',
	}
})

app.directive('adminDrivers', function() {
	return {
		templateUrl: dir+'admin/views/admin-drivers.html',
		controller: 'DashDriversCtrl',
	}
})

app.directive('adminEarnings', function() {
	return {
		templateUrl: dir+'admin/views/admin-earnings.html',
		controller: 'DashdriversearningsCtrl',
	}
})

app.directive('adminStaff', function() {
	return {
		templateUrl: dir+'admin/views/admin-staff.html',
		controller: 'DashStaffCtrl',
	}
})

app.directive('contractorHome', function() {
	return {
		templateUrl: dir+'contractors/views/contractor-home.html',
		controller: 'DashDaccountCtrl',
	}
})

app.directive('contractorEarnings', function() {
	return {
		templateUrl: dir+'contractors/views/contractor-earnings.html',
		controller: 'DashDaccountCtrl',
	}
})

app.directive('naviContractor', function() {
	return {
		templateUrl: dir+'navi-contractor.html',
		controller: 'DashDnaviCtrl',
	}
})


