<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

// 检查请求方法
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    echo json_encode(array("status" => 1, "message" => "Method not allowed"));
    exit;
}

// 支持通过 id 或 username 登录
if (!isset($_GET["username"])) {
    echo json_encode(array("status" => 1, "message" => "Missing username"));
    exit;
}
$loginByUsername = isset($_GET["username"]);

// 读取文件
$filepath = "./users.json";
if (!file_exists($filepath)) {
    echo json_encode(array("status" => 1, "message" => "User not found"));
    exit;
}

$fp = fopen($filepath, 'r');
if (!flock($fp, LOCK_SH)) {
    echo json_encode(array("status" => 1, "message" => "System busy, try again"));
    fclose($fp);
    exit;
}

$data = json_decode(file_get_contents($filepath), true) ?: [];
flock($fp, LOCK_UN);
fclose($fp);

if (!isset($data['users'])) {
    echo json_encode(array("status" => 1, "message" => "Invalid credentials"));
    exit;
}

$user = null;

// 通过 ID 查找
if ($loginByUsername) {
    $username = trim($_GET["username"]);
    if (!isset($data['users'][$username])) {
        echo json_encode(array("status" => 1, "message" => "Cannot find user"));
        exit;
    }
    $user = $data['users'][$username];
}

// 验证用户是否存在
if ($user === null) {
    echo json_encode(array("status" => 1, "message" => "Invalid credentials"));
    exit;
}
echo json_encode(array(
    "status" => 0,
    "message" => "OK",
    "data" => array(
        "nickname" => $user['nickname'],
        "sign" => $user['sign'],
        "privilege" => $user['privilege'],
        "points" => $user['points']
    )
));
?>