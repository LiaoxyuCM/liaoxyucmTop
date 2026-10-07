<?php
$buttons = [
    ['Base16',    'b16'],
    ['URL',       'url'],
    ['Data URL',  'dataurl'],
    ['Unicode',   'unicode'],
    ['SHA1',      'sha1'],
    ['SHA256',    'sha256'],
    ['SHA384',    'sha384'],
    ['SHA512',    'sha512'],
    ['JGE',       'jge'],
    ['JIS2',      'jis2'],
    ['又双叒叕',  'you'],
    ['偏移 (+1)', 'off'],
    ['反转',      'reverse'],
    ['洗牌',      'cardshuffle'],
    ['2维洗牌',   'card2dshuffle'],
];
?>

<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<link rel="stylesheet" href="http://assets.liaoxyucm.top/v2.css">
		<link rel="stylesheet" href="http://assets.liaoxyucm.top/toast/toast.css">
		<script src="http://assets.liaoxyucm.top/toast/toast.js"></script>
		<link rel="stylesheet" href="/index.css">
		<link rel="shortcut icon" href="https://assets.liaoxyucm.top/favicon.ico">
		<script src="encode.js"></script>
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
			<div class="buttongroup btngroup-0">
				<button class="method selected" data-algo="b64">Base64</button>
				<?php
					foreach ($buttons as $btn) {
						echo '<button class="method" data-algo="'.$btn[1].'">'.$btn[0]."</button>";
					}
				?>
				<a href="rsa"><button>RSA</button></a>
			</div>
			<textarea placeholder="输入文本" class="input" name="input"></textarea>
			<div class="buttongroup btngroup-1">
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