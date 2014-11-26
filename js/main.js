if (navigator.geolocation) {

		// 現在の位置情報を取得
	navigator.geolocation.getCurrentPosition(

		//位置情報の取得に成功した場合
		function (pos) {
			console.log("緯度：" + pos.coords.latitude);
			console.log("経度：" + pos.coords.longitude);
			var latitude = pos.coords.latitude;
			var longitude = pos.coords.longitude;

			$(".show_result").append("緯度：" + latitude + "<br>");
			$(".show_result").append("経度：" + longitude);

			//リクエスト用のURIを準備
			var api = 'http://api.gnavi.co.jp/ver1/RestSearchAPI/?';
			var keyid = '24a0a8aa568179b92ea04ef978d792ff';
/*
			var range = 2;
			var requestUri = api + 'keyid=' + keyid + '&latitude=' + latitude + '&longitude=' + longitude+ '&range=' + range;
*/

			var requestUri = api + 'keyid=' + keyid + '&area=AREA110';

			$.ajax({
				type: 'post',
				datatype: 'json',
				url: 'ajax.php',
				data: {
					item:requestUri
				}
			}).then(function(data){console.log(data)});

/*
			$.ajax({url: requestUri})
			.then(function(data){console.log(data)});
*/





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
	window.alert("このブラウザでは位置情報が取得できません");
}


