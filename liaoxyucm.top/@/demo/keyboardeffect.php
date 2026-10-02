<!DOCTYPE html>

<html>
    <head>
		<meta charset="utf-8" />
        <title>PC only :)</title>
    </head>
    <body>
        <p class="showuserinput"></p>
		<input placeholder="移动端的救赎（仅起到呼出键盘作用，不同步当前文本）" style="width: 500px">
        <div style="display: flex; justify-content: center; align-items: flex-start; gap: 50px;">
            <div class="container" id="c_1">
				<?php
					foreach ([
						'1234567890',
						'qwertyuiop',
						'asdfghjkl',
						'zxcvbnm',
					] as $line => $chars) {
						echo '<div class="keyboard_line" id="kl_' . $line . '">';
						foreach (str_split($chars) as $char) {
							echo '<div class="key" id="k_' . $char . '"><p>' . $char . '</p></div>';
						}
						echo '</div>';
					}
				?>
			</div>
            <div class="container" id="c_2">
				<div class="axis">
					<?php
						foreach ([5, 20, 100, 500, 2000] as $axislabel) {
							echo "<small class=\"axislabel\" value=\"$axislabel\" visibility=\"{$axislabel}0\">{$axislabel}&ZeroWidthSpace;</small>";
						}
					?>
				</div>
				<?php
					foreach (array_merge(range('a', 'z'), range(0, 9)) as $char) {
						echo "<div class=\"barchart\" id=\"bc_$char\"><div class=\"bar\" id=\"bar_$char\"><p>$char</p></div><p class=\"count\" id=\"cnt_$char\">0</p></div>";
					}
				?>
        <style>
            p.showuserinput {
				font-family: monospace;
                font-size: 24px;
                margin-bottom: 20px;
                text-align: center;
				overflow-wrap: break-word;
            }
            div#c_1 div.keyboard_line {
                display: flex;
                justify-content: center;
                align-items: center;
                margin: 5px;
            }
            div#c_1 div.keyboard_line div.key {
                width: 40px;
                height: 40px;
                border: 1px solid black;
                border-radius: 5px;
                margin: 2px;
                display: flex;
                justify-content: center;
                align-items: center;
                font-family: Arial, sans-serif;
                font-size: 20px;
                user-select: none;
                transition: background-color 0.2s, transform 0.1s;
            }
            div#c_2 {
                width: 330px;
                height: 358px;
                overflow: hidden;
                position: relative;
            }
			div#c_2 div.axis small.axislabel, div#c_2 div.barchart div.bar {
                transition: all linear 0.2s;
			}
            div#c_2 div.barchart {
                display: flex;
                align-items: center;
                justify-content: left;
                position: absolute;
                top: 0;
                transition: all ease-out .5s;
            }
            div#c_2 div.barchart div.bar {
                width: 0;
                height: 30px;
                color: white;
                border: 1px solid black;
                border-radius: 5px;
                margin: 2px;
                display: flex;
                justify-content: right;
                align-items: flex-end;
                font-family: Arial, sans-serif;
                font-size: 16px;
                user-select: none;
                background-color: lightgray;
                overflow: hidden;
            }
            div#c_2 div.barchart div.bar p, div#c_2 div.barchart p.count {
                margin: 8px;
            }
			div#c_2 div.axis {
				display: flex;
			}
			div#c_2 div.axis small.axislabel {
                position: absolute;
                left: 0;
                text-decoration: none;
                /* color: black; */
				border-left: 1px solid #aaa;
				height: 358px;
				transform: translateX(3px);
			}
			@media(prefers-color-scheme: dark) {
				body {background-color: #000;}
				p, small {color: #fff;}
        	    div#c_1 div.keyboard_line div.key { border: 1px solid white ;}
			}
        </style>
        <script>
            var text = "";
            const showuserinput = document.querySelector('.showuserinput');
            function getBiggestNumber() {
                const container = document.getElementById('c_2');
                const barcharts = Array.from(container.getElementsByClassName('barchart'));
                barcharts.sort((a, b) => {
                    const countA = parseInt(a.querySelector('.count').textContent);
                    const countB = parseInt(b.querySelector('.count').textContent);
                    return countB - countA;
                });
                return parseInt(barcharts[0].querySelector('.count').textContent) + parseInt(barcharts[1].querySelector('.count').textContent) + parseInt(barcharts[2].querySelector('.count').textContent);
            }
			function order_barcharts() {
                const container = document.getElementById('c_2');
                const barcharts = Array.from(container.getElementsByClassName('barchart'));
				const axislabels = document.querySelectorAll('.axislabel');
                barcharts.sort((a, b) => {
                    const countA = parseInt(a.querySelector('.count').textContent);
                    const countB = parseInt(b.querySelector('.count').textContent);
                    return countB - countA;
                });
				axislabels.forEach((axislabel) => {
					let value = parseInt(axislabel.getAttribute("value"));
					let visibility = parseInt(axislabel.getAttribute("visibility"));
					if (getBiggestNumber() <= visibility) {
						axislabel.style.opacity = "100%";
					} else {
						axislabel.style.opacity = `${Math.max(100 -getBiggestNumber() + visibility, 0)}%`;
					};
					try {
						axislabel.style.transform = "translateX(" + (3 + (value / getBiggestNumber() * 280)) + 'px)';
					} catch {

					};
				});
                barcharts.forEach((barchart, index) => {
                    barchart.style.transform = "translateY(" + (index * 34 + 15) + 'px)';
                });
            }
            function setbarbgcolor(currentBar) {
                var count = currentBar.querySelector('.count').textContent;
                var bar = currentBar.querySelector('.bar');
                if (count < 5) {
                    bar.style.backgroundColor = 'black';
                } else if (count < 105) {
                    // rgb 100, 230, 255 to 0, 30, 155
                    bar.style.backgroundColor = `rgb(${Math.round(100 - (100/99)*(count-5))}, ${Math.round(230 - (200/99)*(count-5))}, ${Math.round(255 - (100/99)*(count-5))})`; // A
                } else if (count < 505) {
                    // rgb 0, 30, 155 to 100, 0, 255
                    bar.style.backgroundColor = `rgb(${(count-105)/4}, ${30-(count-105)/4}, ${155+(count-105)/4})`;
                } else if (count < 1505) {
                    bar.style.backgroundColor = `rgb(${100 + (count-505)/10}, 0, ${255 - (count-505)/5})`;
                } else {
					bar.style.backgroundColor = `rgb(200, 0, 55)`;
				}
            }
            
            document.addEventListener('keydown', function(event) {
                const keyId = 'k_' + event.key.toLowerCase();
                const allbars = document.querySelectorAll('.barchart');
                order_barcharts();
                if (event.key.length > 1) {
                    if (event.key === 'Backspace') {
                        const barElement = document.getElementById('bar_' + text.slice(-1).toLowerCase());
                        const countElement = document.getElementById('cnt_' + text.slice(-1).toLowerCase());
                        const currentBar = document.getElementById('bc_' + text.slice(-1).toLowerCase());
                        if (countElement) {
                            let currentCount = parseInt(countElement.textContent);
                            currentCount -= 1;
                            countElement.textContent = currentCount;
                        }
                        if (currentBar) {
                            setbarbgcolor(currentBar);
                        }
                        allbars.forEach(bar => {
                            let counter = bar.querySelector(".count")
							let curr_width = parseInt(counter.textContent) / Math.max(1, getBiggestNumber()) * 280
                            bar.querySelector(".bar").style.width = curr_width + 'px';
                        });
                        order_barcharts();
                        text = text.slice(0, -1);

                    } else if (event.key === 'Space') {
                        text += ' ';
                    }
                } else {
                    text += event.key;
                    const barId = 'bar_' + event.key.toLowerCase();
                    const currentBar = document.getElementById('bc_' + event.key.toLowerCase());
                    if (barId) {
                        const barElement = document.getElementById(barId);
                        if (barElement) {
                            const countId = 'cnt_' + event.key.toLowerCase();
                            const countElement = document.getElementById(countId);
                            if (countElement) {
                                let currentCount = parseInt(countElement.textContent);
                                currentCount += 1;
                                countElement.textContent = currentCount;
                            };
                            if (currentBar) {
                                setbarbgcolor(currentBar);
                            };
                            let currentWidth = barElement.offsetWidth;
                            allbars.forEach(bar => {
                                let counter = bar.querySelector(".count")
                                bar.querySelector(".bar").style.width = parseInt(counter.textContent) / Math.max(1, getBiggestNumber()) * 280 + 'px';
                            });
                            order_barcharts();
                        }
                    }
                }
                showuserinput.textContent = text.slice(-50);
                const keyElement = document.getElementById(keyId);
                if (keyElement) {
                    keyElement.style.backgroundColor = '#ADD8E6'; // Light blue
                    keyElement.style.transform = 'scale(0.95)';
                }
            });

            document.addEventListener('keyup', function(event) {
                const keyId = 'k_' + event.key.toLowerCase();
                const keyElement = document.getElementById(keyId);
                if (keyElement) {
                    keyElement.style.backgroundColor = ''; // Reset to default
                    keyElement.style.transform = 'scale(1)';
                }
            });
        </script>
    </body>
</html>
