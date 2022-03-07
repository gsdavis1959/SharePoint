/* Sticky headers for list views and lists in quick edit mode
 * ---------------------------------------------
 * Created by Daniel Stoelzner
 * stoelzner.daniel@gmail.com
 * http://spoodoo.com
 * Copyright (c) 2015 Daniel Stoelzner (Licensed under the MIT X11 License)
 * v2.9BETA for SharePoint 2013
 * LastMod: 29th of May, 2015
 * ---------------------------------------------
 * Include reference to:
 *  jquery - http://jquery.com
 * ---------------------------------------------
 * Add a reference to this file in a CEWP or Script Editor Web Part or reference the file in your masterpage
 */

_spBodyOnLoadFunctionNames.push("stickyHeaders");

function stickyHeaders() {//-----------------------------------------------------------------------------------------------------------------------------------------------	
	//Class
	function List () {
		this.list               = "";
		this.webpart            = "";
		this.sticky             = "";
		this.header             = "";
		this.dphm               = "";
		this.s4                 = "";
		this.contentBox			= "";
		this.top_old            = 0;
		this.top_new            = 0;
		this.bottom_old         = 0;
		this.bottom_new         = 0;
		this.wpBottomBorder_old = 0;
		this.wpBottomBorder_new = 0;
		this.wpTopBorder_old    = 0;
		this.wpTopBorder_new    = 0;
		this.wpScrollPos_old    = 0;
		this.wpScrollPos_new    = 0;
		this.prevHeight         = 0;
		this.permsWithAnon      = 0;
		this.fixedHeight        = 0;
		this.fixedWidth         = 0;
		this.widthChange        = true;
		this.setWidth = function() {
			if(this.widthChange){
				if(this.fixedWidth) {
					//TODO
					//$(this.sticky).css("overflow-x","hidden")
					//$(this.sticky).width($(this.sticky).closest("[id^=WebPartWPQ][style*=width]").width() - 18).children().each(function (j) {
					//	$(this.header).css("min-width",$(this.header).children('*:nth-child(' + (j+1) + ')').width())
					//});
				} else {
					this.sticky.width(this.header.width());
					for(var k=0, childrenLength = this.sticky.children().length; k<childrenLength; k++){
						this.sticky.children().eq(k).width( this.header.children().eq(k).width() ).css("max-width","");
					}
				}
				this.widthChange = false;
			}
		};
		this.setLeftOffset = function() {
			var parent = this.webpart.length != 0 ? this.webpart : this.dphm;
			this.sticky.css("left",(parent.offset().left + parseInt(parent.css("padding-left")) - 2) + "px");
		};
		this.setTopPosition = function() {
			if( !this.fixedHeight ){
				this.sticky.css("top", (this.s4.offset().top + 2));
			} else {
				this.sticky.css("top",this.webpart.offset().top + "px")
				if(this.sticky.attr('data-hidden', false) && this.sticky.offset().top < (this.s4.offset().top + 2)){
					this.sticky.css("top", (this.s4.offset().top + 2));
				}
			}
		};
		this.update = function(eventType) {
			if(this.sticky.attr('data-hidden', false)){
				this.setLeftOffset();
				this.setTopPosition();
			}
			if(eventType == "scrollList"){
				this.wpScrollPos_old = this.wpScrollPos_new
				this.wpScrollPos_new = this.webpart.scrollTop()

				if(this.wpScrollPos_old <= this.prevHeight && this.wpScrollPos_new >= this.prevHeight ){				
					this.contentBox = this.list.find(".ms-core-menu-box")					
					this.contentBox.appendTo(this.sticky.find("th").eq(this.contentBox.closest("th").index()))
					this.setWidth()
					this.sticky.fadeIn().addClass("typeA");
					
				} else if(this.wpScrollPos_old >= this.prevHeight && this.wpScrollPos_new <= this.prevHeight ) {
					if(!this.sticky.hasClass("typeB")){
						this.sticky.fadeOut().removeClass("typeA");
					} else {
						this.contentBox = this.sticky.find(".ms-core-menu-box")					
						this.contentBox.appendTo(this.header.find("th").eq(this.contentBox.closest("th").index())).css({"top":"auto","left":"auto"})
						this.sticky.removeClass("typeA")
					}
				}
			} else {
				this.top_old = this.top_new;
				this.top_new = this.header.offset().top - this.s4.offset().top;
				
				this.bottom_old = this.bottom_new;
				this.bottom_new = this.top_new - 30 + this.list.height();

				if(this.fixedHeight) {
					this.wpTopBorder_old = this.wpTopBorder_new;
					this.wpTopBorder_new = this.webpart.parent().offset().top - this.s4.offset().top;
					this.wpBottomBorder_old = this.wpBottomBorder_new
					this.wpBottomBorder_new = this.webpart.parent().offset().top + parseInt(this.webpart.css("height")) - this.s4.offset().top
				} 
				
				//fix for the permission this.when anonymous access is activated			
				this.bottom_new = this.permsWithAnon ? this.top_new - 30 + this.dphm.height() : this.bottom_new

				this.bottom_old         = !this.bottom_old         ? this.bottom_new         : this.bottom_old;
				this.top_old            = !this.top_old            ? this.top_new            : this.top_old;
				this.wpBottomBorder_old = !this.wpBottomBorder_old ? this.wpBottomBorder_new : this.wpBottomBorder_old;
				this.wpTopBorder_old    = !this.wpTopBorder_old    ? this.wpTopBorder_new    : this.wpTopBorder_old;
								
				if (this.top_old >= 0 && this.top_new <= 0 || this.bottom_old <= 0 && this.bottom_new >= 0 || this.fixedHeight && ( this.wpBottomBorder_old <= 0 && this.wpBottomBorder_new >= 0 || this.wpTopBorder_old >= 0 && this.wpTopBorder_new <= 0 ) || ( this.top_old == this.top_new && this.bottom_old == this.bottom_new && this.top_old < 0 && this.bottom_old > 0 )) {
					this.contentBox = this.list.find(".ms-core-menu-box")
					if(this.contentBox){
						this.contentBox.appendTo(this.sticky.find("th").eq(this.contentBox.closest("th").index()))
					}
					this.setWidth()
					this.sticky.fadeIn().addClass("typeB")
					
				} else if (this.top_old <= 0 && this.top_new >= 0 || this.bottom_old >= 0 && this.bottom_new <= 0 || this.fixedHeight && ( this.wpBottomBorder_old >= 0 && this.wpBottomBorder_new <= 0 || this.wpTopBorder_old <= 0 && this.wpTopBorder_new >= 0 )){
					this.contentBox = this.sticky.find(".ms-core-menu-box")					
					this.contentBox.appendTo(this.header.find("th").eq(this.contentBox.closest("th").index())).css({"top":"auto","left":"auto"})
					if(!this.sticky.hasClass("typeA")){
						this.sticky.fadeOut().removeClass("typeB");
					} 
					if(this.sticky.hasClass("typeA")){
						if(this.wpBottomBorder_new <= 0){
							this.sticky.removeClass("typeB").fadeOut();
						} else {
							this.sticky.removeClass("typeB")
						}
					}
				}
			}
		}
	}

	(function (){
		var wpq = $("#DeltaPlaceHolderMain [id^=MSOZoneCell_WebPartWPQ]:visible");
		if (wpq.length === 1) {
			function ShowContextRibbonSections() {
				SP.Ribbon.WebPartComponent.registerWithPageManager({editable: true, isEditMode: false, allowWebPartAdder: false});
				var wpcomp = SP.Ribbon.WebPartComponent.get_instance();
				if (wpcomp) {
					wpcomp.selectWebPart(document.getElementById(wpq.attr('id')), true);
				}
			}

			ExecuteOrDelayUntilScriptLoaded(ShowContextRibbonSections, "sp.ribbon.js");
			var DeselectAllWPItems_old = DeselectAllWPItems;
			DeselectAllWPItems = function () {
				DeselectAllWPItems_old();
				setTimeout(function () { ShowContextRibbonSections(); }, 25);
			};
		}
		
		var RibbonContainer = $("#RibbonContainer")
		var ribbonHeight	= RibbonContainer.height();
		g_workspaceResizedHandlers.push(function () {
			setTimeout(function () {
				var newRibbonHeight = RibbonContainer.height();
				if (ribbonHeight !== newRibbonHeight) {
					findListsOnPage(false);
					ribbonHeight = newRibbonHeight;
				}
			}, 500);
		});

		if (jQuery.inArray("spgantt.js", g_spPreFetchKeys) > -1) {
			SP.SOD.executeOrDelayUntilScriptLoaded(function () {
				setTimeout(function () { findListsOnPage(false); }, 500);
			}, "spgantt.js");
		} else {
			findListsOnPage(false);
		}

		$(window).bind('hashchange.stickyHeaders', function () {
			findListsOnPage(true);
		});
	})()
	
	function findListsOnPage(hashchange) {
		window['listContainer'] = {"lists":[]}
		
		var quickEdit = false;

		$("tr:has(>th[class^='ms-vh']):not(.sticky):visible, .ms-listviewgrid").closest("table").each(function(){
			if($(this).find("tbody > tr").length > 1){
				listContainer.lists.push(new List());
				listContainer.lists[listContainer.lists.length - 1].list = $(this);
				if($(this).hasClass('.ms-listviewgrid')){
					quickEdit = true;
				}
			}
		})

		if (quickEdit) {
			SP.GanttControl.WaitForGanttCreation(function () {
				setTimeout(function () {
					initializeStickyHeaders(listContainer,hashchange);
				}, 1000);
				return;
			});
		} else {
			setTimeout(function(){initializeStickyHeaders(listContainer,hashchange);},0)
			
		}
	}

	function initializeStickyHeaders(container,hashchange) {
		$(window).unbind('resize.stickyHeaders');
		$(window).bind ('resize.stickyHeaders', function () { $(container.lists).each(function(){this.update("resize")}) });
		
		$('#s4-workspace').unbind('scroll.stickyHeaders');
		$('#s4-workspace').bind('scroll.stickyHeaders', function () { $(container.lists).each(function(){this.update("scroll")}) });
	
		$(container.lists).each(function(){
			this.webpart        = this.list.closest("[id^=WebPartWPQ]")
			this.header         = this.list.find("tr:has(>th):not(.sticky):visible")
			this.dphm           = this.list.closest("#DeltaPlaceHolderMain");
			this.s4             = $("#s4-workspace")
			this.permsWithAnon  = this.list.closest("div[id$='rptrAnony__div']").length;
			this.fixedHeight    = this.list.closest("[id^=WebPartWPQ][style*=height]").length;
			this.fixedWidth     = this.list.closest("[id^=WebPartWPQ][style*=width]").length;
			
			var prevElem = this.header.closest("table").prevAll()
			for(var i=0, prevElemLength = prevElem.length;i<prevElemLength;i++){
				this.prevHeight = this.prevHeight + $(prevElem[i]).outerHeight()
			}

			if(this.fixedHeight || this.fixedWidth){
				this.webpart.bind("scroll",{elem:this}, function(event){
					event.data.elem.update("scrollList")
				})
			}

			if (!this.webpart.find(".sticky").length) {
				this.list.before('<div class="sticky-anchor"><span></span></div>');
				this.sticky = this.header.clone(true, true).addClass("sticky").attr('style', "position: fixed; border: 1px solid grey; background-color: white; box-shadow: 0 0 6px -2px black; display: none;").insertAfter(this.list);
				this.sticky.find("#users_imn_header").attr("src", "/_layouts/15/images/imnhdr.gif")
				this.sticky.find(".ms-selectall-span img").on("click",{header:this.header},function (event) {
					var span = event.data.header.find(".ms-selectall-span")						
					span[0].checked = span[0].checked ? false : true;
					ToggleAllItems2(span[0], span.attr("id").substr(17), span[0].checked)
				});
			} else {
				if(hashchange){
					this.sticky = this.list.closest("div").find(".sticky");
					/*
					var childrenLength = $(this.header).children().length
					for(k=0; k<childrenLength; k++){
						if(!this.header.children().eq(k).find(".ms-filter-iconouter").attr('data-hidden')){
							this.header.children().eq(k).find(".ms-filter-iconouter").css("display","inline-block")
						} else {
							this.header.children().eq(k).find(".ms-filter-iconouter").css("display","none")
						}					
						if(!this.header.children().eq(k).find(".ms-sortarrowdown-iconouter").attr('data-hidden')){
							this.header.children().eq(k).find(".ms-sortarrowdown-iconouter").css("display","inline-block")
						} else {
							this.header.children().eq(k).find(".ms-sortarrowdown-iconouter").css("display","none")
						}
					}
					*/
				} else {
					this.sticky = this.list.closest("div").find(".sticky");
				}
			}
			
			//update stickies when grouped views are expanded or collapsed
			this.list.children("tbody[id^='titl']").find(".ms-gb a").bind('click.stickyHeaders',{elem:this},function (event) {
				var elem = event.data.elem
				elem.widthChange = true
				interval = setInterval(function(){
					if($("#tbod" + $(event.target).closest("tbody").attr("id").substr(4) + "_").attr("isloaded") == "true"){
						elem.update("expandCollapse");
						clearInterval(interval);
					}  
				},1)
			});
		});
		$(container.lists).each(function(){this.update("standard")})
	}	
	
	(function () {
		$("<div/>", {html: '&shy;<style>.sticky .ms-core-menu-box {top: auto !important; left: auto !important;}</style>'}).appendTo("body");
	})();
}