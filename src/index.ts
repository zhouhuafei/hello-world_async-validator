import Schema, { Rules } from 'async-validator'

async function validationTrigger (formFields, formRules) {
  return await new Schema(formRules).validate(formFields, {
    first: false, // 开启后，若某个字段校验没通过，则停止下一个字段的校验。
    firstFields: false // 开启后，若某个字段的某个规则校验没通过，则停止下一个规则的校验，而后继续下一个字段的校验。
  }).then(() => undefined).catch((err) => err.errors)
}

const formFields = {
  id: undefined,
  name: '',
  weight: '',
  specifications: []
}
const formRules: Rules = {
  name: [
    {
      required: true,
      whitespace: true, // 先去除首尾空格再进行校验 - 不会改变原始值 - 打接口时还需自行处理首尾空格或在输入框输入时不允许输入首尾空格
      message: '名称必填'
    }
  ],
  weight: [
    {
      // 虽然期望值是number - 但是并不建议配置上type - 否则填入任何字符串都报必填
      required: true,
      message: '重量必填'
    },
    {
      validator: (rule, value, cb) => {
        value = +value
        const max = 9
        const min = 1
        if (isNaN(value)) {
          return cb('重量需要输入数字')
        } else if (value > max) {
          return cb(`重量不能大于${max}`)
        } else if (value < min) {
          return cb(`重量不能小于${min}`)
        }
        cb()
      }
    }
  ],
  specifications: (() => {
    const min = 3
    const max = 6
    const type = 'array' // 不配置这个则min和max校验通不过
    return [
      { type, required: true, message: '规格必填' },
      { type, min, max, message: `至少${min}个规格 至多${max}个规格` },
      {
        type,
        defaultField: {
          type: 'object',
          fields: {
            inventory: [
              { type: 'number', required: true, message: '库存必填' }
            ]
          }
        }
      }
    ]
  })()
}

async function save () {
  console.log('')
  console.log('模拟进入新增页，未进行任何操作，直接点击保存按钮')
  const addRes = await validationTrigger(formFields, formRules)
  console.log('被校验的数据', formFields)
  if (addRes) {
    console.log('校验未通过', addRes)
  } else {
    console.log('校验通过')
  }
  console.log('\n======================== 分割线 ========================\n')
  console.log('模拟进入编辑页，接口响应了之后，直接点击保存按钮')
  Object.assign(formFields, {
    id: 1,
    name: '商品名称',
    weight: 5,
    specifications: [
      { id: 11, name: '红色', inventory: 2 },
      { id: 12, name: '蓝色', inventory: 2 },
      { id: 13, name: '紫色', inventory: 2 }
    ]
  })
  const editRes = await validationTrigger(formFields, formRules)
  console.log('被校验的数据', formFields)
  if (editRes) {
    console.log('校验未通过', editRes)
  } else {
    console.log('校验通过')
  }
}

save().then()

// ...TODO 如何只校验某一个字段？ - 摘取规则中的某一项？
// ...TODO 如何只校验数组中对象的某一个字段？ - 怎么摘取？
