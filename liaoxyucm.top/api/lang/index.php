<?php
if ($_SERVER['HTTP_HOST'] != "lang.llcm.top") {
  http_response_code(404);
  exit;
}
?>

<!DOCTYPE html>
<meta charset="utf-8" />
<p>该站点提供3个api接口</p>

<ul>
  <?php
    foreach ([
      ["bf.php", "https://tools.liaoxyucm.top/bfonline/api_doc.html"],
      ["ssdot.php", "https://tools.liaoxyucm.top/ssdotide/ivisitable/api_doc.html"],
      ["unwaste.php", "https://tools.liaoxyucm.top/unwasting/api_doc.html"],
    ] as $col) {
      echo '<li><a href="'.$col[0].'" target="_blank">'.$col[0].'</a>&nbsp;<a href="'.$col[1].'" target="_blank">文档</a></li>';
    }
  ?>
</ul>

<style>
  a {color: blue}
</style>