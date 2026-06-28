<?php

class Rep {}

function tdup_compile(string $content, int $deinf = 0): string {
 
    if (strlen($content) > 50000) {
        return "\n[SYSTEM PROTECTION][!!FATAL] Too many characters (>50k) CURR:" . strlen($content) . "\n";
    };
    if ($deinf >= 9) {
        return "\n[SYSTEM PROTECTION][!!FATAL] Too many overloads (>8)!\n";
    };
    $result = "";
    $col = 0;
    $len = strlen($content);
    
    while ($col < $len) {
        $char = $content[$col];
        
        if ($char === "\\") {
            $col++;
            if ($col >= $len) {
                $result .= "\\";
                break;
            }
            $nextChar = $content[$col];
            $result .= ($nextChar === "n") ? "\n" : $nextChar;
        } elseif ($char === "%") {
            $col++;
            $maplst = [""];
            
            while (true) {
                if ($col >= $len) break;
                $c = $content[$col];
                
                if ($c === " ") {
                    $maplst[] = "";
                } elseif ($c === ",") {
                    $col++;
                    $repd = [""];
                    
                    while (true) {
                        if ($col >= $len) break;
                        $rc = $content[$col];
                        
                        if ($rc === ";") {
                            break;
                        } elseif ($rc === "\\") {
                            $col++;
                            if ($col >= $len) {
                                $last = array_pop($repd);
                                if ($last instanceof Rep) {
                                    $repd[] = $last;
                                    $repd[] = "\\";
                                } else {
                                    $repd[] = "\\";
                                }
                                $col++;
                                continue;
                            }
                            $escChar = $content[$col];
                            $addStr = ($escChar === "n") ? "\n" : $escChar;
                            
                            $last = array_pop($repd);
                            if ($last instanceof Rep) {
                                $repd[] = $last;
                                $repd[] = $addStr;
                            } else {
                                $repd[] = $last . $addStr;
                            }
                        } elseif ($rc === "$") {
                            $repd[] = new Rep();
                        } else {
                            $last = array_pop($repd);
                            if ($last instanceof Rep) {
                                $repd[] = $last;
                                $repd[] = $rc;
                            } else {
                                $repd[] = $last . $rc;
                            }
                        }
                        $col++;
                    }
                    
                    $rsrg = "";
                    foreach ($maplst as $mapl) {
                        foreach ($repd as $rep) {
                            if (is_string($rep)) {
                                $rsrg .= $rep;
                            } else {
                                $rsrg .= $mapl;
                            }
                        }
                    }
                    
                 
                    $result .= tdup_compile($rsrg, $deinf + 1);
                    break;
                } elseif ($c === "\\") {
                    $col++;
                    if ($col >= $len) {
                        $maplst[array_key_last($maplst)] .= "\\";
                        $col++;
                        continue;
                    }
                    $escChar = $content[$col];
                    $addStr = ($escChar === "n") ? "\n" : $escChar;
                    $maplst[array_key_last($maplst)] .= $addStr;
                } else {
                    $maplst[array_key_last($maplst)] .= $c;
                }
                $col++;
            }
        } else {
            $result .= $char;
        }
        $col++;
    }
    
    return $result;
}

function main() {
    header("Content-Type: text/plain");
    header("Access-Control-Allow-Origin: *");
    if (isset($_GET["src"])) {
        echo tdup_compile($_GET["src"]);
    } else {
        echo "[URL QUERY][minor] No params";
    }
}

main();

?>