$( document ).ready(function() {

    ////////MAJOR TASK 1: Call musixmatch to get track names and id's  
    var artist = "kanye west"
    var getTracksUrl = "https://api.musixmatch.com/ws/1.1/track.search?format=jsonp&callback=callback&q_artist="+artist+"&s_track_rating=desc&quorum_factor=1&page_size=15&apikey=89ad81ace06e14e5ea120774c03a0555";

    //get top 15 songs by artist
    $.ajax({
        url: getTracksUrl,
        method: "GET",
        dataType: "jsonp"
          
    }).then(function(response){
        console.log(response);
        var things = response.message.body.track_list;
        var trackNames = [];
        var trackIDs = [];

        for (i=0; i<things.length; i++) {
            //console.log("the track id of the first song is: "+things[i].track.track_id);
            trackIDs.push(things[i].track.track_id)
            //console.log("the track name of the second song is: "+things[i].track.track_name);
            trackNames.push(things[i].track.track_name);
        }
        
        console.log(trackNames);

        /////////MAJOR TASK 2 Select 3 random songs to be in the next question, store them in new array, and delete them from old array. 
        var obj = {} 
        var questionTracksArray=[]
        var questionIdsArray=[]
        
        for (i=0; i<3; i++) {
            console.log(randy);
            var randy = Math.floor(Math.random()*trackNames.length);
        
            //Get track name and id based on randy, save those to obj. INSTEAD: put tracks in array, and ids in seperate array. 
            obj["trackname"+i] = trackNames[randy];
            obj["trackid"+i] = trackIDs[randy];
            console.log(obj)
            questionTracksArray.push(trackNames[randy]);
            questionIdsArray.push(trackIDs[randy]);
            console.log(questionTracksArray);
            console.log(questionIdsArray);

            //remove the chosen track and trackid from large arrays
            trackNames.splice(randy, 1);
            trackIDs.splice(randy,1); 
            console.log(trackNames); 
        }

        //////CHOOSE 1 track to be right answer
        var rightAnswerPosition = Math.floor(Math.random() * Math.floor(3))
        console.log("the right answer is #: "+rightAnswerPosition);
        var rightAnswerID = questionIdsArray[rightAnswerPosition];
        var rightAnswerTrack = questionTracksArray[rightAnswerPosition];
        console.log("the right answer and matching track id are: "+rightAnswerTrack+" "+rightAnswerID);
        //using this random number, that will select the location of the correct answer in the new array with just this question's 3 tracks. 


        //Get a snippet of the song. Go into the new tracksidarray[rightanswerposition] as the variable here in this url. 
        var getSnippetUrl = "https://api.musixmatch.com/ws/1.1/track.snippet.get?format=jsonp&callback=callback&track_id="+rightAnswerID+"&apikey=89ad81ace06e14e5ea120774c03a0555";
        

        //Second API call to Musixmatch to get snippet of correct answer
        $.ajax({
            url: getSnippetUrl,
            method: "GET",
            dataType: "jsonp"
        }).then(function(data){
            console.log(data);
            var snippet = data.message.body.snippet.snippet_body;
            console.log(snippet);
            

            //MAJOR TASK 3: API call to FunTranslate API to translate snippet to chosen language
            var translateUrl = "http://api.funtranslations.com/translate/jive.json/?text="+snippet;

            $.ajax({
                url: translateUrl,
                headers : {
                    "X-FunTranslations-Api-Secret": "Ex0S5zXJ945RlSnwTKuS7geF"
                },
                method: "POST"
            }).then(function(translate){
                console.log(translate);
                $(".snippet").text(translate.contents.translated); 
            })
            
            //print answer options to document
            $(".options").append("<p class='selection' data-position='0'>"+obj.trackname0+"</p>")
            $(".options").append("<p class='selection' data-position='1'>"+obj.trackname1+"</p>")
            $(".options").append("<p class='selection' data-position='2'>"+obj.trackname2+"</p>")


            //MAJOR TASK 4: CHECK IF USERS ANSWER CORRECT OR NOT

            $(document).on("click", ".selection", function() {
                var userChoice = parseInt($(this).attr("data-position"));
                //var userChoiceInt = parseInt(userChoice)
                console.log(userChoice);
                if (userChoice === rightAnswerPosition) {
                    console.log("correct answer");
                } else {
                    console.log("incorrect answer");
                }
            })

        })
    })    



        

        
        



        
    
    

    

    

});