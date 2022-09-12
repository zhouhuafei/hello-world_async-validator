import Schema, { ValidateOption, Rules, RuleItem } from 'async-validator'

export { Schema, ValidateOption, Rules, RuleItem }

// 校验表单中的所有字段
export async function validateAllFormFields (formFields, formRules, option: ValidateOption = {}) {
  // option.keys = ['name'] // 只校验name，适用于只校验某一项字段的场景，但是，但是，但是，对嵌套的属性无效。所以有点鸡肋。
  option.first = option.first || false // 开启后，若某个字段校验没通过，则停止下一个字段的校验。
  option.firstFields = option.firstFields || true // 开启后，若某个字段的某个规则校验没通过，则停止下一个规则的校验，而后继续下一个字段的校验。
  return await new Schema(formRules)
    .validate(formFields, option)
    .then(() => undefined)
    .catch((err) => err.errors.reduce((c, v) => {
      return { ...c, [v.field]: v.message }
    }, {}))
}
