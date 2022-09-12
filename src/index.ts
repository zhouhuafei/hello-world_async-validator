import { validateAllFormFields, Rules } from './async-validator'

const formFields = {
  id: undefined,
  name: '',
  weight: '',
  ext: { source: '' },
  specifications: []
}
const formRules: Rules = {
  name: [
    {
      required: true,
      // 先去除首尾空格再进行校验 - 不会改变原始值 - 打接口时还需自行处理首尾空格或在输入框输入时不允许输入首尾空格
      whitespace: true,
      message: '名称必填'
    }
  ],
  weight: [
    {
      // 非嵌套的时候 - type是number - 不建议填写 - 否则填入任何字符串都报必填
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
  ext: { type: 'object', fields: { source: [{ required: true, message: '来源必填' }] } },
  specifications: (() => {
    const min = 3
    const max = 6
    const type = 'array' // 不配置这个则min和max校验通不过
    const inventoryMin = 2
    const inventoryMax = 6
    const inventoryType = 'number'
    return [
      { type, required: true, message: '规格必填' },
      { type, min, max, message: `至少${min}个规格 至多${max}个规格` },
      {
        type,
        defaultField: {
          type: 'object',
          fields: {
            inventory: [
              // 嵌套的时候 - type是number - 需要填写 - 否则填入任何数字都报必填
              { type: inventoryType, required: true, message: '库存必填' },
              {
                type: inventoryType,
                min: inventoryMin,
                max: inventoryMax,
                message: `至少${inventoryMin}件库存 至多${inventoryMax}件库存`
              }
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
  const addRes = await validateAllFormFields(formFields, formRules)
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
    ext: { source: '京东' },
    specifications: [
      { id: 11, name: '红色', inventory: 9 },
      { id: 12, name: '蓝色', inventory: 9 },
      { id: 13, name: '紫色', inventory: 9 }
    ]
  })
  const editRes = await validateAllFormFields(formFields, formRules)
  console.log('被校验的数据', formFields)
  if (editRes) {
    console.log('校验未通过', editRes)
  } else {
    console.log('校验通过')
  }
}

save().then()
