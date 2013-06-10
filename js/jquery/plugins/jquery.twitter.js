(function($) {
	$.fn.tweet = function(settings) {
		var config = {
			user : 'Subrion'
		};
		function parseDate(str) {
		  var v=str.split(' ');
		  return new Date(Date.parse(v[1]+" "+v[2]+", "+v[5]+" "+v[3]+" UTC"));
		}
		if (settings)
			$.extend(config, settings);
		var twitterBlock = $('<ul class="tweet_list"></ul>').appendTo(this);
		var pattern = /(http\S+)/gi;
		var relative_time = function(time_value) {
			if($.browser.msie)
			{
				temp = time_value.split(' ');
				var mls = temp[4];
				temp[4] = temp[5];
				temp[5] = mls;
				time_value = temp.join(' ');
			}
			var parsed_date = Date.parse(time_value);
			var relative_to = (arguments.length > 1) ? arguments[1]
					: new Date();
			var delta = parseInt((relative_to.getTime() - parsed_date) / 1000);

			if (delta < 60) {
				return 'less than a minute ago';
			} else if (delta < 120) {
				return 'about a minute ago';
			} else if (delta < (45 * 60)) {
				return (parseInt(delta / 60)).toString() + ' minutes ago';
			} else if (delta < (90 * 60)) {
				return 'about an hour ago';
			} else if (delta < (24 * 60 * 60)) {
				return 'about ' + (parseInt(delta / 3600)).toString()
						+ ' hours ago';
			} else if (delta < (48 * 60 * 60)) {
				return '1 day ago';
			} else {
				return (parseInt(delta / 86400)).toString() + ' days ago';
			}
		};
		
		intelli.twites_func = function(twites) {
			var text;
			$.each(twites,function(i, tweet) {
				text = '<a target="_blank" href="http://twitter.com/' + config.user + '" rel="nofollow" class="tweet_avatar">'
						+ '<img alt="virtualformac" src="' + tweet.user.profile_image_url + '" />'
					+ '</a>'
					+ '<span class="tb_author">'
						+ '<a target="_blank" href="http://twitter.com/' + config.user + '" rel="nofollow">' + config.user + '</a> '
					+ '</span>'
					+ '<span class="tweet_text">' + tweet.text.replace(pattern, '<a href="$1" target="_blank" rel="nofollow">$1</a>') + '</span><br>'
					+ '<span class="tweet_from">'
						+ '<a href="http://twitter.com/' + config.user + '/status/' + tweet.id_str + '" target="_blank" rel="nofollow">'
							+ relative_time(tweet.created_at) 
						+ '</a> from ' + tweet.source 
					+ '</span>';
				$('<li id="tweet' + tweet.id + '" class="'+(i%2==0?'tweet_odd':'')+(i==0?' tweet_first':'')+(i==twites.length-1?' tweet_last':'')+'">' + text + '</li>')
					.appendTo(twitterBlock);
			});
		};
		$.ajax({
			url : 'http://api.twitter.com/1/statuses/user_timeline.json?callback=intelli.twites_func',
			dataType : 'jsonp',
			type : 'GET',
			data : 'screen_name=' + config.user + '&count=' + intelli.config.twitter_count
		});
		
	};
})(jQuery);
