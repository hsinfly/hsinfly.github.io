;(function ($) {
	"use strict";
	const scrollCorrection = 70; // (header height = 50px) + (gap = 20px)
	//滑动到给定节点
	function scrolltoElement(elem, correction) {
		correction = correction || scrollCorrection;
		const $elem = elem.href ? $(elem.getAttribute('href')) : $(elem);
		$('html, body').animate({ 'scrollTop': $elem.offset().top - correction }, 400);
	}
	//初始化顶部菜单
	function initHeaderMenu() {
		var $headerMenu = $('header .menu');
		var $underline = $headerMenu.find('.underline');
		//设置菜单下划线
		function setUnderline($item, transition) {
			$item = $item || $headerMenu.find('li a.active');//得到当前菜单
			transition = transition === undefined ? true : !!transition;
			if (!transition) $underline.addClass('disable-trans');
			if ($item && $item.length) {
				$item.addClass('active').siblings().removeClass('active');
				$underline.css({
					left: $item.position().left,
					width: $item.innerWidth()
				});
			} else {
				$underline.css({
					left: 0,
					width: 0
				});
			}
			if (!transition) {
				setTimeout(function () { $underline.removeClass('disable-trans') }, 0);//get into the queue.
			}
		}
		$headerMenu.on('mouseenter', 'li', function (e) {
			setUnderline($(e.currentTarget));
		});
		$headerMenu.on('mouseout', function () {
			setUnderline();
		});
		//设置当前激活的菜单
		var $active_link = null;
		var url_path = location.pathname;//链接地址 
		if (url_path == '' || url_path == '/'){//首页
	        $active_link = $('.nav-home', $headerMenu);
		} else {
			//其他菜单根据地址，判断激活菜单项
           $('.h-list a', $headerMenu).each(function(index,element){
			var $a_href = $(element).attr('href');
			if ($a_href != '/' && url_path.startsWith($a_href)) {
				$active_link = $(element);
				return false;
			}
		   });
		}
		setUnderline($active_link, false);
	}
	//初始化移动端顶部菜单
	function initHeaderMenuPhone() {
		var $switcher = $('.blog-header .switcher .s-menu');
		$switcher.click(function (e) {
			e.stopPropagation();
			$('body').toggleClass('z_menu-open');
			$switcher.toggleClass('active');
		});
		$(document).click(function (e) {
			$('body').removeClass('z_menu-open');
			$switcher.removeClass('active');
		});
	}
	//初始化顶部搜索功能
	function initHeaderSearch() {
		var $switcher = $('.blog-header .switcher .s-search');
		var $header = $('.blog-header');
		var $search = $('.blog-header .m_search');
		if ($switcher.length === 0) return;
		$switcher.click(function (e) {
			e.stopPropagation();
			$header.toggleClass('z_search-open');
			$search.find('input').focus();
		});
		$(document).click(function (e) {
			$header.removeClass('z_search-open');
		});
		$search.click(function (e) {
			e.stopPropagation();
		})
	}
	//设置点击效果
	function initWaves() {
		Waves.attach('.flat-btn', ['waves-button']);
		Waves.attach('.float-btn', ['waves-button', 'waves-float']);
		Waves.attach('.float-btn-light', ['waves-button', 'waves-float', 'waves-light']);
		Waves.attach('.flat-box', ['waves-block']);
		Waves.attach('.float-box', ['waves-block', 'waves-float']);
		Waves.attach('.waves-image');
		Waves.init();
	}
	//设置小工具
	function initTocToggle() {
		const $toc = $('.toc-wrapper');
		const $top = $('.go .top');//滑到顶部
		const $bookmark = $('.go .bookmark');//折叠书签
		const $bottom = $('.go .bottom');//滑到底部

		$top.click(()=>scrolltoElement(document.body));
		$bottom.click(()=>scrolltoElement($('footer')));
		$bookmark.click((e)=>{e.preventDefault();e.stopPropagation();$toc.toggleClass('active');});

		if ($toc.length === 0) return;
		$toc.click((e) => { e.stopPropagation(); $toc.addClass('active'); });
		$(document).click(() => $toc.removeClass('active'));

		$toc.on('click', 'a', (e) => {
			e.preventDefault();
			e.stopPropagation();
			scrolltoElement(e.target.tagName.toLowerCase === 'a' ? e.target : e.target.parentElement);
		});

		const liElements = Array.from($toc.find('li a'));
		//function animate above will convert float to int.
		const getAnchor = () => liElements.map(elem => Math.floor($(elem.getAttribute('href')).offset().top - scrollCorrection));

		let anchor = getAnchor();
		const scrollListener = () => {
			const scrollTop = $('html').scrollTop() || $('body').scrollTop();
			if (!anchor) return;
			//binary search.
			let l = 0, r = anchor.length - 1, mid;
			while (l < r) {
				mid = (l + r + 1) >> 1;
				if (anchor[mid] === scrollTop) l = r = mid;
				else if (anchor[mid] < scrollTop) l = mid;
				else r = mid - 1;
			}
			$(liElements).removeClass('active').eq(l).addClass('active');
		}
		$(window)
			.resize(() => {
				anchor = getAnchor();
				scrollListener();
			})
			.scroll(() => {
				scrollListener()
			});
		scrollListener();
	}

	$(function () {
		initHeaderMenu();
		initHeaderMenuPhone();
		initHeaderSearch();
		initWaves();
		initTocToggle();
		$(".article .video-container").fitVids();//视频自适应处理
	});
})(jQuery);