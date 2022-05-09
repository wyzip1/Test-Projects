import React from 'react';


import {
  FormInputField,
  Form,
  FormStrategy,
  Validators,
  Pop,
  Icon,
  ButtonDirective,
  Button
} from 'zent';

export default function _Form() {
  const form = Form.useForm(FormStrategy.View);
  const [disabled, setDisabled] = React.useState(false);
  const [initializing, setInitializing] = React.useState(false);
  const initialize = React.useCallback(() => {
    setInitializing(true);
    setTimeout(() => {
      form.initialize({
        name: 'zent',
        password: 'zenttnez',
        email: 'zent@youzan.com',
      });
      setInitializing(false);
    }, 1000);
  }, [form]);

  return (
    <>
      <Form layout="horizontal" form={form} disabled={disabled}>
        <FormInputField
          name="name"
          label={
            <span>
              用户名&nbsp;
              <Pop trigger="hover" content="用户名用于个人账号登录" centerArrow>
                <Icon type="error-circle-o" />
              </Pop>:
            </span>
          }
          validators={[
            Validators.minLength(5, '用户名至少 5 个字'),
            Validators.maxLength(25, '用户名最多 25 个字'),
          ]}
          helpDesc="用户名为5-25个字"
          required="必填"
        />
        <FormInputField
          name="password"
          props={{ type: 'password' }}
          label="密码:"
          helpDesc={
            <span>
              密码由英文字母、数字组成
              <a href="https://youzan.com" target="_blank">
                查看更多
              </a>
            </span>
          }
          validateOccasion={
            Form.ValidateOccasion.Blur | Form.ValidateOccasion.Change
          }
          validators={[
            Validators.pattern(/^[a-zA-Z0-9]+$/, '只允许英文字母和数字'),
          ]}
          notice="重要提示：填写后无法修改，请谨慎设置"
          required="必填"
        />
        <FormInputField
          className="demo-form-basic-email"
          label="E-Mail:"
          name="email"
          validators={[
            Validators.required('必填'),
            Validators.email('请输入正确的邮箱'),
          ]}
        />
        <Button htmlType="reset">重置</Button>
        <Button onClick={form.model.clear.bind(form.model)}>
          清空
        </Button>
        <Button loading={initializing} onClick={initialize}>
          初始化表单数据
        </Button>
        <Button onClick={() => form.model.clearError()}>清空错误信息</Button>
      </Form>
      <Button
        style={{ marginTop: 24 }}
        onClick={() => setDisabled(prev => !prev)}
      >
        {disabled ? '解除禁用' : '禁用表单'}
      </Button>
    </>
  );
}