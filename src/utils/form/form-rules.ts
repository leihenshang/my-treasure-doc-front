import type { FormItemRule } from 'naive-ui'

const customFormRules = {
    getRequireRule(message?:string):FormItemRule{
      return {required:true,message:message,}
    }
}
export default customFormRules
