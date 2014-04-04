/*
 * jQuery PlusAnchor 1.0.7.3
 * By Jamy Golden
 * http://css-plus.com
 *
 * Copyright 2011, Jamy Golden
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */
!function(o){o.plusAnchor=function(n,t){var i=this;i.el=n,i.$el=o(n),i.$el.data("plusAnchor",i),i.scrollEl="body, html",i.initHash=window.location.hash,i.offsetTop=function(){return o("html").offset().top},i.init=function(){i.options=o.extend({},o.plusAnchor.defaults,t),i.options.onInit&&"function"==typeof i.options.onInit&&i.options.onInit(i),i.$el.find('a[href^="#"]').click(function(n){n.preventDefault();var t=o(this),e=t.attr("href"),s=o('a[name="'+o(this).attr("href").substring(1)+'"]');o(e).length?(i.options.onSlide&&"function"==typeof i.options.onSlide&&i.options.onSlide(i),o(i.scrollEl).animate({scrollTop:o(e).offset().top+i.options.offsetTop},i.options.speed,i.options.easing)):s.length&&(i.options.onSlide&&"function"==typeof i.options.onSlide&&i.options.onSlide(i),o(i.scrollEl).animate({scrollTop:s.offset().top},i.options.speed,i.options.easing))})},i.init()},o.plusAnchor.defaults={easing:"swing",offsetTop:0,speed:1e3,onInit:null,onSlide:null},o.fn.plusAnchor=function(n){return this.each(function(){new o.plusAnchor(this,n)})}}(jQuery);