import React, {useState, useEffect, useContext} from "react";
import { Button, Form, Input, message, Radio } from 'antd';
import styles from './Login.module.css';
import { GetLogin } from "./Login.logic";
import { SignalRContext } from "../../helpers/SignalRProvider";
import { HubConnectionState } from "@microsoft/signalr";
type LayoutType = Parameters<typeof Form>[0]['layout'];
type LoginProps = {
  handleSuccess: (isLogined:boolean) => void
}
const Login = (props: LoginProps) =>{
  const connection = useContext(SignalRContext);
  const [form] = Form.useForm();
  const [formLayout, setFormLayout] = useState<LayoutType>('vertical');

  const onFormLayoutChange = ({ layout }: { layout: LayoutType }) => {
    setFormLayout(layout);
  };  
  const handleFinish = async (value:any) => {
      console.log(value.userName); console.log(value.password);
      let dataLogin = await GetLogin(value.userName, value.password);
      console.log(dataLogin);
      if(dataLogin.message){
        message.info("Sai tên đăng nhập hoặc mật khẩu");
      }
      else{
        localStorage.setItem("userFullName", dataLogin.userFullName);
        localStorage.setItem("userName", dataLogin.userCode);
        localStorage.setItem('token', dataLogin.token);
        localStorage.setItem('refreshToken', dataLogin.tokenRefresh);
        localStorage.setItem('avatar', dataLogin.avatar);
        localStorage.setItem('userRole', dataLogin.userRole);
        /*if(connection)
          if(connection.state == HubConnectionState.Connected)
            connection.invoke('UserConnected', value.userName);*/
        props.handleSuccess(true);
      }
  }
  return(
        <div className={styles.container}>
            <div className={styles.left}>
                <div className={styles.imageContainer}>
                    <img src='./images/Logo.png' className={styles.imageLogo} />
                </div>
            <Form className={styles.login}
      layout={formLayout}
      form={form} onFinish={handleFinish}
      initialValues={{ layout: formLayout }}
      onValuesChange={onFormLayoutChange}
    >
      <Form.Item name="layout">
      </Form.Item>
      <Form.Item name="userName" label="Tên đăng nhập (*)">
        <Input placeholder="input placeholder"
        />
      </Form.Item>
      <Form.Item name="password" label="Mật khẩu (*)">
        <Input placeholder="input placeholder" type="password"
        />
      </Form.Item>
      <Form.Item>
        <Button type='primary' htmlType="submit">Đăng nhập</Button>
      </Form.Item>
    </Form>
            </div>
            <div className={styles.right}>
                <img src="./images/introduction.png" />
                <div className={styles.text}>
                <p className={styles.normal}>Hệ thống</p>
                <p className={styles.highlight}>Quản lý xếp hàng</p>
                </div>
            </div>
        </div>
    )
}
export default Login;