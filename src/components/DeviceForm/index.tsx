import React from 'react';
import { Form, Input, Button, Row, Col, Select, Switch, message } from 'antd';
import './DeviceForm.css';

const { Option } = Select;
type FormProps = {
  myForm: any,
  serviceOptions: any,
  handleSendStatus: (status:boolean)=>void
}
const DeviceForm = (props:FormProps) => {
  const [form] = Form.useForm();
  const token = localStorage.getItem('token');
  const initialValues = Object.keys(props.myForm).length === 0 ?
  {
    deviceCode: '', // Pre-fill the username field
    deviceName: '', // Pre-fill the email field
    ipAddress: '',
    username:'',
    password:'',
    operationStatus:false,
    connected:false
  }
  : {
    deviceCode: props.myForm.deviceCode, // Pre-fill the username field
    deviceName: props.myForm.deviceName, // Pre-fill the email field
    ipAddress: props.myForm.ipAddress,
    username: props.myForm.username,
    password: props.myForm.password,
    operationStatus: props.myForm.operationStatus=="Active"?true:false,
    connected: props.myForm.connected=="Connected"?true:false
  }
  const handleFinish = async (values: any) => {
    if(props.myForm.deviceCode==""){
              
    }
    else{
    
  }
  };

  return (
    <div className="device-form-container">
      <h2 className="device-form-title">Quản lý thiết bị</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={initialValues}
        className="device-form"
      >
        <Row gutter={24}>
          {/* Cột 1 */}
          <Col xs={24} lg={12}>
            <Form.Item
              name="deviceCode"
              label="Mã thiết bị"
              rules={[{ required: true, message: 'Mã thiết bị là bắt buộc' }]}
            >
              <Input placeholder="Nhập mã thiết bị" />
            </Form.Item>
            <Form.Item
              name="deviceName"
              label="Tên thiết bị"
              rules={[{ required: true, message: 'Tên thiết bị là bắt buộc' }]}
            >
              <Input placeholder="Nhập tên thiết bị" />
            </Form.Item>
            <Form.Item
              name="ipAddress"
              label="Địa chỉ IP"
              rules={[
                { required: true, message: 'Địa chỉ IP là bắt buộc' },
                { pattern: /^\d{1,3}(\.\d{1,3}){3}$/, message: 'Địa chỉ IP không hợp lệ' },
              ]}
            >
              <Input placeholder="Nhập địa chỉ IP" />
            </Form.Item>
            <Form.Item
              name="service"
              label="Dịch vụ sử dụng"
              rules={[{ required: true, message: 'Dịch vụ sử dụng là bắt buộc' }]}
            >
              <Input placeholder="Nhập dịch vụ sử dụng" />
            </Form.Item>
          </Col>
          {/* Cột 2 */}
          <Col xs={24} lg={12}>
          <Form.Item label="Đang hoạt động" name="operationStatus" valuePropName="checked">
              <Switch />
          </Form.Item>
          <Form.Item label="Đang kết nối" name="connected" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item
              name="username"
              label="Tên đăng nhập"
              rules={[{ required: true, message: 'Tên đăng nhập là bắt buộc' }]}
            >
              <Input placeholder="Nhập tài khoản" />
            </Form.Item>
            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: true, message: 'Mật khẩu là bắt buộc' }]}
            >
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>
          </Col>
        </Row>
        {/* Nút hành động */}
        <Form.Item>
          <div className="form-actions">
            <Button htmlType="button">Hủy bỏ</Button>
            <Button type="primary" htmlType="submit">
              Lưu thông tin
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default DeviceForm;
