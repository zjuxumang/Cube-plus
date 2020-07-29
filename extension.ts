//% color="#359eff" weight=20 icon="\uf1b2"
namespace Cube {
    let BUS_SERVO_ENABLE=false;
    let Color_Recognize:number;
    export enum GPIO_ID{
        A0,
        A1,
        B0,
        B1,
        C0,
        C1,
        D0,
        D1,
        E0,
        E1,
        F0,
        F1,
        G0,
        G1,
        H0,
        H1
    }
    export enum Analog_Pins{
        A0,
        A1,
        B0,
        B1,
        C0,
        C1,
        D0,
        D1
    }
    export enum PORT_ID{
        //% block="端口A"
        PORTA,
        //% block="端口B"
        PORTB,
        //% block="端口C"
        PORTC,
        //% block="端口D"
        PORTD
    }
    export enum Pin_MODE{
        //% block="输入"
        INPUT_NOPULL,
        //% block="上拉输入"
        INPUT_PULLUP,
        //% block="下拉输入"
        INPUT_PULLDOWN,
        //% block="数字输出"
        OUTPUT,
        //% block="模拟输出"
        PWM,
        //% block="模拟输入(仅支持模拟引脚)"
        ADC
    }
    export enum Pin_Level{
        //% block="高"
        High,
        //% block="低"
        Low
    }
    export enum Sensor_ID{
        //% block="按钮模块"
        Button=1,
        //% block="触摸模块"
        Touch,
        //% block="手势&颜色模块"
        Gesture,
        //% block="红外光电模块"
        IR,
        //% block="超声波测距模块"
        Ultrasonar,
    }
    export enum Motor_ID{
        M1,
        M2,
        M3,
        M4
    }
    export enum Motor_Dir{
        //% block="正转"
        Forward=1,
        //% block="反转"
        Backward=2,
        //% block="刹车"
        Brake=0
    }
    export enum Move_base_dir{
        //% block="前进"
        Forward=1,
        //% block="后退"
        Backward=2,
        //% block="左转"
        Turn_left=3,
        //% block="右转"
        Turn_right=4,
        //% block="刹车"
        Brake=0
    }

    export enum IMU_AXIS{
        Yaw,
        Roll,
        Pitch
    }

    export enum End_TYPE{
        //% block="左转路口"
        Left=2,
        //% block="右转路口"
        Right=3,
        //% block="十字路口"
        Cross=1,
        //% block="不停止"
        Forever=4
    }

    export enum Go_Distance{
        //% block="前进"
        Forward,
        //% block="后退"
        Backward
    }

    export enum Is_Wait{
        //% block="是"
        Blocking=1,
        //% block="否"
        NonBlocking=0
    }
    // //% block="关闭所有LED" group="基本功能" weight=10
    // export function TurnOffAllLED(){
    //     let strip = neopixel.create(DigitalPin.P15, 5, NeoPixelMode.RGB)
    //     basic.clearScreen()
    //     strip.clear()
    //     strip.show()
    // }

    //% block="复位编程盒" advanced=true
    //% shim=Cube::Init
    export function Init() {
        return
    }

    //————————————————————————————————————————————
    //IQ Motors
    //|__初始化IQ马达 端口X
    //|__设置端口X 马达 速度
    //|__端口X 马达 转动[]°
    //|__
    //|__
    //|__

    export enum IQ_PORT{
        PORT1,
        PORT2,
        PORT3,
        PORT4
    }
    export enum IQ_Motor_Mode{
        //% block="滑行"
        Mode1,
        //% block="中刹车"
        Mode2,
        //% block="锁住"
        Mode3
    }
    /*
                 R/W   Regadd Port   Mode
    初始化马达   0x01   0x42   port   0x00
    设置马达速度 0x01   0x42   port   0x01
    设置马达模式 0x01   0x42   port   0x02
    设置转动角度 0x01   0x42   port   0x03
    */

    //% block="初始化IQ马达 端口%port"
    //% group="控制IQ马达"
    export function Init_IQ_Motor(port:IQ_PORT){
        let cmd=pins.createBuffer(4);
        cmd[0]=0x01;
        cmd[1]=0x42;
        cmd[2]=port;
        cmd[3]=0x00;
        pins.i2cWriteBuffer(0x70,cmd,false);
        basic.pause(20);
    }
    //% block="设置端口%port 马达速度 %speed"
    //% group="控制IQ马达" speed.defl=50 speed.max=100 speed.min=-100
    export function Set_IQ_Motor_Speed(port:IQ_PORT,speed:number){
        let cmd=pins.createBuffer(4);
        cmd[0]=0x01;
        cmd[1]=0x42;
        cmd[2]=port;
        cmd[3]=0x01;
        pins.i2cWriteBuffer(0x70,cmd,false);
        let params=pins.createBuffer(1);
        params[0]=speed;
        pins.i2cWriteBuffer(0x70,params,false);
        basic.pause(20);
    }
    //% block="端口%port 马达转动速度%speed|角度%target|°"
    //% group="控制IQ马达" speed.max=100 speed.min=-100
    export function Set_IQ_Motor_Target(port:IQ_PORT,speed:number,target:number){
        let cmd=pins.createBuffer(4);
        cmd[0]=0x01;
        cmd[1]=0x42;
        cmd[2]=port;
        cmd[3]=0x03;
        pins.i2cWriteBuffer(0x70,cmd,false);
        let params=pins.createBuffer(3);
        params[0]=speed;
        params[1]=target*960/360>>8&0xff;
        params[2]=target*960/360&0xff;
        pins.i2cWriteBuffer(0x70,params,false);
        basic.pause(20);
    }
    // //% block="端口%port 马达模式%mode"
    // //% group="控制IQ马达"
    // export function Set_IQ_Motor_Mode(port:IQ_PORT,mode:IQ_Motor_Mode){

    // }
    //——————————————————————————————————————————————

    //% block="自动标定循线传感器"
    //% shim=Cube::Init_sensor 
    //% group="综合技能"
    export function Init_sensor(){
        basic.pause(3000)
        return 
    }
    
    // //% block="直线距离标定%param"
    // //% 
    // //% group="综合技能"
    // export function straight_correct(param:number){
    //     return 
    // }

    // //% block="转向角度标定%param"
    // //% 
    // //% group="综合技能"
    // export function turn_correct(param:number){
    //     return 
    // }
    
    //% block="获取循线传感器数值"
    //% group="综合技能"
    export function Read_GraySensors(){
        let cmd=pins.createBuffer(4);
        cmd[0]=0x00;
        cmd[1]=0x45;
        cmd[2]=0x00;
        cmd[3]=0x00;
        pins.i2cWriteBuffer(0x70,cmd,false);
        return pins.i2cReadBuffer(0x70,6,false);
    }

    //% block="循线到%end_type||是否等待到达%mode速度%speed"
    //% shim=Cube::follow_line 
    //% group="综合技能"
    //% expandableArgumentMode="toggle"
    //% mode.defl=1
    //% speed.defl=100 speed.max=255 speed.min=70
    export function follow_line(end_type:End_TYPE,mode?:Is_Wait,speed?:number){
        return 
    }
    
    //% block="循线到第%count个路口|速度%speed||是否等待到达%mode"
    //% shim=Cube::follow_line_n 
    //% group="综合技能"
    //% expandableArgumentMode="toggle"
    //% count.defl=3
    //% speed.defl=100 speed.max=100 speed.min=70
    export function follow_line_n(count:number,speed:number,mode?:Is_Wait){
        return 
    }

    //% block="循线完成"
    //% shim=Cube::is_arrive_end
    //% group="综合技能"
    export function is_arrive_end():boolean{
        return true
    }
    
    /**
     * 立即停止循线（仅在非等待模式下有效）
     */
    //% block="停止循线"
    //% shim=Cube::break_follow
    //% group="综合技能"
    export function break_follow(){
        return 
    }

    /**
     * 
     * @param angle 旋转的角度，顺时针为正，逆时针为负
     */
    //% block="原地转向%angle°"
    //% shim=Cube::turn_angle
    //% angle.defl=90
    //% group="底盘控制"
    export function turn_angle(angle: number){
        return 
    }    

    /**
     * 
    * @param angle 旋转到指定角度，以开机时车头正对的角度为0°，顺时针为正，设置范围为-180~180
     */
    //% block="原地转向到面向%angle°"
    //% shim=Cube::turn_to_angle
    //% angle.defl=90
    //% group="底盘控制"
    export function turn_to_angle(angle: number){
        return 
    } 

    //% block="底盘控制%dir|距离%dist cm||速度%speed"
    //% shim=Cube::go_distance
    //% dist.defl=30
    //% group="底盘控制"
    //% expandableArgumentMode="toggle"
    //% speed.defl=200 speed.max=600 speed.min=100
    /**
     * 
     * @param dir 方向
     * @param dist 距离
     * @param speed 速度 单位为mm/s
     */
    export function go_distance(dir:Go_Distance, dist: number, speed?:number){
        return 
    }

    // //% block="设置引脚模式%id|%mode"
    // //% shim=Cube::Set_Pin_Mode group="输入输出"
    // export function Set_Pin_Mode(id:GPIO_ID,mode:Pin_MODE){
    //     return
    // }
    // //% block="数字输出 引脚%id 设为%level"
    // //% shim=Cube::Set_Pin_Value group="输入输出"
    // export function Set_Pin_Value(id:GPIO_ID,level:Pin_Level){
    //     return
    // }
    // //% block="模拟输出 引脚%id 设为%pwm"
    // //% shim=Cube::Set_Pin_PWM group="输入输出"
    // export function Set_Pin_PWM(id:GPIO_ID,pwm:number){
    //     return
    // }
    // //% block="数字读取 引脚%id"
    // //% shim=Cube::Get_Pin_Value group="输入输出"
    // export function Get_Pin_Value(id:GPIO_ID){
    //     return 0
    // }

    // //% block="模拟读取 引脚%id"
    // //% shim=Cube::Get_ADC_Value group="输入输出"
    // export function Get_ADC_Value(id:Analog_Pins){
    //     return 0
    // }

    // //% block="初始化%port|为%sensor"
    // //% shim=Cube::Init_Port group="输入输出"
    // export function init_port(port:PORT_ID,sensor:Sensor_ID){
    //     return
    // }
    
    // //% block="读取%port|上的%sensor"
    // //% shim=Cube::Get_sensor group="输入输出"
    // export function Get_sensor(port:PORT_ID,sensor:Sensor_ID){
    //     return 0
    // }

    // //% block="启动马达%id|方向%dir|速度%pwm"
    // //% shim=Cube::Motor pwm.defl=0 pwm.min=0 pwm.max=255 inlineInputMode=inline
    // //% group="基本功能"
    // export function Motor(id:Motor_ID,dir:Motor_Dir,pwm:number){
    //     return
    // }

    
    // //% block="马达%id|%dir|速度%pwm|运行%delay毫秒后停止"
    // //% shim=Cube::Motor_with_delay pwm.defl=100 pwm.min=0 pwm.max=255 delay.defl=500 inlineInputMode=inline
    // //% group="基本功能"
    // export function Motor_with_delay(id:Motor_ID,dir:Motor_Dir,pwm:number,delay:number){
    //     return
    // }

    // export enum SERVOS{
    //     S1,
    //     S2
    // }
    // //% block="设置舵机%servo角度%angle|等待%delay毫秒"
    // //% group="基本功能" angle.min=0 angle.max=180
    // export function setServo(servo:SERVOS,angle:number,delay:number) {
    //     if(servo==SERVOS.S1)
    //         pins.servoWritePin(AnalogPin.P8,angle);
    //     else if(servo==SERVOS.S2)
    //         pins.servoWritePin(AnalogPin.P12,angle);
    //     basic.pause(delay);
    // }

    // //% block="LED计数器 显示%n"
    // //% group="基本功能"
    // export function LED_Counter(n:number){
    //     basic.clearScreen()
    //     let strip = neopixel.create(DigitalPin.P15, 5, NeoPixelMode.RGB)
    //     strip.showColor(0x000000)
    //     strip.show()
    //     if(n>0){
    //         let cnt=Math.floor(n/25);
    //         let remain = n%25;
    //         if(cnt>0){  
    //             for(let i=0;i<cnt;i++)
    //                 strip.setPixelColor(i,neopixel.rgb(20,20,20))
    //             strip.show()
    //         }
    //         for(let x=0;x<5;x++){
    //             for(let y=0;y<5;y++){
    //                 led.plot(y,x);
    //                 if(remain--==1)
    //                     return;
    //             }
    //         }
    //     }
    //     else
    //         return
    // }

    //% block="读取陀螺仪数据%dir"
    //% shim=Cube::Get_Imu 
    //% advanced=true
    export function Get_Imu(dir:IMU_AXIS){
        return 0
    }
    
    // //% block="初始化底盘 左马达%left|右马达%right"
    // //% shim=Cube::Set_move_base group="底盘控制"
    // export function Set_move_base(left:Motor_ID,right:Motor_ID){
    //     return
    // }

    //% block="底盘控制 %dir|速度%speed||运行%time毫秒后停止"
    //% shim=Cube::move_base group="底盘控制" time.defl=0 speed.defl=100 speed.min=0 speed.max=255
    //% expandableArgumentMode="toggle"
    export function move_base(dir:Move_base_dir, speed:number, time?:number){
        return
    }

    //% block="设置 左马达%left| 右马达%right 速度（±255）"
    //% left.min=-255 left.max=255 right.min=-255 right.max=255
    //% shim=Cube::move_motor group="底盘控制"
    export function move(left:number, right:number){
        return
    }

    // //% block="设置 左轮%left| 右轮%right 速度mm/s（±800）"
    // //% left.min=-800 left.max=800 right.min=-800 right.max=800
    // //% shim=Cube::move_motor_close group="底盘控制"
    // export function move_close(left:number, right:number){
    //     return
    // }

    //% block="总线舵机控制|ID %ID|角度 %value|时间 %time ms"
    //% time.defl=500 time.min=0
    //% value.min=0 value.max=180
    //% num.fieldEditor="gridpicker" num.fieldOptions.columns=4
    //% advanced=true
    export function bus_Servo(ID: number, value: number, time: number): void {
        if(!BUS_SERVO_ENABLE){
            serial.redirect(SerialPin.P8,SerialPin.P12,115200);
            BUS_SERVO_ENABLE=true;
        }
        serial.writeString("#");
        if(ID<10)
            serial.writeString("00");
        else if(ID<100)
            serial.writeString("0");
        serial.writeNumber(ID);
        serial.writeString("P");
        let pwm=Math.map(value,0,180,500,2500);
        pwm=Math.round(pwm);
        if(pwm<1000){
            serial.writeString("0");
        }
        serial.writeNumber(pwm);
        serial.writeString("T");
        if(time<1000){
            serial.writeString("0");
        }
        serial.writeNumber(time);
        serial.writeString("!");
    }

    //% shim=Cube::test
    export function test(){
        return 0
    }
}
