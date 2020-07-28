#include "pxt.h"
#include "i2c_hw_interface.h"
using namespace pxt;

namespace Cube {
    typedef union{
        struct{
            uint8_t D_pin:3;
            uint8_t A_pin:3;
        };
        uint8_t Port_reg_value;
    }Port_Reg;
    typedef union{
        struct{
            uint8_t PORT_A:4;
            uint8_t PORT_B:4;
        };
        struct{
            uint8_t PORT_C:4;
            uint8_t PORT_D:4;
        };
        uint8_t Port_reg_value;
    }Device_Reg;
    CubeI2C* i2c=new CubeI2C(&uBit.i2c,0x70);
    uint8_t Left_wheel=2;
    uint8_t Right_wheel=0;
    uint8_t data[16]={0};
    void wait_for_cmd_finish(uint16_t timeout=500){
        uint8_t is_finish=1;
        while(1){
            wait_ms(timeout);
            if(i2c->I2CRead(0x80,&is_finish)!=0)
                continue;
            else
                if(!is_finish)
                    break;
        }
    }
    //%
    void Init() {
        uint8_t temp;
        uint8_t err_cnt=0;
        while(i2c->I2CRead(0x01,&temp)!=0)
        {
            if(err_cnt++>20)
            {
                uBit.display.scroll("init error");
                uBit.reset();
            }
            wait_ms(10);
        }
        // while(i2c->I2CRead(0x02,&temp)==0);
        // i2c->I2CWrite(0x03,1);
    }
    //%
    int test() {
        uint8_t temp;
        return i2c->I2CRead(0x01,&temp);
    }
    //%
    void Motor(int id,int dir,int pwm){        
        i2c->I2CWrite(0x34+id,dir,pwm);
    }

    //%
    void Motor_with_delay(int id,int dir,int pwm,int delay){        
        i2c->I2CWrite(0x34+id,dir,pwm);
        wait_ms(delay);
        i2c->I2CWrite(0x34+id,dir,0);
    }
    //%
    void Set_move_base(int left,int right){
        Left_wheel=left;
        Right_wheel=right;
        Motor(Left_wheel,0,0);
        Motor(Right_wheel,0,0);
    }
    //%
    void move_base(int dir, int speed,int time){
        if(Left_wheel<4&&Right_wheel<4){
            switch(dir){
                case 1:
                    Motor(Left_wheel,1,speed);
                    Motor(Right_wheel,1,speed);
                    if(time!=0){
                        wait_ms(time);
                        Motor(Left_wheel,0,0);
                        Motor(Right_wheel,0,0);
                    }
                    break;
                case 2:
                    Motor(Left_wheel,2,speed);
                    Motor(Right_wheel,2,speed);
                    if(time!=0){
                        wait_ms(time);
                        Motor(Left_wheel,0,0);
                        Motor(Right_wheel,0,0);
                    }
                    break;
                case 3:
                    Motor(Left_wheel,2,speed);
                    Motor(Right_wheel,1,speed);
                    if(time!=0){
                        wait_ms(time);
                        Motor(Left_wheel,0,0);
                        Motor(Right_wheel,0,0);
                    }
                    break;
                case 4:
                    Motor(Left_wheel,1,speed);
                    Motor(Right_wheel,2,speed);
                    if(time!=0){
                        wait_ms(time);
                        Motor(Left_wheel,0,0);
                        Motor(Right_wheel,0,0);
                    }
                    break;
                case 0:
                    Motor(Left_wheel,0,speed);
                    Motor(Right_wheel,0,speed);
                    if(time!=0){
                        wait_ms(time);
                        Motor(Left_wheel,0,0);
                        Motor(Right_wheel,0,0);
                    }
                    break;
            }
        }
    }
    //%
    void move_motor(int left,int right){
        uint8_t left_dir=left>0?1:2;
        uint8_t right_dir=right>0?1:2;
        Motor(Left_wheel,left_dir,abs(left));
        Motor(Right_wheel,right_dir,abs(right));
    }
    //%
    void move_motor_close(int left,int right){
        i2c->I2CWrite(0x58,(uint8_t)(left>>8),(uint8_t)(left&0x00ff));
        i2c->I2CWrite(0x59,(uint8_t)(right>>8),(uint8_t)(right&0x00ff));
    }

    //%
    int Get_Imu(int dir){
        uint8_t data_buf[2];
        int16_t data=0;
        if(i2c->I2CRead2Byte(0x10+dir*2,data_buf)!=0)
            return 0xffee;
        data=data_buf[0];
        data=(data<<8)|data_buf[1];
        return data/100;
    }
    //%
    void Set_Pin_Mode(int id,int mode){
        Port_Reg port;
        i2c->I2CRead(0x05+id/2,&port.Port_reg_value);
        if(id%2==0)
        {
            if(mode!=port.D_pin)
            {
                port.D_pin=mode;
                i2c->I2CWrite(0x05+id/2,port.Port_reg_value);
            }    
        }
        else
        {
            if(mode!=port.A_pin)
            {
                port.A_pin=mode;
                i2c->I2CWrite(0x05+id/2,port.Port_reg_value);
            }
        }
        wait_us(25);    
    }
    //%
    void Set_Pin_Value(int id,int value){
        uint8_t temp;
        i2c->I2CRead(0x09,&temp);
        if(value!=(temp&0x01<<id))
        {
            temp=temp^(0x01<<id);
            i2c->I2CWrite(0x09,temp);
        }    
    }
    //%
    void Set_Pin_PWM(int id,int pwm){
        i2c->I2CWrite(0x20+id,pwm);    
    }
    //%
    int Get_Pin_Value(int id){
        uint8_t temp[2]={0};
        while(i2c->I2CRead2Byte(0x09,temp)!=0)
            wait_ms(1);
        return (temp[1]<<8|temp[0])>>id&0x01;
    }
    //%
    int Get_ADC_Value(int id){
        uint8_t temp[2]={0};
        uint8_t ret = i2c->I2CRead2Byte(0x16+id,temp);
        if(ret==0)
            return (uint16_t)temp[0]<<8|temp[1]; 
        else
            return ret;
        
    }
    //%
    void Init_Port(int port_id,int sensor_id){
        Device_Reg reg;
        if(port_id<2){
            i2c->I2CRead(0x28,&reg.Port_reg_value);
            if(port_id==0){
                if(sensor_id!=reg.PORT_A){
                    reg.PORT_A=sensor_id;
                    i2c->I2CWrite(0x28,reg.Port_reg_value);
                }
            }
            else{
                if(sensor_id!=reg.PORT_B){
                    reg.PORT_B=sensor_id;
                    i2c->I2CWrite(0x28,reg.Port_reg_value);
                }
            }
        }
        else{
            i2c->I2CRead(0x29,&reg.Port_reg_value);
            if(port_id==2){
                if(sensor_id!=reg.PORT_C){
                    reg.PORT_C=sensor_id;
                    i2c->I2CWrite(0x29,reg.Port_reg_value);
                }
            }
            else{
                if(sensor_id!=reg.PORT_D){
                    reg.PORT_D=sensor_id;
                    i2c->I2CWrite(0x29,reg.Port_reg_value);               
                }
            }
        }
    }
    //%
    int Get_sensor(int port_id,int sensor_id){
        uint8_t temp[2]={0};
        i2c->I2CWrite(0x2A,port_id,sensor_id);
        wait_for_cmd_finish(10);
        i2c->I2CRead2Byte(0x2B,temp);
        return (int)temp[0]|temp[1]<<8;
    }

    //%
    void Update_VL53L0X(int begin, int end){
        // uint8_t cmd=0;
        // uint8_t cnt=end-begin+1;
        // cmd=(0x01<<begin)|(0x01<<end);
        // i2c->I2CWrite(0x41,cmd);
        //while(i2c->I2CRead(data, 2*cnt));
        
    }

    //%
    uint16_t Get_VL53L0X(int index){
        uint16_t ret=data[index*2];
        ret=(ret<<8)|data[index*2+1];
        return ret;
    }

    //%
    void Init_sensor(){
        i2c->I2CWrite(0x50,0,0);
        wait_for_cmd_finish();
    }

    //%
    void follow_line(int end_type,int is_wait,int speed){
        i2c->I2CWrite(0x51,end_type,speed);
        if(is_wait&&end_type!=4)
            wait_for_cmd_finish();
    }

    //%
    void follow_line_n(int count,int speed,int is_wait){
        i2c->I2CWrite(0x60,count,speed);
        if(is_wait)
            wait_for_cmd_finish();
    }

    //%
    void turn_angle(int angle){
        i2c->I2CWrite(0x52,(uint8_t)(angle>>8),(uint8_t)(angle&0x00ff));
        wait_for_cmd_finish();
    }
    
    //%
    void turn_to_angle(int angle){
        if(angle==0)
            angle=1;
        i2c->I2CWrite(0x57,(uint8_t)(angle>>8),(uint8_t)(angle&0x00ff));
        wait_for_cmd_finish();
    }

    //%
    void go_distance(int dir, int dist, int speed){
        if(dir==1)
            dist=-dist;
        dist*=10;
        i2c->I2CWrite(0x53,(uint8_t)(dist>>8),(uint8_t)(dist&0x00ff));
        i2c->I2CWrite2Byte((uint8_t)(speed>>8),(uint8_t)(speed&0x00ff));
        wait_for_cmd_finish();
    }

    //%
    void break_follow(){
        i2c->I2CWrite(0x54,0,0);
    }
    void release(){
        i2c->I2CWrite(0x56,0,0);
        wait_ms(300);
    }
    //%
    void suck(int op){
        if(op==0)
        {
            i2c->I2CWrite(0x55,0,0);
            wait_for_cmd_finish();
        }    
        else if(op==1)
            release();
    }

    //%
    int is_arrive_end(){
        uint8_t is_finish;
        i2c->I2CRead(0x80,&is_finish);
            return !is_finish;
    }
}

