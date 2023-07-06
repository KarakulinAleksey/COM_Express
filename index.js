
// Получить все последовательные порты в системе
// SerialPort.list().then(ports => console.log(ports));

const { SerialPort, ReadlineParser } = require('serialport');
const express = require('express');
const mongoose = require('mongoose');
const analogValue = require('./models/analogValue');
const currentAlalogValue = require('./models/currentAnalogValue');

const app = express();
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});



mongoose.connect('mongodb://0.0.0.0:27017/iisdb', {
  useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false
})
.then(()=>console.log('Mongo_OK'))
.catch((e)=>console.log(e));

app.get('/', (reg, res) => {
  currentAlalogValue.findOne({name: "1_1_0"})
    .then(value => res.send({value_1_1_0: value}))
    .catch(err => res.status(500).send({message: "Произошла ошибка"}));
});

//объект конфигурации модулей
const configurationModule = {
    // 1:['#010','#011','#012','#013','#014','#015','#016','#017'],
    // 2:['#020','#021','#022','#023','#024','#025'],
    1: '#01',
    2: '#02',

}
//объект конфигурации каналов
const configurationChanels = {
  '1_0':{
    nameChannel: 'Температура перегретого пара №1',
    idNameChannel: '1_1_0',
    typeChannel: 'xk',
    inValMin: 0,
    inValMax: 0,
    outValMin: 0,
    outValMax: 0,
    round: 0,

  },
  '1_1':{
    nameChannel: 'Давление перегретого пара №1',
    idNameChannel: '1_1_1',
    typeChannel: '4-20',
    inValMin: 4,
    inValMax: 20,
    outValMin: 0,
    outValMax: 100,
    round: 1,

  },
  '1_2':{
    nameChannel: 'Расход перегретого пара №1',
    idNameChannel: '1_1_2',
    typeChannel: 'square',
    inValMin: 4,
    inValMax: 20,
    outValMin: 0,
    outValMax: 100,
    round: 2,

  },
  '1_3':{
    nameChannel: 'Температура перегретого пара №1',
    idNameChannel: '1_1_3',
    typeChannel: 'xk',
    inValMin: 0,
    inValMax: 0,
    outValMin: 0,
    outValMax: 0,
    round: 0,

  },
  '1_4':{
    nameChannel: 'Давление перегретого пара №1',
    idNameChannel: '1_1_4',
    typeChannel: '4-20',
    inValMin: 4,
    inValMax: 20,
    outValMin: 0,
    outValMax: 100,
    round: 1,

  },
  '1_5':{
    nameChannel: 'Расход перегретого пара №1',
    idNameChannel: '1_1_5',
    typeChannel: 'square',
    inValMin: 4,
    inValMax: 20,
    outValMin: 0,
    outValMax: 100,
    round: 2,

  },
  '1_6':{
    nameChannel: 'Температура перегретого пара №1',
    idNameChannel: '1_1_6',
    typeChannel: 'xk',
    inValMin: 0,
    inValMax: 0,
    outValMin: 0,
    outValMax: 0,
    round: 3,

  },
  '1_7':{
    nameChannel: 'Давление перегретого пара №1',
    idNameChannel: '1_1_7',
    typeChannel: '4-20',
    inValMin: 4,
    inValMax: 20,
    outValMin: 0,
    outValMax: 100,
    round: 0,

  },
  '2_0':{
    nameChannel: 'Расход перегретого пара №1',
    idNameChannel: '1_2_0',
    typeChannel: 'square',
    inValMin: 4,
    inValMax: 20,
    outValMin: 0,
    outValMax: 100,
    round: 0,

  },
  '2_1':{
    nameChannel: 'Расход перегретого пара №1',
    idNameChannel: '1_2_1',
    typeChannel: 'square',
    inValMin: 4,
    inValMax: 20,
    outValMin: 0,
    outValMax: 100,
    round: 1,

  },
  '2_2':{
    nameChannel: 'Расход перегретого пара №1',
    idNameChannel: '1_2_2',
    typeChannel: 'square',
    inValMin: 4,
    inValMax: 20,
    outValMin: 0,
    outValMax: 100,
    round: 2,

  },
  '2_3':{
    nameChannel: 'Температура перегретого пара №1',
    idNameChannel: '1_2_3',
    typeChannel: 'xk',
    inValMin: 0,
    inValMax: 0,
    outValMin: 0,
    outValMax: 0,
    round: 0,

  },
  '2_4':{
    nameChannel: 'Давление перегретого пара №1',
    idNameChannel: '1_2_4',
    typeChannel: '4-20',
    inValMin: 4,
    inValMax: 20,
    outValMin: 0,
    outValMax: 100,
    round: 1,

  },
  '2_5':{
    nameChannel: 'Расход перегретого пара №1',
    idNameChannel: '1_2_5',
    typeChannel: 'square',
    inValMin: 4,
    inValMax: 20,
    outValMin: 0,
    outValMax: 100,
    round: 2,

  },
}

//глобальная переменная для хранения ключа адреса модуля в configurationModule
let addressModule = 1;
// let i = 0;
//глобальная переменная для хранения массива поличенных значений с ComPort
const arrModule = [];

//разделитель сообщений из com-порта
const parser = new ReadlineParser({
  delimiter: '>',
})

const port = new SerialPort({
  path:'com19',
  baudRate: 9600,
})

//функция записи в comPort команды для чтения данных модуля
const setCommandModule = (configurationModule) => {
  // function setCommandModule(configurationModule){

    // if (i < module[addressModule].length - 1){
    //   i = i + 1;
    // } else {
    //   i = 0;
    //   addressModule = addressModule + 1;
    //   if (addressModule > Object.keys(module).length){
    //     addressModule = 1;
    //   }
    // }
    port.write(`${configurationModule[addressModule]}\r`);

    addressModule = addressModule + 1;
      if (addressModule > Object.keys(configurationModule).length){
        addressModule = 1;
      }
    // console.log('#024\r\n');
    // console.log(addressModule, i, `${module[addresLine][i]}`);
    // port.write(`#01${i}\r\n`);
    // port.write('#02\r');
    // port.write(`${module[addresLine][i]}\r`);
  }

//По таймеру записываем команды в comPort
setInterval(setCommandModule, 1000, configurationModule);

//функция которая преобразует строку полученную с comPort в массив
const setArrModule = (valCom) => {
  arrModule.length = 0; //очищаем массив
  let indexArrModule = 0;
  for (let i = 0; i < valCom.length - 1; i = i + 7){

    arrModule[indexArrModule] = valCom.slice(i, i+7);
    indexArrModule++;
  }
  // console.log(arrModule);
  return arrModule
}

//функция пересчета токового сигнала в физическую величину
const convertAmperageToValue = (currentVal, inValMin, inValMax, outValMin, outValMax, round) => {
  return ((outValMax-outValMin)*((currentVal-inValMin)/(inValMax-inValMin))+outValMin).toFixed(round);
}

//функция пересчета токового сигнала в физическую величину (квадратичная зависимость)
const convertAmperageSquareToValue = (currentVal, inValMin, inValMax, outValMin, outValMax, round) => {
  return (Math.sqrt((outValMax-outValMin)*((currentVal-inValMin)/(inValMax-inValMin))+outValMin)).toFixed(round);
}

const convertTXK = (currentVal, round) => {
  return (currentVal * 10).toFixed(round);
}

//функция выбора правила пересчета для канала в зависимости от типа
const setChannelValue = (typeChannel, currentVal, inValMin, inValMax, outValMin, outValMax, round) => {
  let channelValue;
  switch (typeChannel){
    case '4-20':
      channelValue = convertAmperageToValue(currentVal, inValMin, inValMax, outValMin, outValMax, round);
      break;
    case 'square':
      channelValue = convertAmperageSquareToValue(currentVal, inValMin, inValMax, outValMin, outValMax, round);
      break;
    case 'xk':
      channelValue = convertTXK(currentVal, round);
      break;
  }
  return channelValue;
}

//функция для получения значений из comPort
const getValueComPort = (valCom)=>{
  console.log(addressModule);
  // console.log(valCom.length);
  console.log(valCom);
  let arrModule = setArrModule(valCom); //создание массива из данных с com-порта
  arrModule.forEach((item, index)=>{

    let typeChannel = configurationChanels[`${addressModule}_${index}`].typeChannel;
    let idNameChannel = configurationChanels[`${addressModule}_${index}`].idNameChannel;
    let inValMin = configurationChanels[`${addressModule}_${index}`].inValMin;
    let inValMax = configurationChanels[`${addressModule}_${index}`].inValMax;
    let outValMin = configurationChanels[`${addressModule}_${index}`].outValMin;
    let outValMax = configurationChanels[`${addressModule}_${index}`].outValMax;
    let round = configurationChanels[`${addressModule}_${index}`].round;
    let strToFloat = Number(item);

    // console.log(idNameChannel, setChannelValue (typeChannel, strToFloat, inValMin, inValMax, outValMin, outValMax, round));
    // analogValue.create({name: idNameChannel,
    //                 current_date: '12/01/01',
    //                 value: setChannelValue (typeChannel, strToFloat, inValMin, inValMax, outValMin, outValMax, round),})
    // .then(value => console.log(value))
    // .catch(err=> console.log(err));

    currentAlalogValue.findOneAndUpdate({name: idNameChannel},
                                        {value: setChannelValue (typeChannel, strToFloat, inValMin, inValMax, outValMin, outValMax, round),
                                         $currentDate: {current_date: true}
                                        },
                                        {
                                          new: true, // обработчик then получит на вход обновлённую запись
                                          // runValidators: true, // данные будут валидированы перед изменением
                                          upsert: true // если пользователь не найден, он будет создан
                                        })
    .then(value => console.log(value))
    .catch(err=> console.log(err));

  });

}

//читаем информацию с comPort
port.pipe(parser);
port.on('open', () => console.log('Port open'));
parser.on('data', getValueComPort);



