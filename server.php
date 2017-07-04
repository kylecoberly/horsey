<?php
	error_reporting(E_ALL);
	ini_set('display_errors', 1);
	require_once("HTTP/Request2.php");

	$login_url = "http://www.allbreedpedigree.com/index.php?username=rfgandy&password=dante14&do=Log+In";
	$HTTPRequest  = new HTTP_Request2($login_url);
	$RequestUrl = $HTTPRequest->getUrl();
	$HTTPRequest->setMethod(HTTP_Request2::METHOD_POST);
	$HTTPRequest->setCookieJar(TRUE);
	$Response = $HTTPRequest->send();

	$base_search_url ="http://www.allbreedpedigree.com/index.php?query_type=linebreeding&search_bar=linebreeding&hypo_sire=&hypo_dam=&what=done&sort=inf&border=0&g=9&crosses=2&inf=0&all=All+Horses&sort=inf&t=&pedloggedin=1&h=";
	$horses = json_decode(file_get_contents('php://input'), TRUE);
	$horses = $horses["horses"];
	$horse_html = array();
	$HTTPRequest->setMethod(HTTP_Request2::METHOD_GET);

	foreach($horses as $horse){
		$horse_url = $base_search_url . $horse;

		$HTTPRequest->setUrl($horse_url);
		$RequestUrl = $HTTPRequest->getUrl();
		$Response = $HTTPRequest->send();

		$horse_html[$horse] = addslashes(utf8_encode($Response->getBody()));
	}

	$encoded_horses = json_encode($horse_html);
	echo($encoded_horses);
?>