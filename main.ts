pins.P16.digitalWrite(false);
basic.pause(1);
pins.P16.digitalWrite(true);
basic.pause(200);
Cube.Init();
Cube.TurnOffAllLED()
for (let i = 0; i <= 4; i++) {
    for (let j = 0; j <= 4; j++) {
        led.plot(j, i)
        basic.pause(50)
    }
}
basic.showIcon(IconNames.Happy);
