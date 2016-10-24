var urlStart = "https://graph.facebook.com/v2.5/",
    accessToken = "access_token=EAAWqZANrHWwABAP5ie4dtbJ35yAceujR1m8S6neY0fYG0Elu79WuL78MtAiQGrxs0PrZAzlAXDmbmy3HWCPYnGxLNhlqZA1njOQd6nuni23sdai5tpn4XON2EkzmbeswA4TIXzv8xhCKwOj8b8c0h2Vu4gtUM0ZD",
    groupId = "1779834468932639",
    feedUrl = urlStart + groupId + "/feed?" + accessToken,
    fromUrl = urlStart + groupId + "/feed?fields=from&" + accessToken,
    limit = 10,
    feedData, fromData;

function grabFeed() {
  var id, limiter = false;
  // First grab main group feed + from data
  $.when(
    $.getJSON(feedUrl, function(data) {
      feedData = data.data;
    }),
    $.getJSON(fromUrl, function(data) {
      fromData = data.data;
    })
  ).then(function() {
    //Add story to message if no message
    for (i=0; i < feedData.length; i++) {
      id = feedData[i].id;
      if (!feedData[i].message) {
        feedData[i].message = feedData[i].story;
      }

      //Add poster data
      for (x=0; x < fromData.length; x++) {
        if (fromData[x].id == id) {
          feedData[i].poster = fromData[x].from.name;
          feedData[i].posterId = fromData[x].from.id;
        }
      }
    }

    //Write the data to the html
    for (i=0; i < feedData.length; i++) {
      limiter = i < limit ? false : true;
      writeFeed(null, feedData[i].id, feedData[i].message, feedData[i].poster, feedData[i].updated_time, limiter);

      //grab and write profile pic
      grabProfilePic(feedData[i].id, feedData[i].posterId);
    }

    //Go grab the comments for each post
    for (i=0; i < feedData.length; i++) {
      var postid = feedData[i].id,
          commentUrl = urlStart + postid + "/comments?" + accessToken;

      grabComments(postid, commentUrl);
    }
  });
}

function grabComments(postid, commentUrl, stop) {
  var commentData, i, subcommentUrl;

  $.when(
    $.getJSON(commentUrl, function(data) {
      commentData = data.data;
    })
  ).then(function() {
    //Write the recieved data to the html
    for (i=0; i < commentData.length; i++) {
      writeFeed(postid, commentData[i].id, commentData[i].message, commentData[i].from.name, commentData[i].created_time);

      //grab and write profile pic
      grabProfilePic(commentData[i].id, commentData[i].from.id);

      //grab and write subcomments. ie. comments of comments
      //Added in a stop because comments don't go any deeper than this
      //plus I was too lazy to think of a better way to stop this infinite loop
      if (!stop) {
        subcommentUrl = urlStart + commentData[i].id + "/comments?" + accessToken;
        grabComments(commentData[i].id, subcommentUrl, true)
      }
    }
  });
}

function writeFeed(parentid, id, message, poster, time, limit) {
  var parentElement, html,
      classes = limit ? "post_hidden" : "",
      formattedTime = new Date(time);

  if (parentid != null) {
    parentElement = $('#'+parentid);
  } else {
    parentElement = $('.feed');
  }

  html = '<div id="'+ id +'" class="post_wrapper '+ classes +'">'
    + '<div class="post_poster">'+ poster +'</div>'
    + '<div class="post_date">'+ formattedTime +'</div>'
    + '<div class="post_message">'+ message +'</div>'
  + '</div>';

  parentElement.append(html);
}

function grabProfilePic(postid, posterid) {
  var picData, i, html,
      picUrl = urlStart + posterid + "/picture?type=square&" + accessToken;

  html = '<div class="post_pic"><img src="'+ picUrl +'"></div>';
  $('#'+postid).prepend(html);
}


$(document).ready(function() {
  grabFeed();

  $('.button_load').click(function (event) {
    event.preventDefault;
    $('.post_hidden').fadeIn();
    $('.button_load').hide();
  });
});
