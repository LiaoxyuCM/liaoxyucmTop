<?php
$buttons = [
    ['text' => 'Base16',    'algo' => 'b16'],
    ['text' => 'URL',       'algo' => 'url'],
    ['text' => 'Data URL',  'algo' => 'dataurl'],
    ['text' => 'Unicode',   'algo' => 'unicode'],
    ['text' => 'SHA1',      'algo' => 'sha1'],
    ['text' => 'SHA256',    'algo' => 'sha256'],
    ['text' => 'SHA384',    'algo' => 'sha384'],
    ['text' => 'SHA512',    'algo' => 'sha512'],
    ['text' => 'JGE',       'algo' => 'jge'],
    ['text' => 'JIS2',      'algo' => 'jis2'],
    ['text' => '又双叒叕',  'algo' => 'you'],
    ['text' => '偏移（+1）','algo' => 'off'],
    ['text' => '反转',      'algo' => 'reverse'],
    ['text' => '洗牌',      'algo' => 'cardshuffle'],
    ['text' => '2维洗牌',   'algo' => 'card2dshuffle'],
];
?>

<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<link rel="stylesheet" href="http://assets.liaoxyucm.top/v2.css">
		<link rel="stylesheet" href="http://assets.liaoxyucm.top/toast/toast.css">
		<link rel="shortcut icon" href="https://assets.liaoxyucm.top/favicon.ico">
		<script src="encode.js"></script>
		<script src="http://assets.liaoxyucm.top/toast/toast.js"></script>
		<title>Encoder | LiaoxyuCM</title>
	</head>
	<body>
		<nav>
			<a href="https://liaoxyucm.top">LiaoxyuCM</a>
			<div class="pc">
				<a href="https://github.com/LiaoxyuCM" target="_blank">GitHub</a>
				<a href="https://liaoxyucm.top/friendlinks">友链</a>
			</div>
		</nav>
		<main>
			<noscript>
				<h3>本编码器几乎无法运作 因为你没打开JavaScript</h3>
			</noscript>
			<div class="buttongroup">
				<button class="method selected" data-algo="b64">Base64</button>
				<?php
					foreach ($buttons as $btn) {
						echo '<button class="method" data-algo="'.$btn["algo"].'">'.$btn["text"]."</button>";
					}
				?>
				<a href="rsa"><button>RSA（仅获取公私钥）</button></a>
			</div>
			<textarea placeholder="输入文本" class="input" name="input"></textarea>
			<div class="buttongroup">
				<button class="encode">编码</button>
				<button class="decode">解码</button>
				<button class="clear">清空</button>
				<button class="copy_rs">复制结果</button>
				<button class="switch">上下对调</button>
			</div>
			<textarea placeholder="结果将显示在这里" class="output" name="output" readonly></textarea>
			<a href="https://tools.liaoxyucm.top/explore_jge">探究 使用JGE编码文本 长度翻了几倍</a>
		</main>
        <footer>
            <p>&copy; LiaoxyuCM × FrontMeteor 2024-2026</p>
        </footer>
	</body>
</html>