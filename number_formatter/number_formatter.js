steal.then(function($){
/**
 * jquery.numberformatter - Formatting/Parsing Numbers in jQuery
 * Written by Michael Abernethy (mike@abernethysoft.com),
 * Andrew Parry (aparry0@gmail.com)
 *
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * @author Michael Abernethy, Andrew Parry
 * @version 1.2-SNAPSHOT ($Id$)
 *
 * many thanks to advweb.nanasi.jp for his bug fixes
 * jsHashtable is now used also, so thanks to the author for that excellent little class.
 *
 * This plugin can be used to format numbers as text and parse text as Numbers
 * Because we live in an international world, we cannot assume that everyone
 * uses "," to divide thousands, and "." as a decimal point.
 *
 * As of 1.2 the way this plugin works has changed slightly, parsing text to a number
 * has 1 set of functions, formatting a number to text has it's own. Before things
 * were a little confusing, so I wanted to separate the 2 out more.
 *
 *
 * jQuery extension functions:
 *
 * formatNumber(options, writeBack, giveReturnValue) - Reads the value from the subject, parses to
 * a Javascript Number object, then formats back to text using the passed options and write back to
 * the subject.
 * 
 * parseNumber(options) - Parses the value in the subject to a Number object using the passed options
 * to decipher the actual number from the text, then writes the value as text back to the subject.
 * 
 * 
 * Generic functions:
 * 
 * formatNumber(numberString, options) - Takes a plain number as a string (e.g. '1002.0123') and returns
 * a string of the given format options.
 * 
 * parseNumber(numberString, options) - Takes a number as text that is formatted the same as the given
 * options then and returns it as a plain Number object.
 * 
 * To achieve the old way of combining parsing and formatting to keep say a input field always formatted
 * to a given format after it has lost focus you'd simply use a combination of the functions.
 * 
 * e.g.
 * $("#salary").blur(function(){
 * 		$(this).parseNumber({format:"#,###.00", locale:"us"});
 * 		$(this).formatNumber({format:"#,###.00", locale:"us"});
 * });
 *
 * The syntax for the formatting is:
 * 0 = Digit
 * # = Digit, zero shows as absent
 * . = Decimal separator
 * - = Negative sign
 * , = Grouping Separator
 * % = Percent (multiplies the number by 100)
 * 
 * For example, a format of "#,###.00" and text of 4500.20 will
 * display as "4.500,20" with a locale of "de", and "4,500.20" with a locale of "us"
 *
 *
 * As of now, the only acceptable locales are 
 * United States -> "us"
 * Arab Emirates -> "ae"
 * Egypt -> "eg"
 * Israel -> "il"
 * Japan -> "jp"
 * South Korea -> "kr"
 * Thailand -> "th"
 * China -> "cn"
 * Hong Kong -> "hk"
 * Taiwan -> "tw"
 * Australia -> "au"
 * Canada -> "ca"
 * Great Britain -> "gb"
 * India -> "in"
 * Germany -> "de"
 * Vietnam -> "vn"
 * Spain -> "es"
 * Denmark -> "dk"
 * Austria -> "at"
 * Greece -> "gr"
 * Brazil -> "br"
 * Czech -> "cz"
 * France  -> "fr"
 * Finland -> "fi"
 * Russia -> "ru"
 * Sweden -> "se"
 * Switzerland -> "ch"
 * 
 **/


/*	Dependencies Start	*/

/*	jsHashtable	*/
/**
 * Copyright 2009 Tim Down.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var Hashtable=(function(){var w="undefined",f="function",k="string",j="equals",t="hashCode",o="toString";var r=(typeof Array.prototype.splice==f)?function(y,x){y.splice(x,1)}:function(A,z){var y,B,x;if(z===A.length-1){A.length=z}else{y=A.slice(z+1);A.length=z;for(B=0,x=y.length;B<x;++B){A[z+B]=y[B]}}};function v(y){var x;if(typeof y==k){return y}else{if(typeof y[t]==f){x=y.hashCode();return(typeof x==k)?x:v(x)}else{if(typeof y[o]==f){return y.toString()}else{return String(y)}}}}function s(x,y){return x.equals(y)}function b(x,y){return(typeof y[j]==f)?y.equals(x):(x===y)}function d(x){return function(y){if(y===null){throw new Error("null is not a valid "+x)}else{if(typeof y==w){throw new Error(x+" must not be undefined")}}}}var g=d("key"),c=d("value");function i(y,z,x){this.entries=[];this.addEntry(y,z);if(x!==null){this.getEqualityFunction=function(){return x}}}var a=0,l=1,h=2;function p(x){return function(z){var y=this.entries.length,B,A=this.getEqualityFunction(z);while(y--){B=this.entries[y];if(A(z,B[0])){switch(x){case a:return true;case l:return B;case h:return[y,B[1]]}}}return false}}function u(x){return function(A){var B=A.length;for(var z=0,y=this.entries.length;z<y;++z){A[B+z]=this.entries[z][x]}}}i.prototype={getEqualityFunction:function(x){return(typeof x[j]==f)?s:b},getEntryForKey:p(l),getEntryAndIndexForKey:p(h),removeEntryForKey:function(y){var x=this.getEntryAndIndexForKey(y);if(x){r(this.entries,x[0]);return x[1]}return null},addEntry:function(x,y){this.entries[this.entries.length]=[x,y]},keys:u(0),values:u(1),getEntries:function(y){var A=y.length;for(var z=0,x=this.entries.length;z<x;++z){y[A+z]=this.entries[z].slice(0)}},containsKey:p(a),containsValue:function(y){var x=this.entries.length;while(x--){if(y===this.entries[x][1]){return true}}return false}};function q(){}q.prototype=[];function e(A,x){var y=A.length,z;while(y--){z=A[y];if(x===z[0]){return y}}return null}function n(y,x){var z=y[x];return(z&&(z instanceof q))?z[1]:null}function m(A,x){var B=this;var E=[];var y={};var C=(typeof A==f)?A:v;var z=(typeof x==f)?x:null;this.put=function(I,K){g(I);c(K);var F=C(I),J,H,G=null;var L=n(y,F);if(L){H=L.getEntryForKey(I);if(H){G=H[1];H[1]=K}else{L.addEntry(I,K)}}else{J=new q();J[0]=F;J[1]=new i(I,K,z);E[E.length]=J;y[F]=J}return G};this.get=function(H){g(H);var F=C(H);var I=n(y,F);if(I){var G=I.getEntryForKey(H);if(G){return G[1]}}return null};this.containsKey=function(G){g(G);var F=C(G);var H=n(y,F);return H?H.containsKey(G):false};this.containsValue=function(G){c(G);var F=E.length;while(F--){if(E[F][1].containsValue(G)){return true}}return false};this.clear=function(){E.length=0;y={}};this.isEmpty=function(){return !E.length};var D=function(F){return function(){var G=[],H=E.length;while(H--){E[H][1][F](G)}return G}};this.keys=D("keys");this.values=D("values");this.entries=D("getEntries");this.remove=function(I){g(I);var G=C(I),F,H=null;var J=n(y,G);if(J){H=J.removeEntryForKey(I);if(H!==null){if(!J.entries.length){F=e(E,G);r(E,F);y[G]=null;delete y[G]}}}return H};this.size=function(){var G=0,F=E.length;while(F--){G+=E[F][1].entries.length}return G};this.each=function(I){var F=B.entries(),G=F.length,H;while(G--){H=F[G];I(H[0],H[1])}};this.putAll=function(N,I){var H=N.entries();var K,L,J,F,G=H.length;var M=(typeof I==f);while(G--){K=H[G];L=K[0];J=K[1];if(M&&(F=B.get(L))){J=I(L,F,J)}B.put(L,J)}};this.clone=function(){var F=new m(A,x);F.putAll(B);return F}}return m})();

/*	Dependencies End	*/


(function(jQuery) {

	var nfLocales = new Hashtable();
	
	var nfLocalesLikeUS = [ 'ae','au','ca','cn','eg','gb','hk','il','in','jp','sk','th','tw','us' ];
	var nfLocalesLikeDE = [ 'at','br','de','dk','es','gr','it','nl','pt','tr','vn' ];
	var nfLocalesLikeFR = [ 'cz','fi','fr','ru','se' ];
	var nfLocalesLikeCH = [ 'ch' ];
	
	var nfLocaleFormatting = [ [".", ","], [",", "."], [",", " "], [".", "'"] ]; 
	var nfAllLocales = [ nfLocalesLikeUS, nfLocalesLikeDE, nfLocalesLikeFR, nfLocalesLikeCH ]

	function FormatData(dec, group, neg) {
		this.dec = dec;
		this.group = group;
		this.neg = neg;
	};

	function init() {
		// write the arrays into the hashtable
		for (var localeGroupIdx in nfAllLocales) {
			localeGroup = nfAllLocales[localeGroupIdx];
			for (var i = 0; i < localeGroup.length; i++) {
				nfLocales.put(localeGroup[i], localeGroupIdx);
			}
		}
	};

	function formatCodes(locale) {
		if (nfLocales.size() == 0)
			init();

         // default values
         var dec = ".";
         var group = ",";
         var neg = "-";
		 
		 // hashtable lookup to match locale with codes
		 var codesIndex = nfLocales.get(locale);
		 if (codesIndex) {
		 	var codes = nfLocaleFormatting[codesIndex];
			if (codes) {
				dec = codes[0];
				group = codes[1];
			}
		 }
		 return new FormatData(dec, group, neg);
    };
	
	
	/*	Formatting Methods	*/
	
	
	/**
	 * Formats anything containing a number in standard js number notation.
	 * 
	 * @param {Object}	options			The formatting options to use
	 * @param {Boolean}	writeBack		(true) If the output value should be written back to the subject
	 * @param {Boolean} giveReturnValue	(true) If the function should return the output string
	 */
	jQuery.fn.formatNumber = function(options, writeBack, giveReturnValue) {
	
		return this.each(function() {
			// enforce defaults
			if (writeBack == null)
				writeBack = true;
			if (giveReturnValue == null)
				giveReturnValue = true;
			
			// get text
			var text;
			if (jQuery(this).is(":input"))
				text = new String(jQuery(this).val());
			else
				text = new String(jQuery(this).text());

			// format
			var returnString = jQuery.formatNumber(text, options);
		
			// set formatted string back, only if a success
			if (returnString) {
				if (writeBack) {
					if (jQuery(this).is(":input"))
						jQuery(this).val(returnString);
					else
						jQuery(this).text(returnString);
				}
				if (giveReturnValue)
					return returnString;
			}
			return '';
		});
	};
	
	/**
	 * First parses a string and reformats it with the given options.
	 * 
	 * @param {Object} numberString
	 * @param {Object} options
	 */
	jQuery.formatNumber = function(numberString, options){
		var options = jQuery.extend({}, jQuery.fn.formatNumber.defaults, options);
		var formatData = formatCodes(options.locale.toLowerCase());
		
		var dec = formatData.dec;
		var group = formatData.group;
		var neg = formatData.neg;
		
		var validFormat = "0#-,.";
		
		// strip all the invalid characters at the beginning and the end
		// of the format, and we'll stick them back on at the end
		// make a special case for the negative sign "-" though, so 
		// we can have formats like -$23.32
		var prefix = "";
		var negativeInFront = false;
		for (var i = 0; i < options.format.length; i++) {
			if (validFormat.indexOf(options.format.charAt(i)) == -1) 
				prefix = prefix + options.format.charAt(i);
			else 
				if (i == 0 && options.format.charAt(i) == '-') {
					negativeInFront = true;
					continue;
				}
				else 
					break;
		}
		var suffix = "";
		for (var i = options.format.length - 1; i >= 0; i--) {
			if (validFormat.indexOf(options.format.charAt(i)) == -1) 
				suffix = options.format.charAt(i) + suffix;
			else 
				break;
		}
		
		options.format = options.format.substring(prefix.length);
		options.format = options.format.substring(0, options.format.length - suffix.length);
		
		// now we need to convert it into a number
		//while (numberString.indexOf(group) > -1) 
		//	numberString = numberString.replace(group, '');
		//var number = new Number(numberString.replace(dec, ".").replace(neg, "-"));
		var number = new Number(numberString);
		
		return jQuery._formatNumber(number, options, suffix, prefix, negativeInFront);
	};
	
	/**
	 * Formats a Number object into a string, using the given formatting options
	 * 
	 * @param {Object} numberString
	 * @param {Object} options
	 */
	jQuery._formatNumber = function(number, options, suffix, prefix, negativeInFront) {
		var options = jQuery.extend({}, jQuery.fn.formatNumber.defaults, options);
		var formatData = formatCodes(options.locale.toLowerCase());
		
		var dec = formatData.dec;
		var group = formatData.group;
		var neg = formatData.neg;
		
		if (isNaN(number)) {
			if (options.nanForceZero == true)
				number = 0;
			else
				return null;
		}

		// special case for percentages
        if (suffix == "%")
        	number = number * 100;

		var returnString = "";
		if (options.format.indexOf(".") > -1) {
			var decimalPortion = dec;
			var decimalFormat = options.format.substring(options.format.lastIndexOf(".") + 1);
			
			// round or truncate number as needed
			if (options.round == true)
				number = new Number(number.toFixed(decimalFormat.length));
			else {
				var numStr = number.toString();
				numStr = numStr.substring(0, numStr.lastIndexOf('.') + decimalFormat.length + 1);
				number = new Number(numStr);
			}
			
			var decimalValue = number % 1;
			var decimalString = new String(decimalValue.toFixed(decimalFormat.length));
			decimalString = decimalString.substring(decimalString.lastIndexOf(".") + 1);
			
			for (var i = 0; i < decimalFormat.length; i++) {
				if (decimalFormat.charAt(i) == '#' && decimalString.charAt(i) != '0') {
                	decimalPortion += decimalString.charAt(i);
					continue;
				} else if (decimalFormat.charAt(i) == '#' && decimalString.charAt(i) == '0') {
					var notParsed = decimalString.substring(i);
					if (notParsed.match('[1-9]')) {
						decimalPortion += decimalString.charAt(i);
						continue;
					} else
						break;
				} else if (decimalFormat.charAt(i) == "0")
					decimalPortion += decimalString.charAt(i);
			}
			returnString += decimalPortion
         } else
			number = Math.round(number);

		var ones = Math.floor(number);
		if (number < 0)
			ones = Math.ceil(number);

		var onePortion = "";
		if (ones == 0) {
			onePortion = "0";
		} else {
			// find how many digits are in the group
			var onesFormat = "";
			if (options.format.indexOf(".") == -1)
				onesFormat = options.format;
			else
				onesFormat = options.format.substring(0, options.format.indexOf("."));
			var oneText = new String(Math.abs(ones));
			var groupLength = 9999;
			if (onesFormat.lastIndexOf(",") != -1)
				groupLength = onesFormat.length - onesFormat.lastIndexOf(",") - 1;
			var groupCount = 0;
			for (var i = oneText.length - 1; i > -1; i--) {
				onePortion = oneText.charAt(i) + onePortion;
				groupCount++;
				if (groupCount == groupLength && i != 0) {
					onePortion = group + onePortion;
					groupCount = 0;
				}
			}
		}

		returnString = onePortion + returnString;

		// handle special case where negative is in front of the invalid characters
		if (number < 0 && negativeInFront && prefix.length > 0)
			prefix = neg + prefix;
		else if (number < 0)
			returnString = neg + returnString;
		
		if (!options.decimalSeparatorAlwaysShown) {
			if (returnString.lastIndexOf(dec) == returnString.length - 1) {
				returnString = returnString.substring(0, returnString.length - 1);
			}
		}
		returnString = prefix + returnString + suffix;
		return returnString;
	};


	/*	Parsing Methods	*/


	/**
	 * Parses a number of given format from the element and returns a Number object.
	 * @param {Object} options
	 */
	jQuery.fn.parseNumber = function(options, writeBack, giveReturnValue) {
		// enforce defaults
		if (writeBack == null)
			writeBack = true;
		if (giveReturnValue == null)
			giveReturnValue = true;
		
		// get text
		var text;
		if (jQuery(this).is(":input"))
			text = new String(jQuery(this).val());
		else
			text = new String(jQuery(this).text());
	
		// parse text
		var number = jQuery.parseNumber(text, options);
		
		if (number) {
			if (writeBack) {
				if (jQuery(this).is(":input"))
					jQuery(this).val(number.toString());
				else
					jQuery(this).text(number.toString());
			}
			if (giveReturnValue)
				return number;
		}
	};
	
	/**
	 * Parses a string of given format into a Number object.
	 * 
	 * @param {Object} string
	 * @param {Object} options
	 */
	jQuery.parseNumber = function(numberString, options) {
		var options = jQuery.extend({}, jQuery.fn.parseNumber.defaults, options);
		var formatData = formatCodes(options.locale.toLowerCase());

		var dec = formatData.dec;
		var group = formatData.group;
		var neg = formatData.neg;

		var valid = "1234567890.-";
		
		// now we need to convert it into a number
		while (numberString.indexOf(group)>-1)
			numberString = numberString.replace(group,'');
		numberString = numberString.replace(dec,".").replace(neg,"-");
		var validText = "";
		var hasPercent = false;
		if (numberString.charAt(numberString.length-1)=="%")
			hasPercent = true;
		for (var i=0; i<numberString.length; i++) {
			if (valid.indexOf(numberString.charAt(i))>-1)
				validText = validText + numberString.charAt(i);
		}
		var number = new Number(validText);
		if (hasPercent) {
			number = number / 100;
			number = number.toFixed(validText.length-1);
		}

		return number;
	};

	jQuery.fn.parseNumber.defaults = {
		locale: "us",
		decimalSeparatorAlwaysShown: false
	};

	jQuery.fn.formatNumber.defaults = {
		format: "#,###.00",
		locale: "us",
		decimalSeparatorAlwaysShown: false,
		nanForceZero: true,
		round: true
	};

 })(jQuery);	
})
