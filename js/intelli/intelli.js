intelli = function()
{
	return {

		/**
		 * Language array
		 */
		lang: null,

		/**
		 * Clipboard object
		 */
		clipboard: null,

		/**
		 * CSS array
		 */
		css: new Array(),

		/**
		 *  Check if value exists in array
		 *
		 *  @param {Array} val value to be checked
		 *  @param {String} arr array
		 *
		 *  @return {Boolean}
		 */
		inArray: function(val, arr)
		{
			if (typeof arr == 'object' && arr)
			{
				for(var i = 0; i < arr.length; i++)
				{
					if (arr[i] == val)
					{
						return true;
					}
				}

				return false;
			}

			return false;
		},

		/**
		 * Remove one item in the array
		 *
		 * @param {Array} arr array
		 * @param {String} val value to be removed
		 *
		 * @return {Array}
		 */
		remove: function(arr, val)
		{
			if (typeof arr == 'object' && arr)
			{
				for(var i = 0; i < arr.length; i++) 
				{
					if (arr[i] == val)
					{
						arr.splice(i, 1);
					}
				}
			}

			return arr;
		},

		/**
		 *  Load configuration & language phrases
		 *
		 *  @param {Array} array of parametrs lang|conf
		 *
		 *  TODO: store variables in the session. Use sessvars lib.
		 */
		loader: function(params)
		{
			var out = '';
			var url = '';

			url += (typeof params.conf != 'undefined') ? 'conf=' + params.conf : '';
			url += (typeof params.lang != 'undefined') ? '&lang=' + params.lang : '';

			$.ajax(
			{
				type: 'POST', 
				url: 'loader.php?load=vars', 
				data: url,
				async: false,
				success: function(p)
				{
					out = eval('(' + p + ')');
				}
			});
			
			if (typeof out.conf != 'undefined')
			{
				if (null == intelli.conf)
				{
					intelli.conf = out.conf;
				}
				else
				{
					var keys = params.conf.split(',');
					
					for(var i = 0; i <= keys.length; i++)
					{
						intelli.conf[keys[i]] = out.conf[keys[i]];
					}
				}
			}

			if (typeof out.lang != 'undefined')
			{
				if(null == intelli.lang)
				{
					intelli.lang = out.lang;
				}
				else
				{
					var keys = params.lang.split(',');
					
					for(var i = 0; i <= keys.length; i++)
					{
						intelli.lang[keys[i]] = out.lang[keys[i]];
					}
				}
			}
		},

		/**
		 *  Hide or show elements
		 *
		 *  @param {String} obj Can be passed with # symbol
		 *  @param {String} action  show|hide|auto
		 */
		display: function(obj, action)
		{
			var obj = (typeof obj == 'object') ? obj : (-1 != obj.indexOf('#')) ? $(obj) : $('#' + obj);
			
			action = action ? action : 'auto';

			if ('auto' == action)
			{
				action = ('none' == obj.css('display')) ? 'show' : 'hide';
			}
			
			if ('hide' == action)
			{
				$.browser.msie ? obj.hide() : obj.slideUp('fast');
			}

			if ('show' == action)
			{
				$.browser.msie ? obj.show() : obj.slideDown('fast');
			}
		},

		/**
		 * Return random letter
		 *
		 */
		getRandomLetter: function()
		{
			return String.fromCharCode(97 + Math.round(Math.random() * 25));
		},

		/**
		 * Show error message
		 */
		error: function(error)
		{
			alert(error);
		},

		/**
		 * Create new cookie
		 *
		 * @param {String} name cookie name
		 * @param {String} value cookie value
		 * @param {Integer} days number of days to keep cookie value for
		 */
		createCookie: function(name, value, days)
		{
			if (days)
			{
				var date = new Date();
				date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
				var expires = "; expires=" + date.toGMTString();
			}
			else 
			{
				var expires = "";
			}
			
			document.cookie = name + "=" + value + expires + "; path=/";
		},

		/**
		 * Return the value of cookie
		 *
		 * @param {String} name cookie name
		 *
		 * @return {String}
		 */
		readCookie: function(name)
		{
			var nameEQ = name + "=";
			var ca = document.cookie.split(';');
			for(var i = 0; i < ca.length; i++)
			{
				var c = ca[i];
				while (c.charAt(0)==' ') c = c.substring(1, c.length);
				if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
			}

			return null;
		},

		/**
		 * Clear cookie value
		 *
		 * @param {String} name cookie name
		 */
		eraseCookie: function(name)
		{
			this.createCookie(name, '', -1);
		},

		cssCapture: function(attr, val)
		{
			this.css.push(attr + ':' + val);
		},

		cssClear: function()
		{
			this.css = [];
		},

		cssExtract: function()
		{
			return this.css.join('; ') + ';';
		},

		urlVal: function( name )
		{
			name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
			
			var regexS = "[\\?&]"+name+"=([^&#]*)";
			var regex = new RegExp( regexS );
			var results = regex.exec(window.location.href);
			
			if(results == null)
			{
				return null;
			}
			else
			{
				return results[1];
			}
		},

		notifBox: function(opt)
		{
			var msg = opt.msg;
			var type = opt.type || 'info';
			var autohide = opt.autohide || (type == 'notification' || type == 'success' || type == 'error' ? true : false);
			var pause = opt.pause || 10;
			var html = '';

			if ('notif' == type || type == 'notification')
			{
				type = 'success';
			}

			var boxid = 'notification';
			if (opt.boxid)
			{
				boxid = opt.boxid;
			}

			var obj = $('#' + boxid);
			if ($.isArray(msg))
			{
				html += '<ul class="unstyled">';
				for(var i = 0; i < msg.length; i++)
				{
					if ('' != msg[i])
					{
						html += '<li>' + msg[i] + '</li>';
					}
				}
				html += '</ul>';
			}
			else
			{
				html += ['<ul class="unstyled"><li>', msg, '</li></ul>'].join('');
			}

			obj.attr('class', 'alert alert-' + type).html(html).show();

			if (autohide)
			{
				obj.delay(pause * 1000).fadeOut('slow');
			}

			$('html, body').animate({scrollTop: obj.offset().top}, 'slow');

			return obj;
		},

		initCopy2clipboard: function()
		{
			ZeroClipboard.setMoviePath(intelli.config.ia_url + 'js/utils/zeroclipboard/ZeroClipboard.swf');

			var text = Ext.get('htaccess_code').dom.innerHTML;
			
			text = text.replace(/\r\n|\r|\n/g, "");
			text = text.replace(/<br>/gi, "\r\n");

			text = text.replace(/&lt;/gi, '<');
			text = text.replace(/&gt;/gi, '>');
			text = text.replace(/&amp;/gi, '&');

			$("a.copybutton").each(function()
			{
				var clipboard = new ZeroClipboard.Client();

				clipboard.glue(this);
				clipboard.setText(text);
			});

			return false;
		},

		is_int: function(input)
		{
			return !isNaN(input) && parseInt(input) == input;
		},

		is_email: function(email)
		{
			var result = email.search(/^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z]{2,3})+$/);
			
			if(result > -1)
			{
				return true;
			}
			else
			{
				return false;
			}
		},

		ckeditor: function(name, o)
		{
            if (CKEDITOR.instances[name])
            {
                return false;
            }
			var opts = {
				baseHref: intelli.config.ia_url,
			};

			if(o)
			{
				$.each(o, function(i, p)
				{
					opts[i] = p;
				});
			}

			var editor = CKEDITOR.replace(name, opts);
		},

		add_tab: function(name, text)
		{
			tab = $('<li>').append($('<a>').attr({'data-toggle':'tab', 'href':'#' + name}).text(text));
			tab_content = $('<div>').attr('id', name).addClass('tab-pane');
			
			if($('.nav-tabs', '.tabbable').children().length == 0)
			{						
				tab.addClass('active');
				tab_content.addClass('active');
			}

			$('.nav-tabs', '.tabbable').append(tab);
			
			$('.tab-content', '.tabbable').append(tab_content);
		}
	};
}();

intelli.lang = new Object();

function _t(key, def)
{
	if (intelli.admin && intelli.admin.lang[key])
	{
		return intelli.admin.lang[key];
	}

	return _f(key, def);
}

function _f(key, def)
{
	if (intelli.lang[key])
	{
		return intelli.lang[key];
	}

	return (def ? (def === true ? key : def) : '{'+key+'}');
}

// BUG with ie9 in ExtJs
if ((typeof Range !== "undefined") && !Range.prototype.createContextualFragment)
{
	Range.prototype.createContextualFragment = function(html)
	{
		var frag = document.createDocumentFragment(), div = document.createElement("div");

		frag.appendChild(div);
		div.outerHTML = html;

		return frag;
	};
}