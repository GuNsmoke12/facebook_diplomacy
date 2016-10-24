var feedData, fromData,
    y = 0,
    z = 0,
    accessToken = "access_token=EAAWqZANrHWwABAP5ie4dtbJ35yAceujR1m8S6neY0fYG0Elu79WuL78MtAiQGrxs0PrZAzlAXDmbmy3HWCPYnGxLNhlqZA1njOQd6nuni23sdai5tpn4XON2EkzmbeswA4TIXzv8xhCKwOj8b8c0h2Vu4gtUM0ZD",
    urlStart = "https://graph.facebook.com/v2.5/";

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


$(document).ready(function() {
    loadFeed();
});
