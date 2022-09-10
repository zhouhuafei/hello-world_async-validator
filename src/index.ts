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
    { required: true, message: '名称必填' }
  ],
  weight: [
    { required: true, message: '重量必填' },
    {
      validator: (rule, value, cb) => {
        const max = 9
        const min = 1
        if (value > max) {
          return cb(new Error(`重量不能大于${max}`).message)
        } else if (value < min) {
          return cb(new Error(`重量不能小于${min}`).message)
        }
        cb()
      }
    }
  ],
  specifications: [
    { required: true, message: '规格必填' }
  ]
}

async function save () {
  console.log('模拟进入新增页，未进行任何操作，直接点击保存按钮')
  const addRes = await validationTrigger(formFields, formRules)
  if (addRes) {
    console.log('新增校验未通过', addRes)
  } else {
    console.log('新增校验通过')
  }

  console.log('模拟进入编辑页，接口响应了之后，直接点击保存按钮')
  Object.assign(formFields, {
    id: 1,
    name: '商品名称',
    weight: 5,
    specifications: [
      { id: 11, value: '红色' },
      { id: 12, value: '蓝色' }
    ]
  })
  const editRes = await validationTrigger(formFields, formRules)
  if (editRes) {
    console.log('编辑校验未通过', editRes)
  } else {
    console.log('编辑校验通过')
  }
}

save().then()
