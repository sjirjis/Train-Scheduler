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

//routeId will be used to create unique children for each route
var routeId = 0
	,routeName = 'route_'

$('#reset').on('click', function(){
	//function to delete all custom routes and rebuild standard
	//staging standard schedule data
	var train_name = ['Green Line', 'Orange Line', 'Blue Line']
		,destination = ['Santee', 'El Cajon', 'San Ysidro']
		,frequency = ['19', '15', '7'];
	
	//dumping entire db since set method won't overwrite root
	//when chained to child node
	dbRef.remove();

	//loop through staging data above to build standard schedule
	for (i = 0; i < train_name.length; i++){
		routeId = i + 1;

		dbRefStandard.child(routeName + routeId).set({
			train_name: train_name[i]
			,destination: destination[i]
			,frequency: frequency[i]
		});

		dbRefStandard.on('value', function(snap){
			//console.log(JSON.parse(snap.val()));
			console.log(JSON.stringify(snap.val()));
		});

		//bump so routeId can be used as the next ID for custom route
		routeId = routeId + 1;
	}
});

//create user input var's and assign default values
//to use agaist data validation check
var $trainNameInput = ''
	,$destinationInput = ''
	,$firstTrainTimeInput = ''
	,$frequencyInput = ''

$('#submit').on('click', function(){
	//store user input into vars
	$trainNameInput = $('#trainNameInput').val();
	$destinationInput = $('#destinationInput').val();
	$firstTrainTimeInput = $('#firstTrainTimeInput').val();
	$frequencyInput = $('#frequencyInput').val();

	//@todo: user input validation

	// if(
	// 	//(very) basic input validation, 
	// 	//all three fields must have values 
	// 	//before a db entry will occur
	// 	$trainNameInput === ''
	// 	|| $destinationInput === ''
	// 	|| $frequencyInput === ''
	// ){
	// 	alert('Empty required field! (change this alert to a modal)');
	// finally, if we got here then go ahead and write to the db
	// }else{
		dbRefCustom.child(routeName + routeId).update({
			train_name: $trainNameInput
			,destination: $destinationInput
			,frequency: $frequencyInput	
		});

		routeId++

		//alert('Train saved! (change this alert to a modal)');

		//sure I could write the stored user input vars to the
		//html, but what fun would that be?

			// dbRef.child('custom_schedule').on('child_added', function(snap){
			// 	console.log(JSON.stringify(snap.val(), null, 3));
			//});
	//}
});


