<!DOCTYPE html>
<html lang="zh-cn">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Starter-v3lite-intro | LiaoxyuCM</title>
	<link rel="shortcut icon" href="https://assets.liaoxyucm.top/favicon.ico">
</head>
<body>
	<p>欢迎来到starter-lite!</p>
	<style>
		table {
			border-collapse: collapse;
		}
		thead tr {
			border-bottom: 2px solid #000;
		}
		tbody tr:not(:last-child) {
			border-bottom: 1px solid #777;
		}

		thead tr th, tbody tr td {
			padding: 5px;
		}
		body { background-color: #ededed }
		a { color: #00f }
		@media (prefers-color-scheme: dark) {
			p, table { color: #fff }
			a { color: #0ff }
			body { background-color: #121212 }
			thead tr {
				border-bottom: 2px solid #fff;
			}
			tbody tr:not(:last-child) {
				border-bottom: 1px solid #888;
			}
		}
	</style>
	<table>
		<thead>
			<tr>
				<th>档次</th>
				<th>相较于上一档, 被砍去的功能</th>
			</tr>
		</thead>
		<tbody>
			<?php
				$idx = 0;
				foreach(['"/"命令', "Hitokoto", "JQuery框架支持", "当前时间", "基本样式"] as $content) {
					$idx++;
					echo '<tr><td><a href="/lite/lite-l'.$idx.'.html">Lv'.$idx.'</a></td><td>'.$content.'</td></tr>';
				}
			?>
		</tbody>
	</table>
</body>
</html>