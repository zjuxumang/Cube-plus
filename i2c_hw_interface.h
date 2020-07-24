// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

#ifndef INFINITE_CUBE_I2C_HW_INTERFACE_H_
#define INFINITE_CUBE_I2C_HW_INTERFACE_H_

#include "MicroBitI2C.h"
class CubeI2C{
  public:
    CubeI2C(MicroBitI2C* i2c_port, uint8_t address);
    uint32_t I2CRead(uint8_t reg_address, uint8_t* temp, uint8_t size=1,uint8_t arg1=0,uint8_t arg2=0);
    uint32_t I2CRead2Byte(uint8_t reg_address, uint8_t* temp);
    uint32_t I2CWrite(uint8_t reg_address, uint8_t value1, uint8_t value2=0);
    uint32_t I2CWrite2Byte(uint8_t value1, uint8_t value2);
    CubeI2C(const CubeI2C&) = delete;
    CubeI2C& operator=(const CubeI2C &) = delete;

  private:
    MicroBitI2C* i2c_port_ = nullptr;
    uint8_t Addr;
  protected:
};

#endif

