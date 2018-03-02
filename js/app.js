$( document ).ready(function() {

    //when page loads, call to api to generate top 10 tracks from artist


    //Artist based on user's selection, which takes them to this artist specific page. Generate top 20 songs from artist
    var artist = "kanye west"
    var getTracksUrl = "https://api.musixmatch.com/ws/1.1/track.search?format=jsonp&callback=callback&q_artist="+artist+"&s_track_rating=desc&quorum_factor=1&page_size=15&apikey=89ad81ace06e14e5ea120774c03a0555";

    $.ajax({
        url: getTracksUrl,
        method: "GET",
      

        
    }).then(function(response){
        // console.log(response);
        
        //find index position of"body" using search. 
        var bodyPosition = response.search("body");
        console.log(bodyPosition);

        //delete everything in string before body
        var slicedResponse = response.slice(101);
        console.log(slicedResponse);

        slicedResponse.slice

        //parse that string back into an object/array
        //read the track id and track list out of it that array


        // response.slice(0,100);
        // console.log(response.slice(100));

        
        // console.log("the track id is: " + response.message.body.track_list.track_id)
    })
    

    

    

});