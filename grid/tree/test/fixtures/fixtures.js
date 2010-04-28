    var make = function(type, count, make) {
        //make all items now ....
        var items = []
        for (var i = 0; i < (count); i++) {
            var num = i;
            var item = make(i, items)
            if (!item.id) {
                item.id = num;
            }
            items.push(item)
        }
        $.fixture["-" + type[0]] = function(settings) {


            var retArr = items.slice(0);


            $.each((settings.data.order || []).reverse(), function(i, name) {
                var split = name.split(" ");
                retArr = retArr.sort(function(a, b) {
                    if (split[1].toUpperCase() != "ASC")
                        return a[split[0]] < b[split[0]]
                    else
                        return a[split[0]] > b[split[0]]
                })
            })
            var offset = settings.data.offset || 0;
            var limit = settings.data.limit || (count - offset)

            var i = 0;
            for (var param in settings.data) {
                if (param.indexOf("Id") != -1) {
                    while (i < retArr.length) {
                        if (settings.data[param] != retArr[i][param]) {
                            retArr.splice(i, 1)
                        } else {
                            i++;
                        }
                    }
                }
            }


            return [{
                "count": retArr.length,
                "limit": settings.data.limit,
                "offset": settings.data.offset,
                "data": retArr.slice(offset, offset + limit)
}]
            }
            $.fixture["-" + type[1]] = function(settings) {
                for (var i = 0; i < (count); i++) {
                    if (settings.data.id == items[i].id) {
                        return [items[i]]
                    }
                }
            }
            $.fixture["~" + type[0]] = items;
        }



        make(["communities", "community"], 4, function(num) {
            return { "id": num,
                "name": "Community " + num,
                "description": "This is the description for dicussion community " + num,
                "alias": "huh",
                "isHot": !!parseInt(Math.random() * 2),
                "hasNewPosts": !!parseInt(Math.random() * 2),
                "forumCount": 0,
                "topicCount": Math.round(Math.random() * 100)
            }
        })


        make(["forums", "forum"], 1000, function(num) {
            var communityId = Math.floor(Math.random() * $.fixture["~communities"].length)
            community = $.fixture["~communities"][communityId]
            community.forum_count++;
            return { "id": num,
                "name": "Forum " + num,
                "description": "This is the description for forum " + num + ", community " + communityId,
                "communityId": communityId,
                "alias": "Jennifer Garner",
                "isHot": false,
                "hasNewPosts": true,
                "post_count": Math.round(Math.random() * 100),
                "topic_count": 0
            }
        })
        $.fixture["~topics"] = [];
        make(["messages", "message"], 2000, function(num, messages) {
            var forumId = Math.floor(Math.random() * 8),
		    forum = $.fixture["~forums"][forumId]

            var messageId = parseInt(Math.random() * num);
            var message = messages[messageId]
            if (num < 400) {
                forum.topic_count++;
                var topic = { "title": "This is topic " + num,
                    "body": "Let Us Know what you like about topic " + num + ".  Isn't it interesting?",
                    "author": "Justin Meyer",
                    "createdAt": "10-20-1992",
                    "replyCount": 0,
                    "viewCount": 62,
                    "isHot": !!parseInt(Math.random() * 2),
                    "hasNewPosts": !!parseInt(Math.random() * 2),
                    "forumId": forumId,
                    "parentId": null,
                    "topicId" : null
                }
                $.fixture["~topics"].push(topic);
                return topic;
            } else {
                //connect to a topic
                message.replyCount++;
                return { "title": "This is message " + num,
                    "body": "Let Us Know what you like about message " + num + ".  Isn't it interesting?",
                    "author": "Justin Meyer",
                    "createdAt": "10-20-1992",
                    "replyCount": 0,
                    "viewCount": 62,
                    "isHot": !!parseInt(Math.random() * 2),
                    "hasNewPosts": !!parseInt(Math.random() * 2),
                    "forumId": forumId,
                    "parentId": messageId,
                    "topicId": message.topicId || message.id
                }
            }

        })
        make(["bookmarks", "bookmark"], 100, function(num) {
            var topic_id = Math.floor(Math.random() * $.fixture["~topics"].length),
	        topic = $.fixture["~topics"][topic_id]
            //forum.topic_count++;
            return { "topic_id": topic_id,
                "type": "Traditional",
                topic: topic,
                forum: $.fixture["~forums"][topic.forumId]
            }
        })
        make(["subscriptions", "subscription"], 100, function(num) {
            var topic_id = Math.floor(Math.random() * $.fixture["~topics"].length),
	        topic = $.fixture["~topics"][topic_id]
            //forum.topic_count++;
            return { "topic_id": topic_id,
                "type": "Traditional",
                topic: topic,
                forum: $.fixture["~forums"][topic.forumId]
            }
        })
        /*make(["messages", "message"], 1000, function(num) {
        var topic_id = Math.floor(Math.random() * $.fixture["~topics"].length),
        topic = $.fixture["~topics"][topic_id]
        //forum.topic_count++;
        return { "topic_id": topic_id,
        "type": "Traditional",
        topic: topic,
        forum: $.fixture["~forums"][topic.forumId]
        }
        })*/