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

$hashedPassword = hash('sha256', SALT_LEFT . $password . SALT_RIGHT);

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

// 通过 ID 查找
$user = $data['users'][$username];

// 验证用户是否存在
if ($user === null) {
    echo json_encode(array("status" => 1, "message" => "Invalid credentials"));
    exit;
}

if ($user['password'] != $hashedPassword) {
    echo json_encode(array("status" => 1, "message" => "Wrong username or password"));
    exit;
}

// 获取 action 参数
$action = isset($_POST['action']) ? $_POST['action'] : '';

// 记录最后活动时间
$data['users'][$username]['last_active'] = date('Y-m-d H:i:s');

// 根据不同的 action 执行相应操作
switch ($action) {
    case 'verify':
        echo json_encode(array("status" => 0, "message" => "登录成功", "data" => array(
        "nickname" => $user['nickname'],
        "sign" => $user['sign'],
        "privilege" => $user['privilege'],
        "points" => $user['points']
    )));
        break;
    case 'change_nickname':
        $newNickname = isset($_POST['nickname']) ? trim($_POST['nickname']) : '';
        
        // 验证昵称
        if (empty($newNickname) || strlen($newNickname) > 30) {
            echo json_encode(array("status" => 1, "message" => "昵称长度必须在1-30个字符之间"));
            exit;
        }
        
        
        // 执行昵称修改
        $data['users'][$username]['nickname'] = $newNickname;
        
        if (saveUserData($filepath, $data)) {
            echo json_encode(array(
                "status" => 0, 
                "message" => "昵称修改成功",
                "nickname" => $newNickname
            ));
        } else {
            echo json_encode(array("status" => 1, "message" => "修改昵称失败"));
        }
        break;
  
  
    case 'change_password':
        // 修改密码（消耗100积分）
        $newPassword = isset($_POST['new_password']) ? $_POST['new_password'] : '';
        $confirmPassword = isset($_POST['confirm_password']) ? $_POST['confirm_password'] : '';
        
        
        // 验证新密码
        if (empty($newPassword) || strlen($newPassword) < 6 || strlen($newPassword) > 30) {
            echo json_encode(array("status" => 1, "message" => "新密码长度必须在6-30个字符之间"));
            exit;
        }
        
        if ($newPassword !== $confirmPassword) {
            echo json_encode(array("status" => 1, "message" => "两次输入的新密码不一致"));
            exit;
        }
        
        
        // 执行密码修改
        $newHashedPassword = hash('sha256', SALT_LEFT . $newPassword . SALT_RIGHT);
        $data['users'][$username]['password'] = $newHashedPassword;
        
        if (saveUserData($filepath, $data)) {
            echo json_encode(array(
                "status" => 0, 
                "message" => "密码修改成功",
                "points" => $data['users'][$username]['points']
            ));
        } else {
            echo json_encode(array("status" => 1, "message" => "修改密码失败"));
        }
        break;
        
    case 'check_in':
        // 每日签到
        $today = date('Y-m-d');
        $lastCheckin = isset($user['last_checkin']) ? $user['last_checkin'] : '';
        
        if ($lastCheckin == $today) {
            echo json_encode(array("status" => 1, "message" => "今天已经签到过了"));
            exit;
        }
        
        // 增加积分
        $checkinBonus = mt_rand(5, 20);
        $data['users'][$username]['points'] = ($user['points'] ?? 0) + $checkinBonus;
        $data['users'][$username]['last_checkin'] = $today;
        $data['users'][$username]['total_checkins'] = ($user['total_checkins'] ?? 0) + 1;
        
        // 保存数据
        if (saveUserData($filepath, $data)) {
            echo json_encode(array(
                "status" => 0, 
                "message" => "签到成功，获得 {$checkinBonus} 积分",
                "bonus" => $checkinBonus,
                "points" => $data['users'][$username]['points']
            ));
        } else {
            echo json_encode(array("status" => 1, "message" => "签到失败，请稍后重试"));
        }
        break;
        
    case 'change_sign':
        // 修改个性签名
        $newSign = isset($_POST['sign']) ? trim($_POST['sign']) : '';
        
        if (strlen($newSign) > 100) {
            echo json_encode(array("status" => 1, "message" => "签名长度不能超过100个字符"));
            exit;
        }
        
        $data['users'][$username]['sign'] = $newSign;
        
        if (saveUserData($filepath, $data)) {
            echo json_encode(array("status" => 0, "message" => "签名修改成功", "sign" => $newSign));
        } else {
            echo json_encode(array("status" => 1, "message" => "修改签名失败"));
        }
        break;
        
    case 'change_username':
        // 修改用户名（消耗200积分）
        $newUsername = isset($_POST['new_username']) ? trim($_POST['new_username']) : '';
        
        // 验证新用户名
        if (empty($newUsername) || strlen($newUsername) > 25 || !preg_match('/^[a-zA-Z0-9_]+$/', $newUsername)) {
            echo json_encode(array("status" => 1, "message" => "Invalid username (only letters, numbers, underscore AND length <= 25)"));
            exit;
        }
        
        // 检查新用户名是否已存在
        if (isset($data['users'][$newUsername])) {
            echo json_encode(array("status" => 1, "message" => "用户名已存在"));
            exit;
        }
        
        // 检查积分是否足够（消耗10积分）
        $currentPoints = $user['points'] ?? 0;
        $costPoints = 10;
        
        if ($currentPoints < $costPoints) {
            echo json_encode(array("status" => 1, "message" => "积分不足，需要 {$costPoints} 积分"));
            exit;
        }
        
        // 执行用户名修改
        $userData = $data['users'][$username];
        $userData['points'] = $currentPoints - $costPoints;
        
        // 删除旧用户名条目，添加新用户名条目
        unset($data['users'][$username]);
        $data['users'][$newUsername] = $userData;
        
        if (saveUserData($filepath, $data)) {
            echo json_encode(array(
                "status" => 0, 
                "message" => "用户名修改成功，消耗 {$costPoints} 积分",
                "new_username" => $newUsername,
                "points" => $data['users'][$newUsername]['points']
            ));
        } else {
            echo json_encode(array("status" => 1, "message" => "修改用户名失败"));
        }
        break;
        
    case 'transfer_points':
        // 积分转账
        $targetUser = isset($_POST['target_user']) ? trim($_POST['target_user']) : '';
        $transferPoints = isset($_POST['points']) ? intval($_POST['points']) : 0;
        
        // 验证目标用户
        if (empty($targetUser)) {
            echo json_encode(array("status" => 1, "message" => "目标用户名不能为空"));
            exit;
        }
        
        // 不能转给自己
        if ($targetUser === $username) {
            echo json_encode(array("status" => 1, "message" => "不能给自己转账"));
            exit;
        }
        
        // 验证积分数量
        if ($transferPoints <= 0) {
            echo json_encode(array("status" => 1, "message" => "转账积分必须大于0"));
            exit;
        }
        
        // 检查目标用户是否存在
        if (!isset($data['users'][$targetUser])) {
            echo json_encode(array("status" => 1, "message" => "目标用户不存在"));
            exit;
        }
        
        // 检查积分是否足够
        $currentPoints = $user['points'] ?? 0;
        if ($currentPoints < $transferPoints) {
            echo json_encode(array("status" => 1, "message" => "积分不足，当前积分: {$currentPoints}"));
            exit;
        }
        
        // 执行转账
        $data['users'][$username]['points'] = $currentPoints - $transferPoints;
        $data['users'][$targetUser]['points'] = ($data['users'][$targetUser]['points'] ?? 0) + $transferPoints;
        
        // 记录转账历史（可选）
        if (!isset($data['transfers'])) {
            $data['transfers'] = [];
        }
        $data['transfers'][] = array(
            'from' => $username,
            'to' => $targetUser,
            'points' => $transferPoints,
            'time' => date('Y-m-d H:i:s')
        );
        
        if (saveUserData($filepath, $data)) {
            echo json_encode(array(
                "status" => 0, 
                "message" => "成功转账 {$transferPoints} 积分给 {$targetUser}",
                "remaining_points" => $data['users'][$username]['points']
            ));
        } else {
            echo json_encode(array("status" => 1, "message" => "转账失败"));
        }
        break;
        
    case 'get_user_info':
        // 获取用户信息（不需要修改数据）
        echo json_encode(array(
            "status" => 0,
            "message" => "OK",
            "data" => array(
                'nickname' => $user['nickname'] ?? $username,
                'sign' => $user['sign'] ?? '这个人很懒，还没有签名',
                'privilege' => $user['privilege'] ?? ['user'],
                'points' => $user['points'] ?? 0,
                'last_checkin' => $user['last_checkin'] ?? null,
                'total_checkins' => $user['total_checkins'] ?? 0,
                'register_time' => $user['register_time'] ?? '未知'
            )
        ));
        break;
        
    default:
        // 默认返回用户信息（等同于登录验证）
        echo json_encode(array(
            "status" => 0, 
            "message" => "OK",
            "data" => array(
                'nickname' => $user['nickname'] ?? $username,
                'sign' => $user['sign'] ?? '这个人很懒，还没有签名',
                'privilege' => $user['privilege'] ?? ['user'],
                'points' => $user['points'] ?? 0
            )
        ));
        break;
}

// 保存用户数据的函数
function saveUserData($filepath, $data) {
    $fp = fopen($filepath, 'w');
    if (!flock($fp, LOCK_EX)) {
        fclose($fp);
        return false;
    }
    
    $jsonData = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    $result = fwrite($fp, $jsonData);
    
    flock($fp, LOCK_UN);
    fclose($fp);
    
    return $result !== false;
}

// 初始化示例用户数据（如果 users.json 不存在或为空）
function initializeSampleUsers() {
    global $filepath;
    
    if (!file_exists($filepath) || filesize($filepath) == 0) {
        $sampleData = array(
            'users' => array(
                'admin' => array(
                    'password' => hash('sha256', SALT_LEFT . 'admin123' . SALT_RIGHT),
                    'nickname' => '管理员',
                    'sign' => '系统管理员',
                    'privilege' => ['admin', 'staff', 'user'],
                    'points' => 10000,
                    'register_time' => date('Y-m-d H:i:s'),
                    'last_checkin' => null,
                    'total_checkins' => 0
                ),
                'user1' => array(
                    'password' => hash('sha256', SALT_LEFT . 'password123' . SALT_RIGHT),
                    'nickname' => '普通用户',
                    'sign' => '欢迎来到积分系统',
                    'privilege' => ['user'],
                    'points' => 500,
                    'register_time' => date('Y-m-d H:i:s'),
                    'last_checkin' => null,
                    'total_checkins' => 0
                ),
                'hello' => array(
                    'password' => hash('sha256', SALT_LEFT . 'world123' . SALT_RIGHT),
                    'nickname' => 'Hello World',
                    'sign' => 'Admin',
                    'privilege' => ['admin', 'staff'],
                    'points' => 0,
                    'register_time' => date('Y-m-d H:i:s'),
                    'last_checkin' => null,
                    'total_checkins' => 0
                )
            )
        );
        
        $fp = fopen($filepath, 'w');
        if ($fp) {
            fwrite($fp, json_encode($sampleData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
            fclose($fp);
        }
    }
}

// 调用初始化函数
initializeSampleUsers();
?>
