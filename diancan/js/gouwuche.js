
		mui.init();			
		mui.plusReady(function(){
			var self = plus.webview.currentWebview();
			var shopId = self.shopId;
			getProductList(shopId);
		});
		function getProductList(shopId) { //获取商品列表
			mui.ajax({
				url:"JSON/gouwuche.json",
				type: "get",
				async: true,
				data: {
					shopId: shopId
				},
				dataType: "json",
				timeout: 1000,
				success: function(data) {
					var result = data.result;
					var productList = document.getElementById("goodsList");
					var content = "";
					for (var i = 0, len = result.length; i < len; i++) {
						// 将单个商品对象序列化后，存在data-detail属性中，后面传参用
						var productDetail = JSON.stringify(result[i]);
						// 第一行采用双引号包裹，是因为对象序列化以后，里面采用的是""，如果data-detail属性外面依旧用""，转义会出问题
						content += "<li class='mui-table-view-cell mui-media good-content'>" +
							'<div class="mui-input-row mui-checkbox mui-left" >' +
							'<input name="checkbox" value="Item 1" type="checkbox"  onclick="checkChange(this);" class="select_yuanquan check" checked id="checkbox'+i+'">' +
							'<img class="gouwuche_content_img" src="' + result[i].productImage + '">' +
							'<div class="gouwuche_content_body"><p><span class="gouwuche_content_name">' + result[i].productName + '</span><p>' +
							'<p><span class = "gouwuche_content_detail"> ' + result[i].productDetail + '</p></span> ' +
							'<p class = "gouwuche_content_detail">￥<span>' + result[i].productPrice + '</p></span></div>' +
							
							'<div class="mui-numbox gouwuche_jiajian" data-numbox-min="0" style="margin-top: -30px;" >' +
							'<button class="mui-btn mui-btn-numbox-minus" type="button" id="minusBtn'+ i +'">-</button>' +
							/* 这里有一个data-value这个属性，作为一个中间量来判定商品的增减，初始化为0
							 * data-price自定义属性，用来隐式得存储商品价格
							 */
							'<input class="mui-input-numbox" value="1" readonly="readonly" type="number" onchange="checkGoods();" data-price="' + result[i].productPrice + '" data-value="0" id="goodPrice'+i+'">' +
							'<button class="mui-btn mui-btn-numbox-plus" type="button" id="plusBtn'+ i +'">+</button>' +
							'</div></div></li>';
					}
					productList.innerHTML = content;
					// 由于我们的numbox控件是动态拼接，所以拼接后要激活控件
					mui(".mui-numbox").numbox();
					// 我们通过设置中间量来实现计算总价
					checkGoods();
				},
			});
		}
	
		
		/**
		 * 操作全选按钮
		 * @param {Object} obj
		 */
		function switchAll(obj){
			var allGoodsLi = document.getElementsByClassName("good-content");
			if(obj.checked){
				mui.each(allGoodsLi,function(index,item){
					document.getElementById("checkbox"+index).checked = true;
					document.getElementById("minusBtn"+index).removeAttribute("disabled");
					document.getElementById("plusBtn"+index).removeAttribute("disabled");						
				});
			}else{
				mui.each(allGoodsLi,function(index,item){
					document.getElementById("minusBtn"+index).setAttribute("disabled",true);
					document.getElementById("plusBtn"+index).setAttribute("disabled",true);					
					document.getElementById("checkbox"+index).checked = false;
				});
			}		
			checkGoods();
		}
	
		/**
		 * 操作当前checkbox节点，
		 * 控制当前节点对应的numbox的可用/禁用,计算总价
		 * @param {Object} obj
		 */
		function checkChange(obj){
			//动态生成checkbox的时候赋值给它的id 为 checkbox+index,
			//通过index可以获取当前checkbox对应的input框和加减的btn
			//所以通过截取字符串的方式获取index
			var index = obj.id.slice(8,9);
			if(obj.checked){
				document.getElementById("minusBtn"+index).removeAttribute("disabled");
				document.getElementById("plusBtn"+index).removeAttribute("disabled");		
			}else{
				document.getElementById("plusBtn"+index).setAttribute("disabled",true);
				document.getElementById("minusBtn"+index).setAttribute("disabled",true);				
			}
			checkGoods();
		}
		
		/**
		 * 根据所有checkbox的状态计算总价格
		 */
		function checkGoods() {	
			var selectAllFlag = false;
			var allGoodsLi = document.getElementsByClassName("good-content");
			var totalPrice = 0;
			mui.each(allGoodsLi,function(index,item){
				var checkBoxItem = document.getElementById("checkbox"+index);
				var minusBtnItem = document.getElementById("minusBtn"+index);
				var plusBtnItem = document.getElementById("plusBtn"+index);
				var goodPriceItem = document.getElementById("goodPrice"+index);
				
				//打点测试li获取的商品价格，获取一个看下就可以
				if(index==0){
					console.log(goodPriceItem.value);
					console.log(goodPriceItem.getAttribute("data-price"));				
					console.log(goodPriceItem.value * goodPriceItem.getAttribute("data-price"));				
				}
				if(checkBoxItem.checked){
					selectAllFlag = true;
					totalPrice += (goodPriceItem.value * goodPriceItem.getAttribute("data-price"))
				}else{
					selectAllFlag = false;
					minusBtnItem.setAttribute("disabled",true);
					plusBtnItem.setAttribute("disabled",true);
				}
			});
			console.log("totalPrice"+totalPrice);
			totalPrice>0?totalPrice=totalPrice.toFixed(1):totalPrice = 0.0; 
			document.getElementById("totalPrice1").innerHTML = totalPrice;
			if(selectAllFlag){
				document.getElementById("checkAll").checked = true;
			}else{
				document.getElementById("checkAll").checked = false;
			}
		}


