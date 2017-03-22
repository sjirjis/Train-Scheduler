var config = {
    apiKey: "AIzaSyD5XaIeja-1wSB-ffHu2TesGEVK2BB2k5s",
    authDomain: "train-scheduler-ec0fb.firebaseapp.com",
    databaseURL: "https://train-scheduler-ec0fb.firebaseio.com",
    storageBucket: "train-scheduler-ec0fb.appspot.com",
    messagingSenderId: "17501726830"
  };
firebase.initializeApp(config);

//how about some database shortcuts
var dbRef = firebase.database().ref()
 ,dbRefStandard = dbRef.child('standard_schedule')
 ,dbRefCustom = dbRef.child('custom_schedule');

 var standardSchedule = function(){
	//function to delete all custom routes and rebuild standard
	//staging standard schedule data

	//dumping entire db since set method won't overwrite root
	//when chained to child node
	dbRef.remove();

	//clear the markup too
	$('tbody').empty();
		
	//let's start with standard values
	var trainName = ['Green Line', 'Orange Line', 'Blue Line']
	,destination = ['Santee', 'El Cajon', 'San Ysidro']
	,frequency = ['19', '15', '7']
	,firstTrainTime = ['0000', '0070', '0014'];

	//loop through staging data above to build standard schedule
	for (i = 0; i < trainName.length; i++){
		routeId = i + 1;

		dbRefStandard.push({
			trainName: trainName[i]
			,destination: destination[i]
			,frequency: frequency[i]
			,firstTrainTime: firstTrainTime[i]
		});

		//add to markup
		$('tbody').append(
		'<tr>'
			+'<td>' + trainName[i]
			+'<td>' + destination[i]
			+'<td>' + frequency[i] 
		+'<tr>');	
	}
 };

standardSchedule();

$('#reset').on('click', function(){
	standardSchedule();

    $('.modal-title').html('Reset to Standard Train Schedule!')
    $('#modal').modal('show');
	setTimeout(function() {$('#modal').modal('hide');}, 2000);    
});


$('#submit').on('click', function(){
	//create user input var's and assign default values
	//to use agaist data validation check
	var $trainNameInput = ''
		,$destinationInput = ''
		,$firstTrainTimeInput = ''
		,$frequencyInput = ''

	//store user input into vars
	$trainNameInput = $('#trainNameInput').val();
	$destinationInput = $('#destinationInput').val();
	$firstTrainTimeInput = $('#firstTrainTimeInput').val();
	$frequencyInput = $('#frequencyInput').val();

	//@todo: user input validation

	if(
		//(very) basic input validation, 
		//all three fields must have values 
		//before a db entry will occur
		$trainNameInput === ''
		|| $destinationInput === ''
		|| $firstTrainTimeInput === ''
		|| $frequencyInput === ''
	){
	    $('.modal-title').html('Cannot have an empty field!')
	    $('#modal').modal('show');
    	setTimeout(function() {$('#modal').modal('hide');}, 2000);    

	//finally, if we got here then go ahead and write to the db
	}else{
		dbRefCustom.push({
			trainName: $trainNameInput
			,destination: $destinationInput
			,frequency: $frequencyInput	
			,firstTrainTime: $firstTrainTimeInput
		});

	    $('.modal-title').html('Train Schedule Added!')
	    $('#modal').modal('show');
    	setTimeout(function() {$('#modal').modal('hide');}, 2000);    

		// catch the new user input in the db
		//and write it to the markup
		dbRefCustom.once('child_added').then(function(snap){
			$('tbody').append(
			'<tr>'
				+'<td>' + snap.val().trainName
				+'<td>' + snap.val().destination
				+'<td>' + snap.val().frequency 
			+'<tr>');
		});
	}
});


var nextArrivalCalc = function(firstTrainTimeInputTest, frequency){
	//strip to date down to midnight
	var nextArrival = moment().startOf('day')

	//take user input and format into fully qualified date
	//so we can compare below
	firstTrainTimeInputTest = moment().startOf('day').add(firstTrainTimeInputTest.substring(0,2), 'h').add(firstTrainTimeInputTest.substring(3,5), 'm');

	//add the frequency to the ftt until the next arrival is in the future
	while (moment(nextArrival).isBefore(moment())){
		nextArrival = nextArrival.add(frequency, 'm');	
	};

	//now that we have next arrival, let's quickly grab minutes away
	var minAway = moment(nextArrival).diff(moment());

	console.log(moment(minAway).format('mm'));
};

//testing
	var firstTrainTimeInputTest = '10:01'

nextArrivalCalc(firstTrainTimeInputTest, 19);