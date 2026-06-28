<?php

header('Content-Type: text/plain');
header('Access-Control-Allow-Origin: *');

$userInput = $_GET['src'] ?? '';
$stored = '';
$result = '';
$status = 0;
foreach (str_split($userInput) as $chr) {
  if ($status == 1) {
    $stored .= $chr;
    $status = 0;
    continue;
  }
  switch ($chr) {
    case '.':
      if ($status == 0) {
        $result .= $stored . "\n";
        $stored = '';
      }
      break;
      case '\\':
        if ($status == 0) {
          $status = 1;
        }
        break;

      case '/':
        if ($status == 0) {
          $status = 2;
        } else if ($status == 2) {
          $status = 0;
        }
        break;

      default:
        if ($status == 0) {
          $stored .= $chr;
        }
        break;
  }
}
echo $result ?: "No output\nMay missing argument 'src' (require GET)";
exit;
