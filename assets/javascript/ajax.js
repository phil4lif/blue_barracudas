$(document).ready(function () {
    console.log("ready")


    // function to display results after submit button is pressed
    $("#submit").on("click", function (e) {
        e.preventDefault();

        console.log("submit button working")

        // ajax call for USA Jobs

        // var host = "data.usajobs.gov";
        // var userAgent = "rasipes@gmail.com";
        var authKey = "1+O9aAwfO+XgebPVfqXfSkKAL3bb7wv4QItq/LRvqlA=";
        var topic = $("#keyword").val();
        var place = $("#location").val();

        var queryURL = "https://data.usajobs.gov/api/search?Keyword=" + topic + "&Location=" + place;

        $.ajax({
            url: queryURL,
            method: "GET",
            headers: {
                // "Host": host,
                // "User-Agent": userAgent,
                "Authorization-Key": authKey
            }
        }).then(function (response) {
            console.log(response);


            // displays results from the USAJobs board to the page
            var results = response.SearchResult.SearchResultItems;

            // create a new div for each job result in the array with a unique id corresponding with the index of the item
            results.map(function (value, key) {
                // create new table row
                var newResult = $("<tr>");
                newResult.addClass("search-result");
                newResult.attr("id", "result-" + key);
                // add table data
                // console.log(value);
                var newJobTitle = $("<td>").html("<a href='" + value.MatchedObjectDescriptor.ApplyURI[0] + "' target='_blank'>" + value.MatchedObjectDescriptor.PositionTitle + "</a>")


                var newEmployer = $("<td>").text(value.MatchedObjectDescriptor.OrganizationName);
                var newJobLocation = $("<td>").text(value.MatchedObjectDescriptor.PositionLocationDisplay);
                var newJobDescription = $("<td>").addClass("overflow-auto").html(value.MatchedObjectDescriptor.UserArea.Details.JobSummary.substring(0, 250) + "...<a href='#'data-toggle='modal' data-target='#exampleModalScrollable'> see more </a>");
                $(".modal-body").val(value.MatchedObjectDescriptor.UserArea.Details.JobSummary);
                $('#exampleModalScrollable .modal-body').html();
                //open the modal
                // $('#exampleModalScrollable').modal('show') 
                // append table data to new row
                newResult.append(newJobTitle).append(newEmployer).append(newJobLocation).append(newJobDescription);
                // append new row to table body
                $(".job-info-1").append(newResult);

            });


        })


        //writing ajax functionality for the github jobs api

        var keyword = $("#keyword").val()
        var loc = $("#location").val()
        var queryURL = "https://jobs.github.com/positions.json?description=" + keyword + "&location=" + loc


        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            var resultsArr = response;
            console.log(resultsArr);


            //GitHub Jobs Code
            // create a new div for each job result in the array with a unique id corresponding with the index of the item
            resultsArr.map(function (value, key) {
                // create new table row
                var newResult = $("<tr>");
                newResult.addClass("search-result");
                newResult.attr("id", "result-" + key);
                // here i make a var called save button and create an html button using jquery
                var saveButton = $("<button>");
                //add the text to the button
                saveButton.text("Save")
                //add bootstrap classes to this button and a save-button class for click functionality
                saveButton.addClass("btn btn-primary btn-sm save-button")
                //here I add the attributes for the values that I will need to push to the database in the click function
                saveButton.attr("data-url", value.url)
                saveButton.attr("data-title", value.title)
                saveButton.attr("data-company", value.company)
                saveButton.attr("data-loc", value.location)
                //now I make another var newsavebutton which creates the data cell 
                var newSaveButton = $("<td>")
                //that I append the actual button to
                newSaveButton.append(saveButton)
                //these are the variables that we create to hold the values that the ajax query returns to us
                var newJobTitle = $("<td>").html("<a href='" + value.url + "' target='_blank'>" + value.title + "</a>");
                var newEmployer = $("<td>").text(value.company);
                var newJobLocation = $("<td>").text(value.location);
                var newJobDescription = $("<td>").addClass("overflow-auto").html(value.description.substring(0, 250) + "...<a href='#'data-toggle='modal' data-target='#exampleModalScrollable'> see more </a>");
                // append table data to new row
                newResult.append(newSaveButton).append(newJobTitle).append(newEmployer).append(newJobLocation).append(newJobDescription);
                // append new row to the appropriate table body
                $(".job-info-2").append(newResult);
                // });


            })














            // //ajax for indeed api
            // var keywordIndeed = $("#keyword").val()
            // var loc= $("#location").val()
            // var settings = {
            // 	"async": true,
            // 	"crossDomain": true,
            // 	"url": "https://indeed-indeed.p.rapidapi.com/apigetjobs?v=2&format=json",
            // 	"method": "GET",
            // 	"headers": {
            // 		"x-rapidapi-host": "indeed-indeed.p.rapidapi.com",
            // 		"x-rapidapi-key": "6a24900b4dmsh49b37a3833d9488p16a5cfjsnf50ec338300e"
            // 	}
            // }

            // $.ajax(settings).done(function (response) {
            // 	console.log(response);
            // });


            //writing ajax for reed api
            // var keywordReed = "web"
            // var locationReed = "london"
            // var queryURLreed = "https://www.reed.co.uk/api/search?keywords="+keywordReed+"&locationName="+locationReed

            // $.ajax ({
            //     url: queryURLreed,
            //     method: "GET"
            // }).then(function(response){
            //     var results = response
            //     console.log(results)
            // })


            //Empties the input boxes after the submit button is clicked
            $("#keyword").val(" ")
            $("#location").val(" ")

        });


    });
    //initialize the firebase database where we can save user saved jobs
    var firebaseConfig = {
        apiKey: "AIzaSyDLgO9rlM5PW8AhrIWk31hdSwHxaEHbyhA",
        authDomain: "blue-barracuda.firebaseapp.com",
        databaseURL: "https://blue-barracuda.firebaseio.com",
        projectId: "blue-barracuda",
        storageBucket: "blue-barracuda.appspot.com",
        messagingSenderId: "436435380595",
        appId: "1:436435380595:web:9989d968eb18cc60cd7d06"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    var database = firebase.database();

    //write the functionality of the save buttons
    //_______________________________________________
    //document click function that will allow the user to click

    //on the dynamically generated save buttons from the api calls that display in the save
    //column of the table rows
    //when the user clicks the save button
    $(document).on("click", ".save-button", function (e) {
        //the object will be pushed to firebase on that signed in users path
        e.preventDefault();
        console.log("save")
        console.log($(this).attr("data-url"))
        //these are the attributes that were created when the button was made.
        database.ref().push({
            title: $(this).attr("data-title"),
            location: $(this).attr("data-loc"),
            company: $(this).attr("data-company"),
            url: $(this).attr("data-url")

        })
    })
    //the saved jobs will then be pulled from firebase to be displayed on the favorites html page
    //use the child added function to take the values from the db
    database.ref().on("child_added", function (snapshot) {
        console.log(snapshot.val());
        //and store them in new variables
        var eraseButton = $("<button>").text("erase").addClass("btn btn-primary btn-sm erase-button")
        var appliedButton = $("<button>").text("i've applied").addClass("btn btn-primary btn-sm applied-button")
        var savedTitle = snapshot.val().title
        var savedLoc = snapshot.val().location
        var savedCompany = snapshot.val().company
        var savedURL = snapshot.val().url

        var newRow = $("<tr>").append(
            $("<td>").html(eraseButton),
            $("<td>").html(appliedButton),
            $("<td>").text(savedTitle),
            $("<td>").text(savedLoc),
            $("<td>").text(savedCompany),
            $("<td>").text(savedURL)
        )
        $(".job-info-saved").append(newRow);
            database.ref().remove({
                
            })
    })




    //give functionality to the new buttons in the saved jobs table
    //the erase button will remove the saved job from firebase and from the table at the same time
$(document).on("click", ".erase-button", function(){
    console.log("erase")
})

    //the applied for button will move the job to the other table for applied for jobs
})
