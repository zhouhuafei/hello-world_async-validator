import Schema, { ValidateOption, Rules } from 'async-validator'

async function validateAllFormFields (formFields, formRules, option: ValidateOption = {}) {
  option.first = option.first || false // 开启后，若某个字段校验没通过，则停止下一个字段的校验。
  option.firstFields = option.firstFields || false // 开启后，若某个字段的某个规则校验没通过，则停止下一个规则的校验，而后继续下一个字段的校验。
  return await new Schema(formRules).validate(formFields, option).then(() => undefined).catch((err) => err.errors)
}

export { validateAllFormFields, Rules }
