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


			var map = null;

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
			}


			//食べログリクエスト用のURIを準備
			var api        = 'http://api.gnavi.co.jp/ver1/RestSearchAPI/?';
			var keyid      = '24a0a8aa568179b92ea04ef978d792ff';
			var range      = 2;
			var requestUri = api + 'keyid=' + keyid + '&latitude=' + latitude + '&longitude=' + longitude+ '&range=' + range;

			$.ajax({
				type:     'post',
				datatype: 'xml',
				url:      'ajax.php',
				data: {
					item:requestUri
				}
			}).then(function parse_xml(shop_data){
				//console.log(shop_data);
				$(shop_data).find('rest').each(disp);
			});


			function disp(){  
  
    			//各要素を変数に格納  
    			var $latitude  = $(this).find('latitude' ).text();  
    			var $longitude = $(this).find('longitude').text();  
    			var $url       = $(this).find('url'      ).text();  
    			var $name      = $(this).find('name'     ).text();  
     			var $tel       = $(this).find('tel'      ).text();  
     			//var new google.maps.LatLng($latitude, $longitude);



    			//HTMLを生成  
    			$('<tr>'+
        				'<td><a href="'+$url+'">'+$name+'</a></td>'+ 
        			'<th>緯度   </th>'+  
        				'<td>'+$latitude+ '</td>'+
        			'<th>経度   </th>'+ 
        				'<td>'+$longitude+'</td>'+ 
      		  		'<th>電話番号</th>'+
        				'<td>'+$tel+      '</td>'+
       		  		'<th>アクセス</th>'+
        				'<td><a href=# id></td>'+       				
      		  		'</tr>'


        		).appendTo('table.tbl tbody');  
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
			window.alert(message);
		}
    );
} else {
	alert("このブラウザでは位置情報が取得できません");
}

/*

$(function(){
	$("#btn").click(function(latlng)
		var marker = new google.maps.Marker({ position: latlng, map: map });

	)
})


*/


