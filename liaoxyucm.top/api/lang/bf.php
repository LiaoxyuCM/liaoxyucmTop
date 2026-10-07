<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

define('MAX_ITER', 131071);
define('MAX_NUMBER', 255);
define('MEMORY_SIZE', 256);

$code = $_GET['code'] ?? '';
$input = $_GET['input'] ?? '';
$preprocessor = $_GET['preprocessor'] ?? '';

$result = '';
$code_cursor = -1;
$cell_cursor = 0;
$input_cursor = 0;
$memory = array_fill(0, MEMORY_SIZE, 0);
$bracketMap = [];
$stack = [];

function error($errstr) {
  return json_encode(["success" => false, "text" => $errstr]);
}

function utf8len($str) {
  return mb_strlen($str, 'UTF-8');
}

if ($preprocessor == 'macro_comment') {
  $mct_macros = [];
  $mct_pointer = -1;
  $mct_storaged_name = "";
  $mct_storaged_body = "";
  $mct_result = "";

  try {
    while (++$mct_pointer < strlen($code)) {
      $mct_chr = $code[$mct_pointer];
      switch ($mct_chr) {
        case '$':
          while (!in_array($code[++$mct_pointer], ["{", "("])) {
            $mct_storaged_name .= $code[$mct_pointer];
          }
          while (!in_array($code[++$mct_pointer], ["}", ")"])) {
            $mct_storaged_body .= $code[$mct_pointer];
          }
          if ($code[$mct_pointer] == "}") {
            $mct_macros[$mct_storaged_name] = $mct_storaged_body;
          } else if ($code[$mct_pointer] == ")") {
            $mct_result .= str_replace("@", $mct_storaged_body, $mct_macros[$mct_storaged_name] ?? "");
          }

          $mct_storaged_name = "";
          $mct_storaged_body = "";

          break;
        case '/':
          if ($code[$mct_pointer + 1] == "*") {
            $mct_pointer++;
            while (
              !($code[$mct_pointer] == "*" && $code[$mct_pointer + 1] == "/")
              && ($mct_pointer + 1 < strlen($code))
            ) {
              $mct_pointer++;
            }
            $mct_pointer++;
          } else {
            $mct_result .= $mct_chr;
          }
          break;
        default:
          $mct_result .= $mct_chr;
          break;
      }
    }
  } catch (\Throwable $_) {
    echo error("Processor exception");
  }

  $code = $mct_result;
}

for ($i = 0; $i < utf8len($code); $i++) {
  if ($code[$i] === '[') {
    $stack[] = $i;
  } else if ($code[$i] === ']') {
    if (count($stack) === 0) {
      echo error("Unmatched ']' at pos " . $i);
      exit;
    }
    $open = array_pop($stack);
    $bracketMap[$open] = $i;
    $bracketMap[$i] = $open;
  }
}

if (count($stack) > 0) {
  echo error("Unmatched '[' at pos " . $stack[count($stack)-1]);
}

$iterations = [];

while (++$code_cursor < utf8len($code)) {
  if (isset($iterations[count($iterations)-1]) && $iterations[count($iterations)-1] > MAX_ITER) {
    echo error("Exec exceeded max iter (" . MAX_ITER . ") at pos " . $code_cursor);
    exit;
  }

  if (isset($code[$code_cursor])) {
    $cmd = $code[$code_cursor];
  }

  switch ($cmd) {
    case '>':
      if (++$cell_cursor >= MEMORY_SIZE) {
        $cell_cursor = 0;
      }
      break;
    case '<':
      if (--$cell_cursor < 0) {
        $cell_cursor = MEMORY_SIZE - 1;
      }
      break;
    case '+':
      $memory[$cell_cursor] = ($memory[$cell_cursor] + 1) % (MAX_NUMBER + 1);
      break;
    case '-':
      $memory[$cell_cursor] = ($memory[$cell_cursor] - 1 + (MAX_NUMBER+1)) % (MAX_NUMBER + 1);
      break;
    case '.':
      $result .= mb_chr($memory[$cell_cursor], 'UTF-8');
      break;
    case ',':
      $memory[$cell_cursor] = mb_ord($input[$input_cursor++] ?? "\0", 'UTF-8');
      break;
    case '[':
      if ($memory[$cell_cursor] === 0) {
        $code_cursor = $bracketMap[$code_cursor];
      } else {
        $iterations[] = 0;
      }
      break;
    case ']':
      if ($memory[$cell_cursor] !== 0) {
        $code_cursor = $bracketMap[$code_cursor];
        if (isset($iterations[count($iterations)-1])) {
          $iterations[count($iterations)-1]++;
        }
      } else {
        array_pop($iterations);
      }
      break;
  }
}

echo json_encode(["success" => true, "text" => $result]);
exit;
