$(document).ready(function () {

  
    var artist = "kanye west"
    counter = 1;

    var trackNames = [];
    var trackIDs = [];
    console.log(artist);
    console.log(trackNames);
    var artistChoice;
    var language;
    var score=0;
    
    ////////MAJOR TASK 0: Read user's selection of language and artist, then save to, and then read from sessionstorage.  
    var artistSelect = $(".card").click(function(){
        artistChoice = $(this).attr("data-artist");
        console.log(artistChoice);

        // sessionStorage.clear();
        // sessionStorage.setItem("artist-name", artistChoice);
    })

    var showLink = $(".card").click(function(){
        if (this) {
            $(".card").find("a").addClass("hidden");
            $(this).find("a").removeClass("hidden");
            $(".card").removeClass("selected")
            $(this).addClass("selected");
                        
        }
        sessionStorage.setItem("artist-name", artistChoice);
    })

    var startGame = $(".hidden").click(function(){
        sessionStorage.clear();
        sessionStorage.setItem("artist-name", artistChoice);
        sessionStorage.setItem("language", language);
    })

    if (sessionStorage.getItem("language") == undefined) {
        language = "jive"      
        console.log(language);

    } else {
        language = sessionStorage.getItem("language");
        artistChoice = sessionStorage.getItem("artist-name");
        console.log(language);
        console.log(artistChoice);
    };

    //update artist picture

    var artistImage = "images/"+artistChoice+".jpg"
    console.log(artistImage);
    $("#artist-image").attr("src", artistImage);


    ////////MAJOR TASK 1: Call musixmatch to get track names and id's  

    var getTracksUrl = "https://api.musixmatch.com/ws/1.1/track.search?format=jsonp&callback=callback&q_artist="+artistChoice+"&s_track_rating=desc&quorum_factor=1&page_size=30&apikey=8f4de785a9dfc3bf07c73a3c479848c3";
   
        //get top 15 songs by artist
        $.ajax({
            url: getTracksUrl,
            method: "GET",
            dataType: "jsonp"

        }).then(function (response) {
            console.log(response);
            var things = response.message.body.track_list;


            for (i = 0; i < things.length; i++) {
                //console.log("the track id of the first song is: "+things[i].track.track_id);
                trackIDs.push(things[i].track.track_id)
                //console.log("the track name of the second song is: "+things[i].track.track_name);
                trackNames.push(things[i].track.track_name);
            }
            nextQuestion();
        })

            //console.log(trackNames);
            function nextQuestion() {
            /////////MAJOR TASK 2 Select 3 random songs to be in the next question, store them in new array, and delete them from old array. 
            var obj = {}
            var questionTracksArray = []
            var questionIdsArray = []

            for (i = 0; i < 3; i++) {
                //console.log(randy);
                var randy = Math.floor(Math.random() * trackNames.length);

                //Get track name and id based on randy, save those to obj. INSTEAD: put tracks in array, and ids in seperate array. 
                obj["trackname" + i] = trackNames[randy];
                obj["trackid" + i] = trackIDs[randy];
                questionTracksArray.push(trackNames[randy]);
                questionIdsArray.push(trackIDs[randy]);


                //remove the chosen track and trackid from large arrays
                trackNames.splice(randy, 1);
                trackIDs.splice(randy, 1);

            }

            //////CHOOSE 1 track to be right answer
            var rightAnswerPosition = Math.floor(Math.random() * Math.floor(3))
            var rightAnswerID = questionIdsArray[rightAnswerPosition];
            var rightAnswerTrack = questionTracksArray[rightAnswerPosition];
            console.log("the right answer and matching track id are: " + rightAnswerTrack + " " + rightAnswerID);
            //using this random number, that will select the location of the correct answer in the new array with just this question's 3 tracks. 


            //Get a snippet of the song. Go into the new tracksidarray[rightanswerposition] as the variable here in this url. 
            var getSnippetUrl = "https://api.musixmatch.com/ws/1.1/track.snippet.get?format=jsonp&callback=callback&track_id=" + rightAnswerID + "&apikey=8f4de785a9dfc3bf07c73a3c479848c3";


            //Second API call to Musixmatch to get snippet of correct answer
            $.ajax({
                url: getSnippetUrl,
                method: "GET",
                dataType: "jsonp"
            }).then(function (data) {
                console.log(data);
                if (data.message.body.length==0) {
                    nextQuestion();
                    return
                } 
                var snippet = data.message.body.snippet.snippet_body;
                console.log(snippet);


                //API call to FunTranslate API based on which language was selected
                if (language==="jive") {
                var translateUrl = "https://api.funtranslations.com/translate/jive.json/?text=" + snippet;
                var key = "Ex0S5zXJ945RlSnwTKuS7geF"
                }

                if (language==="yoda") {
                    var translateUrl = "https://api.funtranslations.com/translate/yoda.json/?text=" + snippet;
                    var key = "qHJ1JuyinTEvWX00BamKBQeF"
                }

                if (language==="shakespeare") {
                    var translateUrl = "https://api.funtranslations.com/translate/shakespeare.json/?text=" + snippet;
                    var key = "T8DF5Cy12eOCMAI_O5LF7geF"
                }

                
                $.ajax({
                    url: translateUrl,
                    headers: {
                        "X-FunTranslations-Api-Secret": key
                    },
                    method: "POST"
                }).then(function (translate) {
                    var translatedText = translate.contents.translated
                    $("#snippets").text(translatedText);
                })

                //print answer options to document
                $("#middle").empty
                $(".option0").html("<p class='selection' data-position='0'>" + obj.trackname0 + "</p>")
                $(".option1").html("<p class='selection' data-position='1'>" + obj.trackname1 + "</p>")
                $(".option2").html("<p class='selection' data-position='2'>" + obj.trackname2 + "</p>")

                //Hide high score forms when game starts
                $("#enterInfo").hide()

                //MAJOR TASK 4: CHECK IF USERS ANSWER CORRECT OR NOT
                $(".selection").on("click", function () {
                    var userChoice = parseInt($(this).attr("data-position"));
                    
                    console.log(userChoice);
                    if (userChoice === rightAnswerPosition) {
                        
                        $("#results").html('Great job! The original line was "' + snippet + '" ')
                        $("#button-holder").append("<button id='next-question'> Next Question </buton>")
                        score++
                        
                    } else {
                        
                        $("#results").html('Sorry wrong answer! The original line was "' + snippet + '" from ' + rightAnswerTrack)
                        $("#button-holder").append("<button id='next-question'> Next Question </buton>")
                        
                    };
                    $("#results").show();
                    $("#button-holder").show();
                    counter++


                    
                    if (counter > 5) {
                        console.log("5 questions have been asked, round is over")
                        $("#results").html("Game over! Your score is "+score);
                        $("#results").append("<div class='score'>"+score+"</div>")
                        $("#button-holder").hide();
                        $("#enterInfo").show();
                        $("#answer-holder").hide();
                        
                        
                    } else {
                        console.log("move onto questions #"+counter)
                        
                    }
                    
                })


            })
        }

        $(document).on("click", "#next-question", function(){
            $("#button-holder").empty();
            $("#results").hide();
            nextQuestion();
        })


        
    
    var clicks = $(".tabbs").click(function(){
        if (this) {
            $(".tabbs").removeClass("current")
            $(this).addClass("current")
        }
        if (this){
            language = $(".current").attr("data-choice");
            console.log(language);
            sessionStorage.setItem("language", language);
            $(".brand-logo").html("Do You Speak Jive");
            $("body").css("background-image","url(images/background.jpg)");
            // $("body").css("font-family", "'Special Elite', cursive;"); 

        }
        if (language === "yoda") {
            $(".brand-logo").html("Do You Speak Yoda");
            $("body").css("background-image", "url(images/yoda.jpg)");
            console.log($("#body").css("font-family"));
            $("body").attr("style", "font-family: 'VT323' !important;");
            
    
        }
        

        if (language === "shakespeare") {
            $(".brand-logo").html("Do You Speak Shakespeare")
            $(".brand-logo").addClass("shakespeareClass")
            $("body").css("background-image", "url(images/shakes.jpg)");
            $("body").css("font-family", "'MedievalSharp', cursive;");
        }
        // sessionStorage.clear(); 
    });


    





});