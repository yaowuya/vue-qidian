const schedule = require('node-schedule')
const spiderUtils = require('./spiderUtils')
const utils = require('../../utils/utils')
const mongoose = require('mongoose')

const chapter = mongoose.model('Chapter')
let chapterId = ''

const scheduleCronstyle = () => {
  //在每小时的30分运行定时任务
  let rule = new schedule.RecurrenceRule()
  // rule.hour = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]

  /**
   *如果仅仅设置了hour，定时任务并不会如期望的一样在每小时的0分时运行，而是每分钟都会运行！！！
   因此，如果你希望在每小时的固定分钟运行，就一定要设置minute！！！
   */
  // rule.minute = 30
//通过数组在多个时刻运行
  rule.minute = []
  for (let i = 0; i < 60; i=i+4) {
    rule.minute.push(i)
  }
  // rule.minute = [1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]

  //每小时的30分1秒触发:
  schedule.scheduleJob(rule, () => {
    spiderUtils.updateChapterContent()
    console.log('--------------------schedule------------------------' + utils.formatTime('Y-M-D h:m:s'))
  })
}

module.exports = {
  scheduleCronstyle: scheduleCronstyle
}

