import { Rules, RuleItem, validateAllFormFields } from './async-validator'

const formFields = {
  id: undefined,
  name: '',
  weight: '',
  ext: { source: '' },
  specifications: []
}
const getInventoryRule = (): RuleItem[] => {
  const type = 'number'
  const min = 2
  const max = 6
  return [
    { type: type, required: true, message: '库存必填' },
    { type, min, max, message: `至少${min}件库存 至多${max}件库存` }
  ]
}
const formRules: Rules = {
  name: (() => {
    const type = 'string'
    return [
      {
        // 不加type属性时，type默认是'string'。填写个0，false啥的不会报必填。会把其他类型转成字符串。
        // 不加type属性时，type默认是'string'。但是若存在whitespace属性，不管其值是false还是true。填写个0，false啥的会报必填。不会把其他类型转成字符串。
        // 加了type属性时，当其值为undefined或者'string'时。填写个0，false啥的会报必填。不会把其他类型转成字符串。
        type,
        required: true,
        // 先去除首尾空格再进行校验，不会改变原始值，打接口时还需自行处理首尾空格或在输入框输入时不允许输入首尾空格。
        whitespace: true,
        message: '名称必填'
      }
    ]
  })(),
  weight: (() => {
    const type = 'number'
    return [
      { type, required: true, message: '重量必填' },
      {
        type,
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
    ]
  })(),
  ext: (() => {
    const type = 'string'
    return { type: 'object', fields: { source: [{ type, required: true, message: '来源必填' }] } }
  })(),
  specifications: (() => {
    const type = 'array' // 不配置这个则min和max校验通不过。还有个len。他们三个针对数组和字符串时，表示长度。针对数字时表示大小。
    const min = 3
    const max = 6
    return [
      { type, required: true, message: '规格必填' },
      { type, min, max, message: `至少${min}个规格 至多${max}个规格` },
      { type, defaultField: { type: 'object', fields: { inventory: getInventoryRule() } } }
    ]
  })()
}
let formErrors = {}

async function save () {
  console.log('')
  console.log('模拟进入新增页，未进行任何操作，直接点击保存按钮')
  formErrors = await validateAllFormFields(formFields, formRules)
  console.log('被校验的数据', formFields)
  if (formErrors) {
    console.log('校验未通过', formErrors)
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
  formErrors = await validateAllFormFields(formFields, formRules)
  console.log('被校验的数据', formFields)
  if (formErrors) {
    console.log('校验未通过', formErrors)
  } else {
    console.log('校验通过')
  }
  console.log('\n======================== 分割线 ========================\n')
  console.log('模拟再次进入编辑页，接口响应了之后，编辑了第一条规格的库存后，对第一条规格的库存进行校验')
  formFields.specifications[0].inventory = 4
  const tempName = 'specifications.0.inventory'
  const tempValue = formFields.specifications[0].inventory
  const tempFormFields = { [tempName]: tempValue }
  const tempFormRules = { [tempName]: getInventoryRule() }
  const tempFormErrors = await validateAllFormFields(tempFormFields, tempFormRules)
  console.log('单独被校验的数据', tempFormFields)
  if (tempFormErrors) {
    console.log('单独校验未通过', formErrors)
  } else {
    console.log('单独校验通过')
    delete formErrors[tempName]
  }
  if (formErrors) {
    console.log('整体校验未通过', formErrors)
  } else {
    console.log('整体校验通过')
  }
}

save().then()
