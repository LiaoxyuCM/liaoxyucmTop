<?php
header('Content-Type: text/plain');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

$userInput = $_GET['src'] ?? '';
$uniqueResult = $_GET['unique_result'] ?? '';

$chars = [];
$cells = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
$cells_used = [true, false, false, false, false, false, false, false, false, false];
$result = "";
if ($uniqueResult == "true") {
  $result .= "0#";
}

$charArray = mb_str_split($userInput);
foreach ($charArray as $chr) {
  $chars[] = mb_ord($chr, 'UTF-8');
}

$lastMostCloseIndex = 0;
$snippet = "";
$lastSnippet = "";
$snippetCnt = 1;
$mostCloseIdxType = ".";

$handleSnippet = function () use (&$result, &$lastSnippet, &$snippetCnt) {
  if (str_ends_with($result, $lastSnippet)) {
    $result = mb_substr($result, 0, mb_strlen($result) - mb_strlen($lastSnippet));
    $snippetCnt += 1;
  }

  if (mb_strlen($lastSnippet) == 1 && $snippetCnt <= 7) {
    $result .= str_repeat($lastSnippet, $snippetCnt);
  } else {
    $binSnippetCnt = str_split(decbin($snippetCnt));
    $last = array_pop($binSnippetCnt);
    $result .= str_repeat("[", count($binSnippetCnt));

    foreach ($binSnippetCnt as $car) {
      if ($car == "1") {
        $result .= $lastSnippet . "]";
      } else {
        $result .= "]";
      }
    }
    if ($last == "1") {
      $result .= $lastSnippet;
    }
  }
};

foreach ($chars as $num) {
  $snippet = "";

  if ($num == 10) {
    $snippet .= ":";
  } else {
    // 寻找最接近的数字
    $cellIndex = 0;
    $mostClose = PHP_INT_MAX;
    $mostCloseIndex = 0;
    foreach ($cells as $cellnum) {
      if (abs($cellnum - $num) < abs($mostClose)) {
        $mostClose = $cellnum - $num;
        $mostCloseIndex = $cellIndex;
        $mostCloseIdxType = ".";
      }
      $char = mb_chr($num, 'UTF-8');
      if (ctype_digit($char)) {
        $charnum = (int)$char;
        if (abs($cellnum - $charnum) < abs($mostClose)) {
          $mostClose = $cellnum - $charnum;
          $mostCloseIndex = $cellIndex;
          $mostCloseIdxType = "%";
        }
      }
      $cellIndex += 1;
    }

    if ($lastMostCloseIndex != $mostCloseIndex) {
      $snippet .= (string)$mostCloseIndex;
      if ($uniqueResult && !$cells_used[$mostCloseIndex]) {
        $cells_used[$mostCloseIndex] = true;
        $snippet .= "#";
      }
    }
    $lastMostCloseIndex = $mostCloseIndex;

    $opr = $mostClose > 0 ? "-" : "+";
    $numa = abs($mostClose);

    if ($numa <= 7) {
      $snippet .= str_repeat($opr, $numa);
    } else {
      $snuma = str_split(decbin($numa));
      $last = array_pop($snuma);
      $snippet .= str_repeat("[", count($snuma));

      foreach ($snuma as $car) {
        if ($car == "1") {
          $snippet .= $opr . "]";
        } else {
          $snippet .= "]";
        }
      }
      if ($last == "1") {
        $snippet .= $opr;
      }
    }

    if ($mostCloseIdxType == ".") {
      $cells[$mostCloseIndex] = $num;
    } else {
      $char = mb_chr($num, 'UTF-8');
      $cells[$mostCloseIndex] = (int)$char;
    }
    $snippet .= $mostCloseIdxType;
  }

  if ($snippet == $lastSnippet) {
    $snippetCnt += 1;
  } else {
    if ($lastSnippet != "") {
      $handleSnippet();
    }
    $snippetCnt = 1;
    $lastSnippet = $snippet;
  }
}

$handleSnippet();
echo preg_replace_callback('/\[(.)\]/u', function ($matches) {
  return $matches[1] . $matches[1];
}, $result);

exit;
