<?php

$option = $_POST['item'];

$url = 'http://api.gnavi.co.jp/ver1/RestSearchAPI/?keyid=24a0a8aa568179b92ea04ef978d792ff' . $option;


$curl=curl_init($url);
curl_setopt($curl,CURLOPT_SSL_VERIFYPEER, FALSE);  // オレオレ証明書対策
curl_setopt($curl,CURLOPT_SSL_VERIFYHOST, FALSE);  // 
curl_setopt($curl,CURLOPT_RETURNTRANSFER, TRUE);
curl_setopt($curl,CURLOPT_COOKIEJAR,      'cookie');
curl_setopt($curl,CURLOPT_COOKIEFILE,     'tmp');
curl_setopt($curl,CURLOPT_FOLLOWLOCATION, TRUE); // Locationヘッダを追跡
echo curl_exec($curl);
