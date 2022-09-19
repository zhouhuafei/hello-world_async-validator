import Schema, { ValidateOption, Rules, RuleItem } from 'async-validator'

export { Schema, ValidateOption, Rules, RuleItem }

// 校验表单中的所有字段
export async function validateAllFormFields (formFields: object, formRules: Rules, option: ValidateOption = {}) {
  // option.keys = ['name'] // 只校验name，适用于只校验某一项字段的场景，但是，但是，但是，对嵌套的属性无效。所以有点鸡肋。
  option.first = option.first || false // 开启后，若某个字段校验没通过，则停止下一个字段的校验。
  option.firstFields = option.firstFields || true // 开启后，若某个字段的某个规则校验没通过，则停止下一个规则的校验，而后继续下一个字段的校验。
  return await new Schema(formRules)
    .validate(formFields, option)
    .then(() => ({}))
    .catch((err: any) => err.errors.reduce((c: any, v: any) => {
      return { ...c, [v.field]: v.message }
    }, {}))
}

// 金额
// { validator: (rule: any, value: any, callback: any): any => moneyNumber(rule, value, callback) }
export function moneyNumber (rule: any, value: any, callback: any, ext: any = {}) {
  const { min, max } = ext

  value = String(value)

  if (!value) return callback()

  if (!/(^[1-9]\d*(\.\d{1,2})?$)|(^0\.\d{1,2}$)|(^0$)/.test(value)) {
    return callback(new Error('格式有误，只允许输入合法的数字且最多保留两位小数'))
  }

  if (min && +value < +min) {
    return callback(new Error(`不能小于${min}`))
  }

  if (max && +value > +max) {
    return callback(new Error(`不能大于${max}`))
  }

  callback()
}

// 自然数
// { validator: (rule: any, value: any, callback: any): any => naturalNumber(rule, value, callback) }
export function naturalNumber (rule: any, value: any, callback: any, ext: any = {}) {
  const { min, max } = ext

  value = String(value)

  if (!value) return callback()

  if (!/(^[1-9]\d*$)|(^0$)/.test(value)) {
    return callback(new Error('格式有误，只允许合法的数字'))
  }

  if (min && +value < +min) {
    return callback(new Error(`不能小于${min}`))
  }

  if (max && +value > +max) {
    return callback(new Error(`不能大于${max}`))
  }

  callback()
}
