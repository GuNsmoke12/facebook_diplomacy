var feedData, fromData,
    y = 0,
    accessToken = "access_token=EAACEdEose0cBALiSjQhX2qodHJiuhLfFsKKHiNrgaHjnX9arbon0dPFtRKUerZAH1uSzSODHX8D0keNAJ3txHZBiHXXBh0fvonTTmA1nkeS1dQGnQSMTF8Ra0wLJHqaxsJkxihhsSw4YSxfUIrpwfcgYMfWtFQfwVkBjXwfAZDZD",
    urlStart = "https://graph.facebook.com/v2.5/";

function loadFeed () {
    var id, i, x, commentsData, commentsUrl,
        groupId = "1779834468932639",
        feedUrl = urlStart + groupId + "/feed?" + accessToken,
        fromUrl = urlStart + groupId + "/feed?fields=from&" + accessToken;

    $.when(
        $.getJSON(feedUrl, function(data) {
            feedData = data.data;
        }),
        $.getJSON(fromUrl, function(data) {
            fromData = data.data;
        })
    ).then(function() {
        for (i=0; i < feedData.length; i++) {
            id = feedData[i].id;
            if (!feedData[i].message) {
                feedData[i].message = feedData[i].story;
            }

            for (x=0; x < fromData.length; x++) {
                if (fromData[x].id == id) {
                    feedData[i].poster = fromData[x].from.name;
                }
            }

            addComments(i, feedData.length, id, feedData);
        }
    });
}

function addComments(count, length, id, data) {
    var commentsUrl = urlStart + id + "/comments?" + accessToken,
        data;

    $.when(
        $.getJSON(commentsUrl, function(data) {
            commentsData = data.data;
        })
    ).then(function() {
        feedData[count].comments = commentsData;
        y++;

        console.log(y, length);
        if (y >= length) {
            printFeed(feedData);
        }
    })
}

function printFeed (feedData) {
    var i, x, message, comments, poster, comm, createdTime,
        subMessage, subTime, subPoster, subImage,
        feed = $('.feed'),
        postsShowLimit = 15;
        mobileSizeShowLimit = 9;

    for (i=0; i < feedData.length; i++) {
        if (feedData[i].image) {
            image = '<div class="post_image"><img src="' + feedData[i].image + '" /></div>';
        } else {
            image = '';
        }

        message = '<p>' + feedData[i].message + '</p>';
        poster = '<span class="poster">' + feedData[i].poster + '</span>';
        createdTime = '<span class="post_date">' + new Date(feedData[i].updated_time).toDateString() + '</span>';
        comments = '<div class="commentsWrapper">';

        console.log(feedData[i].comments);

        if (feedData[i].comments.length > 0) {
            comm = feedData[i].comments;

            for (x=0; x < comm.length; x++) {
                if (comm[x].image) {
                    subImage = '<div class="post_image"><img src="' + comm[x].image + '" /></div>';
                } else {
                    subImage = '';
                }

                subMessage = '<p>' + comm[x].message + '</p>';
                subTime = '<span class="post_date">' + new Date(comm[x].created_time).toDateString() + '</span>';
                subPoster = '<span class="poster">' + comm[x].from.name + '</span>';

                comments += '<div class="post_wrapper">' +
                      subImage +
                      subPoster +
                    '<div class="post_message">' +
                        subMessage +
                        subTime +
                    '</div>' +
                '</div>'
            }
        }
        comments += '</div>';
        // comments = '<span class="post_count"><i class="fa fa-comments"></i>' + feedData[i].comments + '</span>';

        feed.append(
          '<div class="post_wrapper">' +
                image +
                poster +
              '<div class="post_message">' +
                  message +
                  createdTime +
              '</div>' +
              '<div class="post_footer">' +
                  comments +
              '</div>' +
          '</div>'
        );
    }
}

$(document).ready(function() {
    loadFeed();
});
