import React, { useEffect } from 'react';
import { Form, Input, Button, Row, Col, Select, Switch, message } from 'antd';
import './DeviceForm.css';
import { createDevice, updateDevice } from '../../pages/dashboard/Dashboard.logic';

const { Option } = Select;
type FormProps = {
  myForm: any,
  serviceOptions: any,
  handleSendStatus: (status: boolean) => void
}
const DeviceForm = (props: FormProps) => {
  const [form] = Form.useForm();
  const token = localStorage.getItem('token');
  const isEditMode = Object.keys(props.myForm).length > 0;

  const getFormValues = () => {
    if (!isEditMode) {
      return {
        deviceCode: '',
        deviceName: '',
        ipAddress: '',
        username: '',
        password: '',
        service: '',
        operationStatus: false,
        connected: false
      };
    }
    return {
      deviceCode: props.myForm.deviceCode,
      deviceName: props.myForm.deviceName,
      ipAddress: props.myForm.ipAddress,
      username: props.myForm.username,
      password: props.myForm.password,
      service: props.myForm.services || '',
      operationStatus: props.myForm.operationStatus == "Active",
      connected: props.myForm.connected == "Connected"
    };
  };

  const initialValues = getFormValues();

  useEffect(() => {
    if (isEditMode) {
      form.setFieldsValue(getFormValues());
    } else {
      form.resetFields();
    }
  }, [props.myForm]);
  const handleFinish = async (values: any) => {
    const deviceData = {
      DeviceCode: values.deviceCode,
      DeviceName: values.deviceName,
      IpAddress: values.ipAddress,
      UserName: values.username,
      Password: values.password,
      Services: values.service || "",
      OperationStatus: values.operationStatus === true,
      Connected: values.connected === true
    };

    let result;
    if (isEditMode) {
      result = await updateDevice(deviceData);
    } else {
      result = await createDevice(deviceData);
    }

    if (result.success) {
      message.success(result.message);
      props.handleSendStatus(false); // Close modal
    } else {
      message.error(result.message);
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
