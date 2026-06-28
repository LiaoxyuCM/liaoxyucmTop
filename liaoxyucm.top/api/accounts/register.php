<?php
define("SALT_LEFT", "zHXPMHmWvKsMcAMABm5UBJZRJ");
define("SALT_RIGHT", "HAjrwgDxrxabESRVVkF3JnBZp");

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

// 检查请求方法
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(array("status" => 1, "message" => "Method not allowed"));
    exit;
}

// 检查输入
if (!isset($_POST["username"]) || !isset($_POST["password"])) {
    echo json_encode(array("status" => 1, "message" => "Missing username or password"));
    exit;
}

$username = trim($_POST["username"]);
$password = $_POST["password"];

// 验证用户名
if (empty($username) || strlen($username) > 25 || !preg_match('/^[a-zA-Z0-9_]+$/', $username)) {
    echo json_encode(array("status" => 1, "message" => "Invalid username (only letters, numbers, underscore AND username_length < 25 )"));
    exit;
}

// 验证密码强度
if (strlen($password) < 9 || strlen($password) > 25) {
    echo json_encode(array("status" => 1, "message" => "Invalid password (9 < password_length < 25)"));
    exit;
}

// 读取并锁定文件
$filepath = "./users.json";
$fp = fopen($filepath, 'c+');
if (!flock($fp, LOCK_EX)) {
    echo json_encode(array("status" => 1, "message" => "System busy, try again"));
    exit;
}

$data = json_decode(file_get_contents($filepath), true) ?: [];

// 初始化结构
if (!isset($data['users'])) {
    $data['users'] = [];
}

// 检查用户名是否已存在
$usernameExists = isset($data['users'][$username]);

if ($usernameExists) {
    flock($fp, LOCK_UN);
    fclose($fp);
    echo json_encode(array("status" => 1, "message" => "Username already exists"));
    exit;
}

// 创建新用户
$data['users'][$username] = array(
    'nickname' => $username,
    'password' => hash('sha256', SALT_LEFT . $password . SALT_RIGHT),
    'points' => 0,
    'sign' => 'Nothing',
    'created_at' => date('Y-m-d H:i:s'),
    'privilege' => [],
);

// 写回文件
rewind($fp);
ftruncate($fp, 0);
fwrite($fp, json_encode($data, JSON_PRETTY_PRINT));
fflush($fp);
flock($fp, LOCK_UN);
fclose($fp);

echo json_encode(array(
    "status" => 0,
    "message" => "OK",
    "data" => array(
        "username" => $username
    )
));
?>