if (navigator.geolocation) {

		// 現在の位置情報を取得
	navigator.geolocation.getCurrentPosition(

		//位置情報の取得に成功した場合
		function (pos) {
			console.log("緯度：" + pos.coords.latitude);
			console.log("経度：" + pos.coords.longitude);
			var latitude = pos.coords.latitude;
			var longitude = pos.coords.longitude;

			$(".show_lat_long").append("緯度：" + latitude  + "<br>");
			$(".show_lat_long").append("経度：" + longitude + "<br>");


			var map        = null;//地図オブジェクト	

			var infoWindow = null;//吹き出しオブジェクト	

			$(function(){
				//現在地点の緯度経度を元に LatLngオブジェクトを作成する
				var latlng = new google.maps.LatLng(latitude, longitude);
				//console.log(latlng);
				createMap(latlng);
			});


			function createMap(latlng) {
				//地図のオプション
				var mapOption = {
					zoom: 16, //ズームレベル
					center: latlng, //指定した場所を地図のセンターにする
					mapTypeId: google.maps.MapTypeId.ROADMAP //地図のタイプ
				};

				//console.log(latlng);　OK
				//Mapオブジェクトを作成
				map = new google.maps.Map($("#map_canvas").get(0), mapOption);
				
				//console.log(map); OK
				//マーカーを作成して現在位置に置く
				var marker = new google.maps.Marker({ position: latlng, map: map });
				//console.log(marker); OK

				//吹き出しを予め作成
				infoWindow = new google.maps.InfoWindow();


			}


			//食べログリクエスト用のURIのオプションを準備
			//半径500m以内の店舗を指定
			var range      = 2;

			//世界測地系
			var coordinates_mode = 2;

			var sort = 1;

			//
			var uriOption  = '&latitude=' + latitude + '&longitude=' + longitude + '&range=' + range + '&coordinates_mode=' + coordinates_mode ;

			//console.log(uriOption);

			//each()実行毎に店舗緯度経度を格納
			var markersInfo = [];

			//each()実行回数カウント、店舗情報配列呼び出し用
			var roopCount = 0;

			$.ajax({
				type:     'post',
				datatype: 'xml',
				url:      'ajax.php',
				data:     {item:uriOption}
			}).then(function parse_xml(shop_data){
				console.log(shop_data);
				$(shop_data).find('rest').each(disp);

			});


			function disp(){  
  
    			//各要素を変数に格納  
    			var $latitude  = $(this).find('latitude' ).text();  
    			var $longitude = $(this).find('longitude').text();  
    			var $url       = $(this).find('url'      ).text();  
    			var $name      = $(this).find('name'     ).text();
     			var $tel       = $(this).find('tel'      ).text();
     			var $category  = $(this).find('category' ).text();

     			//each()実行毎にマーカー作成に用いる配列に緯度・経度を保存
     			markersInfo.push($latitude, $longitude, $name);

     			//console.log(roopCount);　OK


    			//HTMLを生成  
    			$('<ul data-role="listview">'+
    			    '<li class="ui-btn ui-btn-icon-left ui-icon-home" data-role="list-divider" data-theme="c">'+$name+ '：' + $category + '</li>'+
        		    '<li><a class="ui-btn ui-btn-icon-left ui-icon-info" href="'+$url+'" target="_blank" >詳細情報（ぐるナビへ）</a></li>'+
        		    '<li><a class="ui-btn ui-btn-icon-left ui-icon-phone" href="tel:'+$tel+'">'+$tel+'</a></li>'+
        		    '<button data-inline="true" class="ui-btn ui-btn-icon-left ui-icon-location" type="button" id="btn" value="'+ roopCount +'">地図に表示</button><br>'+
     				'<div align="center">(○´･д･)ﾉ-----------ｷﾘﾄﾘ線-----------ヽ(･д･`●)</div>'+
        		  '</ul>'
        		).appendTo('div.list'); 

     			roopCount++;

				$(function(){
					$("button").click(makeInfo);

					function makeInfo(){
						var num = $(this).val();
						//console.log(num);
						//console.log(roopCount);

						var lat = markersInfo[num * 3    ];
  						//console.log(lat);
						var lng = markersInfo[num * 3 + 1];
						//console.log(lng);

						var latlng = new google.maps.LatLng(lat, lng);
						//console.log(latlng);

						//マーカーオブジェクトを作成		
						var markerOption = {
							position : latlng,           // 飲み屋の緯度経度
							map      : map,              // 表示するマップ
							icon     : "images/icon.jpg" // カスタムアイコンの設定
						};


						var marker = new google.maps.Marker(markerOption);

						//店舗名の取得
						var info = markersInfo[num * 3 + 2];
			

						infoWindow.setContent(info);
						infoWindow.open(map, marker);


						google.maps.event.addListener(marker, "click", function(){
							// 表示内容に店名を設定して、吹き出しを開く
							var info = markersInfo[num * 3 + 2];
							infoWindow.setContent(info);
							infoWindow.open(map, marker);
						});


					}
				});
			}  
		},
    //位置情報の取得に失敗した場合
		function (error) {
			var message = "";

			switch (error.code) {

				// 位置情報が取得できない場合
				case error.POSITION_UNAVAILABLE:
					message = "位置情報の取得ができませんでした。";
					break;

				// Geolocationの使用が許可されない場合
				case error.PERMISSION_DENIED:
					message = "位置情報取得の使用許可がされませんでした。";
					break;

				// タイムアウトした場合
				case error.PERMISSION_DENIED_TIMEOUT:
					message = "位置情報取得中にタイムアウトしました。";
					break;
			}
			alert(message);
		}
    );
} else {
	alert("このブラウザでは位置情報が取得できません");
}

